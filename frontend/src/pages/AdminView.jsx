import React, { useState, useEffect } from 'react';
import { History, Database, Trash2, Plus, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const RISK_THEMES = {
  Safe: "bg-emerald-50 text-emerald-600 border-emerald-100",
  Caution: "bg-amber-50 text-amber-600 border-amber-100",
  Dangerous: "bg-rose-50 text-rose-600 border-rose-100",
  Lethal: "bg-slate-900 text-white border-slate-950",
};

const AdminView = () => {
  const [activeTab, setActiveTab] = useState('logs');
  const [logs, setLogs] = useState([]);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/admin/${activeTab}`);
      const data = await res.json();
      activeTab === 'logs' ? setLogs(data) : setRules(data);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteRule = async (id) => {
    if (!window.confirm("Are you sure you want to delete this safety rule?")) return;
    try {
      await fetch(`http://localhost:8000/admin/rules/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="flex-1 h-full overflow-y-auto p-1 zero-pb z-10">
      <div className="max-w-5xl mx-auto p-8 lg:p-12">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Admin Console</h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-0.5">Registry Monitoring & Logic Controls</p>
          </div>
          
          <div className="flex bg-slate-100/40 p-1.5 rounded-2xl border border-slate-200/50 backdrop-blur-sm shadow-sm">
            <button 
              onClick={() => setActiveTab('logs')}
              className={`px-6 py-2 rounded-xl font-black transition-all text-[10px] uppercase tracking-widest ${activeTab === 'logs' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Audit Logs
            </button>
            <button 
              onClick={() => setActiveTab('rules')}
              className={`px-6 py-2 rounded-xl font-black transition-all text-[10px] uppercase tracking-widest ${activeTab === 'rules' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Safety Rules
            </button>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 boundary-pulse" />
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {activeTab === 'logs' ? (
              <div className="space-y-4">
                {logs.map((log) => (
                  <div 
                    key={log.id} 
                    className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all group border-l-4 border-l-indigo-400"
                  >
                    <div className="bg-indigo-50/50 p-2 rounded-lg shrink-0">
                      <Clock className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-0.5">
                           <span className="text-[9px] font-black text-indigo-300 uppercase tracking-widest">SESSION: {log.session_id.substring(0, 8)}</span>
                           <span className="text-[9px] text-slate-300 font-bold">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-700 truncate">"{log.user_message}"</p>
                      </div>
                      
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border shrink-0 ${RISK_THEMES[log.ai_response.risk] || RISK_THEMES.Caution}`}>
                        <span className="text-[9px] font-black uppercase tracking-widest">Protocol: {log.ai_response.risk}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rules.map((rule) => (
                  <div key={rule.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm group hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex flex-wrap gap-1.5 font-mono">
                         {rule.chemicals.map(c => (
                           <span key={c} className="px-1.5 py-0.5 bg-slate-50 rounded text-[9px] font-bold text-slate-400 uppercase border border-slate-100">{c}</span>
                         ))}
                      </div>
                      <button onClick={() => deleteRule(rule.id)} className="p-1 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded transition-all">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className={`p-1.5 rounded-lg shrink-0 ${rule.risk === 'Dangerous' ? 'bg-rose-50 text-rose-500' : 'bg-amber-50 text-amber-500'}`}>
                        <AlertCircle className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-bold text-slate-600 leading-snug">{rule.explanation}</p>
                    </div>
                   </div>
                ))}
                <button className="h-24 border-2 border-dashed border-slate-200 rounded-xl hover:border-indigo-300 transition-all group flex items-center justify-center gap-3 bg-slate-50/30">
                   <Plus className="w-4 h-4 text-slate-300 group-hover:text-indigo-400" />
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-400">New Logic Definition</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminView;
