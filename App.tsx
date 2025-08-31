
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { analyzeRTRWH } from './services/geminiService';
import type { FormData, AnalysisResult } from './types';

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    location: '',
    soilType: 'Loam',
    dwellers: 4,
    roofArea: 100,
    openSpace: 50,
  });
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'dwellers' || name === 'roofArea' || name === 'openSpace' ? (value === '' ? '' : parseInt(value, 10)) : value,
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeRTRWH(formData);
      setAnalysisResult(result);
    } catch (err) {
      console.error("Error fetching analysis:", err);
      setError("Failed to generate the analysis. Please check your inputs and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <InputForm
              formData={formData}
              onFormChange={handleFormChange}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
          <div className="lg:col-span-2">
            {isLoading && (
              <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-md h-full">
                <LoadingSpinner />
                <p className="mt-4 text-lg font-medium text-gray-600">Analyzing your data...</p>
                <p className="mt-2 text-sm text-gray-500">This may take a moment.</p>
              </div>
            )}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-md" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            {analysisResult && !isLoading && (
              <ResultsDisplay result={analysisResult} />
            )}
            {!analysisResult && !isLoading && !error && (
                 <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-md h-full text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h2 className="mt-4 text-2xl font-bold text-gray-700">Ready for Your Analysis</h2>
                    <p className="mt-2 text-gray-500">Fill out the form on the left to get started. Your personalized rainwater harvesting report will appear here.</p>
                </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
