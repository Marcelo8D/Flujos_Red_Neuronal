import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();

  return (
    <div className="space-y-8 relative">
      {/* Lava Lamp Background Effect */}
      <div className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${
        isDark ? 'bg-black' : 'bg-white'
      }`}>
         <div className={`absolute top-0 -left-20 w-96 h-96 rounded-full filter blur-3xl opacity-30 animate-blob ${
          isDark ? 'mix-blend-screen bg-white' : ' mix-blend-multiply bg-black'
        }`}></div>
        <div className={`absolute top-20 right-10 w-[500px] h-[500px] rounded-full filter blur-3xl opacity-40 animate-blob animation-delay-2000 ${
          isDark ? 'mix-blend-screen bg-gray-300' : 'mix-blend-multiply bg-gray-700'
        }`}></div>
        <div className={`absolute -bottom-20 left-1/4 w-[450px] h-[450px] rounded-full filter blur-3xl opacity-35 animate-blob-reverse animation-delay-4000 ${
          isDark ? 'mix-blend-screen bg-gray-500' : 'mix-blend-multiply bg-gray-500'
        }`}></div>
        <div className={`absolute bottom-10 right-1/4 w-[400px] h-[400px] rounded-full filter blur-3xl opacity-25 animate-blob animation-delay-6000 ${
          isDark ? 'mix-blend-screen bg-white' : 'mix-blend-multiply bg-black'
        }`}></div>
        <div className={`absolute top-1/2 left-1/2 w-[350px] h-[350px] rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-3000 ${
          isDark ? 'mix-blend-screen bg-gray-400' : 'mix-blend-multiply bg-gray-600'
        }`}></div>
        <div className={`absolute top-0 right-1/2 w-[300px] h-[300px] rounded-full filter blur-3xl opacity-30 animate-blob-reverse animation-delay-3000 ${
          isDark ? 'mix-blend-screen bg-gray-400' : 'mix-blend-multiply bg-gray-600'
        }`}></div>
        
        {/* Overlay for text readability */}
        <div className={isDark ? 'absolute inset-0 bg-black/50' : 'absolute inset-0 bg-white/30'}></div>
      </div>

      {/* Welcome Section*/}
      <div className={`relative backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border overflow-hidden group hover:scale-[1.01] transition-all duration-500 ${
        isDark 
          ? 'bg-gradient-to-r from-white/5 via-gray-400/5 to-white/5 border-white/10'
          : 'bg-gradient-to-r from-black/5 via-gray-600/5 to-black/5 border-black/10'
      }`}>
        {/* Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${
          isDark 
            ? 'from-white/5 via-gray-300/5 to-gray-500/5'
            : 'from-black/5 via-gray-700/5 to-gray-500/5'
        }`}></div>
        
        {/* Shine effect */}
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500 ${
          isDark ? 'via-white/5' : 'via-black/5'
        }`}></div>
        
        <div className="relative z-10">
          <h1 className={`text-5xl font-bold bg-clip-text text-transparent mb-2 ${
            isDark 
              ? 'bg-gradient-to-r from-white via-gray-200 to-gray-400'
              : 'bg-gradient-to-r from-black via-gray-800 to-gray-600'
          }`}>
            Welcome back, {user?.nombre}!
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Ready to visualize some neural networks?
          </p>
        </div>

        {/* Floating particles */}
        <div className={`absolute top-4 right-4 w-2 h-2 rounded-full animate-ping ${
          isDark ? 'bg-white/50' : 'bg-black/50'
        }`}></div>
        <div className={`absolute bottom-4 right-12 w-2 h-2 rounded-full animate-ping animation-delay-1000 ${
          isDark ? 'bg-gray-400/50' : 'bg-gray-600/50'
        }`}></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {/* Models Card */}
        <div className={`group relative backdrop-blur-xl rounded-2xl p-6 shadow-xl border transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 cursor-pointer overflow-hidden ${
          isDark 
            ? 'bg-gradient-to-br from-white/5 to-gray-500/5 border-white/10 hover:border-white/30'
            : 'bg-gradient-to-br from-black/5 to-gray-500/5 border-black/10 hover:border-black/30'
        }`}>
          <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-500 rounded-2xl ${
            isDark
              ? 'from-white/0 to-gray-400/0 group-hover:from-white/10 group-hover:to-gray-400/10'
              : 'from-black/0 to-gray-600/0 group-hover:from-black/10 group-hover:to-gray-600/10'
          }`}></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className={`text-sm mb-1 font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Models
              </p>
              <p className={`text-6xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300 ${
                isDark ? 'text-white' : 'text-black'
              }`}>0</p>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                Neural networks uploaded
              </p>
            </div>
            <div className="text-6xl opacity-30 group-hover:opacity-60 group-hover:scale-110 transition-all duration-300">🧠</div>
          </div>
          
          {/* border glow */}
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl ${
            isDark ? 'from-white/0 via-white/20 to-white/0' : 'from-black/0 via-black/20 to-black/0'
          }`}></div>
        </div>

        {/* Projects Card */}
        <div className={`group relative backdrop-blur-xl rounded-2xl p-6 shadow-xl border transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 cursor-pointer overflow-hidden ${
          isDark 
            ? 'bg-gradient-to-br from-gray-400/5 to-gray-600/5 border-white/10 hover:border-gray-300/30'
            : 'bg-gradient-to-br from-gray-600/5 to-gray-400/5 border-black/10 hover:border-gray-700/30'
        }`}>
          <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-500 rounded-2xl ${
            isDark
              ? 'from-gray-400/0 to-white/0 group-hover:from-gray-400/10 group-hover:to-white/10'
              : 'from-gray-600/0 to-black/0 group-hover:from-gray-600/10 group-hover:to-black/10'
          }`}></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className={`text-sm mb-1 font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Projects
              </p>
              <p className={`text-6xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300 ${
                isDark ? 'text-white' : 'text-black'
              }`}>0</p>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                Active projects
              </p>
            </div>
            <div className="text-6xl opacity-30 group-hover:opacity-60 group-hover:scale-110 transition-all duration-300">📁</div>
          </div>
          
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl ${
            isDark ? 'from-gray-400/0 via-gray-200/20 to-gray-400/0' : 'from-gray-600/0 via-gray-800/20 to-gray-600/0'
          }`}></div>
        </div>

        {/* Visualizations Card */}
        <div className={`group relative backdrop-blur-xl rounded-2xl p-6 shadow-xl border transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 cursor-pointer overflow-hidden ${
          isDark 
            ? 'bg-gradient-to-br from-gray-600/5 to-white/5 border-white/10 hover:border-gray-400/30'
            : 'bg-gradient-to-br from-gray-400/5 to-black/5 border-black/10 hover:border-gray-600/30'
        }`}>
          <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-500 rounded-2xl ${
            isDark
              ? 'from-white/0 to-gray-600/0 group-hover:from-white/10 group-hover:to-gray-600/10'
              : 'from-black/0 to-gray-400/0 group-hover:from-black/10 group-hover:to-gray-400/10'
          }`}></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className={`text-sm mb-1 font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Visualizations
              </p>
              <p className={`text-6xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300 ${
                isDark ? 'text-white' : 'text-black'
              }`}>0</p>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                Created visualizations
              </p>
            </div>
            <div className="text-6xl opacity-30 group-hover:opacity-60 group-hover:scale-110 transition-all duration-300">📊</div>
          </div>
          
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl ${
            isDark ? 'from-white/0 via-gray-400/20 to-white/0' : 'from-black/0 via-gray-600/20 to-black/0'
          }`}></div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`relative backdrop-blur-xl rounded-3xl p-8 border shadow-2xl ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
      }`}>
        <h2 className={`text-3xl font-bold mb-6 flex items-center ${
          isDark ? 'text-white' : 'text-black'
        }`}>
          <span className="mr-3">⚡</span>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Upload Model */}
          <Link
            to="/models/upload"
            className={`group relative backdrop-blur-lg rounded-2xl p-6 transition-all duration-300 transform hover:scale-[1.02] border cursor-pointer overflow-hidden ${
              isDark
                ? 'bg-gradient-to-br from-white/5 to-gray-500/5 hover:from-white/10 hover:to-gray-400/10 border-white/10 hover:border-white/20'
                : 'bg-gradient-to-br from-black/5 to-gray-500/5 hover:from-black/10 hover:to-gray-600/10 border-black/10 hover:border-black/20'
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r from-transparent to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ${
              isDark ? 'via-white/5' : 'via-black/5'
            }`}></div>
            
            <div className="relative z-10 flex items-start space-x-4">
              <div className="text-4xl group-hover:scale-110 transition-transform duration-300">⬆️</div>
              <div>
                <h3 className={`font-semibold text-lg mb-1 ${
                  isDark ? 'text-white group-hover:text-gray-200' : 'text-black group-hover:text-gray-800'
                }`}>
                  Upload Model
                </h3>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-600 group-hover:text-gray-700'
                }`}>
                  Upload a new neural network model (TensorFlow, PyTorch, ONNX)
                </p>
              </div>
            </div>
          </Link>

          {/* Create Project */}
          <Link
            to="/projects/new"
            className={`group relative backdrop-blur-lg rounded-2xl p-6 transition-all duration-300 transform hover:scale-[1.02] border cursor-pointer overflow-hidden ${
              isDark
                ? 'bg-gradient-to-br from-gray-500/5 to-white/5 hover:from-gray-400/10 hover:to-white/10 border-white/10 hover:border-white/20'
                : 'bg-gradient-to-br from-gray-500/5 to-black/5 hover:from-gray-600/10 hover:to-black/10 border-black/10 hover:border-black/20'
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r from-transparent to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ${
              isDark ? 'via-white/5' : 'via-black/5'
            }`}></div>
            
            <div className="relative z-10 flex items-start space-x-4">
              <div className="text-4xl group-hover:scale-110 transition-transform duration-300">➕</div>
              <div>
                <h3 className={`font-semibold text-lg mb-1 ${
                  isDark ? 'text-white group-hover:text-gray-200' : 'text-black group-hover:text-gray-800'
                }`}>
                  Create Project
                </h3>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-600 group-hover:text-gray-700'
                }`}>
                  Start a new visualization project
                </p>
              </div>
            </div>
          </Link>

          {/* Browse Models */}
          <Link
            to="/models"
            className={`group relative backdrop-blur-lg rounded-2xl p-6 transition-all duration-300 transform hover:scale-[1.02] border cursor-pointer overflow-hidden ${
              isDark
                ? 'bg-gradient-to-br from-white/5 to-gray-600/5 hover:from-white/10 hover:to-gray-500/10 border-white/10 hover:border-white/20'
                : 'bg-gradient-to-br from-black/5 to-gray-400/5 hover:from-black/10 hover:to-gray-500/10 border-black/10 hover:border-black/20'
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r from-transparent to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ${
              isDark ? 'via-white/5' : 'via-black/5'
            }`}></div>
            
            <div className="relative z-10 flex items-start space-x-4">
              <div className="text-4xl group-hover:scale-110 transition-transform duration-300">📚</div>
              <div>
                <h3 className={`font-semibold text-lg mb-1 ${
                  isDark ? 'text-white group-hover:text-gray-200' : 'text-black group-hover:text-gray-800'
                }`}>
                  Browse Models
                </h3>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-600 group-hover:text-gray-700'
                }`}>
                  View and manage your uploaded models
                </p>
              </div>
            </div>
          </Link>

          {/* View Projects */}
          <Link
            to="/projects"
            className={`group relative backdrop-blur-lg rounded-2xl p-6 transition-all duration-300 transform hover:scale-[1.02] border cursor-pointer overflow-hidden ${
              isDark
                ? 'bg-gradient-to-br from-gray-600/5 to-gray-400/5 hover:from-gray-500/10 hover:to-gray-300/10 border-white/10 hover:border-white/20'
                : 'bg-gradient-to-br from-gray-400/5 to-gray-600/5 hover:from-gray-500/10 hover:to-gray-700/10 border-black/10 hover:border-black/20'
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r from-transparent to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ${
              isDark ? 'via-white/5' : 'via-black/5'
            }`}></div>
            
            <div className="relative z-10 flex items-start space-x-4">
              <div className="text-4xl group-hover:scale-110 transition-transform duration-300">🎨</div>
              <div>
                <h3 className={`font-semibold text-lg mb-1 ${
                  isDark ? 'text-white group-hover:text-gray-200' : 'text-black group-hover:text-gray-800'
                }`}>
                  View Projects
                </h3>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-600 group-hover:text-gray-700'
                }`}>
                  Access your existing visualization projects
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className={`relative backdrop-blur-xl rounded-3xl p-8 border shadow-2xl ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
      }`}>
        <h2 className={`text-3xl font-bold mb-6 flex items-center ${
          isDark ? 'text-white' : 'text-black'
        }`}>
          <span className="mr-3">📈</span>
          Recent Activity
        </h2>
        <div className="text-center py-16">
          <div className="text-8xl mb-6 opacity-20">🎯</div>
          <p className={`text-xl mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            No recent activity yet
          </p>
          <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
            Start by uploading a model or creating a project
          </p>
        </div>
      </div>

      {/* Getting Started */}
      <div className={`relative backdrop-blur-xl rounded-3xl p-8 border shadow-2xl overflow-hidden ${
        isDark 
          ? 'bg-gradient-to-br from-white/5 via-gray-500/5 to-gray-700/5 border-white/10'
          : 'bg-gradient-to-br from-black/5 via-gray-500/5 to-gray-300/5 border-black/10'
      }`}>
        
        <div className="relative z-10">
          <h2 className={`text-3xl font-bold mb-8 flex items-center ${
            isDark ? 'text-white' : 'text-black'
          }`}>
            <span className="mr-3">🚀</span>
            Getting Started
          </h2>
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex items-start space-x-4 group">
              <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br rounded-full flex items-center justify-center font-bold text-lg border group-hover:scale-110 transition-transform duration-300 ${
                isDark 
                  ? 'from-white/20 to-gray-500/20 text-white border-white/20'
                  : 'from-black/20 to-gray-500/20 text-black border-black/20'
              }`}>
                1
              </div>
              <div className={`flex-1 backdrop-blur-sm rounded-xl p-4 border transition-all ${
                isDark
                  ? 'bg-white/5 border-white/5 group-hover:border-white/20'
                  : 'bg-black/5 border-black/5 group-hover:border-black/20'
              }`}>
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
                  Upload a Neural Network Model
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Upload your trained model in TensorFlow (.h5), PyTorch (.pt), or ONNX (.onnx) format
                </p>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="flex items-start space-x-4 group">
              <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br rounded-full flex items-center justify-center font-bold text-lg border group-hover:scale-110 transition-transform duration-300 ${
                isDark 
                  ? 'from-gray-400/20 to-white/20 text-white border-white/20'
                  : 'from-gray-600/20 to-black/20 text-black border-black/20'
              }`}>
                2
              </div>
              <div className={`flex-1 backdrop-blur-sm rounded-xl p-4 border transition-all ${
                isDark
                  ? 'bg-white/5 border-white/5 group-hover:border-white/20'
                  : 'bg-black/5 border-black/5 group-hover:border-black/20'
              }`}>
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
                  Create a Visualization Project
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Select your model and create a new project to start visualizing
                </p>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="flex items-start space-x-4 group">
              <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br rounded-full flex items-center justify-center font-bold text-lg border group-hover:scale-110 transition-transform duration-300 ${
                isDark 
                  ? 'from-gray-600/20 to-gray-400/20 text-white border-white/20'
                  : 'from-gray-400/20 to-gray-600/20 text-black border-black/20'
              }`}>
                3
              </div>
              <div className={`flex-1 backdrop-blur-sm rounded-xl p-4 border transition-all ${
                isDark
                  ? 'bg-white/5 border-white/5 group-hover:border-white/20'
                  : 'bg-black/5 border-black/5 group-hover:border-black/20'
              }`}>
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
                  Upload Input Data
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Add input data files to test your model and see activation patterns
                </p>
              </div>
            </div>
            
            {/* Step 4 */}
            <div className="flex items-start space-x-4 group">
              <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br rounded-full flex items-center justify-center font-bold text-lg border group-hover:scale-110 transition-transform duration-300 ${
                isDark 
                  ? 'from-white/20 to-gray-600/20 text-white border-white/20'
                  : 'from-black/20 to-gray-400/20 text-black border-black/20'
              }`}>
                4
              </div>
              <div className={`flex-1 backdrop-blur-sm rounded-xl p-4 border transition-all ${
                isDark
                  ? 'bg-white/5 border-white/5 group-hover:border-white/20'
                  : 'bg-black/5 border-black/5 group-hover:border-black/20'
              }`}>
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
                  Explore & Visualize
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Run executions and explore interactive visualizations of your neural network
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1) rotate(0deg); }
          33% { transform: translate(40px, -60px) scale(1.15) rotate(120deg); }
          66% { transform: translate(-30px, 30px) scale(0.85) rotate(240deg); }
          100% { transform: translate(0px, 0px) scale(1) rotate(360deg); }
        }
        
        @keyframes blob-reverse {
          0% { transform: translate(0px, 0px) scale(1) rotate(0deg); }
          33% { transform: translate(-40px, 60px) scale(0.9) rotate(-120deg); }
          66% { transform: translate(30px, -30px) scale(1.1) rotate(-240deg); }
          100% { transform: translate(0px, 0px) scale(1) rotate(-360deg); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
        
        .animate-blob {
          animation: blob 12s infinite ease-in-out;
        }
        
        .animate-blob-reverse {
          animation: blob-reverse 15s infinite ease-in-out;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animation-delay-5000 {
          animation-delay: 5s;
        }
        
        .animation-delay-6000 {
          animation-delay: 6s;
        }
        
        .animate-shake {
          animation: shake 0.5s;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default Home;