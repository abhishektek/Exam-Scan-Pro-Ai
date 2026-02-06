
import React, { useState, useCallback } from 'react';
import { Camera, Image as ImageIcon, Sparkles, AlertCircle, X, Check } from 'lucide-react';
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
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleProcessImage = useCallback(async (base64: string) => {
    setImagePreview(base64);
    setView(AppView.PROCESSING);
    setError(null);
    setIsCameraOpen(false);

    try {
      const data = await extractQuestionsFromImage(base64);
      setResults(data);
      setView(AppView.RESULTS);
      showToast("Scan complete!");
    } catch (err: any) {
      console.error("Process Error:", err);
      setError(err.message || "An unexpected error occurred during scanning.");
      setView(AppView.UPLOAD);
    }
  }, []);

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => handleProcessImage(reader.result as string);
    reader.onerror = () => setError("Failed to read image file.");
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setView(AppView.UPLOAD);
    setImagePreview(null);
    setResults(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-[#f8fafc]">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {error && (
          <div className="max-w-3xl mx-auto mb-8 animate-in slide-in-from-top-4 duration-300">
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-4 text-red-700">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <div className="flex-grow">
                <p className="font-bold">Scan Error</p>
                <p className="text-sm opacity-90">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="p-1 hover:bg-red-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {view === AppView.UPLOAD && (
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold mb-4">
                <Sparkles className="w-4 h-4" /> Powered by Gemini 3.0
              </div>
              <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
                Turn Paper Exams into <span className="text-indigo-600">Digital Data</span>
              </h1>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                Snap a photo or upload an image. Our AI extracts every question, option, and mark with precision.
              </p>
            </div>

            <UploadZone onFileSelect={handleFileSelect} />

            <div className="mt-8 flex justify-center">
              <button 
                onClick={() => setIsCameraOpen(true)}
                className="group relative flex items-center gap-3 bg-slate-900 hover:bg-indigo-600 text-white px-10 py-5 rounded-3xl font-bold text-lg shadow-2xl transition-all hover:scale-[1.03] active:scale-95"
              >
                <div className="absolute -top-2 -right-2 bg-indigo-500 text-[10px] px-2 py-0.5 rounded-full border border-white">BETA</div>
                <Camera className="w-6 h-6 group-hover:animate-bounce" />
                Open Live Scanner
              </button>
            </div>
          </div>
        )}

        {view === AppView.PROCESSING && (
          <ProcessingScreen imagePreview={imagePreview} />
        )}

        {view === AppView.RESULTS && results && (
          <QuestionList 
            questions={results.questions} 
            rawText={results.rawText}
            onReset={reset}
            onCopyAll={() => {
              const text = results.questions.map(q => `${q.questionNumber}. ${q.text}`).join('\n\n');
              navigator.clipboard.writeText(text);
              showToast("All questions copied!");
            }}
          />
        )}
      </main>

      {isCameraOpen && (
        <CameraView 
          onCapture={handleProcessImage}
          onClose={() => setIsCameraOpen(false)}
        />
      )}

      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-bottom-5 duration-300">
          <div className={`px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold text-white ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
            <Check className="w-5 h-5" />
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
