import React, { useState, useEffect } from 'react';
import { Plus, Sparkles, MoreHorizontal, Loader2, Trash2, X } from 'lucide-react';
import { ActionPlanItem } from '../types';
import { generateActionPlan } from '../services/geminiService';
import { useAppContext } from '../context/AppContext';

const ActionsPage: React.FC = () => {
  const { actions, addAction, deleteAction, setActions, company, questions } = useAppContext();
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  
  // Add Task Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskImpact, setNewTaskImpact] = useState<ActionPlanItem['impact']>('Medium');
  const [newTaskEffort, setNewTaskEffort] = useState<ActionPlanItem['effort']>('Medium');
  
  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    const newActions = await generateActionPlan(company, questions);
    // Combine new generated actions with existing ones
    // We iterate to add them to context
    const currentActions = [...actions, ...newActions];
    setActions(currentActions);
    setIsGenerating(false);
  };

  const handleOpenAddTask = () => {
      setNewTaskTitle('');
      setNewTaskImpact('Medium');
      setNewTaskEffort('Medium');
      setIsAddModalOpen(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newTaskTitle.trim()) return;
      
      const newItem: ActionPlanItem = {
          id: `manual-${Date.now()}`,
          title: newTaskTitle,
          impact: newTaskImpact,
          effort: newTaskEffort,
          status: 'Planned'
      };
      addAction(newItem);
      setIsAddModalOpen(false);
  };

  const handleDelete = (id: string) => {
      deleteAction(id);
      setActiveMenuId(null);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
      setDraggedItemId(id);
      e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, status: ActionPlanItem['status']) => {
      e.preventDefault();
      if (!draggedItemId) return;
      
      // Update global state via setActions (map through existing)
      const updatedActions = actions.map(a => a.id === draggedItemId ? { ...a, status } : a);
      setActions(updatedActions);
      setDraggedItemId(null);
  };

  const getImpactColor = (impact: string) => {
    switch(impact) {
      case 'High': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Medium': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getEffortColor = (effort: string) => {
    switch(effort) {
      case 'Easy': return 'bg-green-100 text-green-700 border-green-200';
      case 'Hard': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const columns: { id: ActionPlanItem['status'], title: string }[] = [
    { id: 'Planned', title: 'To Do' },
    { id: 'In Progress', title: 'In Progress' },
    { id: 'Done', title: 'Completed' },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Action Plan</h1>
          <p className="text-slate-500">Track initiatives to improve your ESG score.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleOpenAddTask}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium transition-colors shadow-sm"
          >
            <Plus size={18} /> Add Task
          </button>
          <button 
            onClick={handleGeneratePlan}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-sm transition-all disabled:opacity-70 active:transform active:scale-95"
          >
            {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            {isGenerating ? 'Analyzing...' : 'Generate with AI'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-[1000px] h-full">
          {columns.map((col) => {
            const colItems = actions.filter(a => a.status === col.id);
            return (
                <div 
                    key={col.id} 
                    className="flex-1 flex flex-col bg-slate-50 rounded-xl border border-slate-200 h-full transition-colors"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, col.id)}
                >
                <div className="p-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-slate-50 rounded-t-xl z-10">
                    <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-700">{col.title}</h3>
                    <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold">{colItems.length}</span>
                    </div>
                    <button onClick={handleOpenAddTask} className="text-slate-400 hover:text-slate-600 transition-colors"><Plus size={18} /></button>
                </div>

                <div className="p-3 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
                    {colItems.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-lg">
                        Drag items here
                    </div>
                    ) : (
                    colItems.map((item) => (
                        <div 
                            key={item.id} 
                            className={`bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group relative ${draggedItemId === item.id ? 'opacity-50 border-indigo-300 shadow-md transform scale-[1.02]' : ''}`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, item.id)}
                        >
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-slate-900 leading-snug pr-6">{item.title}</h4>
                            <button 
                                className="text-slate-300 hover:text-slate-500 p-1 rounded hover:bg-slate-50 absolute right-2 top-2"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveMenuId(activeMenuId === item.id ? null : item.id);
                                }}
                            >
                                <MoreHorizontal size={16} />
                            </button>
                            
                            {/* Context Menu (Simplified) */}
                            {activeMenuId === item.id && (
                                <div className="absolute right-2 top-8 w-32 bg-white rounded-lg shadow-xl border border-slate-100 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                                        className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                                    >
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-4">
                            <span className={`text-[10px] px-2 py-1 rounded border font-medium ${getImpactColor(item.impact)}`}>
                            {item.impact} Impact
                            </span>
                            <span className={`text-[10px] px-2 py-1 rounded border font-medium ${getEffortColor(item.effort)}`}>
                            {item.effort} Effort
                            </span>
                        </div>
                        </div>
                    ))
                    )}
                </div>
                </div>
            );
          })}
        </div>
      </div>

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-semibold text-slate-800">Add New Task</h3>
                    <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSaveTask} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Task Title</label>
                        <input 
                            type="text" 
                            autoFocus
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" 
                            placeholder="e.g., Conduct energy audit"
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Impact</label>
                            <select 
                                value={newTaskImpact}
                                onChange={(e) => setNewTaskImpact(e.target.value as ActionPlanItem['impact'])}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white transition-all"
                            >
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Effort</label>
                            <select 
                                value={newTaskEffort}
                                onChange={(e) => setNewTaskEffort(e.target.value as ActionPlanItem['effort'])}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white transition-all"
                            >
                                <option value="Hard">Hard</option>
                                <option value="Medium">Medium</option>
                                <option value="Easy">Easy</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 font-medium transition-colors shadow-sm">
                            Add Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default ActionsPage;