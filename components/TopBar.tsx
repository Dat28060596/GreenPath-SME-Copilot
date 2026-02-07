import React from 'react';
import { Menu, Bell, User, MessageSquareText } from 'lucide-react';
import { MOCK_COMPANY } from '../constants';

interface TopBarProps {
  toggleCopilot: () => void;
  isCopilotOpen: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ toggleCopilot, isCopilotOpen }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 fixed top-0 right-0 left-0 md:left-64 z-20">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 text-slate-600">
          <Menu size={24} />
        </button>
        <div className="flex flex-col">
          <h2 className="font-semibold text-slate-800">{MOCK_COMPANY.name}</h2>
          <span className="text-xs text-slate-500">Reporting Year: {MOCK_COMPANY.reportingYear}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:block text-right mr-2">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Overall Progress</div>
            <div className="w-32 h-2 bg-slate-100 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-green-500 w-[62%] rounded-full"></div>
            </div>
        </div>

        <button 
          onClick={toggleCopilot}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${isCopilotOpen ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
        >
          <MessageSquareText size={18} />
          <span className="text-sm font-medium">Copilot</span>
        </button>

        <button className="p-2 text-slate-400 hover:text-slate-600">
          <Bell size={20} />
        </button>
        <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 border border-slate-300">
            <User size={16} />
        </div>
      </div>
    </header>
  );
};

export default TopBar;