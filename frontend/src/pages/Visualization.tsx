import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import AdvancedNeuralVisualizer from '../components/AdvancedNeuralVisualizer';
import DifferenceVisualizer from '../components/DifferenceVisualizer';
import { projectsAPI, exportsAPI } from '../services/api';

interface NeuralNetworkData {
  totalNeurons: number;
  layers: number[];
  weightsMatrix: number[][];
}

interface InputFile {
  id: number;
  nombre_archivo: string;
  ataque: boolean;
  num_neuronas: number;
  capas: number[];
  matriz_pesos: number[][];
  fecha_carga: string;
}

interface ProjectFile {
  id: number;
  name: string;
  type: 'network' | 'adversarial';
  data: NeuralNetworkData;
}

const Visualization: React.FC = () => {
  const { projectId } = useParams<{ projectId?: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDark } = useTheme();
  
  const [inputFiles, setInputFiles] = useState<InputFile[]>([]);
  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<number | null>(null);
  const [selectedAdversarial, setSelectedAdversarial] = useState<number | null>(null);
  const [activationMode, setActivationMode] = useState<'color' | 'thickness'>('color');
  const [showComparison, setShowComparison] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isAdversarial, setIsAdversarial] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [exporting, setExporting] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [currentVisualizationId, setCurrentVisualizationId] = useState<number | null>(null);

  useEffect(() => {
    if (projectId) {
      loadInputFiles();
    } else {
      // If no projectId, redirect to projects page
      navigate('/projects');
    }
  }, [projectId]);

  const loadInputFiles = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getInputFiles(Number(projectId));
      setInputFiles(response.data);
      
      // Convert input files to project files format
      const files: ProjectFile[] = response.data.map((file: InputFile) => ({
        id: file.id,
        name: file.nombre_archivo,
        type: file.ataque ? 'adversarial' : 'network',
        data: {
          totalNeurons: file.num_neuronas,
          layers: file.capas,
          weightsMatrix: file.matriz_pesos,
        },
      }));
      setProjectFiles(files);
      
      // Auto-select first network file if available
      const firstNetwork = files.find(f => f.type === 'network');
      if (firstNetwork) {
        setSelectedNetwork(firstNetwork.id);
      }
    } catch (error: any) {
      console.error('Error loading input files:', error);
      alert(error.response?.data?.detail || t('visualization.errorParsing'));
    } finally {
      setLoading(false);
    }
  };

  const getSelectedNetworkData = () => {
    return projectFiles.find(f => f.id === selectedNetwork && f.type === 'network');
  };

  const getSelectedAdversarialData = () => {
    return projectFiles.find(f => f.id === selectedAdversarial && f.type === 'adversarial');
  };

  const selectedNetworkData = getSelectedNetworkData();
  const selectedAdversarialData = getSelectedAdversarialData();

  const networkFiles = projectFiles.filter(f => f.type === 'network');
  const adversarialFiles = projectFiles.filter(f => f.type === 'adversarial');

  const handleDeleteFile = async (fileId: number, type: 'network' | 'adversarial') => {
    if (!window.confirm(`Are you sure you want to delete this ${type === 'network' ? 'network' : 'adversarial'} file?`)) return;
    
    try {
      setDeleting(fileId);
      await projectsAPI.deleteInputFile(Number(projectId), fileId);
      
      // Clear selection if deleting selected file
      if (type === 'network' && selectedNetwork === fileId) {
        setSelectedNetwork(null);
      } else if (type === 'adversarial' && selectedAdversarial === fileId) {
        setSelectedAdversarial(null);
      }
      
      await loadInputFiles();
    } catch (error: any) {
      console.error('Error deleting file:', error);
      alert(error.response?.data?.detail || 'Error deleting file');
    } finally {
      setDeleting(null);
    }
  };

  const handleExport = async (formato: 'pdf' | 'png' | 'svg' | 'json' | 'html') => {
    if (!projectId) return;
    
    try {
      setExporting(true);
      
      // Create or get visualization
      let visId = currentVisualizationId;
      if (!visId) {
        const visResponse = await projectsAPI.createVisualization(Number(projectId), {
          selectedNetwork: selectedNetwork,
          selectedAdversarial: selectedAdversarial,
          activationMode: activationMode,
          showComparison: showComparison
        });
        visId = visResponse.data.id;
        setCurrentVisualizationId(visId);
      }
      
      // Ensure visId is not null
      if (!visId) {
        throw new Error('Failed to create visualization');
      }
      
      // Create export
      const exportResponse = await exportsAPI.create(visId, formato);
      const exportId = exportResponse.data.id;
      
      // Download the export
      const downloadResponse = await exportsAPI.download(exportId);
      const blob = new Blob([downloadResponse.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `visualization_${visId}_${Date.now()}.${formato}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setShowExportModal(false);
      alert(t('visualization.exportSuccess'));
    } catch (error: any) {
      console.error('Error exporting:', error);
      alert(error.response?.data?.detail || t('visualization.exportError'));
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-black' : 'bg-white'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className={`px-4 py-2 rounded-lg text-sm ${isDark ? 'bg-white/10 text-white' : 'bg-black/10 text-black'}`}>
          ← Back
        </button>
      </div>
      {/* Header */}
      <div className={`backdrop-blur-xl rounded-3xl p-8 border ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
      }`}>
        <h1 className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
          {t('visualization.title')}
        </h1>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          {t('visualization.subtitle')}
        </p>
      </div>

      {/* Upload more files */}
      <div className={`backdrop-blur-xl rounded-3xl p-6 border ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
      }`}>
        <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>
          {t('projects.uploadInputFile')}
        </h2>
        <div className="flex items-center gap-4 mb-3">
          <label className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <input type="checkbox" checked={isAdversarial} onChange={(e) => setIsAdversarial(e.target.checked)} />
            {t('visualization.adversarial')}
          </label>
          <label className={`cursor-pointer inline-block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            isDark
              ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              : 'bg-black/10 hover:bg-black/20 text-black border border-black/20'
          } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {uploading ? t('common.loading') : t('common.upload')}
            <input
              type="file"
              accept=".txt"
              onChange={async (e) => {
                const files = e.target.files;
                if (!files || !files.length) return;
                const file = files[0];
                try {
                  setUploading(true);
                  await projectsAPI.uploadInputFile(Number(projectId), file, isAdversarial);
                  await loadInputFiles();
                  // Reset checkbox after successful upload
                  setIsAdversarial(false);
                } catch (error: any) {
                  console.error('Error uploading file:', error);
                  const errorMessage = error.response?.data?.detail || error.message || t('visualization.errorUploading');
                  alert(errorMessage);
                } finally {
                  setUploading(false);
                  if (e.currentTarget) {
                    e.currentTarget.value = '';
                  }
                }
              }}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* File Selection Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Good Networks */}
        <div className={`backdrop-blur-xl rounded-3xl p-6 border ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
        }`}>
          <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>
            {t('visualization.goodNetworks')}
          </h2>

          {networkFiles.length === 0 ? (
            <div className="text-center py-8">
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('visualization.noNetworksUploaded')}
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {networkFiles.map(file => (
                <div
                  key={file.id}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedNetwork === file.id
                      ? isDark
                        ? 'bg-white/20 border border-white/30'
                        : 'bg-black/20 border border-black/30'
                      : isDark
                        ? 'bg-white/5 hover:bg-white/10 border border-white/10'
                        : 'bg-black/5 hover:bg-black/10 border border-black/10'
                  }`}
                  onClick={() => setSelectedNetwork(file.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-black'}`}>
                        {file.name}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {file.data.totalNeurons} {t('visualization.neurons')} • {file.data.layers.length} {t('visualization.layers')}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFile(file.id, 'network');
                      }}
                      disabled={deleting === file.id}
                      className={`ml-2 p-1 rounded hover:bg-red-500/20 text-red-500 transition-all ${
                        deleting === file.id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      title="Delete file"
                    >
                      {deleting === file.id ? '⏳' : '🗑️'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Adversarial Patterns */}
        <div className={`backdrop-blur-xl rounded-3xl p-6 border ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
        }`}>
          <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>
            {t('visualization.adversarialPatterns')}
          </h2>

          {adversarialFiles.length === 0 ? (
            <div className="text-center py-8">
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('visualization.noAdversarialUploaded')}
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {adversarialFiles.map(file => (
                <div
                  key={file.id}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedAdversarial === file.id
                      ? isDark
                        ? 'bg-red-500/20 border border-red-400/30'
                        : 'bg-red-500/30 border border-red-400/50'
                      : isDark
                        ? 'bg-white/5 hover:bg-white/10 border border-white/10'
                        : 'bg-black/5 hover:bg-black/10 border border-black/10'
                  }`}
                  onClick={() => setSelectedAdversarial(file.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-black'}`}>
                        {file.name}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {file.data.totalNeurons} {t('visualization.neurons')} • {file.data.layers.length} {t('visualization.layers')}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFile(file.id, 'adversarial');
                      }}
                      disabled={deleting === file.id}
                      className={`ml-2 p-1 rounded hover:bg-red-500/20 text-red-500 transition-all ${
                        deleting === file.id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      title="Delete file"
                    >
                      {deleting === file.id ? '⏳' : '🗑️'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Visualization Controls */}
      {(selectedNetworkData || selectedAdversarialData) && (
        <div className={`backdrop-blur-xl rounded-xl p-6 border ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
        }`}>
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <label className={`text-sm font-medium ${isDark ? 'text-white' : 'text-black'}`}>
                {t('visualization.activationDisplay')}:
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setActivationMode('color')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activationMode === 'color'
                      ? isDark
                        ? 'bg-white/20 text-white border border-white/30'
                        : 'bg-black/20 text-black border border-black/30'
                      : isDark
                        ? 'bg-white/5 text-gray-400 hover:bg-white/10'
                        : 'bg-black/5 text-gray-600 hover:bg-black/10'
                  }`}
                >
                  {t('visualization.color')}
                </button>
                <button
                  onClick={() => setActivationMode('thickness')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activationMode === 'thickness'
                      ? isDark
                        ? 'bg-white/20 text-white border border-white/30'
                        : 'bg-black/20 text-black border border-black/30'
                      : isDark
                        ? 'bg-white/5 text-gray-400 hover:bg-white/10'
                        : 'bg-black/5 text-gray-600 hover:bg-black/10'
                  }`}
                >
                  {t('visualization.thickness')}
                </button>
              </div>
            </div>

            {selectedNetworkData && selectedAdversarialData && (
              <button
                onClick={() => setShowComparison(!showComparison)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  showComparison
                    ? isDark
                      ? 'bg-white/20 text-white border border-white/30'
                      : 'bg-black/20 text-black border border-black/30'
                    : isDark
                      ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                      : 'bg-black/10 hover:bg-black/20 text-black border border-black/20'
                }`}
              >
                {showComparison ? t('visualization.hideComparison') : t('visualization.showComparison')}
              </button>
            )}

            {/* Export Button */}
            <button
              onClick={() => setShowExportModal(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isDark
                  ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-400/30'
                  : 'bg-green-500/30 hover:bg-green-500/40 text-green-600 border border-green-500/50'
              }`}
            >
              💾 {t('visualization.export')}
            </button>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`backdrop-blur-xl rounded-3xl p-8 border max-w-md w-full mx-4 ${
            isDark ? 'bg-white/10 border-white/20' : 'bg-black/10 border-black/20'
          }`}>
            <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-black'}`}>
              {t('visualization.exportTitle')}
            </h3>
            <div className="space-y-3">
              {(['pdf', 'png', 'svg', 'json', 'html'] as const).map((formato) => (
                <button
                  key={formato}
                  onClick={() => handleExport(formato)}
                  disabled={exporting}
                  className={`w-full px-4 py-3 rounded-lg font-medium transition-all text-left ${
                    exporting
                      ? 'opacity-50 cursor-not-allowed'
                      : isDark
                        ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                        : 'bg-black/10 hover:bg-black/20 text-black border border-black/20'
                  }`}
                >
                  {formato.toUpperCase()} {t('visualization.export')}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowExportModal(false)}
              className={`mt-6 w-full px-4 py-2 rounded-lg font-medium transition-all ${
                isDark
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-black/10 hover:bg-black/20 text-black'
              }`}
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      )}

      {/* Visualization Area */}
      {(selectedNetworkData || selectedAdversarialData) && (
        <div className="space-y-6">
          <div className={`grid ${
            selectedNetworkData && selectedAdversarialData ? 'grid-cols-2' : 'grid-cols-1'
          } gap-6`}>
            {selectedNetworkData && (
              <div className={`backdrop-blur-xl rounded-3xl p-4 border ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
              }`}>
                <div style={{ height: '600px' }}>
                  <AdvancedNeuralVisualizer
                    networkData={selectedNetworkData.data}
                    position={selectedAdversarialData ? 'left' : 'center'}
                    activationMode={activationMode}
                    label={selectedNetworkData.name}
                  />
                </div>
              </div>
            )}

            {selectedAdversarialData && (
              <div className={`backdrop-blur-xl rounded-3xl p-4 border ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
              }`}>
                <div style={{ height: '600px' }}>
                  <AdvancedNeuralVisualizer
                    networkData={selectedAdversarialData.data}
                    position={selectedNetworkData ? 'right' : 'center'}
                    activationMode={activationMode}
                    label={selectedAdversarialData.name}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Difference Visualization */}
          {showComparison && selectedNetworkData && selectedAdversarialData && (
            <DifferenceVisualizer
              network1={selectedNetworkData.data}
              network2={selectedAdversarialData.data}
              label1={selectedNetworkData.name}
              label2={selectedAdversarialData.name}
            />
          )}
        </div>
      )}

      {/* Empty state */}
      {!selectedNetworkData && !selectedAdversarialData && (
        <div className={`backdrop-blur-xl rounded-3xl p-12 border text-center ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
        }`}>
          <div className="text-6xl mb-4">🎯</div>
          <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
            {t('visualization.noNetworksSelected')}
          </h3>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            {t('visualization.uploadAndSelect')}
          </p>
          <button
            onClick={() => navigate(`/projects/${projectId}`)}
            className={`mt-4 px-6 py-3 rounded-lg font-medium transition-all ${
              isDark
                ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                : 'bg-black/10 hover:bg-black/20 text-black border border-black/20'
            }`}
          >
            {t('projects.uploadInputFile')}
          </button>
        </div>
      )}
    </div>
  );
};

export default Visualization;
