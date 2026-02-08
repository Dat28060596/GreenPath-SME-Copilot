import React, { useState, useEffect } from 'react';
import { X, Save, Building2, MapPin, Globe, Briefcase } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { CompanyProfile } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { company, updateCompany } = useAppContext();
  const [formData, setFormData] = useState<CompanyProfile>(company);

  // Sync state when opening
  useEffect(() => {
    if (isOpen) setFormData(company);
  }, [isOpen, company]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompany(formData);
    onClose();
  };

  const handleChange = (field: keyof CompanyProfile, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-semibold text-slate-800">Company Settings</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Company Name</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Industry</label>
                <div className="relative">
                <Briefcase className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input 
                    type="text" 
                    value={formData.industry}
                    onChange={(e) => handleChange('industry', e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" 
                />
                </div>
            </div>
            <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Size</label>
                <div className="relative">
                <Globe className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <select 
                    value={formData.size}
                    onChange={(e) => handleChange('size', e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white transition-all"
                >
                    <option value="Micro">Micro</option>
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                </select>
                </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input 
                type="text" 
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Reporting Year</label>
            <input 
                type="number" 
                value={formData.reportingYear}
                onChange={(e) => handleChange('reportingYear', parseInt(e.target.value) || 2024)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" 
            />
          </div>

           <div className="pt-4">
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 font-medium transition-colors shadow-sm active:transform active:scale-[0.98]">
              <Save size={18} /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsModal;