
import React from 'react';
import { Copy, CheckCircle2, FileText, ClipboardList, CornerDownRight } from 'lucide-react';
import { ExtractedQuestion } from '../types';

interface QuestionListProps {
  questions: ExtractedQuestion[];
  rawText: string;
  onCopyAll: () => void;
  onCopyOne: (text: string) => void;
}

const QuestionList: React.FC<QuestionListProps> = ({ questions, rawText, onCopyAll, onCopyOne }) => {
  const formatQuestionForCopy = (q: ExtractedQuestion) => {
    let text = `${q.questionNumber}. ${q.text}`;
    if (q.points) text += ` [${q.points}]`;
    if (q.options?.length) {
      text += '\n' + q.options.map(o => `${o.label}: ${o.text}`).join('\n');
    }
    if (q.subQuestions?.length) {
      text += '\n' + q.subQuestions.map(s => `  ${s.label} ${s.text}`).join('\n');
    }
    if (q.correctAnswer) text += `\nAns: ${q.correctAnswer}`;
    return text;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Digitized Result</h2>
          <p className="text-slate-500 mt-1">Found {questions.length} main questions in the scanned document.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onCopyAll}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100 active:scale-95"
          >
            <Copy className="w-4 h-4" /> Copy All Data
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {questions.length > 0 ? (
          questions.map((q, idx) => (
            <div 
              key={q.id || idx} 
              className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 relative"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex-shrink-0 bg-indigo-50 text-indigo-700 rounded-xl flex items-center justify-center font-bold text-lg">
                  {q.questionNumber || (idx + 1)}
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Extracted Question</span>
                    {q.points && (
                      <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
                        {q.points}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-slate-800 text-lg font-medium leading-relaxed whitespace-pre-wrap mb-4">
                    {q.text}
                  </p>

                  {/* Multiple Choice Options */}
                  {q.options && q.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-indigo-200 transition-colors">
                          <span className="font-bold text-indigo-600 w-5">{opt.label}</span>
                          <span className="text-slate-700 text-sm">{opt.text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Sub-questions / Nested Items */}
                  {q.subQuestions && q.subQuestions.length > 0 && (
                    <div className="space-y-3 mb-6 pl-4 border-l-2 border-slate-100">
                      {q.subQuestions.map((sub, sIdx) => (
                        <div key={sub.id || sIdx} className="flex items-start gap-3 group/sub">
                          <CornerDownRight className="w-4 h-4 text-slate-300 mt-1 flex-shrink-0" />
                          <div className="flex-grow">
                            <span className="font-bold text-slate-600 mr-2">{sub.label}</span>
                            <span className="text-slate-700 text-sm whitespace-pre-wrap">{sub.text}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {q.correctAnswer && (
                    <div className="flex items-center gap-2 mt-4 text-emerald-600 font-semibold text-sm bg-emerald-50 w-fit px-3 py-1.5 rounded-lg border border-emerald-100">
                      <CheckCircle2 className="w-4 h-4" />
                      Answer: {q.correctAnswer}
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => onCopyOne(formatQuestionForCopy(q))}
                  className="opacity-0 group-hover:opacity-100 absolute top-4 right-4 p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                  title="Copy this question"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
              <ClipboardList className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No questions found</h3>
            <p className="text-slate-500 mt-2">Try re-scanning the image or use a clearer photo.</p>
          </div>
        )}
      </div>

      {/* Raw Text View */}
      <div className="mt-12">
        <div className="flex items-center gap-2 mb-4 text-slate-500 font-bold uppercase tracking-widest text-xs">
          <FileText className="w-4 h-4" /> Raw Context
        </div>
        <div className="bg-slate-900 rounded-2xl p-6 text-slate-300 text-sm font-mono overflow-x-auto whitespace-pre custom-scrollbar">
          {rawText || "No raw text context available."}
        </div>
      </div>
    </div>
  );
};

export default QuestionList;
