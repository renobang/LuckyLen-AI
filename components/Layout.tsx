
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 md:p-8">
      <header className="w-full max-w-md mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-blue-600 tracking-tight">LuckyLens AI</h1>
        <p className="text-slate-500 mt-1 font-medium italic">Your fortune, focused.</p>
      </header>
      <main className="w-full max-w-md flex-1 flex flex-col">
        {children}
      </main>
      <footer className="w-full max-w-md mt-8 py-4 border-t border-slate-200 text-center text-xs text-slate-400">
        &copy; 2025 LuckyLens AI. All rights reserved. <br/>
        This service is for assistance only. Always confirm your results with official retailers.
      </footer>
    </div>
  );
};
