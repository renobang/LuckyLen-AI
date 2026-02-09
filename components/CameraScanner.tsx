
import React, { useRef, useEffect, useState, useCallback } from 'react';

interface CameraScannerProps {
  onCapture: (base64Image: string) => void;
  onCancel: () => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function setupCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false
        });
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setStream(mediaStream);
      } catch (err) {
        setError("Unable to access camera. Please check your permissions.");
      }
    }
    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        const base64 = dataUrl.split(',')[1];
        onCapture(base64);
      }
    }
  }, [onCapture]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="relative flex-1 overflow-hidden">
        {error ? (
          <div className="flex items-center justify-center h-full text-white p-6 text-center">
            {error}
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            {/* Overlay Viewfinder */}
            <div className="scanner-overlay pointer-events-none" />
            <div className="absolute top-1/4 left-0 right-0 h-[200px] border-y-2 border-blue-500/50 flex items-center justify-center pointer-events-none">
              <div className="scan-line w-full h-[2px] bg-blue-400/80 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
              <p className="absolute bottom-[-40px] text-white font-bold bg-black/50 px-4 py-1 rounded-full text-sm">
                Align ticket numbers within the frame
              </p>
            </div>
          </>
        )}
      </div>
      
      <div className="h-40 bg-slate-900 flex items-center justify-around px-8">
        <button 
          onClick={onCancel}
          className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <button 
          onClick={handleCapture}
          className="w-20 h-20 rounded-full bg-white border-8 border-slate-700 active:scale-95 transition-transform"
        />

        <div className="w-16" /> {/* Spacer */}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
