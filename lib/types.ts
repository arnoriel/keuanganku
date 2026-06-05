export type TransactionType = 'income' | 'expense' | 'transfer_out' | 'transfer_in';
export type WalletType = 'pegangan' | 'tabungan';
export type IncomePeriod = 'harian' | 'bulanan';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  wallet: WalletType;
  note?: string;
  period?: IncomePeriod;
  date: string;       // YYYY-MM-DD
  createdAt: string;  // ISO datetime
}

export interface AppState {
  saldoPegangan: number;
  saldoTabungan: number;
  transactions: Transaction[];
}
