 import React, { useState } from 'react';
import { 
  Briefcase, Volume2, X, Settings, Heart, Sparkles, ShieldAlert
} from 'lucide-react';

const apiKey = ""; 

const App = () => {
  const [topic, setTopic] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const sanitizeForVoice = (text) => {
    if (!text) return "";
    return text.replace(/[*#_~`\[\]()<>]/g, '').replace(/\n\n/g, '. ').replace(/\n/g, '. '); 
  };

  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(sanitizeForVoice(text));
    window.speechSynthesis.speak(speech);
  };

  const callAI = async (prompt) => {
    setIsProcessing(true);
    const sys = "Expert pedagogical assistant for teachers. Draft a WAEC-compliant lesson plan. Plain text only. No markdown.";
    const delays = [1000, 2000, 4000, 8000, 16000];
    
    for (let i = 0; i <= delays.length; i++) {
      try {
        const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: { parts: [{ text: sys }] }
          }) 
        });
        if (!r.ok) throw new Error();
        const d = await r.json();
        return d.candidates[0].content.parts[0].text;
      } catch (e) {
        if (i === delays.length) return "Connection failed.";
        await new Promise(res => setTimeout(res, delays[i]));
      }
    }
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans">
      <nav className="p-6 border-b border-white/10 bg-slate-900/50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Briefcase className="text-blue-500" />
          <span className="font-black tracking-widest uppercase text-sm">Educator Pro</span>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center p-6 space-y-12">
        <div className="text-center space-y-4 max-w-3xl">
          <h1 className="text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-none">
            Strategic <br/><span className="text-blue-500 italic">Pedagogy</span>
          </h1>
          <p className="text-xl text-slate-400 font-light">Draft professional lesson strategies in seconds.</p>
        </div>

        <div className="w-full max-w-xl bg-white/5 p-10 rounded-[40px] border border-white/10 shadow-2xl space-y-6">
            <input 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-black/40 p-6 rounded-2xl text-white text-center text-2xl outline-none border border-white/10 focus:border-blue-500 transition-all"
              placeholder="e.g. Organic Chemistry"
            />
            <button 
              onClick={async () => { const res = await callAI(`Draft lesson: ${topic}`); setResult(res); setShowModal(true); }}
              className="w-full bg-slate-700 hover:bg-slate-600 py-6 rounded-2xl font-black text-xl uppercase tracking-widest transition-all"
            >
              Draft Strategy
            </button>
        </div>
      </main>

      <footer className="bg-blue-900 h-20 border-t-8 border-yellow-500 flex items-center justify-between px-10">
        <div className="flex items-center gap-4">
          <Settings className="text-yellow-500" size={24} />
          <p className="text-sm font-black text-white uppercase tracking-tight">Rotary Abuja HighRise</p>
        </div>
      </footer>

      {showModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[100] flex items-center justify-center p-6">
          <div className="bg-slate-900 border-2 border-white/10 rounded-[40px] w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h2 className="text-2xl font-black text-white uppercase">Lesson Plan Output</h2>
              <div className="flex gap-4">
                <button onClick={() => speak(result)} className="bg-blue-600 hover:bg-blue-500 p-3 rounded-xl text-white flex items-center gap-2 font-bold px-6">
                  <Volume2 size={20}/> Listen
                </button>
                <button onClick={() => setShowModal(false)} className="bg-white/10 p-3 rounded-xl text-white"><X/></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-12 text-xl text-slate-300 whitespace-pre-wrap">
              {result}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
