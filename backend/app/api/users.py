from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta

from app.database import get_db
from app.models.user import User
from app.api.auth import get_current_user, get_password_hash, verify_password

router = APIRouter()

reset_codes = {}

class UserUpdate(BaseModel):
    nombre: Optional[str] = None
    apellidos: Optional[str] = None
    email: Optional[EmailStr] = None

class PasswordChange(BaseModel):
    current_password: str
    new_password: str

class RequestResetCode(BaseModel):
    email: EmailStr

class ResetPasswordWithCode(BaseModel):
    email: EmailStr
    code: str
    new_password: str

#Funtions
def send_email(to_email: str, subject: str, body: str):

    try:
        gmail_user = "hnsuporte1@gmail.com"
        gmail_password = "ufuk gssx tenz dmiu"
        
        message = MIMEMultipart()
        message["From"] = gmail_user
        message["To"] = to_email
        message["Subject"] = subject
        
        message.attach(MIMEText(body, "plain"))
        
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(gmail_user, gmail_password)
            server.send_message(message)
        
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

#Routes
@router.get("/me")
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "nombre": current_user.nombre,
        "apellidos": current_user.apellidos,
        "fecha_registro": current_user.fecha_registro
    }

@router.put("/me")
async def update_user_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user profile"""
    
    if user_update.email and user_update.email != current_user.email:
        existing = db.query(User).filter(User.email == user_update.email).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already in use"
            )
        current_user.email = user_update.email
    
    if user_update.nombre:
        current_user.nombre = user_update.nombre
    
    if user_update.apellidos is not None:
        current_user.apellidos = user_update.apellidos
    
    db.commit()
    db.refresh(current_user)
    
    return {"message": "Profile updated successfully"}

@router.post("/change-password")
async def change_password(
    password_data: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change user password"""
    
    if not verify_password(password_data.current_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    current_user.password_hash = get_password_hash(password_data.new_password)
    db.commit()
    
    # Send confirmation email
    send_email(
        current_user.email,
        "Password Changed - Neural Viz",
        f"Hello {current_user.nombre},\n\nYour password has been changed successfully.\n\nIf you didn't make this change, please contact support immediately.\n\nNeural Viz Team"
    )
    
    return {"message": "Password changed successfully"}

@router.post("/request-reset-code")
async def request_reset_code(
    reset_request: RequestResetCode,
    db: Session = Depends(get_db)
):
    """Request password reset code via email"""
    
    user = db.query(User).filter(User.email == reset_request.email).first()
    
    # Always return success
    if not user:
        return {"message": "If the email exists, a reset code has been sent"}
    
    # Random 6-digit code
    code = ''.join([str(random.randint(0, 9)) for _ in range(6)])
    
    # Store code with expiration (10 minutes)
    reset_codes[reset_request.email] = {
        "code": code,
        "expires_at": datetime.utcnow() + timedelta(minutes=10)
    }
    
    # Send email with code
    email_body = f"""Hello {user.nombre},

You requested to reset your password for Neural Viz.

Your reset code is: {code}

This code will expire in 10 minutes.

If you didn't request this, please ignore this email.

Neural Viz Team"""
    
    send_email(
        user.email,
        "Password Reset Code - Neural Viz",
        email_body
    )
    
    return {"message": "If the email exists, a reset code has been sent"}

@router.post("/reset-password-with-code")
async def reset_password_with_code(
    reset_data: ResetPasswordWithCode,
    db: Session = Depends(get_db)
):
    """Reset password using code from email"""
    
    # Check if code exists and is valid
    if reset_data.email not in reset_codes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset code"
        )
    
    stored_data = reset_codes[reset_data.email]
    
    # Check if code matches
    if stored_data["code"] != reset_data.code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid reset code"
        )
    
    # Check if code expired
    if datetime.utcnow() > stored_data["expires_at"]:
        del reset_codes[reset_data.email]
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reset code has expired"
        )
    
    # Find user
    user = db.query(User).filter(User.email == reset_data.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update password
    user.password_hash = get_password_hash(reset_data.new_password)
    db.commit()
    
    # Remove used code
    del reset_codes[reset_data.email]
    
    # Send confirmation
    send_email(
        user.email,
        "Password Reset Successful - Neural Viz",
        f"Hello {user.nombre},\n\nYour password has been reset successfully.\n\nNeural Viz Team"
    )
    
    return {"message": "Password reset successfully"}