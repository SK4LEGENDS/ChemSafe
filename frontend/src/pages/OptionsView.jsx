import React from 'react';
import { Settings, Sliders, Bell, Shield, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OptionsView = () => {
  const navigate = useNavigate();
  
  const settingsGroups = [
    { 
      title: "General", 
      icon: Settings, 
      items: [
        { label: "Theme (Scientific Light)", action: null },
        { label: "Language", action: null },
        { label: "Compact Mode", action: null }
      ] 
    },
    { 
      title: "Safety Rules", 
      icon: Shield, 
      items: [
        { label: "Local Database Path", action: null },
        { label: "Rule Persistence", action: null },
        { label: "Risk Thresholds", action: null }
      ] 
    },
    { 
      title: "System", 
      icon: Database, 
      items: [
        { label: "Clear Cache", action: null },
        { label: "Technical Documentation", action: () => navigate('/docs') },
        { label: "Export Logs", action: null },
        { label: "Audit History", action: null }
      ] 
    },
  ];

  return (
    <div className="flex-1 bg-white p-12 overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <header className="mb-12">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">System Options</h2>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Configure your laboratory environment</p>
        </header>

        <div className="space-y-8">
          {settingsGroups.map((group, idx) => (
            <section key={idx} className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                <group.icon className="w-4 h-4 text-indigo-400" />
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{group.title}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {group.items.map((item, i) => (
                  <div 
                    key={i} 
                    onClick={() => item.action && item.action()}
                    className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center justify-between group cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-xs font-bold text-slate-600">{item.label}</span>
                    <Sliders className="w-3 h-3 text-slate-200 group-hover:text-indigo-300 transition-colors" />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 p-6 bg-indigo-50/30 rounded-3xl border border-indigo-100/50">
          <p className="text-[10px] font-bold text-indigo-400 leading-relaxed text-center italic">
            Note: Laboratory settings are stored locally in the session. <br/>
            Contact the administrator for global system overrides.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OptionsView;
