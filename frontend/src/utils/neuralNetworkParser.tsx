export interface NeuralNetworkData {
  totalNeurons: number;
  layers: number[];
  weightsMatrix: number[][];
}

export interface ParsedLayer {
  layerIndex: number;
  startNeuron: number;
  endNeuron: number;
  neuronCount: number;
}

export interface NetworkFile {
  id: string;
  name: string;
  type: 'network' | 'adversarial';
  data: NeuralNetworkData;
  uploadedAt: Date;
}

export function parseNeuralNetworkFile(fileContent: string): NeuralNetworkData {
  // Split into lines and remove comments (anything after #)
  const lines = fileContent
    .split('\n')
    .map(line => line.split('#')[0].trim())
    .filter(line => line.length > 0);

  let currentLine = 0;

  // Parse total neurons
  const totalNeurons = parseInt(lines[currentLine++]);

  // Parse layer distribution
  const layers: number[] = [];
  let neuronsParsed = 0;
  
  while (neuronsParsed < totalNeurons && currentLine < lines.length) {
    const layerSize = parseInt(lines[currentLine++]);
    if (!isNaN(layerSize)) {
      layers.push(layerSize);
      neuronsParsed += layerSize;
    }
  }

  // Parse weights matrix
  const weightsMatrix: number[][] = [];
  
  while (currentLine < lines.length) {
    const line = lines[currentLine++];
    const weights = line
      .split(/\s+/)
      .map(w => parseFloat(w))
      .filter(w => !isNaN(w));
    
    if (weights.length > 0) {
      weightsMatrix.push(weights);
    }
  }

  return {
    totalNeurons,
    layers,
    weightsMatrix
  };
}

export function getLayerInfo(data: NeuralNetworkData): ParsedLayer[] {
  const layerInfo: ParsedLayer[] = [];
  let startNeuron = 0;

  data.layers.forEach((neuronCount, index) => {
    layerInfo.push({
      layerIndex: index,
      startNeuron,
      endNeuron: startNeuron + neuronCount - 1,
      neuronCount
    });
    startNeuron += neuronCount;
  });

  return layerInfo;
}

export function getConnectionWeight(
  data: NeuralNetworkData,
  fromNeuron: number,
  toNeuron: number
): number {
  if (
    fromNeuron >= 0 && 
    fromNeuron < data.weightsMatrix.length &&
    toNeuron >= 0 && 
    toNeuron < data.weightsMatrix[fromNeuron].length
  ) {
    return data.weightsMatrix[fromNeuron][toNeuron];
  }
  return 0;
}

export function getNeuronConnections(
  data: NeuralNetworkData,
  neuronIndex: number
): Array<{ to: number; weight: number }> {
  const connections: Array<{ to: number; weight: number }> = [];
  
  if (neuronIndex >= 0 && neuronIndex < data.weightsMatrix.length) {
    data.weightsMatrix[neuronIndex].forEach((weight, toIndex) => {
      if (weight !== 0) {
        connections.push({ to: toIndex, weight });
      }
    });
  }
  
  return connections;
}

export function calculateNetworkDifference(
  network1: NeuralNetworkData,
  network2: NeuralNetworkData
): {
  totalDifference: number;
  averageDifference: number;
  maxDifference: number;
  differenceMatrix: number[][];
} {
  const size = Math.min(network1.weightsMatrix.length, network2.weightsMatrix.length);
  const differenceMatrix: number[][] = [];
  let totalDiff = 0;
  let count = 0;
  let maxDiff = 0;

  for (let i = 0; i < size; i++) {
    const row: number[] = [];
    const rowSize = Math.min(
      network1.weightsMatrix[i]?.length || 0,
      network2.weightsMatrix[i]?.length || 0
    );

    for (let j = 0; j < rowSize; j++) {
      const diff = Math.abs(
        (network1.weightsMatrix[i]?.[j] || 0) - 
        (network2.weightsMatrix[i]?.[j] || 0)
      );
      row.push(diff);
      totalDiff += diff;
      count++;
      maxDiff = Math.max(maxDiff, diff);
    }
    differenceMatrix.push(row);
  }

  return {
    totalDifference: totalDiff,
    averageDifference: count > 0 ? totalDiff / count : 0,
    maxDifference: maxDiff,
    differenceMatrix
  };
}