import { Question, ActionPlanItem, Evidence } from './types';

export const MOCK_COMPANY = {
  name: "Viet Manufacturing Co., Ltd",
  industry: "Manufacturing",
  size: "Medium",
  location: "Ho Chi Minh City, Vietnam",
  reportingYear: 2024
} as const;

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: "E1",
    category: "Environment",
    topic: "Energy",
    text: "Total Electricity Consumption",
    description: "Please enter the total electricity consumed by your organization during the reporting period.",
    value: null,
    unit: "kWh",
    status: "not_started",
    evidenceIds: []
  },
  {
    id: "E2",
    category: "Environment",
    topic: "GHG Emissions",
    text: "Scope 1 Emissions (Fuel)",
    description: "Direct emissions from owned or controlled sources (e.g., company vehicles, generators).",
    value: 12500,
    unit: "tCO2e",
    status: "in_progress",
    evidenceIds: ["ev-002"],
    lastUpdated: "2024-05-10"
  },
  {
    id: "S1",
    category: "Social",
    topic: "Workforce",
    text: "Total Number of Employees",
    description: "Headcount as of the end of the reporting period.",
    value: 45,
    unit: "FTE",
    status: "completed",
    evidenceIds: ["ev-003"]
  },
  {
    id: "S2",
    category: "Social",
    topic: "Health & Safety",
    text: "Work-related Injuries",
    description: "Number of recordable work-related injuries.",
    value: 0,
    unit: "Incidents",
    status: "verified",
    evidenceIds: []
  },
  {
    id: "G1",
    category: "Governance",
    topic: "Ethics",
    text: "Code of Conduct",
    description: "Do you have a written Code of Conduct distributed to all employees?",
    value: "Yes",
    status: "completed",
    evidenceIds: ["ev-001"]
  }
];

export const MOCK_EVIDENCE: Evidence[] = [
  {
    id: "ev-001",
    filename: "Code_of_Conduct_2024.pdf",
    uploadDate: "2024-01-15",
    type: "Policy",
    relatedQuestionId: "G1"
  },
  {
    id: "ev-002",
    filename: "Fuel_Receipts_Q1.pdf",
    uploadDate: "2024-04-02",
    type: "Invoice",
    relatedQuestionId: "E2",
    extractedData: { liters: 4500, type: "Diesel" },
    confidenceScore: 0.92
  },
  {
    id: "ev-003",
    filename: "HR_Report_Dec2023.xlsx",
    uploadDate: "2024-01-20",
    type: "Report",
    relatedQuestionId: "S1"
  }
];

export const MOCK_ACTIONS: ActionPlanItem[] = [
  { id: "a1", title: "Install LED Lighting in Warehouse", impact: "Medium", effort: "Easy", status: "In Progress" },
  { id: "a2", title: "Develop Supplier Code of Conduct", impact: "High", effort: "Medium", status: "Planned" },
  { id: "a3", title: "Switch to Hybrid Company Cars", impact: "High", effort: "Hard", status: "Planned" }
];
