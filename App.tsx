
import React, { useState, useCallback } from 'react';
import { Layout } from './components/Layout';
import { CameraScanner } from './components/CameraScanner';
import { ResultView } from './components/ResultView';
import { AppState, LottoResult } from './types';
import { checkLottoTicket } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.HOME);
  const [result, setResult] = useState<LottoResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleStartScan = () => setState(AppState.SCANNING);
  
  const handleCapture = useCallback(async (base64: string) => {
    setState(AppState.PROCESSING);
    try {
      const data = await checkLottoTicket(base64);
      setResult(data);
      setState(AppState.RESULT);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("We couldn't read the ticket properly. Please ensure the numbers are clear and try again.");
      setState(AppState.ERROR);
    }
  }, []);

  const handleReset = () => {
    setResult(null);
    setErrorMsg('');
    setState(AppState.HOME);
  };

  const renderContent = () => {
    switch (state) {
      case AppState.HOME:
        return (
          <div className="flex-1 flex flex-col justify-center items-center text-center space-y-8 animate-in fade-in duration-700">
            <div className="w-64 h-64 bg-white rounded-full shadow-2xl flex items-center justify-center border-8 border-blue-50 relative group">
              <div className="bg-blue-600 w-48 h-48 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-[10px] font-black px-3 py-1 rounded-full shadow-sm transform rotate-12">
                POWERED BY AI
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-800 px-4">
                Stop manually checking.<br/>
                <span className="text-blue-600">Scan your luck instantly.</span>
              </h2>
              <p className="text-slate-500 max-w-[280px] mx-auto text-sm leading-relaxed">
                Snap a photo of your ticket and let our AI<br/>handle the rest in seconds.
              </p>
            </div>

            <button 
              onClick={handleStartScan}
              className="w-full max-w-[280px] py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
            >
              Start Scanning
            </button>
          </div>
        );

      case AppState.SCANNING:
        return (
          <CameraScanner 
            onCapture={handleCapture} 
            onCancel={() => setState(AppState.HOME)} 
          />
        );

      case AppState.PROCESSING:
        return (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="w-24 h-24 border-8 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="animate-pulse text-blue-600 font-black text-lg">AI</span>
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-slate-800 mb-2">Analyzing your ticket...</h2>
              <p className="text-slate-400 text-sm animate-pulse px-8">Identifying numbers and searching for the latest draw results...</p>
            </div>
          </div>
        );

      case AppState.RESULT:
        return result ? (
          <ResultView result={result} onReset={handleReset} />
        ) : (
          <div className="text-center py-10">No result found.</div>
        );

      case AppState.ERROR:
        return (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
             <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
             </div>
             <div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Scanning Error</h2>
                <p className="text-slate-500 text-sm px-8 leading-relaxed">{errorMsg}</p>
             </div>
             <button 
              onClick={handleReset}
              className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg hover:bg-slate-800 active:scale-95 transition-all"
            >
              Try Again
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout>
      {renderContent()}
    </Layout>
  );
};

export default App;
