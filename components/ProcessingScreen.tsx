
import React, { useState, useEffect } from 'react';
import { Brain, Cpu, Search, CheckCircle } from 'lucide-react';

interface ProcessingScreenProps {
  imagePreview: string | null;
}

const ProcessingScreen: React.FC<ProcessingScreenProps> = ({ imagePreview }) => {
  const [step, setStep] = useState(0);
  const steps = [
    { icon: <Search className="w-5 h-5" />, label: "Analyzing layout..." },
    { icon: <Cpu className="w-5 h-5" />, label: "Extracting math symbols..." },
    { icon: <Brain className="w-5 h-5" />, label: "Gemini AI thinking..." },
    { icon: <CheckCircle className="w-5 h-5" />, label: "Structuring results..." }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(prev => (prev < 3 ? prev + 1 : prev));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-3xl mx-auto flex flex-col items-center py-12">
      <div className="w-full aspect-[4/3] max-h-[500px] rounded-[40px] overflow-hidden bg-slate-200 shadow-2xl relative border-8 border-white">
        {imagePreview && (
          <img 
            src={imagePreview} 
            alt="Source Scan" 
            className="w-full h-full object-cover grayscale opacity-40 transition-all duration-1000"
          />
        )}
        <div className="scan-line"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
           <div className="spinner mb-6"></div>
           <p className="text-indigo-900 font-black text-2xl drop-shadow-sm uppercase tracking-widest">Scanning...</p>
        </div>
      </div>

      <div className="mt-12 w-full max-w-sm">
        <div className="space-y-4">
          {steps.map((s, idx) => (
            <div 
              key={idx} 
              className={`flex items-center gap-4 transition-all duration-500 ${idx <= step ? 'opacity-100 translate-x-0' : 'opacity-20 translate-x-4'}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${idx <= step ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-200 text-slate-400'}`}>
                {s.icon}
              </div>
              <span className={`font-bold ${idx <= step ? 'text-slate-900' : 'text-slate-400'}`}>{s.label}</span>
              {idx < step && <div className="ml-auto w-2 h-2 rounded-full bg-emerald-500"></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProcessingScreen;
