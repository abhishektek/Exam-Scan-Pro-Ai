
import React from 'react';
import { ScanLine, Layers } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <ScanLine className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-tight text-slate-900 leading-none">
              ExamScan <span className="text-indigo-600">AI</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Professional Digitizer</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
             <Layers className="w-3.5 h-3.5 text-slate-500" />
             <span className="text-xs font-semibold text-slate-600">v2.0 Advanced AI</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
