from typing import Dict, List, Any

class NeuralNetworkParser:
    """
    Parser for neural network files in .txt format.
    Expected format:
    - First line: total number of neurons
    - Next lines: number of neurons per layer (until total is reached)
    - Remaining lines: weight matrix (space-separated floats)
    """
    
    @staticmethod
    def parse(file_content: str) -> Dict[str, Any]:
        """
        Parse a neural network file content and return structured data.
        
        Args:
            file_content: Content of the .txt file as a string
            
        Returns:
            Dictionary with:
            - num_neuronas: int
            - capas: List[int]
            - matriz_pesos: List[List[float]]
        """
        # Split into lines and remove comments (anything after #)
        lines = file_content.split('\n')
        cleaned_lines = []
        
        for line in lines:
            # Remove comments
            comment_index = line.find('#')
            if comment_index != -1:
                line = line[:comment_index]
            # Trim whitespace
            line = line.strip()
            if line:
                cleaned_lines.append(line)
        
        if not cleaned_lines:
            raise ValueError("File is empty or contains only comments")
        
        current_line = 0
        
        # Parse total neurons
        try:
            total_neuronas = int(cleaned_lines[current_line])
            current_line += 1
        except (ValueError, IndexError):
            raise ValueError("First line must contain the total number of neurons")
        
        # Parse layer distribution
        capas: List[int] = []
        neurons_parsed = 0
        
        while neurons_parsed < total_neuronas and current_line < len(cleaned_lines):
            try:
                layer_size = int(cleaned_lines[current_line])
                if layer_size <= 0:
                    raise ValueError(f"Layer size must be positive, got {layer_size}")
                capas.append(layer_size)
                neurons_parsed += layer_size
                current_line += 1
            except (ValueError, IndexError):
                break
        
        if neurons_parsed != total_neuronas:
            raise ValueError(
                f"Sum of layer sizes ({neurons_parsed}) does not match total neurons ({total_neuronas})"
            )
        
        # Parse weights matrix
        matriz_pesos: List[List[float]] = []
        
        while current_line < len(cleaned_lines):
            line = cleaned_lines[current_line]
            weights = []
            
            # Split by whitespace and parse floats
            parts = line.split()
            for part in parts:
                try:
                    weight = float(part)
                    weights.append(weight)
                except ValueError:
                    # Skip invalid values
                    continue
            
            if weights:
                matriz_pesos.append(weights)
            
            current_line += 1
        
        return {
            "num_neuronas": total_neuronas,
            "capas": capas,
            "matriz_pesos": matriz_pesos
        }
    
    @staticmethod
    def validate_parsed_data(data: Dict[str, Any]) -> bool:
        """
        Validate parsed neural network data.
        
        Args:
            data: Parsed data dictionary
            
        Returns:
            True if valid, raises ValueError if invalid
        """
        num_neuronas = data.get("num_neuronas")
        capas = data.get("capas")
        matriz_pesos = data.get("matriz_pesos")
        
        if not isinstance(num_neuronas, int) or num_neuronas <= 0:
            raise ValueError("num_neuronas must be a positive integer")
        
        if not isinstance(capas, list) or len(capas) == 0:
            raise ValueError("capas must be a non-empty list")
        
        if sum(capas) != num_neuronas:
            raise ValueError("Sum of capas must equal num_neuronas")
        
        if not isinstance(matriz_pesos, list):
            raise ValueError("matriz_pesos must be a list")
        
        return True

