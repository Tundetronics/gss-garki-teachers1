 import React, { useState } from 'react';
import { 
  Briefcase, Volume2, X, Settings, Heart, Sparkles, ShieldAlert
} from 'lucide-react';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ""; 

const App = () => {
  const [topic, setTopic] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const callAI = async (prompt) => {
    if (!apiKey || apiKey.length < 5) {
      return "DIAGNOSTIC ERROR: API Key missing. Please add VITE_GEMINI_API_KEY to Vercel Environment Variables and REDEPLOY.";
    }
    setIsProcessing(true);
    const sys = "Expert pedagogical assistant for GSS Garki teachers. Draft a WAEC-compliant lesson plan. Plain text only. No markdown.";
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: sys }] }
        }) 
      });
      if (r.status === 403) return "DIAGNOSTIC ERROR: Invalid API Key permissions.";
      const d = await r.json();
      return d.candidates[0].content.parts[0].text;
    } catch (e) { return "ORCHESTRATION FAILED: Connection error."; } finally { setIsProcessing(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans">
      <nav className="p-6 border-b border-white/10 bg-slate-900/50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Briefcase className="text-blue-500" />
          <span className="font-black tracking-widest uppercase text-sm">Educator Pro</span>
        </div>
        <div className="text-[10px] font-bold text-yellow-500 tracking-[0.3em] uppercase">Teaching Support Suite</div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center p-6 space-y-12">
        <div className="text-center space-y-4 max-w-3xl">
          <h1 className="text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-none">
            Strategic <br/><span className="text-blue-500 italic">Instruction</span>
          </h1>
          <p className="text-xl text-slate-400 font-light">Draft professional lesson strategies in seconds.</p>
        </div>

        <div className="w-full max-w-xl bg-white/5 p-10 rounded-[40px] border border-white/10 shadow-2xl relative space-y-6">
            <input 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-black/40 p-6 rounded-2xl text-white text-center text-2xl outline-none border border-white/10 focus:border-blue-500 transition-all"
              placeholder="e.g. Photosynthesis"
            />
            <button 
              onClick={async () => {
                const res = await callAI(`Draft lesson: ${topic}`);
                setResult(res); setShowModal(true);
              }}
              className="w-full bg-slate-700 hover:bg-slate-600 py-6 rounded-2xl font-black text-xl uppercase tracking-widest transition-all"
            >
              Draft Strategy
            </button>
        </div>
      </main>

      <footer className="bg-blue-900 h-20 border-t-8 border-yellow-500 flex items-center justify-between px-10 mt-auto">
        <div className="flex items-center gap-4">
          <Settings className="text-yellow-500" size={24} />
          <p className="text-sm font-black text-white uppercase tracking-tight">Rotary Abuja HighRise</p>
        </div>
        <Heart className="text-yellow-500" size={20} />
      </footer>

      {showModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[100] flex items-center justify-center p-6">
          <div className="bg-slate-900 border-2 border-white/10 rounded-[40px] w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h2 className="text-2xl font-black text-white uppercase">Strategy Output</h2>
              <button onClick={() => setShowModal(false)} className="bg-white/10 p-3 rounded-xl text-white hover:bg-red-500 transition-colors"><X/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-12 text-xl text-slate-300 leading-relaxed whitespace-pre-wrap font-light">
              {result && result.startsWith("DIAGNOSTIC") ? (
                <div className="bg-red-900/20 border border-red-500/50 p-8 rounded-3xl flex items-center gap-6">
                    <ShieldAlert className="text-red-500" size={48}/>
                    <p className="text-red-200 font-bold">{result}</p>
                </div>
              ) : result}
            </div>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="fixed inset-0 bg-black/90 z-[200] flex flex-col items-center justify-center space-y-6">
          <div className="h-20 w-20 border-8 border-t-blue-500 border-white/5 rounded-full animate-spin"></div>
          <p className="text-xl font-black text-white uppercase animate-pulse">Drafting...</p>
        </div>
      )}
    </div>
  );
};

export default App;
