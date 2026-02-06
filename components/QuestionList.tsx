
import React from 'react';
import { Copy, ArrowLeft, Download, FileText, CheckCircle2 } from 'lucide-react';
import { ExtractedQuestion } from '../types';

interface QuestionListProps {
  questions: ExtractedQuestion[];
  rawText: string;
  onReset: () => void;
  onCopyAll: () => void;
}

const QuestionList: React.FC<QuestionListProps> = ({ questions, rawText, onReset, onCopyAll }) => {
  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Upload
        </button>
        <div className="flex gap-3">
          <button 
            onClick={onCopyAll}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
          >
            <Copy className="w-4 h-4" /> Copy All
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {questions.map((q, idx) => (
          <div key={q.id || idx} className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 flex-shrink-0 bg-indigo-50 text-indigo-700 rounded-2xl flex items-center justify-center font-black text-xl">
                {q.questionNumber}
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">Question Item</span>
                  {q.points && <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded font-bold">{q.points} Marks</span>}
                </div>
                <h3 className="text-xl font-bold text-slate-800 leading-relaxed mb-6 whitespace-pre-wrap">{q.text}</h3>
                
                {q.options && q.options.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-transparent hover:border-indigo-200 hover:bg-white transition-all cursor-default">
                        <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-sm">
                          {opt.label}
                        </div>
                        <span className="text-slate-700 font-medium">{opt.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                {q.subQuestions && q.subQuestions.length > 0 && (
                  <div className="mt-6 space-y-4 pl-6 border-l-2 border-slate-100">
                    {q.subQuestions.map((sub, sIdx) => (
                      <div key={sIdx} className="flex gap-4">
                        <span className="font-bold text-slate-400">{sub.label}</span>
                        <p className="text-slate-600">{sub.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-slate-900 rounded-3xl p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <FileText className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <h4 className="text-xl font-bold mb-4 flex items-center gap-3">
            <FileText className="text-indigo-400 w-6 h-6" /> Raw AI Context
          </h4>
          <div className="max-h-60 overflow-y-auto custom-scrollbar text-slate-400 font-mono text-sm leading-relaxed whitespace-pre-wrap pr-4">
            {rawText}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionList;
