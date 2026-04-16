import React from 'react';
import { BookOpen, Shield, Beaker, Zap, AlertTriangle, ArrowLeft, Skull, ShieldAlert, Cpu, Network, Layers, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const SectionHeader = ({ icon: Icon, title, number }) => (
  <div className="flex items-center gap-4 border-b border-slate-100 pb-4 mb-8">
    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 shadow-sm shrink-0">
      <Icon className="w-5 h-5 text-indigo-500" />
    </div>
    <div className="flex flex-col">
      <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] leading-none mb-1">Section {number}</span>
      <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight leading-none">{title}</h2>
    </div>
  </div>
);

const InfoCard = ({ title, desc, icon: Icon, colorClass }) => (
  <div className="p-6 bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all space-y-3 group">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${colorClass}`}>
      <Icon className="w-5 h-5" />
    </div>
    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">{title}</h3>
    <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

const Documentation = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 bg-white overflow-y-auto antialiased selection:bg-indigo-100 selection:text-indigo-900 custom-scrollbar">
      <div className="max-w-5xl mx-auto px-8 py-20 lg:px-16">
        {/* Navigation */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-black text-[10px] uppercase tracking-widest mb-16 transition-all group"
        >
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-slate-400 group-hover:text-indigo-600" />
          </div>
          Back to Terminal
        </button>

        {/* Header */}
        <header className="mb-24 relative">
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-indigo-50/50 blur-[80px] rounded-full pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center gap-8 relative z-10">
             <div className="p-5 bg-indigo-600 rounded-[32px] shadow-xl shadow-indigo-100 ring-8 ring-indigo-50">
                <BookOpen className="w-10 h-10 text-white" />
             </div>
             <div>
               <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">Technical Documentation</h1>
               <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 text-white rounded-full">
                    <Shield className="w-3 h-3" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Safety Protocols Active</span>
                 </div>
                 <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">v2.5.0-CHEM-CORE</span>
               </div>
             </div>
          </div>
        </header>

        <div className="space-y-24">
          {/* Section I: Analysis Intelligence */}
          <section>
            <SectionHeader icon={Layers} title="Analysis Intelligence Pipeline" number="01" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InfoCard 
                icon={Database} 
                title="Rule-Based Pre-check" 
                desc="Every input is first cross-referenced against a localized SQL registry of known lethal reactions and controlled substances. This ensures instant, deterministic blocking of high-risk interactions."
                colorClass="bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
              />
              <InfoCard 
                icon={Network} 
                title="Semantic Routing" 
                desc="Smart analysis logic distinguishes between direct substance interactions and general chemical inquiries (classes, mechanisms, etc.), tailoring the AI reasoning engine to the user's intent."
                colorClass="bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white"
              />
              <InfoCard 
                icon={Cpu} 
                title="LLM Synthesis" 
                desc="Chemical profiles are synthesized by high-fidelity large language models, providing professional-grade insights into thermodynamic feasibility, energy changes, and emergency protocols."
                colorClass="bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white"
              />
            </div>
          </section>

          {/* Section II: Processing Clusters */}
          <section>
            <SectionHeader icon={Cpu} title="Infrastructure & Nodes" number="02" />
            <div className="bg-slate-50 border border-slate-100 rounded-[40px] p-8 md:p-12 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100/30 blur-[100px] rounded-full -mr-32 -mt-32" />
              <div className="relative z-10 space-y-10">
                <p className="text-sm font-semibold text-slate-600 leading-relaxed max-w-2xl">
                  The ChemSafe system operates across specialized processing clusters to ensure maximum reliability and technical depth.
                </p>
                <div className="grid grid-cols-1 gap-6">
                  {[
                    { id: 'ALPHA', name: 'Llama-3.1-8B (Direct)', role: 'Primary Reasoning Engine', status: 'Optimal' },
                    { id: 'BETA', name: 'Mistral-7B (Instruct)', role: 'High-Availability Fallback', status: 'Active' },
                    { id: 'GAMMA', name: 'Nemotron-120B (NVIDIA)', role: 'Advanced Interaction Synthesis', status: 'Standby' }
                  ].map((node, i) => (
                    <div key={i} className="flex items-center gap-6 p-5 bg-white rounded-3xl border border-slate-100 shadow-sm">
                      <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100">
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter">{node.id}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide truncate">{node.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{node.role}</p>
                      </div>
                      <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full shrink-0">
                        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[8px] font-black uppercase tracking-[0.2em]">{node.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section III: Risk Classifications */}
          <section>
            <SectionHeader icon={Shield} title="Risk Classifications" number="03" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Safe", color: "text-emerald-500", bg: "bg-emerald-50/50", border: "border-emerald-100", desc: "No known immediate bio-chemical hazards. Standard lab attire recommended for general handling." },
                { label: "Caution", color: "text-amber-500", bg: "bg-amber-50/50", border: "border-amber-100", desc: "Potential irritants or reactive tendencies. Use fume hood and secondary containment during all procedures." },
                { label: "Dangerous", color: "text-rose-500", bg: "bg-rose-50/50", border: "border-rose-100", desc: "Severe risk of toxicity, flammability, or explosion. Mandatory industrial-grade PPE required (Level C/B)." },
                { label: "Lethal", color: "text-slate-900", bg: "bg-slate-900 text-white", border: "border-slate-900", desc: "Extreme biological or chemical weapon precursors. High-risk evacuation zones may apply. Immediate lethality upon exposure." }
              ].map((item, i) => (
                <div key={i} className={`p-8 rounded-[40px] border transition-all hover:scale-[1.02] ${item.bg} ${item.border}`}>
                   <div className="flex items-center gap-3 mb-4">
                     {item.label === 'Lethal' ? <Skull className="w-4 h-4" /> : <div className={`w-2.5 h-2.5 rounded-full bg-current ${item.color}`} />}
                     <span className={`text-xs font-black uppercase tracking-[0.3em] ${item.label === 'Lethal' ? 'text-white' : item.color}`}>
                       {item.label}
                     </span>
                   </div>
                   <p className={`text-[11px] font-semibold leading-relaxed ${item.label === 'Lethal' ? 'text-slate-400' : 'text-slate-500'}`}>
                     {item.desc}
                   </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section IV: Operational Logic */}
          <section>
            <SectionHeader icon={Zap} title="Operational Logic" number="04" />
            <div className="space-y-8 px-8">
              <div className="flex gap-6 items-start">
                <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-black text-indigo-600">01</span>
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-2">Fail-Fast Protocol</h4>
                  <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">System implements an 8-second initial timeout on primary nodes, facilitating rapid failover to secondary clusters to minimize downtime and ensure continuous analysis capability.</p>
                </div>
              </div>
              <div className="flex gap-6 items-start transition-all">
                <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-black text-indigo-600">02</span>
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-2">Context-Aware Synthesis</h4>
                  <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">Dynamic sliding window context limits (last 3 messages) prevent topic rigidity, ensuring the AI prioritizes the latest user query over historical substance profiles.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Liability Footer */}
          <section className="pt-20 border-t border-slate-100">
             <div className="bg-rose-50/50 p-10 md:p-12 rounded-[48px] border border-rose-100 flex flex-col md:flex-row gap-10 items-start overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-100/20 blur-[60px] rounded-full -mr-16 -mt-16" />
                <div className="p-5 bg-white rounded-[24px] shadow-sm border border-rose-100 shrink-0 relative z-10">
                   <ShieldAlert className="w-8 h-8 text-rose-500" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-sm font-black text-rose-600 uppercase tracking-[0.2em] mb-4">Mandatory Legal Disclaimer</h3>
                  <p className="text-xs font-bold text-rose-500/80 leading-relaxed italic max-w-2xl">
                    The ChemSafe Analysis System is designed for theoretical laboratory research and training simulations. AI-generated technical datasheets are synthesized by community clusters and must never replace official Material Safety Data Sheets (MSDS). Laboratory personnel remain solely responsible for validating all chemical interactions before physical implementation. Antigravity AI assumes no liability for chemical incidents, equipment failure, or biological exposure.
                  </p>
                </div>
             </div>
          </section>
        </div>

        {/* Branding Footer */}
        <footer className="mt-32 pt-12 border-t border-slate-50 flex flex-col items-center gap-6">
           <div className="flex items-center gap-2 group cursor-default">
              <Beaker className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-colors" />
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Antigravity Laboratory Solutions</span>
           </div>
        </footer>
      </div>
    </div>
  );
};

export default Documentation;
