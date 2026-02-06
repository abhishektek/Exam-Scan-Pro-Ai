
import React, { useState } from 'react';
import { ChevronLeft, RefreshCw, XCircle, AlertTriangle } from 'lucide-react';
import Header from './components/Header';
import UploadZone from './components/UploadZone';
import ProcessingScreen from './components/ProcessingScreen';
import QuestionList from './components/QuestionList';
import { extractQuestionsFromImage } from './services/geminiService';
import { AppView, OCRResult } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.UPLOAD);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [results, setResults] = useState<OCRResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleFileSelect = (file: File) => {
    setError(null);
    const reader = new FileReader();
    
    reader.onerror = () => {
      setError("Failed to read the file. Please try another one.");
      setView(AppView.UPLOAD);
    };

    reader.onload = async () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      setView(AppView.PROCESSING);

      try {
        const data = await extractQuestionsFromImage(base64);
        setResults(data);
        setView(AppView.RESULTS);
      } catch (err: any) {
        console.error("Extraction process failed:", err);
        setError(err.message || 'The AI encountered an error while processing. Please ensure the image is clear.');
        setView(AppView.UPLOAD);
      }
    };
    
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setView(AppView.UPLOAD);
    setImagePreview(null);
    setResults(null);
    setError(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copied to clipboard!');
    }).catch(err => {
      console.error('Copy failed:', err);
      showToast('Failed to copy');
    });
  };

  const copyAll = () => {
    if (!results) return;
    const allText = results.questions.map(q => {
      let text = `${q.questionNumber || 'Q'}. ${q.text}`;
      if (q.points) text += ` [${q.points}]`;
      if (q.options?.length) {
        text += '\n' + q.options.map(o => `${o.label}: ${o.text}`).join('\n');
      }
      if (q.subQuestions?.length) {
        text += '\n' + q.subQuestions.map(s => `  ${s.label} ${s.text}`).join('\n');
      }
      if (q.correctAnswer) text += `\nAns: ${q.correctAnswer}`;
      return text;
    }).join('\n\n---\n\n');
    copyToClipboard(allText);
  };

  return (
    <div className="min-h-screen pb-12 transition-colors duration-500">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 pt-12">
        {error && (
          <div className="mb-8 p-5 bg-red-50 border border-red-200 rounded-3xl flex items-start gap-4 text-red-800 max-w-3xl mx-auto animate-in fade-in slide-in-from-top-4 duration-500">
            <AlertTriangle className="w-6 h-6 flex-shrink-0 text-red-500" />
            <div className="flex-grow">
              <h4 className="font-bold text-lg">Oops! Something went wrong</h4>
              <p className="text-sm opacity-90">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="p-1.5 hover:bg-red-100 rounded-xl transition-colors">
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        )}

        {view === AppView.UPLOAD && (
          <UploadZone onFileSelect={handleFileSelect} />
        )}

        {view === AppView.PROCESSING && (
          <ProcessingScreen imagePreview={imagePreview} />
        )}

        {view === AppView.RESULTS && results && (
          <>
            <div className="max-w-4xl mx-auto mb-6">
              <button 
                onClick={handleReset}
                className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm transition-all hover:-translate-x-1"
              >
                <ChevronLeft className="w-4 h-4" /> Back to Upload
              </button>
            </div>
            <QuestionList 
              questions={results.questions} 
              rawText={results.rawText} 
              onCopyAll={copyAll}
              onCopyOne={copyToClipboard}
            />
          </>
        )}
      </main>

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 z-[100] animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
          <span className="font-bold text-sm tracking-wide">{toast}</span>
        </div>
      )}

      {/* Persistent Footer Actions for Mobile */}
      {view === AppView.RESULTS && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 p-4 md:hidden z-50">
          <button 
            onClick={copyAll}
            className="w-full bg-indigo-600 active:scale-95 transition-transform text-white py-4 rounded-2xl font-bold shadow-xl shadow-indigo-100 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" /> Copy All Questions
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
