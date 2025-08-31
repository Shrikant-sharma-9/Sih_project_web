
export interface FormData {
  name: string;
  location: string;
  soilType: string;
  dwellers: number | '';
  roofArea: number | '';
  openSpace: number | '';
}

export interface Feasibility {
  status: string;
  score: number;
  reasoning: string;
}

export interface SuggestedStructure {
  type: string;
  description: string;
}

export interface AquiferInfo {
  name: string;
  details: string;
}

export interface GroundwaterDepth {
  depthMeters: number;
  notes: string;
}

export interface LocalRainfall {
  annualAverageMm: number;
}

export interface RunoffCapacity {
  litersPerYear: number;
  calculation: string;
}

export interface StructureDimensions {
  type: string;
  lengthMeters: number;
  widthMeters: number;
  depthMeters: number;
}

export interface CostAnalysis {
  estimatedCost: number;
  currency: string;
  benefitAnalysis: string;
}

export interface AnalysisResult {
  feasibility: Feasibility;
  suggestedStructure: SuggestedStructure;
  aquiferInfo: AquiferInfo;
  groundwaterDepth: GroundwaterDepth;
  localRainfall: LocalRainfall;
  runoffCapacity: RunoffCapacity;
  structureDimensions: StructureDimensions;
  costAnalysis: CostAnalysis;
}
