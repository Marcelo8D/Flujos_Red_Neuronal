import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import { projectsAPI } from '../services/api';

interface Project {
  id: number;
  nombre: string;
  estado: string;
}

const Home: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [projects, setProjects] = useState<Project[]>([]);
  const [totalFiles, setTotalFiles] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.list();
      const allProjects = response.data;
      setProjects(allProjects);
      
      // Count total input files across all projects
      let fileCount = 0;
      for (const project of allProjects) {
        try {
          const filesResponse = await projectsAPI.getInputFiles(project.id);
          fileCount += filesResponse.data.length;
        } catch (e) {
          // Skip projects with errors
        }
      }
      setTotalFiles(fileCount);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeProjects = projects.filter(p => p.estado === 'Activo').length;

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
            {t('home.welcomeBack', { name: user?.nombre })}
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('home.readyToVisualize')}
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

      {/* Stats Cards - Minimalist & Dynamic */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {/* Projects Card */}
        <Link to="/projects">
          <div className={`group relative backdrop-blur-xl rounded-2xl p-8 shadow-xl border transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 cursor-pointer overflow-hidden ${
            isDark 
              ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-400/20 hover:border-blue-300/40'
              : 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-400/30 hover:border-blue-500/50'
          }`}>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`text-4xl ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>📁</div>
                <div className={`text-5xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                  {loading ? '...' : activeProjects}
                </div>
              </div>
              <p className={`text-lg font-semibold mb-1 ${isDark ? 'text-white' : 'text-black'}`}>
                {t('home.projects')}
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('home.activeProjects')}
              </p>
            </div>
            <div className={`absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
              isDark ? 'from-blue-500/10 to-purple-500/10' : 'from-blue-400/20 to-purple-400/20'
            }`}></div>
          </div>
        </Link>

        {/* Files Card */}
        <div className={`group relative backdrop-blur-xl rounded-2xl p-8 shadow-xl border transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 overflow-hidden ${
          isDark 
            ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-400/20 hover:border-green-300/40'
            : 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-400/30 hover:border-green-500/50'
        }`}>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className={`text-4xl ${isDark ? 'text-green-400' : 'text-green-600'}`}>📊</div>
              <div className={`text-5xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                {loading ? '...' : totalFiles}
              </div>
            </div>
            <p className={`text-lg font-semibold mb-1 ${isDark ? 'text-white' : 'text-black'}`}>
              {t('home.visualizations')}
            </p>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('home.createdVisualizations')}
            </p>
          </div>
          <div className={`absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
            isDark ? 'from-green-500/10 to-emerald-500/10' : 'from-green-400/20 to-emerald-400/20'
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
          {t('home.quickActions')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Create Project */}
          <Link
            to="/projects"
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
              <div>
                <h3 className={`font-semibold text-lg mb-1 ${
                  isDark ? 'text-white group-hover:text-gray-200' : 'text-black group-hover:text-gray-800'
                }`}>
                  {t('home.createProject')}
                </h3>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-600 group-hover:text-gray-700'
                }`}>
                  {t('home.createProjectDesc')}
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
             <div>
                <h3 className={`font-semibold text-lg mb-1 ${
                  isDark ? 'text-white group-hover:text-gray-200' : 'text-black group-hover:text-gray-800'
                }`}>
                  {t('home.viewProjects')}
                </h3>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-600 group-hover:text-gray-700'
                }`}>
                  {t('home.viewProjectsDesc')}
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Projects */}
      {projects.length > 0 && (
        <div className={`relative backdrop-blur-xl rounded-3xl p-8 border shadow-2xl ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
        }`}>
          <h2 className={`text-2xl font-bold mb-6 flex items-center ${
            isDark ? 'text-white' : 'text-black'
          }`}>
            <span className="mr-3">📋</span>
            Recent Projects
          </h2>
          <div className="space-y-3">
            {projects.slice(0, 3).map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className={`block p-4 rounded-xl border transition-all hover:scale-[1.01] ${
                  isDark
                    ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                    : 'bg-black/5 border-black/10 hover:bg-black/10 hover:border-black/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
                      {project.nombre}
                    </p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {project.estado}
                    </p>
                  </div>
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
          {projects.length > 3 && (
            <Link
              to="/projects"
              className={`block text-center mt-4 text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors`}
            >
              View all projects →
            </Link>
          )}
        </div>
      )}

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
            {t('home.gettingStarted')}
          </h2>
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex items-start space-x-4 group">
              <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br rounded-full flex items-center justify-center font-bold text-lg border group-hover:scale-110 transition-transform duration-300 ${
                isDark 
                  ? 'from-gray-400/20 to-white/20 text-white border-white/20'
                  : 'from-gray-600/20 to-black/20 text-black border-black/20'
              }`}>
                1
              </div>
              <div className={`flex-1 backdrop-blur-sm rounded-xl p-4 border transition-all ${
                isDark
                  ? 'bg-white/5 border-white/5 group-hover:border-white/20'
                  : 'bg-black/5 border-black/5 group-hover:border-black/20'
              }`}>
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
                  {t('home.step1')}
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t('home.step1Desc')}
                </p>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="flex items-start space-x-4 group">
              <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br rounded-full flex items-center justify-center font-bold text-lg border group-hover:scale-110 transition-transform duration-300 ${
                isDark 
                  ? 'from-gray-600/20 to-gray-400/20 text-white border-white/20'
                  : 'from-gray-400/20 to-gray-600/20 text-black border-black/20'
              }`}>
                2
              </div>
              <div className={`flex-1 backdrop-blur-sm rounded-xl p-4 border transition-all ${
                isDark
                  ? 'bg-white/5 border-white/5 group-hover:border-white/20'
                  : 'bg-black/5 border-black/5 group-hover:border-black/20'
              }`}>
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
                  {t('home.step2')}
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t('home.step2Desc')}
                </p>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="flex items-start space-x-4 group">
              <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br rounded-full flex items-center justify-center font-bold text-lg border group-hover:scale-110 transition-transform duration-300 ${
                isDark 
                  ? 'from-white/20 to-gray-600/20 text-white border-white/20'
                  : 'from-black/20 to-gray-400/20 text-black border-black/20'
              }`}>
                3
              </div>
              <div className={`flex-1 backdrop-blur-sm rounded-xl p-4 border transition-all ${
                isDark
                  ? 'bg-white/5 border-white/5 group-hover:border-white/20'
                  : 'bg-black/5 border-black/5 group-hover:border-black/20'
              }`}>
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
                  {t('home.step3')}
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t('home.step3Desc')}
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