import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { calculateNetworkDifference, getLayerInfo, type NeuralNetworkData } from '../utils/neuralNetworkParser';

interface DifferenceVisualizerProps {
  network1: NeuralNetworkData;
  network2: NeuralNetworkData;
  label1: string;
  label2: string;
}

const DifferenceVisualizer: React.FC<DifferenceVisualizerProps> = ({
  network1,
  network2,
  label1,
  label2
}) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  
  const difference = calculateNetworkDifference(network1, network2);
  const diffPercentage = (difference.averageDifference * 100).toFixed(2);
  
  // Get layer info for both networks
  const layerInfo1 = useMemo(() => getLayerInfo(network1), [network1]);
  const layerInfo2 = useMemo(() => getLayerInfo(network2), [network2]);
  
  // Calculate layer-by-layer differences
  const layerDifferences = useMemo(() => {
    const maxLayers = Math.max(layerInfo1.length, layerInfo2.length);
    return Array.from({ length: maxLayers }, (_, layerIdx) => {
      const layer1 = layerInfo1[layerIdx];
      const layer2 = layerInfo2[layerIdx];
      
      if (!layer1 || !layer2) return 1.0; // Different layer counts = max difference
      
      let layerDiff = 0;
      let count = 0;
      
      for (let i = 0; i < Math.min(layer1.neuronCount, layer2.neuronCount); i++) {
        const neuron1 = layer1.startNeuron + i;
        const neuron2 = layer2.startNeuron + i;
        
        // Compare connections from this neuron
        const weights1 = network1.weightsMatrix[neuron1] || [];
        const weights2 = network2.weightsMatrix[neuron2] || [];
        const maxWeights = Math.max(weights1.length, weights2.length);
        
        for (let j = 0; j < maxWeights; j++) {
          const w1 = weights1[j] || 0;
          const w2 = weights2[j] || 0;
          layerDiff += Math.abs(w1 - w2);
          count++;
        }
      }
      
      return count > 0 ? layerDiff / count : 0;
    });
  }, [network1, network2, layerInfo1, layerInfo2]);
  
  // Calculate color based on difference
  const getColorForDifference = (value: number): string => {
    // 0 = green (no difference), 1 = red (max difference)
    const normalized = Math.min(value / difference.maxDifference, 1);
    const hue = (1 - normalized) * 120; // 120 = green, 0 = red
    return `hsl(${hue}, 100%, 50%)`;
  };

  return (
    <div className={`p-6 rounded-3xl backdrop-blur-xl border ${
      isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
    }`}>
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
          {t('comparison.title')}
        </h3>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {label1} vs {label2}
        </p>
      </div>

      {/* Difference Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className={`p-4 rounded-xl text-center ${
          isDark ? 'bg-white/5' : 'bg-black/5'
        }`}>
          <p className={`text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('comparison.averageDifference')}
          </p>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
            {diffPercentage}%
          </p>
        </div>

        <div className={`p-4 rounded-xl text-center ${
          isDark ? 'bg-white/5' : 'bg-black/5'
        }`}>
          <p className={`text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('comparison.maxDifference')}
          </p>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
            {(difference.maxDifference * 100).toFixed(1)}%
          </p>
        </div>

        <div className={`p-4 rounded-xl text-center ${
          isDark ? 'bg-white/5' : 'bg-black/5'
        }`}>
          <p className={`text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('comparison.totalDifference')}
          </p>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
            {difference.totalDifference.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Visual Difference Diagram */}
      <div className="space-y-4 mb-6">
        <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
          {t('comparison.layerDiagram')}
        </p>
        
        {/* Network Diagram */}
        <div className={`relative p-6 rounded-xl ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
          <div className="flex items-center justify-center gap-4 overflow-x-auto pb-4">
            {layerDifferences.map((layerDiff, idx) => {
              const normalizedDiff = difference.maxDifference > 0 
                ? Math.min(layerDiff / difference.maxDifference, 1) 
                : 0;
              const color = getColorForDifference(layerDiff);
              const layerSize = Math.max(
                layerInfo1[idx]?.neuronCount || 0,
                layerInfo2[idx]?.neuronCount || 0
              );
              
              return (
                <div key={idx} className="flex flex-col items-center gap-2 min-w-[80px]">
                  {/* Layer label */}
                  <span className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    L{idx + 1}
                  </span>
                  
                  {/* Layer visualization */}
                  <div className="relative">
                    {/* Neurons */}
                    <div className="flex flex-col gap-1">
                      {Array.from({ length: Math.min(layerSize, 8) }).map((_, neuronIdx) => {
                        const neuronDiff = normalizedDiff;
                        return (
                          <div
                            key={neuronIdx}
                            className="w-8 h-8 rounded-full border-2 transition-all"
                            style={{
                              backgroundColor: color,
                              opacity: 0.3 + neuronDiff * 0.7,
                              borderColor: color,
                              boxShadow: `0 0 ${neuronDiff * 8}px ${color}`
                            }}
                          />
                        );
                      })}
                      {layerSize > 8 && (
                        <div className={`text-xs text-center ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          +{layerSize - 8}
                        </div>
                      )}
                    </div>
                    
                    {/* Difference indicator bar */}
                    <div className={`mt-2 w-full h-2 rounded-full overflow-hidden ${
                      isDark ? 'bg-gray-800' : 'bg-gray-300'
                    }`}>
                      <div
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${normalizedDiff * 100}%`,
                          backgroundColor: color
                        }}
                      />
                    </div>
                    
                    {/* Difference percentage */}
                    <div className={`text-xs text-center mt-1 font-semibold`} style={{ color }}>
                      {(normalizedDiff * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Connection lines showing differences */}

        </div>
      </div>

      {/* Visual Difference Indicator */}
      <div className="space-y-4">
        <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
          {t('comparison.overallScale')}
        </p>
        
        {/* Color scale */}
        <div className="relative h-12 rounded-xl overflow-hidden">
          <div 
            className="h-full transition-all duration-500"
            style={{
              background: `linear-gradient(to right, 
                hsl(120, 100%, 50%), 
                hsl(60, 100%, 50%), 
                hsl(0, 100%, 50%)
              )`
            }}
          />
          
          {/* Marker for average difference */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
            style={{ 
              left: `${difference.averageDifference * 100}%`,
              transition: 'left 0.5s ease'
            }}
          >
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white text-black text-xs px-2 py-1 rounded whitespace-nowrap font-bold">
              Avg: {diffPercentage}%
            </div>
          </div>
        </div>

        <div className="flex justify-between text-xs">
          <span className={isDark ? 'text-green-400' : 'text-green-600'}>
            ✓ {t('comparison.identical')}
          </span>
          <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            {t('comparison.similar')}
          </span>
          <span className={isDark ? 'text-red-400' : 'text-red-600'}>
            ✗ {t('comparison.veryDifferent')}
          </span>
        </div>
      </div>

      {/* Interpretation */}
      <div className={`mt-6 p-4 rounded-xl ${
        difference.averageDifference < 0.1
          ? isDark ? 'bg-green-500/20 border border-green-400/30' : 'bg-green-500/30 border border-green-400/50'
          : difference.averageDifference < 0.3
          ? isDark ? 'bg-yellow-500/20 border border-yellow-400/30' : 'bg-yellow-500/30 border border-yellow-400/50'
          : isDark ? 'bg-red-500/20 border border-red-400/30' : 'bg-red-500/30 border border-red-400/50'
      }`}>
        <p className={`text-sm font-semibold mb-2 ${
          difference.averageDifference < 0.1
            ? isDark ? 'text-green-100' : 'text-green-900'
            : difference.averageDifference < 0.3
            ? isDark ? 'text-yellow-100' : 'text-yellow-900'
            : isDark ? 'text-red-100' : 'text-red-900'
        }`}>
          {difference.averageDifference < 0.1
            ? `✓ ${t('comparison.verySimilar')}`
            : difference.averageDifference < 0.3
            ? `⚠ ${t('comparison.moderateDifferences')}`
            : `✗ ${t('comparison.significantlyDifferent')}`
          }
        </p>
        <p className={`text-xs ${
          difference.averageDifference < 0.1
            ? isDark ? 'text-green-200' : 'text-green-800'
            : difference.averageDifference < 0.3
            ? isDark ? 'text-yellow-200' : 'text-yellow-800'
            : isDark ? 'text-red-200' : 'text-red-800'
        }`}>
          {difference.averageDifference < 0.1
            ? t('comparison.identicalDescription')
            : difference.averageDifference < 0.3
            ? t('comparison.moderateDescription')
            : t('comparison.differentDescription')
          }
        </p>
      </div>

      {/* Legend */}
      <div className={`mt-4 p-3 rounded-lg ${
        isDark ? 'bg-white/5' : 'bg-black/5'
      }`}>
        <p className={`text-xs font-semibold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
          {t('comparison.howToInterpret')}
        </p>
        <ul className={`text-xs space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          <li>• <strong>&lt;10%</strong>: {t('comparison.interpretation1')}</li>
          <li>• <strong>10-30%</strong>: {t('comparison.interpretation2')}</li>
          <li>• <strong>&gt;30%</strong>: {t('comparison.interpretation3')}</li>
        </ul>
      </div>
    </div>
  );
};

export default DifferenceVisualizer;