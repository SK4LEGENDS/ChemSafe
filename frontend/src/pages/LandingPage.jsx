import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Beaker, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  ArrowRight, 
  Search, 
  Lock,
  Globe,
  Database
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Search,
      title: "Real-time GHS Analysis",
      description: "Instant safety protocol generation based on Globally Harmonized System standards."
    },
    {
      icon: Cpu,
      title: "Multi-Node Brain",
      description: "Redundant AI processing using Mistral, Llama, and Nemotron clusters for 99.9% reliability."
    },
    {
      icon: ShieldCheck,
      title: "Safety-First Routing",
      description: "Automatic semantic distinction between technical datasheets and educational queries."
    }
  ];

  const stats = [
    { label: "AI Models", value: "3 Active" },
    { label: "Latency", value: "< 2s API" },
    { label: "Protocols", value: "Locked" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/20 blur-[120px] rounded-full animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200/20 blur-[120px] rounded-full animate-blob [animation-delay:2s]" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-900 rounded-xl shadow-lg">
              <Beaker className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-xl tracking-tighter text-slate-900">ChemSafe</span>
          </div>

          <div className="flex items-center gap-8">
            <button 
              onClick={() => navigate('/docs')}
              className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest"
            >
              Documentation
            </button>
            <button 
              onClick={() => navigate('/chat')}
              className="px-5 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
            >
              Enter Laboratory
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm mb-6">
              <span className="boundary-pulse" />
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">System v2.5.0 Deployment Live</span>
            </div>

            <h1 className="text-6xl lg:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight mb-6">
              Intelligence for the <span className="text-gradient">Modern Laboratory.</span>
            </h1>
            
            <p className="text-lg text-slate-500 mb-8 max-w-lg leading-relaxed font-medium">
              A high-reliability AI reasoning engine designed to analyze chemical hazards, 
              synthesize safety protocols, and manage laboratory documentation with 
              unprecedented speed and precision.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button 
                onClick={() => navigate('/chat')}
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white font-black uppercase tracking-[0.15em] text-xs rounded-2xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 flex items-center justify-center gap-3 active:scale-95 group"
              >
                Launch Analysis Suite
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center">
                      <Lock className="w-3 h-3 text-indigo-300" />
                    </div>
                  </div>
                ))}
                <div className="pl-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trusted by Research Teams</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 glass-card rounded-[2.5rem] overflow-hidden shadow-2xl">
              <img 
                src="/hero-lab.png" 
                alt="Laboratory Hero" 
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/20 to-transparent pointer-events-none" />
              
              {/* Floating Stat Overlay */}
              <div className="absolute bottom-6 left-6 right-6">
                 <div className="glass-card p-4 rounded-2xl flex items-center justify-between">
                    {stats.map((stat, i) => (
                      <div key={i} className="text-center px-4 border-r last:border-0 border-slate-200/50">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className="text-sm font-black text-slate-900 tracking-tighter">{stat.value}</p>
                      </div>
                    ))}
                 </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl animate-pulse [animation-delay:1.5s]" />
          </motion.div>
        </div>
      </section>

      {/* Intelligence Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto border-t border-slate-200/60 pt-20">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group p-8 bg-white border border-slate-100 rounded-[2rem] hover:shadow-xl hover:shadow-indigo-500/5 transition-all"
              >
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors">
                  <feature.icon className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight mb-3">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Cluster Section */}
      <section className="py-20 px-6 bg-slate-900 rounded-[4rem] mx-4 mb-10 overflow-hidden relative">
        <div className="absolute inset-0 opacity-20">
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_1px_1px,#6366f1_1px,transparent_0)] bg-[size:40px_40px]" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4 block">Infrastructure Level</span>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-12 tracking-tight">Powered by Advanced AI Clusters</h2>
            
            <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
               <div className="flex items-center gap-3">
                  <Globe className="w-8 h-8 text-white" />
                  <span className="text-2xl font-black text-white tracking-widest uppercase">Mistral 7B</span>
               </div>
               <div className="flex items-center gap-3">
                  <Cpu className="w-8 h-8 text-white" />
                  <span className="text-2xl font-black text-white tracking-widest uppercase">Llama 3.1</span>
               </div>
               <div className="flex items-center gap-3">
                  <Database className="w-8 h-8 text-white" />
                  <span className="text-2xl font-black text-white tracking-widest uppercase">Nemotron</span>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-slate-900 rounded-lg">
              <Beaker className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 tracking-tight">ChemSafe Protocol</span>
          </div>
          
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Released for Professional Training & Simulation © 2026
          </p>

          <div className="flex items-center gap-6">
             <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">v2.5 Full Core</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
