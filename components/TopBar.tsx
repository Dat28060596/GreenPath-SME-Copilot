import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, User, MessageSquareText, Check, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface TopBarProps {
  toggleCopilot: () => void;
  isCopilotOpen: boolean;
  onToggleSidebar: () => void;
  onOpenSettings: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ toggleCopilot, isCopilotOpen, onToggleSidebar, onOpenSettings }) => {
  const { company, questions } = useAppContext();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close notifications on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notificationRef]);

  const notifications = [
    { id: 1, text: "Electricity bill upload pending for March", type: "warning", time: "2h ago" },
    { id: 2, text: "Social metric 'Workforce' verified", type: "success", time: "1d ago" },
    { id: 3, text: "New governance policy template available", type: "info", time: "2d ago" }
  ];

  // Calculate real progress
  const completedQ = questions.filter(q => q.status === 'completed' || q.status === 'verified').length;
  const progressPercent = Math.round((completedQ / questions.length) * 100) || 0;

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 fixed top-0 right-0 left-0 md:left-64 z-20 shadow-sm">
      <div className="flex items-center gap-4">
        <button 
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" 
            onClick={onToggleSidebar}
        >
          <Menu size={24} />
        </button>
        <div className="flex flex-col">
          <h2 className="font-semibold text-slate-800 leading-tight">{company.name}</h2>
          <span className="text-xs text-slate-500 hidden sm:inline-block">Reporting Year: {company.reportingYear}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden lg:block text-right mr-2">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Overall Progress</div>
            <div className="w-32 h-2 bg-slate-100 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
            </div>
        </div>

        <button 
          onClick={toggleCopilot}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${isCopilotOpen ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
        >
          <MessageSquareText size={18} />
          <span className="text-sm font-medium hidden sm:inline">Copilot</span>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
            <button 
                className={`p-2 rounded-full transition-colors relative ${showNotifications ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                onClick={() => setShowNotifications(!showNotifications)}
            >
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            
            {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden z-50">
                    <div className="p-3 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                        <h3 className="font-semibold text-sm text-slate-800">Notifications</h3>
                        <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">Mark all read</button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        {notifications.map(n => (
                            <div key={n.id} className="p-3 border-b border-slate-50 hover:bg-slate-50 transition-colors flex gap-3">
                                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${n.type === 'warning' ? 'bg-amber-400' : n.type === 'success' ? 'bg-green-500' : 'bg-blue-400'}`}></div>
                                <div>
                                    <p className="text-sm text-slate-800 leading-snug">{n.text}</p>
                                    <span className="text-xs text-slate-400 mt-1 block">{n.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full py-2 text-xs text-slate-500 hover:bg-slate-50 transition-colors">View all history</button>
                </div>
            )}
        </div>

        <button 
          className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 border border-slate-200 cursor-pointer hover:bg-slate-200 transition-colors hover:border-slate-300"
          onClick={onOpenSettings}
          title="Profile & Settings"
        >
            <User size={16} />
        </button>
      </div>
    </header>
  );
};

export default TopBar;