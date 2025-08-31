
import { GoogleGenAI, Type } from "@google/genai";
import type { FormData, AnalysisResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
  
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        feasibility: {
            type: Type.OBJECT,
            properties: {
                status: { type: Type.STRING, description: "e.g., 'Highly Feasible', 'Moderately Feasible', 'Not Feasible'" },
                score: { type: Type.NUMBER, description: "A score from 0 to 100 representing feasibility." },
                reasoning: { type: Type.STRING, description: "A brief explanation for the feasibility status." },
            },
            required: ["status", "score", "reasoning"],
        },
        suggestedStructure: {
            type: Type.OBJECT,
            properties: {
                type: { type: Type.STRING, description: "e.g., 'Recharge Pit', 'Trench', 'Shaft', 'Storage Tank'" },
                description: { type: Type.STRING, description: "Brief description and suitability for the user's context." },
            },
            required: ["type", "description"],
        },
        aquiferInfo: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING, description: "Name of the principal aquifer in the specified location." },
                details: { type: Type.STRING, description: "Geological details about the aquifer." },
            },
            required: ["name", "details"],
        },
        groundwaterDepth: {
            type: Type.OBJECT,
            properties: {
                depthMeters: { type: Type.NUMBER, description: "Estimated depth to groundwater level in meters." },
                notes: { type: Type.STRING, description: "Any notes about seasonal variation or local factors." },
            },
            required: ["depthMeters", "notes"],
        },
        localRainfall: {
            type: Type.OBJECT,
            properties: {
                annualAverageMm: { type: Type.NUMBER, description: "Average annual rainfall in millimeters for the location." },
            },
            required: ["annualAverageMm"],
        },
        runoffCapacity: {
            type: Type.OBJECT,
            properties: {
                litersPerYear: { type: Type.NUMBER, description: "Total potential rainwater runoff in liters per year." },
                calculation: { type: Type.STRING, description: "Formula used: Roof Area (sq.m) * Annual Rainfall (mm) * Runoff Coefficient (0.85)." },
            },
            required: ["litersPerYear", "calculation"],
        },
        structureDimensions: {
            type: Type.OBJECT,
            properties: {
                type: { type: Type.STRING, description: "The type of structure for which dimensions are provided." },
                lengthMeters: { type: Type.NUMBER, description: "Recommended length in meters." },
                widthMeters: { type: Type.NUMBER, description: "Recommended width in meters." },
                depthMeters: { type: Type.NUMBER, description: "Recommended depth in meters." },
            },
            required: ["type", "lengthMeters", "widthMeters", "depthMeters"],
        },
        costAnalysis: {
            type: Type.OBJECT,
            properties: {
                estimatedCost: { type: Type.NUMBER, description: "An estimated cost for implementing the suggested structure." },
                currency: { type: Type.STRING, description: "Currency, e.g., USD, INR." },
                benefitAnalysis: { type: Type.STRING, description: "A summary of the cost-benefit analysis and long-term savings." },
            },
            required: ["estimatedCost", "currency", "benefitAnalysis"],
        },
    },
     required: [
        "feasibility", "suggestedStructure", "aquiferInfo", "groundwaterDepth", 
        "localRainfall", "runoffCapacity", "structureDimensions", "costAnalysis"
    ],
};


export const analyzeRTRWH = async (formData: FormData): Promise<AnalysisResult> => {
  const { location, dwellers, roofArea, openSpace, soilType } = formData;

  const prompt = `
    Act as an expert hydrogeologist and civil engineer specializing in rainwater harvesting.
    Analyze the following data to determine the feasibility of Rooftop Rainwater Harvesting (RTRWH) and artificial recharge.

    User Data:
    - Location: ${location}
    - Number of Dwellers: ${dwellers}
    - Roof Area: ${roofArea} sq. meters
    - Available Open Space for recharge structures: ${openSpace} sq. meters
    - Predominant Soil Type: ${soilType}

    Based on this data, provide a detailed analysis. Your response MUST be a JSON object that conforms to the provided schema.
    
    Analysis to perform:
    1.  **Feasibility Check**: Based on roof area, rainfall (infer for the location), available open space, and the provided soil type (e.g., sandy soils are better for infiltration than clay soils).
    2.  **Suggested Structure**: Recommend a suitable RTRWH or Artificial Recharge structure (e.g., Recharge Pit, Trench, Shaft, or simple Storage Tank). Your recommendation should be heavily influenced by the provided soil type and available open space. For example, a recharge pit is excellent for sandy soil, while a trench might be better for loam. Clay soils might favor a storage tank over direct recharge.
    3.  **Principal Aquifer**: Identify the likely principal aquifer system for the given location.
    4.  **Groundwater Depth**: Estimate the depth to the groundwater level.
    5.  **Local Rainfall**: Provide an estimated average annual rainfall for the location.
    6.  **Runoff Generation**: Calculate the potential annual runoff. Use a runoff coefficient of 0.85 for a typical roof. Formula: Runoff (Liters) = Roof Area (m²) * Annual Rainfall (mm) * 0.85.
    7.  **Structure Dimensions**: Recommend practical dimensions (length, width, depth in meters) for the suggested recharge structure. The dimensions should be reasonable for the available open space.
    8.  **Cost-Benefit Analysis**: Provide a rough cost estimate for the structure in the local currency (or USD if local is unknown) and a brief cost-benefit analysis, highlighting potential water savings and long-term value.
    
    Generate the JSON output now.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: responseSchema,
        },
    });

    const jsonText = response.text.trim();
    const parsedResult = JSON.parse(jsonText) as AnalysisResult;
    return parsedResult;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to get analysis from Gemini API.");
  }
};
