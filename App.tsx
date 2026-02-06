
import React, { useState, useEffect } from 'react';
import { ChevronLeft, RefreshCw, XCircle, AlertTriangle, Camera } from 'lucide-react';
import Header from './components/Header';
import UploadZone from './components/UploadZone';
import ProcessingScreen from './components/ProcessingScreen';
import QuestionList from './components/QuestionList';
import CameraView from './components/CameraView';
import { extractQuestionsFromImage } from './services/geminiService';
import { AppView, OCRResult } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.UPLOAD);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [results, setResults] = useState<OCRResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const processImage = async (base64: string) => {
    setImagePreview(base64);
    setView(AppView.PROCESSING);
    setError(null);

    try {
      const data = await extractQuestionsFromImage(base64);
      setResults(data);
      setView(AppView.RESULTS);
    } catch (err: any) {
      console.error("Extraction failed:", err);
      setError(err.message || 'Error processing image.');
      setView(AppView.UPLOAD);
    }
  };

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      processImage(reader.result as string);
    };
    reader.onerror = () => setError("Failed to read file.");
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
    }).catch(() => showToast('Copy failed'));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12 transition-all duration-300">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 pt-12">
        {error && (
          <div className="mb-8 p-5 bg-red-50 border border-red-200 rounded-3xl flex items-start gap-4 text-red-800 max-w-3xl mx-auto animate-in fade-in slide-in-from-top-4 duration-500">
            <AlertTriangle className="w-6 h-6 flex-shrink-0 text-red-500" />
            <div className="flex-grow">
              <h4 className="font-bold text-lg">Extraction Failed</h4>
              <p className="text-sm opacity-90">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="p-1.5 hover:bg-red-100 rounded-xl transition-colors">
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        )}

        {view === AppView.UPLOAD && (
          <div className="relative">
            <UploadZone onFileSelect={handleFileSelect} />
            <button 
              onClick={() => setIsCameraOpen(true)}
              className="mt-6 mx-auto flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:bg-indigo-600 transition-all hover:scale-105 active:scale-95"
            >
              <Camera className="w-6 h-6" /> Open Live Camera
            </button>
          </div>
        )}

        {view === AppView.PROCESSING && (
          <ProcessingScreen imagePreview={imagePreview} />
        )}

        {view === AppView.RESULTS && results && (
          <>
            <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between">
              <button 
                onClick={handleReset}
                className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm transition-all hover:-translate-x-1"
              >
                <ChevronLeft className="w-4 h-4" /> Start New Scan
              </button>
            </div>
            <QuestionList 
              questions={results.questions} 
              rawText={results.rawText} 
              onCopyAll={() => {
                const all = results.questions.map(q => `${q.questionNumber}. ${q.text}`).join('\n\n');
                copyToClipboard(all);
              }}
              onCopyOne={copyToClipboard}
            />
          </>
        )}
      </main>

      {isCameraOpen && (
        <CameraView 
          onCapture={(base64) => {
            setIsCameraOpen(false);
            processImage(base64);
          }} 
          onClose={() => setIsCameraOpen(false)} 
        />
      )}

      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 z-[110] animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
          <span className="font-bold text-sm tracking-wide">{toast}</span>
        </div>
      )}
    </div>
  );
};

export default App;
