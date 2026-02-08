import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Question, ActionPlanItem, CompanyProfile } from "../types";

// Initialize the client.
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

export const generateActionPlan = async (
  profile: CompanyProfile,
  questions: Question[]
): Promise<ActionPlanItem[]> => {
  try {
    if (!process.env.API_KEY) {
      // Return mock data if no key
      return [
        { id: "mock1", title: "Setup Energy Monitoring (Mock)", impact: "High", effort: "Medium", status: "Planned" },
        { id: "mock2", title: "Create Diversity Policy (Mock)", impact: "Medium", effort: "Easy", status: "Planned" }
      ];
    }

    const unfinishedTopics = questions
      .filter(q => q.status === 'not_started' || q.status === 'in_progress')
      .map(q => q.topic)
      .join(', ');

    const prompt = `
      Generate a specific ESG action plan for a ${profile.size} ${profile.industry} company in ${profile.location}.
      Focus on these unfinished areas: ${unfinishedTopics}.
      
      Generate 3-5 concrete, actionable items.
      
      For each item, specify:
      - title: A clear action title
      - impact: 'High', 'Medium', or 'Low'
      - effort: 'Hard', 'Medium', or 'Easy'
      - status: 'Planned'
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              impact: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
              effort: { type: Type.STRING, enum: ["Hard", "Medium", "Easy"] },
              status: { type: Type.STRING, enum: ["Planned", "In Progress", "Done"] }
            },
            required: ["title", "impact", "effort", "status"]
          }
        }
      }
    });

    const jsonStr = response.text || "[]";
    const items = JSON.parse(jsonStr);
    
    return items.map((item: any, index: number) => ({
      ...item,
      id: `gen-${Date.now()}-${index}`
    }));

  } catch (error) {
    console.error("Action Plan Error:", error);
    return [];
  }
};

export const suggestAnswer = async (
  question: Question,
  profile: CompanyProfile
): Promise<string> => {
  try {
    if (!process.env.API_KEY) return "1000 (Mock Suggestion)";

    const prompt = `
      Suggest a realistic value or text response for an ESG report question based on benchmarks for a ${profile.size} ${profile.industry} company in ${profile.location}.
      
      Question Topic: ${question.topic}
      Question Text: ${question.text}
      Unit: ${question.unit || 'N/A'}

      If it is a numeric metric (like energy), provide a realistic estimate number only.
      If it is a text question (like a policy description), draft a short, compliant 1-sentence response.
      
      Output ONLY the suggested value/text.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text?.trim() || "";
  } catch (error) {
    return "";
  }
};