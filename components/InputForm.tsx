
import React from 'react';
import type { FormData } from '../types';

interface InputFormProps {
  formData: FormData;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const InputField: React.FC<{
  label: string;
  name: keyof FormData;
  type: string;
  value: string | number;
  placeholder: string;
  unit?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, name, type, value, placeholder, unit, onChange }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="mt-1 relative rounded-md shadow-sm">
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="bg-gray-100 focus:bg-white transition-colors focus:ring-blue-500 focus:border-blue-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
        required
        min={type === 'number' ? 1 : undefined}
      />
      {unit && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">{unit}</span>
        </div>
      )}
    </div>
  </div>
);

const soilTypes = [
  { value: 'Clay', label: 'Clay (Slow infiltration)' },
  { value: 'Silt', label: 'Silt (Medium infiltration)' },
  { value: 'Sand', label: 'Sand (Fast infiltration)' },
  { value: 'Loam', label: 'Loam (Good infiltration)' },
  { value: 'Gravel', label: 'Gravel (Very fast infiltration)' },
];

const SelectField: React.FC<{
  label: string;
  name: keyof FormData;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}> = ({ label, name, value, onChange, options }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="mt-1">
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="bg-gray-100 focus:bg-white transition-colors focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md shadow-sm"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export const InputForm: React.FC<InputFormProps> = ({ formData, onFormChange, onSubmit, isLoading }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Your Details</h2>
      <p className="text-sm text-gray-600 mb-6">Enter information about your property to generate a personalized rainwater harvesting report.</p>
      <form onSubmit={onSubmit} className="space-y-6">
        <InputField
          label="Full Name"
          name="name"
          type="text"
          value={formData.name}
          onChange={onFormChange}
          placeholder="e.g., Jane Doe"
        />
        <InputField
          label="Location"
          name="location"
          type="text"
          value={formData.location}
          onChange={onFormChange}
          placeholder="City, State/Country"
        />
        <SelectField
          label="Predominant Soil Type"
          name="soilType"
          value={formData.soilType}
          onChange={onFormChange}
          options={soilTypes}
        />
        <InputField
          label="Number of Dwellers"
          name="dwellers"
          type="number"
          value={formData.dwellers}
          onChange={onFormChange}
          placeholder="e.g., 4"
        />
        <InputField
          label="Roof Area"
          name="roofArea"
          type="number"
          value={formData.roofArea}
          onChange={onFormChange}
          placeholder="e.g., 100"
          unit="m²"
        />
        <InputField
          label="Available Open Space"
          name="openSpace"
          type="number"
          value={formData.openSpace}
          onChange={onFormChange}
          placeholder="e.g., 50"
          unit="m²"
        />
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Analyzing...' : 'Generate Report'}
          </button>
        </div>
      </form>
    </div>
  );
};
