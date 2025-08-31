
import React from 'react';
import type { Feasibility } from '../types';

interface ResultCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

export const ResultCard: React.FC<ResultCardProps> = ({ icon, title, children }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col h-full">
      <div className="flex items-center mb-4">
        <div className="bg-blue-100 p-2 rounded-full">
          {icon}
        </div>
        <h3 className="ml-3 text-lg font-semibold text-gray-700">{title}</h3>
      </div>
      <div className="flex-grow">
        {children}
      </div>
    </div>
  );
};


export const FeasibilityCard: React.FC<{ feasibility: Feasibility }> = ({ feasibility }) => {
  const getScoreColor = (score: number) => {
    if (score >= 75) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getFeasibilityColor = (score: number) => {
    if (score >= 75) return 'text-green-700';
    if (score >= 50) return 'text-yellow-700';
    return 'text-red-700';
  };
  
  const scoreColor = getScoreColor(feasibility.score);
  const feasibilityColor = getFeasibilityColor(feasibility.score);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Feasibility Summary</h3>
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
        <div className="flex-shrink-0 text-center mb-4 sm:mb-0">
          <p className="text-5xl font-bold tracking-tight" style={{ color: feasibilityColor.replace('text-', '').replace('-700', '') }}>
            {feasibility.score}<span className="text-2xl text-gray-400">/100</span>
          </p>
          <p className={`text-xl font-semibold ${feasibilityColor}`}>{feasibility.status}</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 my-2 sm:hidden">
          <div className={`${scoreColor} h-2.5 rounded-full`} style={{ width: `${feasibility.score}%` }}></div>
        </div>
        <div>
          <p className="text-sm text-gray-600 leading-relaxed">{feasibility.reasoning}</p>
        </div>
      </div>
    </div>
  );
};
