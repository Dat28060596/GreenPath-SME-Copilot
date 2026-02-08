import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, FileText, PieChart, CheckSquare, Settings, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onOpenSettings }) => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: ClipboardList, label: 'Assessment', path: '/assessment' },
    { icon: FileText, label: 'Evidence', path: '/evidence' },
    { icon: PieChart, label: 'Report', path: '/report' },
    { icon: CheckSquare, label: 'Actions', path: '/actions' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
            className="fixed inset-0 bg-slate-900/50 z-20 md:hidden backdrop-blur-sm transition-opacity"
            onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed top-0 left-0 z-30 h-screen w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-green-900/20">G</div>
            <span className="text-xl font-bold tracking-tight">GreenPath</span>
            </div>
            {/* Close button for mobile */}
            <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
                <X size={20} />
            </button>
        </div>
        
        <div className="px-6 py-2">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Menu</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
            <ul className="space-y-1 px-3">
            {navItems.map((item) => (
                <li key={item.path}>
                <NavLink
                    to={item.path}
                    onClick={() => { if (window.innerWidth < 768) onClose(); }}
                    className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                        isActive
                        ? 'bg-green-600 text-white font-medium shadow-md shadow-green-900/20'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`
                    }
                >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                </NavLink>
                </li>
            ))}
            </ul>
        </nav>

        <div className="p-4 border-t border-slate-700 bg-slate-900">
            <button 
            onClick={() => { onOpenSettings(); if (window.innerWidth < 768) onClose(); }}
            className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white w-full transition-colors hover:bg-slate-800 rounded-lg"
            >
            <Settings size={20} />
            <span>Settings</span>
            </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;