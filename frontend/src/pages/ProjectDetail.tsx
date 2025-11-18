import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { projectsAPI } from '../services/api';

interface InputFile {
  id: number;
  proyecto_id: number;
  nombre_archivo: string;
  ataque: boolean;
  num_neuronas: number;
  capas: number[];
  matriz_pesos: number[][];
  fecha_carga: string;
}

interface Project {
  id: number;
  nombre: string;
  descripcion: string | null;
  usuario_id: number;
  fecha_creacion: string;
  fecha_modificacion: string;
  estado: 'Activo' | 'Archivado';
  archivos_entrada: InputFile[];
}

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isAdversarial, setIsAdversarial] = useState(false);
  const [updatingEstado, setUpdatingEstado] = useState(false);

  useEffect(() => {
    if (id) {
      loadProject();
    }
  }, [id]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getById(Number(id));
      setProject(response.data);
    } catch (error: any) {
      console.error('Error loading project:', error);
      alert(error.response?.data?.detail || t('projects.errorLoading'));
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.name.endsWith('.txt')) {
      alert(t('projects.onlyTxtAllowed'));
      return;
    }

    try {
      setUploading(true);
      await projectsAPI.uploadInputFile(Number(id), file, isAdversarial);
      await loadProject();
      alert(t('projects.successUploaded'));
    } catch (error: any) {
      console.error('Error uploading file:', error);
      alert(error.response?.data?.detail || t('projects.errorUploading'));
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDeleteFile = async (archivoId: number) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    try {
      await projectsAPI.deleteInputFile(Number(id), archivoId);
      await loadProject();
    } catch (error: any) {
      console.error('Error deleting file:', error);
      alert(error.response?.data?.detail || 'Error deleting file');
    }
  };

  const handleGoToVisualization = () => {
    navigate(`/visualization/${id}`);
  };

  const toggleArchive = async () => {
    if (!project) return;
    try {
      setUpdatingEstado(true);
      const nextEstado = project.estado === 'Activo' ? 'Archivado' : 'Activo';
      await projectsAPI.update(project.id, { estado: nextEstado });
      await loadProject();
    } catch (e) {
      alert('Error updating project status');
    } finally {
      setUpdatingEstado(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-black' : 'bg-white'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className={`text-center py-12 ${isDark ? 'text-white' : 'text-black'}`}>
        Project not found
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Animated Background */}
      <div className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${
        isDark ? 'bg-black' : 'bg-white'
      }`}>
        <div className={`absolute top-0 right-1/4 w-96 h-96 rounded-full filter blur-3xl opacity-20 animate-blob ${
          isDark ? 'mix-blend-screen bg-cyan-500' : 'mix-blend-multiply bg-cyan-300'
        }`}></div>
        <div className={`absolute top-20 left-1/4 w-[400px] h-[400px] rounded-full filter blur-3xl opacity-25 animate-blob animation-delay-2000 ${
          isDark ? 'mix-blend-screen bg-teal-500' : 'mix-blend-multiply bg-teal-300'
        }`}></div>
        <div className={`absolute bottom-20 right-1/3 w-[350px] h-[350px] rounded-full filter blur-3xl opacity-20 animate-blob-reverse animation-delay-4000 ${
          isDark ? 'mix-blend-screen bg-emerald-500' : 'mix-blend-multiply bg-emerald-300'
        }`}></div>
        <div className={isDark ? 'absolute inset-0 bg-black/40' : 'absolute inset-0 bg-white/40'}></div>
      </div>

      {/* Header */}
      <div className={`relative backdrop-blur-xl rounded-3xl p-8 border ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
      }`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
              {project.nombre}
            </h1>
            {project.descripcion && (
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                {project.descripcion}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleGoToVisualization}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                isDark
                  ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  : 'bg-black/10 hover:bg-black/20 text-black border border-black/20'
              }`}
            >
              {t('projects.goToVisualization')}
            </button>
            <button
              onClick={toggleArchive}
              disabled={updatingEstado}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                project.estado === 'Activo'
                  ? (isDark ? 'bg-yellow-500/20 text-yellow-300' : 'bg-yellow-500/30 text-yellow-700')
                  : (isDark ? 'bg-green-500/20 text-green-300' : 'bg-green-500/30 text-green-700')
              }`}
            >
              {project.estado === 'Activo' ? t('projects.archived') : t('projects.active')}
            </button>
          </div>
        </div>
        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {t('projects.createdAt')}: {new Date(project.fecha_creacion).toLocaleDateString()} |{' '}
          {t('projects.modifiedAt')}: {new Date(project.fecha_modificacion).toLocaleDateString()}
        </div>
      </div>

      {/* Upload Section */}
      <div className={`backdrop-blur-xl rounded-3xl p-6 border ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
      }`}>
        <button
          onClick={() => navigate(-1)}
          className={`mb-4 px-4 py-2 rounded-lg text-sm ${isDark ? 'bg-white/10 text-white' : 'bg-black/10 text-black'}`}
        >
          ← Back
        </button>
        <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>
          {t('projects.uploadInputFile')}
        </h2>
        <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {t('projects.uploadFileDesc')}
        </p>
        <div className="flex items-center gap-4 mb-3">
          <label className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <input type="checkbox" checked={isAdversarial} onChange={(e) => setIsAdversarial(e.target.checked)} />
            Adversarial (ataque)
          </label>
        </div>
        <label className={`cursor-pointer inline-block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          isDark
            ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
            : 'bg-black/10 hover:bg-black/20 text-black border border-black/20'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          {uploading ? t('common.loading') : t('common.upload')}
          <input
            type="file"
            accept=".txt"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Input Files List */}
      <div className={`backdrop-blur-xl rounded-3xl p-6 border ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
      }`}>
        <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>
          {t('projects.inputFiles')}
        </h2>
        {project.archivos_entrada.length === 0 ? (
          <div className="text-center py-8">
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              {t('projects.noInputFiles')}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {project.archivos_entrada.map((file) => (
              <div
                key={file.id}
                className={`p-4 rounded-lg border ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className={`text-sm font-medium mb-1 ${isDark ? 'text-white' : 'text-black'}`}>
                      {file.nombre_archivo}
                    </p>
                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {t('projects.neurons')}: {file.num_neuronas} • {t('projects.layers')}: {file.capas.length}
                    </div>
                    <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                      {t('projects.uploadedAt')}: {new Date(file.fecha_carga).toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteFile(file.id)}
                    className={`ml-2 p-2 rounded hover:bg-red-500/20 text-red-500`}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
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

export default ProjectDetail;

