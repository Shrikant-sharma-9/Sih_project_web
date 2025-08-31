
import React from 'react';
import type { AnalysisResult } from '../types';
import { ResultCard, FeasibilityCard } from './ResultCard';
import { WaterDropIcon, RulerIcon, CostIcon, ChartIcon, MapIcon, DepthIcon } from './Icons';

export const ResultsDisplay: React.FC<{ result: AnalysisResult }> = ({ result }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Your Rainwater Harvesting Analysis</h2>
      <FeasibilityCard feasibility={result.feasibility} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ResultCard icon={<WaterDropIcon />} title="Runoff Capacity">
          <p className="text-3xl font-bold text-blue-600">{result.runoffCapacity.litersPerYear.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Liters/Year</p>
          <p className="mt-2 text-xs text-gray-400">{result.runoffCapacity.calculation}</p>
        </ResultCard>

        <ResultCard icon={<WaterDropIcon />} title="Local Rainfall">
          <p className="text-3xl font-bold text-blue-600">{result.localRainfall.annualAverageMm}</p>
          <p className="text-sm text-gray-500">mm/Year</p>
        </ResultCard>

         <ResultCard icon={<RulerIcon />} title="Suggested Structure">
          <p className="text-xl font-semibold text-gray-800">{result.suggestedStructure.type}</p>
          <p className="mt-1 text-sm text-gray-600">{result.suggestedStructure.description}</p>
        </ResultCard>

        <ResultCard icon={<RulerIcon />} title="Recommended Dimensions">
            <p className="text-xl font-semibold text-gray-800">{result.structureDimensions.type}</p>
             <div className="mt-2 space-y-1 text-sm text-gray-700">
                <p>Length: <strong>{result.structureDimensions.lengthMeters} m</strong></p>
                <p>Width: <strong>{result.structureDimensions.widthMeters} m</strong></p>
                <p>Depth: <strong>{result.structureDimensions.depthMeters} m</strong></p>
            </div>
        </ResultCard>

        <ResultCard icon={<CostIcon />} title="Cost Estimate">
           <p className="text-3xl font-bold text-green-600">{new Intl.NumberFormat('en-US', { style: 'currency', currency: result.costAnalysis.currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(result.costAnalysis.estimatedCost)}</p>
          <p className="text-sm text-gray-500">Estimated Cost</p>
        </ResultCard>

        <ResultCard icon={<ChartIcon />} title="Cost-Benefit Analysis">
            <p className="text-sm text-gray-600 leading-relaxed">{result.costAnalysis.benefitAnalysis}</p>
        </ResultCard>

        <ResultCard icon={<MapIcon />} title="Principal Aquifer">
            <p className="text-xl font-semibold text-gray-800">{result.aquiferInfo.name}</p>
            <p className="mt-1 text-sm text-gray-600">{result.aquiferInfo.details}</p>
        </ResultCard>

        <ResultCard icon={<DepthIcon />} title="Groundwater Depth">
            <p className="text-3xl font-bold text-blue-600">{result.groundwaterDepth.depthMeters} m</p>
            <p className="text-sm text-gray-500">Estimated Depth</p>
            <p className="mt-2 text-xs text-gray-500">{result.groundwaterDepth.notes}</p>
        </ResultCard>
      </div>
    </div>
  );
};
