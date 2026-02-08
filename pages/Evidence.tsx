import React, { useState } from 'react';
import { UploadCloud, FileText, Check, Loader2, Sparkles, X } from 'lucide-react';
import { Evidence as EvidenceType } from '../types';
import { extractDataFromDocument } from '../services/geminiService';
import { useAppContext } from '../context/AppContext';

const EvidencePage: React.FC = () => {
  const { evidence, addEvidence, deleteEvidence } = useAppContext();
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [extractionResult, setExtractionResult] = useState<{id: string, text: string} | null>(null);

  const handleAnalyze = async (item: EvidenceType) => {
    setAnalyzingId(item.id);
    setExtractionResult(null);
    
    // Simulate delay + API call
    const result = await extractDataFromDocument(item.filename, item.type);
    
    setAnalyzingId(null);
    setExtractionResult({ id: item.id, text: result.text });
  };

  const handleUpload = () => {
    // Simulate file upload
    const fileName = prompt("Enter mock file name (e.g., 'May_Electricity.pdf'):");
    if (!fileName) return;

    const newEvidence: EvidenceType = {
        id: `ev-new-${Date.now()}`,
        filename: fileName,
        uploadDate: new Date().toISOString().split('T')[0],
        type: 'Other',
        relatedQuestionId: undefined
    };

    addEvidence(newEvidence);
  };

  const handleApplyToReport = (item: EvidenceType) => {
      // Logic to actually map this to the report data structure would go here
      alert(`Data from ${item.filename} has been applied to the draft report.`);
      setExtractionResult(null);
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
       <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Evidence Library</h1>
          <p className="text-slate-500">Manage invoices, policies, and reports. Let AI extract the facts.</p>
        </div>
        <button 
            onClick={handleUpload}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm transition-colors"
        >
          <UploadCloud size={18} />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main List */}
          <div className="lg:col-span-2 space-y-4">
              {evidence.map((item) => (
                  <div key={item.id} className={`bg-white border rounded-xl p-4 transition-all hover:shadow-md flex flex-col gap-4 ${extractionResult?.id === item.id ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-200'}`}>
                      <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                                  <FileText size={20} />
                              </div>
                              <div>
                                  <h3 className="font-medium text-slate-900">{item.filename}</h3>
                                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                      <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{item.type}</span>
                                      <span>Uploaded: {item.uploadDate}</span>
                                  </div>
                              </div>
                          </div>
                          <button 
                            onClick={() => deleteEvidence(item.id)} 
                            className="text-slate-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors" 
                            title="Remove"
                          >
                              <X size={20} />
                          </button>
                      </div>

                      {/* AI Action Area */}
                      <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                         {item.extractedData ? (
                             <div className="text-xs text-green-600 flex items-center gap-1">
                                 <Check size={14} /> Data Extracted (Conf: {(item.confidenceScore! * 100).toFixed(0)}%)
                             </div>
                         ) : (
                             <div className="text-xs text-slate-400">No data extracted yet</div>
                         )}
                         
                         <button 
                            onClick={() => handleAnalyze(item)}
                            disabled={analyzingId === item.id}
                            className="text-xs font-medium text-indigo-600 flex items-center gap-1.5 hover:bg-indigo-50 px-2 py-1 rounded transition-colors disabled:opacity-50"
                         >
                            {analyzingId === item.id ? (
                                <>
                                    <Loader2 size={12} className="animate-spin" /> Processing...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={12} /> Extract Facts
                                </>
                            )}
                         </button>
                      </div>

                      {/* Result Display */}
                      {extractionResult?.id === item.id && (
                          <div className="bg-indigo-50 rounded-lg p-3 text-sm text-slate-700 animate-in fade-in slide-in-from-top-2 duration-300">
                              <p className="font-medium text-indigo-900 mb-1 text-xs uppercase tracking-wide">AI Findings</p>
                              {extractionResult.text}
                              <div className="mt-2 flex gap-2">
                                  <button onClick={() => handleApplyToReport(item)} className="text-xs bg-white border border-indigo-200 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-100 transition-colors">Apply to Report</button>
                                  <button onClick={() => setExtractionResult(null)} className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1">Dismiss</button>
                              </div>
                          </div>
                      )}
                  </div>
              ))}
              {evidence.length === 0 && (
                  <div className="text-center py-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl text-slate-500">
                      No documents uploaded yet.
                  </div>
              )}
          </div>

          {/* Info Side Panel */}
          <div className="hidden lg:block">
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 sticky top-24">
                  <h3 className="font-semibold text-slate-800 mb-2">How AI Extraction Works</h3>
                  <p className="text-sm text-slate-600 mb-4">
                      Our Copilot scans your documents for key ESG metrics like energy usage (kWh), fuel volume, or headcount.
                  </p>
                  <ul className="space-y-3 text-sm text-slate-600">
                      <li className="flex gap-2">
                          <div className="mt-0.5 text-green-500"><Check size={16} /></div>
                          <span>Automatic unit conversion (e.g. MJ to kWh)</span>
                      </li>
                      <li className="flex gap-2">
                          <div className="mt-0.5 text-green-500"><Check size={16} /></div>
                          <span>Links evidence to specific VSME questions</span>
                      </li>
                      <li className="flex gap-2">
                          <div className="mt-0.5 text-green-500"><Check size={16} /></div>
                          <span>Maintains an audit trail of source documents</span>
                      </li>
                  </ul>
              </div>
          </div>
      </div>
    </div>
  );
};

export default EvidencePage;