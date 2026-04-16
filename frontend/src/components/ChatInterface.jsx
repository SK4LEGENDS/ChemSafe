import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Send, Loader2, User, Bot, AlertTriangle, ShieldCheck, Zap, Sparkles, Square, Skull, AlertOctagon, Beaker, ShieldAlert, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const GHS_THEMES = {
  Safe: { icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", accent: "text-emerald-500" },
  Caution: { icon: Zap, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", accent: "text-amber-500" },
  Dangerous: { icon: AlertTriangle, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100", accent: "text-rose-500" },
  Lethal: { icon: Skull, color: "text-slate-900", bg: "bg-slate-50", border: "border-slate-900", accent: "text-slate-800" },
};

const ReportSection = ({ title, icon: Icon, children }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
      <Icon className="w-3 h-3" />
      {title}
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 px-1">
      {children}
    </div>
  </div>
);

const ReportItem = ({ label, value, fullWidth, monospaced }) => {
  if (!value) return null;
  return (
    <div className={cn("flex flex-col gap-1", fullWidth && "sm:col-span-2")}>
      <span className="text-[9px] font-black text-slate-300 uppercase tracking-wider">{label}</span>
      <span className={cn(
        "text-xs font-semibold text-slate-600 leading-snug",
        monospaced && "font-mono bg-slate-50 p-2 rounded border border-slate-100"
      )}>
        {value}
      </span>
    </div>
  );
};

const ChatInterface = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentSessionId = searchParams.get('s');

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', content: "Welcome to the Lab. Which chemical substances should I analyze for safety?", timestamp: new Date().toISOString() }
  ]);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Compiling Analysis Report...');
  const loadingTimerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Initialize or Sync Session ID
  useEffect(() => {
    if (!currentSessionId) {
      const newId = Math.random().toString(36).substring(7);
      setSearchParams({ s: newId }, { replace: true });
    } else {
      loadHistory(currentSessionId);
    }
  }, [currentSessionId]);

  const loadHistory = async (sid) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/sessions/${sid}`);
      if (res.ok) {
        const history = await res.json();
        if (history && history.length > 0) {
          setMessages(history);
        } else {
          // New session, restore welcome message
          setMessages([{ 
            role: 'bot', 
            content: "Welcome to the Lab. Which chemical substances should I analyze for safety?", 
            timestamp: new Date().toISOString() 
          }]);
        }
      } else {
        // Fallback for failed fetch or 404
        setMessages([{ role: 'bot', content: "Welcome to the Lab. Which chemical substances should I analyze for safety?", timestamp: new Date().toISOString() }]);
      }
    } catch (err) {
      console.error("Failed to load session", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
    }
  };

  const handleSend = async (e, retryMsg = null) => {
    if (e) e.preventDefault();
    const userMsg = retryMsg || input.trim();
    if (!userMsg || loading) return;

    abortControllerRef.current = new AbortController();
    if (!retryMsg) setInput('');
    
    // Check if this was an error retry
    const isRetry = !!retryMsg;
    
    // Only add to history if it's not a retry (to avoid duplicating messages)
    if (!isRetry) {
      const newMessages = [...messages, { role: 'user', content: userMsg, timestamp: new Date().toISOString() }];
      setMessages(newMessages);
    }
    
    setLoading(true);
    setLoadingText('Requesting Analysis...');
    
    // Dynamically update loading text to show progress
    const texts = [
      'Authenticating Secure Connection...',
      'Accessing Global Safety Clusters...',
      'Synthesizing Chemical Data...',
      'Node Congested: Attempting Fallback...',
      'Switching to High-Performance Node...',
      'Finalizing Report...'
    ];
    let step = 0;
    const interval = setInterval(() => {
      if (step < texts.length - 1) {
        step++;
        setLoadingText(texts[step]);
      }
    }, 4500);

    const chemicals = userMsg.split(/[+,]/).map(c => c.trim()).filter(c => c);

    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chemicals, session_id: currentSessionId }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) throw new Error('API Error');

      const data = await response.json();
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: data.explanation, 
        analysis: data,
        timestamp: new Date().toISOString() 
      }]);
    } catch (err) {
      if (err.name === 'AbortError') {
        setMessages(prev => [...prev, { 
          role: 'bot', 
          content: "Analysis stopped by user.", 
          timestamp: new Date().toISOString() 
        }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'bot', 
          content: "The analysis nodes are experiencing heavy traffic. Would you like to try again with an alternate protocol?", 
          isError: true,
          timestamp: new Date().toISOString() 
        }]);
      }
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full relative bg-slate-50/20 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-200/5 blur-[120px] rounded-full -mr-32 -mt-32 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-200/5 blur-[100px] rounded-full -ml-16 -mb-16 pointer-events-none" />

      {/* Modern Chat Header */}
      <header className="relative z-30 bg-white/70 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 py-4 shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-50 p-2 rounded-xl">
            <Beaker className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-800 tracking-tight">Safety Analysis Node</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Connection</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
           <div className="text-right mr-2 hidden sm:block">
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Session ID</span>
              <span className="block text-[10px] font-mono text-indigo-400">{currentSessionId?.substring(0, 12)}</span>
           </div>
           <div className="h-8 w-px bg-slate-100 mx-2" />
           <ShieldAlert className="w-4 h-4 text-slate-200" />
        </div>
      </header>

      {/* Scroller Area */}
      <div className="flex-1 overflow-y-auto w-full z-10 custom-scrollbar scroll-smooth">
        <div className="max-w-2xl mx-auto px-6 pt-16 pb-32 space-y-8">
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={cn(
                  "flex gap-4",
                  msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-all border",
                  msg.role === 'user' ? "bg-indigo-50 border-indigo-100" : "bg-white border-slate-100"
                )}>
                  {msg.role === 'user' 
                    ? <User className="w-5 h-5 text-indigo-400" /> 
                    : <Sparkles className="w-5 h-5 text-indigo-500" />
                  }
                </div>

                <div className={cn(
                  "max-w-[85%] space-y-2",
                  msg.role === 'user' ? "items-end text-right" : "items-start text-left"
                )}>
                    <div className="flex flex-col gap-3">
                      <div className={cn(
                        "px-4 py-3 rounded-2xl shadow-sm text-sm font-semibold border",
                        msg.role === 'user' 
                          ? "bg-indigo-600 text-white rounded-tr-none border-indigo-700" 
                          : "bg-white text-slate-700 border-slate-100 rounded-tl-none",
                        msg.isError && "bg-rose-50 text-rose-700 border-rose-200"
                      )}>
                        {msg.content}
                      </div>
                      
                      {msg.isError && (
                        <button
                          onClick={() => handleSend(null, messages[idx-1]?.content)}
                          className="flex items-center gap-2 self-start px-3 py-1.5 bg-white border border-rose-200 text-rose-600 rounded-lg text-[10px] font-black uppercase hover:bg-rose-50 transition-colors shadow-sm"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Retry Analysis
                        </button>
                      )}
                    </div>

                  {msg.analysis && (
                    <motion.div 
                      className={cn(
                        "mt-4 p-5 rounded-2xl border shadow-lg shadow-slate-200/20 space-y-5 bg-white overflow-hidden",
                        GHS_THEMES[msg.analysis.risk].border,
                        msg.analysis.risk === 'Lethal' && "bg-slate-50 border-slate-900 ring-1 ring-slate-900 shadow-xl"
                      )}
                    >
                      {/* Analysis Header */}
                      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 tracking-[0.3em] uppercase">
                             Security Protocol: {msg.analysis.risk}
                          </div>
                          <div className={cn(
                            "text-sm font-bold uppercase tracking-wider",
                            GHS_THEMES[msg.analysis.risk].color
                          )}>
                            {msg.analysis.risk === 'Lethal' ? 'Extremely Hazardous Mixture' : 'AI Safety Assessment'}
                          </div>
                        </div>
                        <div className={cn(
                          "p-2.5 rounded-xl border-2 shadow-sm transition-all animate-in zoom-in duration-300",
                          GHS_THEMES[msg.analysis.risk].bg,
                          GHS_THEMES[msg.analysis.risk].border,
                          msg.analysis.risk === 'Lethal' && "bg-slate-900 text-white border-slate-900"
                        )}>
                            {React.createElement(GHS_THEMES[msg.analysis.risk].icon, { 
                              className: cn(
                                "w-5 h-5", 
                                msg.analysis.risk === 'Lethal' ? "text-white fill-white" : GHS_THEMES[msg.analysis.risk].color
                              ) 
                            })}
                        </div>
                      </div>

                      {/* AI Summary */}
                      <div className="text-xs leading-relaxed text-slate-600 font-medium italic border-l-2 border-slate-100 pl-4 py-1">
                        "{msg.analysis.explanation}"
                      </div>

                      {/* Precise Precautions */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {msg.analysis.precautions.map((p, i) => (
                          <div key={i} className="flex gap-2.5 text-[10px] text-slate-700 bg-slate-50/80 p-2.5 rounded-lg border border-slate-100 font-bold uppercase tracking-tight">
                            <ShieldCheck className={cn("w-3.5 h-3.5 shrink-0 mt-0.5", GHS_THEMES[msg.analysis.risk].accent)} />
                            {p}
                          </div>
                        ))}
                      </div>

                      {/* Detailed Lab Report Sections */}
                      {msg.analysis.report && (
                        <div className="mt-6 space-y-6 pt-6 border-t border-slate-100">
                          {/* Physical & Chemical Properties */}
                          <ReportSection title="Chemical Identity & Physics" icon={Zap}>
                            <ReportItem label="IUPAC Name" value={msg.analysis.report.iupac_name || msg.analysis.report.common_name} />
                            <ReportItem label="Formula" value={msg.analysis.report.formula} />
                            <ReportItem label="Mol. Weight" value={msg.analysis.report.molecular_weight} />
                            <ReportItem label="Physical State" value={msg.analysis.report.physical_state || msg.analysis.report.states} />
                            <ReportItem label="Appearance" value={msg.analysis.report.appearance} />
                            <ReportItem label="Solubility" value={msg.analysis.report.solubility} />
                            <ReportItem label="pH Value" value={msg.analysis.report.ph} />
                          </ReportSection>

                          {/* Reaction Analysis */}
                          {msg.analysis.report.balanced_equation && (
                            <ReportSection title="Reaction Dynamics" icon={Sparkles}>
                              <ReportItem label="Equation" value={msg.analysis.report.balanced_equation} fullWidth monospaced />
                              <ReportItem label="Overview" value={msg.analysis.report.reaction_overview} fullWidth />
                              <ReportItem label="Type" value={msg.analysis.report.reaction_type} />
                              <ReportItem label="Energy" value={msg.analysis.report.energy_change} />
                              <ReportItem label="Conditions" value={msg.analysis.report.conditions} />
                              <ReportItem label="Speed" value={msg.analysis.report.speed} />
                              <ReportItem label="Feasibility" value={msg.analysis.report.feasibility} />
                            </ReportSection>
                          )}

                          {/* Safety & Hazards */}
                          <ReportSection title="Safety & Hazards" icon={AlertTriangle}>
                            <ReportItem label="Hazards" value={msg.analysis.report.hazards || msg.analysis.report.hazard_id} fullWidth />
                            <ReportItem label="Stability" value={msg.analysis.report.reactivity || msg.analysis.report.storage_compatibility} />
                            <ReportItem label="PPE Required" value={msg.analysis.report.ppe?.join?.(', ') || msg.analysis.report.symbols?.join?.(', ')} />
                            <ReportItem label="Storage" value={msg.analysis.report.storage} fullWidth />
                            <ReportItem label="Emergency" value={msg.analysis.report.emergency} fullWidth />
                          </ReportSection>

                          {/* Industrial & Environmental */}
                          <ReportSection title="Industrial & Environment" icon={ShieldCheck}>
                            <ReportItem label="Applications" value={msg.analysis.report.applications} fullWidth />
                            <ReportItem label="Ind. Relevance" value={msg.analysis.report.industrial_relevance} fullWidth />
                            <ReportItem label="Env. Impact" value={msg.analysis.report.environmental} fullWidth />
                          </ReportSection>
                        </div>
                      )}

                      {/* Pairwise Interaction Breakdown */}
                      {msg.analysis.interactions?.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Interaction Matrix</div>
                          {msg.analysis.interactions.map((intr, i) => (
                            <div key={i} className="flex flex-col gap-1 p-3 bg-slate-50/30 rounded-xl border border-slate-100">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-slate-700 uppercase tracking-tighter">
                                  {intr.pair.join(' + ')}
                                </span>
                                <span className={cn(
                                  "px-2 py-0.5 rounded text-[8px] font-black uppercase",
                                  intr.risk === 'Lethal' ? "bg-slate-900 text-white" : 
                                  intr.risk === 'Dangerous' ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                                )}>
                                  {intr.risk}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 font-medium italic">{intr.explanation}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}

            {loading && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex gap-4 items-start"
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white border border-slate-100 shadow-sm">
                  <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
                </div>
                <div className="bg-white border border-slate-100 px-5 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-4">
                  <div className="flex gap-1.5">
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.4, times: [0, 0.5, 1] }} className="w-1.5 h-1.5 rounded-full bg-indigo-200" />
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.4, times: [0, 0.5, 1], delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-indigo-300" />
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.4, times: [0, 0.5, 1], delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{loadingText}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Fixed Bottom Docked Bar */}
      <div className="fixed bottom-0 right-0 left-64 bg-white border-t border-slate-200 z-50">
        <div className="max-w-4xl mx-auto px-6 pt-3 pb-5">
          <div className="flex items-center justify-center gap-4 mb-3 text-[9px] uppercase tracking-[0.2em] font-black text-slate-300">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> Lab Safety Protocol</span>
            <span className="w-1 h-1 rounded-full bg-slate-200" />
            <span>Verify with Official MSDS Sheets</span>
          </div>

          <form 
            onSubmit={handleSend} 
            className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-indigo-100/50 focus-within:bg-white transition-all shadow-sm"
          >
            {loading ? (
              <button
                type="button"
                onClick={handleStop}
                className="group flex items-center justify-center w-9 h-9 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
              >
                <Square className="w-4 h-4 fill-current transition-transform duration-200" />
              </button>
            ) : (
              <div className="flex items-center justify-center w-9 h-9 text-slate-300 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
            )}
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Analyze chemicals..."
              className="flex-1 bg-transparent py-2.5 focus:outline-none text-sm font-bold text-slate-700 placeholder:text-slate-200 uppercase"
              disabled={loading}
            />

            <button
              type="submit"
              disabled={!input.trim() || loading}
              className={cn(
                "flex items-center justify-center w-11 h-11 rounded-lg transition-all active:scale-95 shadow-sm shrink-0",
                input.trim() && !loading 
                  ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100" 
                  : "bg-slate-100 text-slate-300 cursor-not-allowed"
              )}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
