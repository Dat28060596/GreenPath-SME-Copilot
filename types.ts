export type ESGStatus = 'not_started' | 'in_progress' | 'completed' | 'verified';
export type ESGCategory = 'Environment' | 'Social' | 'Governance';

export interface CompanyProfile {
  name: string;
  industry: string;
  size: 'Micro' | 'Small' | 'Medium';
  location: string;
  reportingYear: number;
}

export interface Question {
  id: string;
  category: ESGCategory;
  topic: string; // e.g., "Energy", "Water"
  text: string;
  description: string;
  value: string | number | null;
  unit?: string;
  status: ESGStatus;
  evidenceIds: string[];
  lastUpdated?: string;
  aiSuggestion?: string;
}

export interface Evidence {
  id: string;
  filename: string;
  uploadDate: string;
  type: 'Invoice' | 'Policy' | 'Report' | 'Other';
  relatedQuestionId?: string;
  extractedData?: Record<string, any>;
  confidenceScore?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
}

export interface ActionPlanItem {
  id: string;
  title: string;
  impact: 'High' | 'Medium' | 'Low';
  effort: 'Hard' | 'Medium' | 'Easy';
  status: 'Planned' | 'In Progress' | 'Done';
}
