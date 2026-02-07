import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, FileText, PieChart, CheckSquare, Settings } from 'lucide-react';

const Sidebar: React.FC = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: ClipboardList, label: 'Assessment', path: '/assessment' },
    { icon: FileText, label: 'Evidence', path: '/evidence' },
    { icon: PieChart, label: 'Report', path: '/report' },
    { icon: CheckSquare, label: 'Actions', path: '/actions' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 z-30 hidden md:flex">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center font-bold text-white">G</div>
          <span className="text-xl font-bold tracking-tight">GreenPath</span>
        </div>
        <p className="text-xs text-slate-400 mt-1">SME ESG Copilot</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-green-600 text-white font-medium'
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

      <div className="p-4 border-t border-slate-700">
        <button className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white w-full">
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;