import React from 'react';
import { ArrowRight, Leaf, Users, ShieldCheck, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const Dashboard: React.FC = () => {
  const data = [
    { name: 'Completed', value: 65, color: '#10B981' }, // green-500
    { name: 'In Progress', value: 25, color: '#F59E0B' }, // amber-500
    { name: 'Not Started', value: 10, color: '#E2E8F0' }, // slate-200
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Overview of your 2024 VSME Sustainability Report.</p>
        </div>
        <Link to="/assessment" className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors shadow-sm">
          Continue Assessment <ArrowRight size={18} />
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Environmental Score</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">72/100</h3>
            <span className="text-xs text-green-600 flex items-center gap-1 mt-2">
              <TrendingUp size={12} /> +12% from last year
            </span>
          </div>
          <div className="p-3 bg-green-50 rounded-lg text-green-600">
            <Leaf size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Social Metrics</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">4 Pending</h3>
            <span className="text-xs text-amber-600 flex items-center gap-1 mt-2">
              <AlertCircle size={12} /> Needs attention
            </span>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <Users size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Governance</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">Compliant</h3>
            <span className="text-xs text-slate-400 mt-2">Policy review done</span>
          </div>
          <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
            <ShieldCheck size={24} />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-1">
          <h3 className="font-semibold text-slate-800 mb-6">Completion Status</h3>
          <div className="h-64 relative">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
             </ResponsiveContainer>
             <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <span className="text-3xl font-bold text-slate-800">65%</span>
                <span className="text-xs text-slate-500">Complete</span>
             </div>
          </div>
          <div className="mt-4 space-y-2">
            {data.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                        <span className="text-slate-600">{d.name}</span>
                    </div>
                    <span className="font-medium text-slate-900">{d.value}%</span>
                </div>
            ))}
          </div>
        </div>

        {/* Recent Actions & Tasks */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-slate-800">Priority Tasks</h3>
                <Link to="/actions" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">View Plan</Link>
            </div>
            <div className="space-y-4">
                {[
                    { title: "Upload Electricity Bills (Q3-Q4)", type: "Data Gap", urgent: true },
                    { title: "Review Employee Safety Incident Log", type: "Verification", urgent: false },
                    { title: "Draft Board Diversity Policy", type: "Governance", urgent: false },
                ].map((task, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-300 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={`w-2 h-2 rounded-full ${task.urgent ? 'bg-red-500' : 'bg-green-500'}`}></div>
                            <div>
                                <h4 className="text-sm font-medium text-slate-900">{task.title}</h4>
                                <span className="text-xs text-slate-500">{task.type}</span>
                            </div>
                        </div>
                        <button className="text-sm bg-white border border-slate-300 px-3 py-1 rounded text-slate-600 hover:text-slate-900">Start</button>
                    </div>
                ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-100">
                 <h3 className="font-semibold text-slate-800 mb-4">AI Insight</h3>
                 <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 flex gap-3">
                    <div className="bg-white p-2 rounded-full h-fit text-indigo-600 shadow-sm">
                        <Sparkles size={16} />
                    </div>
                    <div>
                        <p className="text-sm text-indigo-900 leading-relaxed">
                            Based on your uploaded fuel receipts, your <strong>Scope 1 emissions</strong> are trending 
                            15% higher than industry average for medium-sized manufacturers. Consider reviewing logistics efficiency.
                        </p>
                        <Link to="/report" className="text-xs font-semibold text-indigo-700 mt-2 block hover:underline">See detailed analysis</Link>
                    </div>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;