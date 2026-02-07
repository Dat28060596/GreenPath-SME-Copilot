import { GoogleGenAI } from "@google/genai";
import { Question } from "../types";

// Initialize the client. 
// Note: In a production app, the key should be proxied or carefully managed. 
// Here we assume process.env.API_KEY is available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const MODEL_NAME = "gemini-3-flash-preview";

export const generateCopilotResponse = async (
  userMessage: string,
  context: { page: string; selectedQuestion?: Question | null }
): Promise<string> => {
  try {
    if (!process.env.API_KEY) {
        return "I'm ready to help, but I need an API Key to function. Please ensure the environment is configured.";
    }

    const systemPrompt = `
      You are an expert ESG Copilot for Small and Medium Enterprises (SMEs) in Vietnam/ASEAN.
      Your goal is to guide non-expert business owners through the VSME (Voluntary SME) reporting standard.
      
      Current User Context:
      - Page: ${context.page}
      - Focused Question: ${context.selectedQuestion ? `${context.selectedQuestion.topic}: ${context.selectedQuestion.text}` : 'None'}
      - Description of Question: ${context.selectedQuestion?.description || ''}

      Tone: Professional, encouraging, simplified, and helpful. Avoid overly complex jargon.
      If the user asks about calculation, explain the formula simply (e.g., Activity Data x Emission Factor).
      If the user is stuck, suggest types of documents they might look for (e.g., electricity bills, payroll records).
      
      Keep responses concise unless asked for a detailed explanation.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: userMessage,
      config: {
        systemInstruction: systemPrompt,
      }
    });

    return response.text || "I processed that but couldn't generate a text response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to my knowledge base right now. Please try again later.";
  }
};

export const extractDataFromDocument = async (
  fileName: string,
  fileType: string
): Promise<{ text: string; confidence: number }> => {
  try {
     if (!process.env.API_KEY) return { text: "Mock extraction: API Key missing.", confidence: 0 };

    // Since we cannot actually upload files in this browser environment to the server,
    // We will simulate the extraction by asking Gemini what data *typically* resides in such a file
    // and generating a realistic "extraction" result to demonstrate the UI flow.
    
    const prompt = `
      Simulate a data extraction result for an uploaded file named "${fileName}" of type "${fileType}".
      Assume this is for an SME's ESG report.
      
      If it looks like an electricity bill, extract kWh and Cost.
      If it looks like an HR report, extract Headcount and Gender Ratio.
      If it is a policy, summarize the key commitments.

      Return a short paragraph summarizing the "extracted" facts.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return {
      text: response.text || "Could not extract data.",
      confidence: 0.85 + (Math.random() * 0.1) // Mock confidence
    };

  } catch (error) {
    return { text: "Error extracting data from document.", confidence: 0 };
  }
};
