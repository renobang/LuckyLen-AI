
export interface LottoResult {
  drawNumber: string;
  winningNumbers: number[];
  bonusNumber: number;
  ticketRows: {
    label: string;
    numbers: number[];
    matchCount: number;
    hasBonus: boolean;
    rank: number;
    prize: string;
  }[];
  summary: string;
  sources: { title: string; uri: string }[];
}

export enum AppState {
  HOME = 'HOME',
  SCANNING = 'SCANNING',
  PROCESSING = 'PROCESSING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}
