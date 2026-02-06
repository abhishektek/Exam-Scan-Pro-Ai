
import React from 'react';
import { Loader2, BrainCircuit } from 'lucide-react';

interface ProcessingScreenProps {
  imagePreview: string | null;
}

const ProcessingScreen: React.FC<ProcessingScreenProps> = ({ imagePreview }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 max-w-3xl mx-auto">
      <div className="relative w-full aspect-[3/4] max-h-[600px] rounded-2xl overflow-hidden bg-slate-200 shadow-2xl mb-8">
        {imagePreview && (
          <img 
            src={imagePreview} 
            alt="Scanning" 
            className="w-full h-full object-contain brightness-75 grayscale-[30%]"
          />
        )}
        <div className="scan-animation"></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-indigo-900/40 backdrop-blur-[2px]">
          <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center max-w-xs transform scale-110">
            <div className="relative mb-6">
              <Loader2 className="w-16 h-16 text-indigo-600 animate-spin" />
              <BrainCircuit className="w-8 h-8 text-indigo-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Analyzing Paper...</h3>
            <p className="text-sm text-slate-500">Gemini AI is identifying questions, options, and formatting structures.</p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <div className="flex items-center gap-3 text-indigo-600 font-medium animate-pulse">
           <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
           <span>Reading multimodal visual tokens...</span>
        </div>
        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
           <div className="h-full bg-indigo-600 w-1/2 rounded-full animate-[shimmer_2s_infinite]"></div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingScreen;
