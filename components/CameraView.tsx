
import React, { useRef, useEffect, useState } from 'react';
import { Camera, X, RefreshCw, Zap } from 'lucide-react';

interface CameraViewProps {
  onCapture: (base64: string) => void;
  onClose: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setIsReady(true);
            videoRef.current?.play();
          };
        }
      } catch (err) {
        setError("Camera access denied or not available.");
      }
    }
    setupCamera();
    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64 = canvas.toDataURL('image/png');
        onCapture(base64);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      <div className="flex justify-between items-center p-4 text-white z-10">
        <button onClick={onClose} className="p-2 bg-white/10 rounded-full backdrop-blur-md">
          <X className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
           <Zap className="w-4 h-4 text-amber-400" />
           <span className="text-sm font-bold uppercase tracking-wider">HD Scan Mode</span>
        </div>
        <div className="w-10"></div>
      </div>

      <div className="flex-grow relative overflow-hidden flex items-center justify-center">
        {error ? (
          <div className="text-white text-center p-8">
            <p className="mb-4">{error}</p>
            <button onClick={onClose} className="px-6 py-2 bg-indigo-600 rounded-xl font-bold">Go Back</button>
          </div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
            {/* Guide Overlay */}
            <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none">
              <div className="w-full h-full border-2 border-indigo-400/50 rounded-lg relative">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-500 rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-500 rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-500 rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-500 rounded-br-lg"></div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="p-8 bg-black/90 flex justify-center items-center gap-8">
        <canvas ref={canvasRef} className="hidden" />
        <button 
          onClick={capturePhoto}
          disabled={!isReady}
          className={`w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all
            ${isReady ? 'border-white bg-white/10 scale-100' : 'border-white/20 scale-90 opacity-50'}
          `}
        >
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <Camera className="w-8 h-8 text-black" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default CameraView;
