import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MOCK_COMPANY, INITIAL_QUESTIONS, MOCK_EVIDENCE, MOCK_ACTIONS } from '../constants';
import { CompanyProfile, Question, Evidence, ActionPlanItem } from '../types';

interface AppContextType {
  company: CompanyProfile;
  updateCompany: (company: CompanyProfile) => void;
  questions: Question[];
  updateQuestion: (id: string, updates: Partial<Question>) => void;
  evidence: Evidence[];
  addEvidence: (item: Evidence) => void;
  deleteEvidence: (id: string) => void;
  actions: ActionPlanItem[];
  addAction: (item: ActionPlanItem) => void;
  updateAction: (id: string, updates: Partial<ActionPlanItem>) => void;
  deleteAction: (id: string) => void;
  setActions: (actions: ActionPlanItem[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [company, setCompany] = useState<CompanyProfile>(MOCK_COMPANY);
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [evidence, setEvidence] = useState<Evidence[]>(MOCK_EVIDENCE);
  const [actions, setActionsState] = useState<ActionPlanItem[]>(MOCK_ACTIONS);

  const updateCompany = (updated: CompanyProfile) => setCompany(updated);

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const addEvidence = (item: Evidence) => {
    setEvidence(prev => [item, ...prev]);
  };

  const deleteEvidence = (id: string) => {
    setEvidence(prev => prev.filter(e => e.id !== id));
    // Remove reference from questions
    setQuestions(prev => prev.map(q => ({
      ...q,
      evidenceIds: q.evidenceIds.filter(eid => eid !== id)
    })));
  };

  const addAction = (item: ActionPlanItem) => setActionsState(prev => [item, ...prev]);
  
  const updateAction = (id: string, updates: Partial<ActionPlanItem>) => {
    setActionsState(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const deleteAction = (id: string) => {
    setActionsState(prev => prev.filter(a => a.id !== id));
  };

  const setActions = (newActions: ActionPlanItem[]) => {
      setActionsState(newActions);
  }

  return (
    <AppContext.Provider value={{
      company, updateCompany,
      questions, updateQuestion,
      evidence, addEvidence, deleteEvidence,
      actions, addAction, updateAction, deleteAction, setActions
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};