import React, { useState } from 'react';
import { ChevronRight, Info, Paperclip, CheckCircle2, Circle, Sparkles, Loader2, CheckSquare } from 'lucide-react';
import { Question, ESGCategory, ESGStatus } from '../types';
import { suggestAnswer } from '../services/geminiService';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

interface AssessmentProps {
  onSelectQuestion: (q: Question) => void;
  openCopilot: () => void;
}

const Assessment: React.FC<AssessmentProps> = ({ onSelectQuestion, openCopilot }) => {
  const navigate = useNavigate();
  const { questions, updateQuestion, company } = useAppContext();
  const [activeCategory, setActiveCategory] = useState<ESGCategory>('Environment');
  const [suggestionLoadingId, setSuggestionLoadingId] = useState<string | null>(null);

  const categories: ESGCategory[] = ['Environment', 'Social', 'Governance'];

  const handleValueChange = (id: string, value: string) => {
    // If user types, we generally reset to in_progress unless it was empty
    updateQuestion(id, { 
        value, 
        status: value ? 'in_progress' : 'not_started' 
    });
  };

  const handleStatusToggle = (id: string, currentStatus: ESGStatus, hasValue: boolean) => {
      if (!hasValue && currentStatus !== 'completed') return; // Prevent completing empty questions
      
      const newStatus = (currentStatus === 'completed' || currentStatus === 'verified') 
        ? 'in_progress' 
        : 'completed';
      
      updateQuestion(id, { status: newStatus });
  };

  const handleAutoSuggest = async (e: React.MouseEvent, question: Question) => {
    e.stopPropagation();
    setSuggestionLoadingId(question.id);
    
    const suggestion = await suggestAnswer(question, company);
    
    if (suggestion) {
        handleValueChange(question.id, suggestion);
    }
    setSuggestionLoadingId(null);
  };

  const handleAttach = (e: React.MouseEvent, questionId: string) => {
    e.stopPropagation();
    // In a real app, this would open a file picker.
    // For this demo, we'll simulate attaching a file.
    const mockFileId = `ev-new-${Date.now()}`;
    const question = questions.find(q => q.id === questionId);
    if(question) {
        updateQuestion(questionId, { evidenceIds: [...question.evidenceIds, mockFileId] });
        alert("Mock file attached successfully! It will appear in the Evidence library.");
    }
  };

  const handleNextSection = () => {
      const currentIndex = categories.indexOf(activeCategory);
      if (currentIndex < categories.length - 1) {
          setActiveCategory(categories[currentIndex + 1]);
      } else {
          navigate('/evidence');
      }
  };

  const filteredQuestions = questions.filter(q => q.category === activeCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500';
      case 'verified': return 'text-blue-500';
      case 'in_progress': return 'text-amber-500';
      default: return 'text-slate-300';
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">ESG Assessment</h1>
        <p className="text-slate-500">VSME Basic Module • Standardized for SMEs</p>
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl mb-6 w-fit">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              activeCategory === cat
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Questions List */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-20">
        {filteredQuestions.map((q) => (
          <div 
            key={q.id} 
            className={`bg-white border rounded-xl p-6 shadow-sm transition-all hover:border-indigo-200 group focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 ${q.status === 'completed' || q.status === 'verified' ? 'border-green-200 bg-green-50/10' : 'border-slate-200'}`}
            onClick={() => onSelectQuestion(q)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex gap-3">
                 <div className={`mt-1 ${getStatusColor(q.status)}`}>
                    {q.status === 'completed' || q.status === 'verified' ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                 </div>
                 <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{q.topic}</span>
                        {q.evidenceIds.length > 0 && (
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Paperclip size={10} /> {q.evidenceIds.length} Evidence
                            </span>
                        )}
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">{q.text}</h3>
                    <p className="text-sm text-slate-500 mt-1">{q.description}</p>
                 </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); onSelectQuestion(q); openCopilot(); }}
                className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium flex items-center gap-1 hover:underline"
              >
                <Info size={16} /> Ask Copilot
              </button>
            </div>

            <div className="pl-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-medium text-slate-700">
                            Your Response {q.unit && `(${q.unit})`}
                        </label>
                        <button 
                            onClick={(e) => handleAutoSuggest(e, q)}
                            disabled={suggestionLoadingId === q.id || q.status === 'completed'}
                            className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                            title="Auto-fill with AI based on industry benchmarks"
                        >
                            {suggestionLoadingId === q.id ? (
                                <Loader2 size={12} className="animate-spin" />
                            ) : (
                                <Sparkles size={12} />
                            )}
                            Auto-Fill
                        </button>
                    </div>
                    <div className="relative">
                        <input 
                            type={typeof q.value === 'number' ? 'number' : 'text'}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors disabled:bg-slate-100 disabled:text-slate-500"
                            placeholder={q.unit ? `e.g. 1200` : "Enter text..."}
                            value={q.value || ''}
                            onChange={(e) => handleValueChange(q.id, e.target.value)}
                            // disabled={q.status === 'completed' || q.status === 'verified'} // Optional: Disable input when complete
                        />
                    </div>
                    
                    {/* Mark as Complete Toggle */}
                    <div className="mt-3 flex items-center gap-2">
                        <button
                            onClick={() => handleStatusToggle(q.id, q.status, !!q.value)}
                            disabled={!q.value && q.status !== 'completed'}
                            className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border transition-all ${
                                q.status === 'completed' || q.status === 'verified'
                                    ? 'bg-green-100 border-green-200 text-green-700 hover:bg-green-200' 
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed'
                            }`}
                        >
                            {q.status === 'completed' || q.status === 'verified' ? (
                                <>
                                    <CheckSquare size={16} /> Completed
                                </>
                            ) : (
                                <>
                                    <div className="w-4 h-4 border-2 border-slate-300 rounded sm:w-4 sm:h-4"></div> Mark as Complete
                                </>
                            )}
                        </button>
                        {!q.value && q.status !== 'completed' && (
                            <span className="text-xs text-slate-400">Enter a value to complete</span>
                        )}
                    </div>

                </div>
                
                {/* Evidence Quick Attach */}
                <div className="flex-shrink-0 pt-6">
                    <button 
                        onClick={(e) => handleAttach(e, q.id)}
                        className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 text-sm transition-colors"
                    >
                        <Paperclip size={16} />
                        Attach
                    </button>
                </div>
              </div>
              
              {q.aiSuggestion && (
                  <div className="mt-3 flex items-start gap-2 bg-indigo-50 p-3 rounded-lg text-xs text-indigo-800">
                      <div className="mt-0.5"><Info size={14} /></div>
                      <div>
                          <span className="font-semibold">AI Suggestion:</span> {q.aiSuggestion}
                      </div>
                  </div>
              )}
            </div>
          </div>
        ))}

        <div className="flex justify-end pt-6">
             <button 
                onClick={handleNextSection}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium transition-colors"
             >
                {activeCategory === 'Governance' ? 'Go to Evidence' : 'Next Section'} <ChevronRight size={18} />
             </button>
        </div>
      </div>
    </div>
  );
};

export default Assessment;