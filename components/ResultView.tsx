
import React from 'react';
import { LottoResult } from '../types';

interface ResultViewProps {
  result: LottoResult;
  onReset: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ result, onReset }) => {
  const getRankText = (rank: number) => {
    switch(rank) {
      case 1: return '1st';
      case 2: return '2nd';
      case 3: return '3rd';
      case 4: return '4th';
      case 5: return '5th';
      default: return 'No Prize';
    }
  };

  const getRankColor = (rank: number) => {
    switch(rank) {
      case 1: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 2: return 'bg-orange-100 text-orange-700 border-orange-200';
      case 3: return 'bg-blue-100 text-blue-700 border-blue-200';
      case 4: return 'bg-green-100 text-green-700 border-green-200';
      case 5: return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-gray-50 text-gray-400 border-gray-100';
    }
  };

  const isWinner = result.ticketRows.some(row => row.rank > 0 && row.rank <= 5);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className={`p-6 rounded-3xl shadow-sm border text-center ${isWinner ? 'bg-blue-50 border-blue-100' : 'bg-white border-slate-100'}`}>
        <h2 className="text-sm font-bold text-slate-500 mb-1">Draw #{result.drawNumber} Analysis</h2>
        <div className="text-2xl font-extrabold text-slate-800 mb-4">
          {result.summary}
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs font-semibold text-slate-400">WINNING NUMBERS</p>
          <div className="flex flex-wrap justify-center gap-2">
            {result.winningNumbers.map((num, i) => (
              <span key={i} className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm">
                {num}
              </span>
            ))}
            <span className="w-6 h-10 flex items-center justify-center text-slate-400 text-lg">+</span>
            <span className="w-10 h-10 rounded-full border-2 border-slate-800 text-slate-800 flex items-center justify-center font-bold text-sm">
              {result.bonusNumber}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {result.ticketRows.map((row, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="font-bold text-slate-400 w-4">{row.label}</span>
              <div className="flex gap-1">
                {row.numbers.map((num, idx) => {
                  const isMatch = result.winningNumbers.includes(num);
                  const isBonusMatch = num === result.bonusNumber;
                  return (
                    <span 
                      key={idx} 
                      className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                        ${isMatch ? 'bg-blue-600 text-white shadow-sm' : isBonusMatch ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-slate-50 text-slate-400'}
                      `}
                    >
                      {num}
                    </span>
                  );
                })}
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getRankColor(row.rank)}`}>
              {getRankText(row.rank)}
            </div>
          </div>
        ))}
      </div>

      {result.sources.length > 0 && (
        <div className="px-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">SOURCES</p>
          <div className="space-y-1">
            {result.sources.map((src, i) => (
              <a 
                key={i} 
                href={src.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-xs text-blue-500 hover:underline truncate"
              >
                🔗 {src.title}
              </a>
            ))}
          </div>
        </div>
      )}

      <button 
        onClick={onReset}
        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 active:scale-95 transition-all shadow-lg"
      >
        Scan Another Ticket
      </button>
    </div>
  );
};
