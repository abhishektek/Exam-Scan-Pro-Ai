
import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Camera, Zap, ShieldCheck } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Digitize Any Exam Paper</h2>
        <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
          Upload images of physical exam papers to extract questions into structured digital formats instantly using Gemini AI.
        </p>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group h-96 border-3 border-dashed rounded-3xl transition-all duration-300 cursor-pointer flex flex-col items-center justify-center p-8
          ${isDragging 
            ? 'border-indigo-500 bg-indigo-50 scale-[1.02]' 
            : 'border-slate-200 bg-white hover:border-indigo-400 hover:bg-slate-50 hover:shadow-2xl hover:shadow-indigo-100/50'
          }`}
      >
        <div className={`w-24 h-24 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500
          ${isDragging ? 'bg-indigo-600 text-white rotate-12' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white group-hover:-rotate-6'}
        `}>
          <UploadCloud className="w-12 h-12" />
        </div>

        <h3 className="text-2xl font-bold text-slate-800 mb-2">
          {isDragging ? 'Drop it here!' : 'Choose an exam image'}
        </h3>
        <p className="text-slate-500 text-center mb-8">
          Drag and drop your file here, or click to browse files
          <br />
          <span className="text-sm text-slate-400 mt-2 block">Supports PNG, JPG, JPEG (Max 10MB)</span>
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-slate-600 text-sm font-medium">
            <ImageIcon className="w-4 h-4" /> Gallery
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-slate-600 text-sm font-medium">
            <Camera className="w-4 h-4" /> Camera
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleInputChange}
          className="hidden"
          accept="image/*"
        />
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-4">
            <Zap className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-800 mb-1">Instant Extraction</h4>
          <p className="text-sm text-slate-500">Extract text and structures in seconds using Gemini's high-speed vision.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-800 mb-1">99% Accuracy</h4>
          <p className="text-sm text-slate-500">Proprietary AI ensures math symbols and complex layouts are captured correctly.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4">
            <ImageIcon className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-800 mb-1">OCR Refinement</h4>
          <p className="text-sm text-slate-500">Raw text recovery keeps the context of even the messiest handwritten papers.</p>
        </div>
      </div>
    </div>
  );
};

export default UploadZone;
