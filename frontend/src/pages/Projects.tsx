import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { projectsAPI } from '../services/api';

interface Project {
  id: number;
  nombre: string;
  descripcion: string | null;
  usuario_id: number;
  fecha_creacion: string;
  fecha_modificacion: string;
  estado: 'Activo' | 'Archivado';
}

const Projects: React.FC = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [uploadNow, setUploadNow] = useState<'now' | 'later'>('later');
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.list();
      setProjects(response.data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await projectsAPI.create({
        nombre: newProjectName,
        descripcion: newProjectDesc || null,
      });
      const created = res.data as Project;

      // If user chose to upload now and provided file, upload it
      if (uploadNow === 'now' && fileToUpload) {
        try {
          await projectsAPI.uploadInputFile(created.id, fileToUpload, false);
        } catch (err) {
          console.error('Upload after create failed', err);
        }
      }

      // Reset and navigate to project detail
      setShowCreateModal(false);
      setNewProjectName('');
      setNewProjectDesc('');
      setFileToUpload(null);
      setUploadNow('later');
      navigate(`/projects/${created.id}`);
    } catch (error: any) {
      alert(error.response?.data?.detail || t('projects.errorCreating'));
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await projectsAPI.delete(id);
      loadProjects();
    } catch (error: any) {
      alert(error.response?.data?.detail || t('projects.errorDeleting'));
    }
  };

  const handleViewProject = (id: number) => {
    navigate(`/projects/${id}`);
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-black' : 'bg-white'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Animated Background */}
      <div className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${
        isDark ? 'bg-black' : 'bg-white'
      }`}>
        <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full filter blur-3xl opacity-20 animate-blob ${
          isDark ? 'mix-blend-screen bg-blue-500' : 'mix-blend-multiply bg-blue-300'
        }`}></div>
        <div className={`absolute top-20 right-1/4 w-[400px] h-[400px] rounded-full filter blur-3xl opacity-25 animate-blob animation-delay-2000 ${
          isDark ? 'mix-blend-screen bg-purple-500' : 'mix-blend-multiply bg-purple-300'
        }`}></div>
        <div className={`absolute bottom-20 left-1/3 w-[350px] h-[350px] rounded-full filter blur-3xl opacity-20 animate-blob-reverse animation-delay-4000 ${
          isDark ? 'mix-blend-screen bg-indigo-500' : 'mix-blend-multiply bg-indigo-300'
        }`}></div>
        <div className={isDark ? 'absolute inset-0 bg-black/40' : 'absolute inset-0 bg-white/40'}></div>
      </div>

      {/* Header */}
      <div className={`relative flex justify-between items-center backdrop-blur-xl rounded-3xl p-8 border ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
      }`}>
        <div>
          <h1 className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
            {t('projects.title')}
          </h1>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            isDark
              ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              : 'bg-black/10 hover:bg-black/20 text-black border border-black/20'
          }`}
        >
          {t('projects.createNew')}
        </button>
      </div>

      {/* Projects List */}
      {projects.length === 0 ? (
        <div className={`backdrop-blur-xl rounded-3xl p-12 border text-center ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
        }`}>
          <div className="text-6xl mb-4">📁</div>
          <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
            {t('projects.noProjects')}
          </h3>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            {t('projects.createFirst')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`backdrop-blur-xl rounded-2xl p-6 border transition-all hover:scale-105 cursor-pointer ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
              }`}
              onClick={() => handleViewProject(project.id)}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                  {project.nombre}
                </h3>
                <span className={`px-2 py-1 rounded text-xs ${
                  project.estado === 'Activo'
                    ? isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-500/30 text-green-600'
                    : isDark ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-500/30 text-gray-600'
                }`}>
                  {project.estado === 'Activo' ? t('projects.active') : t('projects.archived')}
                </span>
              </div>
              {project.descripcion && (
                <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {project.descripcion}
                </p>
              )}
              <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                {t('projects.createdAt')}: {new Date(project.fecha_creacion).toLocaleDateString()}
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewProject(project.id);
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isDark
                      ? 'bg-white/10 hover:bg-white/20 text-white'
                      : 'bg-black/10 hover:bg-black/20 text-black'
                  }`}
                >
                  {t('projects.view')}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProject(project.id);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isDark
                      ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                      : 'bg-red-500/30 hover:bg-red-500/40 text-red-600'
                  }`}
                >
                  {t('common.delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`backdrop-blur-xl rounded-3xl p-8 border max-w-md w-full mx-4 ${
            isDark ? 'bg-gray-900 border-white/10' : 'bg-white border-black/10'
          }`}>
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>
              {t('projects.createProjectTitle')}
            </h2>
            <form onSubmit={handleCreateProject}>
              <div className="mb-4">
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('projects.projectName')}
                </label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  required
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-white/5 border-white/20 text-white'
                      : 'bg-black/5 border-black/20 text-black'
                  }`}
                />
              </div>
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('projects.projectDescription')}
                </label>
                <textarea
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-white/5 border-white/20 text-white'
                      : 'bg-black/5 border-black/20 text-black'
                  }`}
                />
              </div>
              {/* Upload now or later */}
              <div className="mb-6">
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm mb-2`}>
                  {t('projects.uploadInputFile')}
                </p>
                <div className="flex items-center gap-4 mb-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      checked={uploadNow === 'now'}
                      onChange={() => setUploadNow('now')}
                    />
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm mb-2`}>
                      {t('common.upload')}
                    </p>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      checked={uploadNow === 'later'}
                      onChange={() => setUploadNow('later')}
                    />
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm mb-2`}>
                      {t('projects.goToVisualization')}
                    </p>
                  </label>
                </div>
                {uploadNow === 'now' && (
                  <input
                    type="file"
                    accept=".txt"
                    onChange={(e) => setFileToUpload(e.target.files?.[0] || null)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDark
                        ? 'bg-white/5 border-white/20 text-white'
                        : 'bg-black/5 border-black/20 text-black'
                    }`}
                  />
                )}
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                    isDark
                      ? 'bg-white/10 hover:bg-white/20 text-white'
                      : 'bg-black/10 hover:bg-black/20 text-black'
                  }`}
                >
                  {t('projects.create')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewProjectName('');
                    setNewProjectDesc('');
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                    isDark
                      ? 'bg-white/5 hover:bg-white/10 text-white'
                      : 'bg-black/5 hover:bg-black/10 text-black'
                  }`}
                >
                  {t('common.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Custom Animations */}
      <style>{`
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
        
        .animate-blob {
          animation: blob 12s infinite ease-in-out;
        }
        
        .animate-blob-reverse {
          animation: blob-reverse 15s infinite ease-in-out;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Projects;

