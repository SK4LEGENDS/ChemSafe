import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { MessageSquare, ShieldAlert, Beaker, Activity, Settings, Plus, Clock, Trash2, BookOpen } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sessions, setSessions] = useState([]);
  const currentSessionId = searchParams.get('s');

  const links = [
    { to: "/chat", icon: MessageSquare, label: "Safety Chat", color: "text-indigo-500" },
    { to: "/admin", icon: ShieldAlert, label: "Admin Panel", color: "text-rose-500" },
    { to: "/options", icon: Settings, label: "Options", color: "text-slate-500" },
    { to: "/docs", icon: BookOpen, label: "Technical Documentation", color: "text-amber-500" },
  ];

  const fetchSessions = async () => {
    try {
      const res = await fetch('http://localhost:8000/sessions');
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
      }
    } catch (err) {
      console.error("Failed to fetch sessions", err);
    }
  };

  useEffect(() => {
    fetchSessions();
    // Refresh history periodically if on the chat page
    const interval = setInterval(fetchSessions, 10000);
    return () => clearInterval(interval);
  }, []);

  const startNewChat = () => {
    const newId = Math.random().toString(36).substring(7);
    navigate(`/?s=${newId}`);
  };

  const deleteSession = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Delete this chat history?")) return;
    try {
      await fetch(`http://localhost:8000/sessions/${id}`, { method: 'DELETE' });
      fetchSessions();
      if (currentSessionId === id) navigate('/');
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="w-64 glass-sidebar h-screen flex flex-col z-20 border-r border-slate-200/50">
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md group-hover:scale-105 transition-transform">
            <Beaker className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-slate-800 tracking-tight text-base leading-none">ChemSafe</h1>
            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Assistant</span>
          </div>
        </div>
      </div>

      <nav className="px-3 py-6 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-xs
              ${isActive 
                ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' 
                : 'text-slate-400 hover:bg-white/40 hover:text-indigo-500'}
            `}
          >
            <link.icon className={`w-4 h-4 ${link.color}`} />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="flex-1 px-4 overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between mb-4 px-2">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Recent Chats</span>
          <button 
            onClick={startNewChat}
            className="p-1.5 hover:bg-indigo-50 text-indigo-400 rounded-lg transition-colors border border-transparent hover:border-indigo-100"
            title="New Chat"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-1 pb-10">
          {sessions.map((s) => (
            <NavLink
              key={s.id}
              to={`/?s=${s.id}`}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative
                ${isActive 
                  ? 'bg-indigo-50/50 text-indigo-600 font-bold border border-indigo-100' 
                  : 'text-slate-500 hover:bg-slate-50'}
              `}
            >
              <Clock className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] truncate leading-tight">{s.title || "Untitled Chat"}</p>
                <span className="text-[8px] text-slate-300 font-bold uppercase tracking-tighter">
                  {new Date(s.timestamp).toLocaleDateString()}
                </span>
              </div>
              <button 
                onClick={(e) => deleteSession(e, s.id)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-500 transition-all"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </NavLink>
          ))}
          {sessions.length === 0 && (
            <div className="text-[10px] text-slate-300 text-center py-8 italic font-medium">
              No history yet
            </div>
          )}
        </div>
      </div>

      <div className="p-5 mt-auto">
        <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">System</span>
            <Activity className="w-3 h-3 text-indigo-200" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-500 tracking-wide">Secure Connection</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
