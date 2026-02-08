import React from 'react';
import { ArrowRight, Leaf, Users, ShieldCheck, TrendingUp, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useAppContext } from '../context/AppContext';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { questions, actions } = useAppContext();

  // Calculate status counts
  const totalQ = questions.length;
  const completedQ = questions.filter(q => q.status === 'completed' || q.status === 'verified').length;
  const inProgressQ = questions.filter(q => q.status === 'in_progress').length;
  const notStartedQ = questions.filter(q => q.status === 'not_started').length;

  const completionPercentage = Math.round((completedQ / totalQ) * 100) || 0;

  const data = [
    { name: 'Completed', value: completionPercentage, color: '#10B981' }, 
    { name: 'In Progress', value: Math.round((inProgressQ / totalQ) * 100), color: '#F59E0B' },
    { name: 'Not Started', value: Math.round((notStartedQ / totalQ) * 100), color: '#E2E8F0' },
  ];

  // Specific Category Stats
  const envQuestions = questions.filter(q => q.category === 'Environment');
  const envFilled = envQuestions.filter(q => q.status !== 'not_started').length;
  const envScore = Math.round((envFilled / envQuestions.length) * 100) || 0;

  const socialPending = questions.filter(q => q.category === 'Social' && q.status !== 'verified' && q.status !== 'completed').length;
  
  const govQuestions = questions.filter(q => q.category === 'Governance');
  const govCompliant = govQuestions.every(q => q.status === 'completed' || q.status === 'verified');

  // Generate Dynamic Priority Tasks
  const getPriorityTasks = () => {
      const tasks = [];

      // 1. Missing Data (High Priority)
      const missingData = questions.filter(q => q.status === 'not_started');
      missingData.forEach(q => {
          tasks.push({
              id: q.id,
              title: `Complete ${q.category} Assessment: ${q.topic}`,
              type: 'Data Gap',
              urgent: true,
              path: '/assessment'
          });
      });

      // 2. High Impact Actions (High Priority)
      const strategicActions = actions.filter(a => a.status !== 'Done' && a.impact === 'High');
      strategicActions.forEach(a => {
          tasks.push({
              id: a.id,
              title: a.title,
              type: 'Strategic Action',
              urgent: true,
              path: '/actions'
          });
      });

      // 3. In Progress Questions (Medium Priority)
      const inProgressData = questions.filter(q => q.status === 'in_progress');
      inProgressData.forEach(q => {
          tasks.push({
              id: q.id,
              title: `Finalize data for ${q.topic}`,
              type: 'Verification',
              urgent: false,
              path: '/assessment'
          });
      });

      // 4. Other Actions (Medium Priority)
      const otherActions = actions.filter(a => a.status !== 'Done' && a.impact !== 'High');
      otherActions.forEach(a => {
          tasks.push({
              id: a.id,
              title: a.title,
              type: 'Action Plan',
              urgent: false,
              path: '/actions'
          });
      });

      // Return top 3 mix
      return tasks.slice(0, 3);
  };

  const priorityTasks = getPriorityTasks();

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
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between cursor-pointer hover:border-indigo-200 transition-colors" onClick={() => navigate('/assessment')}>
          <div>
            <p className="text-sm font-medium text-slate-500">Environmental Score</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{envScore}/100</h3>
            <span className="text-xs text-green-600 flex items-center gap-1 mt-2">
              <TrendingUp size={12} /> Data Filling
            </span>
          </div>
          <div className="p-3 bg-green-50 rounded-lg text-green-600">
            <Leaf size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between cursor-pointer hover:border-indigo-200 transition-colors" onClick={() => navigate('/assessment')}>
          <div>
            <p className="text-sm font-medium text-slate-500">Social Metrics</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{socialPending} Pending</h3>
            <span className={`text-xs flex items-center gap-1 mt-2 ${socialPending > 0 ? 'text-amber-600' : 'text-green-600'}`}>
              <AlertCircle size={12} /> {socialPending > 0 ? 'Needs attention' : 'All clear'}
            </span>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <Users size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between cursor-pointer hover:border-indigo-200 transition-colors" onClick={() => navigate('/assessment')}>
          <div>
            <p className="text-sm font-medium text-slate-500">Governance</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{govCompliant ? 'Compliant' : 'In Review'}</h3>
            <span className="text-xs text-slate-400 mt-2">Policy review status</span>
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
                <span className="text-3xl font-bold text-slate-800">{completionPercentage}%</span>
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
                {priorityTasks.length > 0 ? (
                    priorityTasks.map((task, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-300 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-2 h-2 rounded-full ${task.urgent ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                <div>
                                    <h4 className="text-sm font-medium text-slate-900">{task.title}</h4>
                                    <span className="text-xs text-slate-500">{task.type}</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => navigate(task.path)}
                                className="text-sm bg-white border border-slate-300 px-3 py-1 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                            >
                                Start
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                        <div className="flex justify-center mb-2 text-green-500"><CheckCircle2 size={24} /></div>
                        <p>All priority tasks completed!</p>
                    </div>
                )}
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-100">
                 <h3 className="font-semibold text-slate-800 mb-4">AI Insight</h3>
                 <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 flex gap-3 cursor-pointer hover:bg-indigo-100 transition-colors" onClick={() => navigate('/report')}>
                    <div className="bg-white p-2 rounded-full h-fit text-indigo-600 shadow-sm">
                        <Sparkles size={16} />
                    </div>
                    <div>
                        <p className="text-sm text-indigo-900 leading-relaxed">
                            Based on your uploaded fuel receipts, your <strong>Scope 1 emissions</strong> are trending 
                            15% higher than industry average for medium-sized manufacturers. Consider reviewing logistics efficiency.
                        </p>
                        <div className="text-xs font-semibold text-indigo-700 mt-2 block hover:underline">See detailed analysis</div>
                    </div>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;