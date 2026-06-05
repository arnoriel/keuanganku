'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { AppState, IncomePeriod } from '@/lib/types';
import * as storage from '@/lib/storage';

interface WalletContextType extends AppState {
  totalSaldo: number;
  todayIncome: number;
  monthIncome: number;
  monthExpense: number;
  addIncome: (amount: number, period: IncomePeriod) => void;
  addExpense: (amount: number, note: string) => void;
  transfer: (amount: number, from: 'pegangan' | 'tabungan', to: 'pegangan' | 'tabungan') => void;
}

const WalletContext = createContext<WalletContextType | null>(null);

function computeStats(state: AppState) {
  const today = new Date().toISOString().split('T')[0];
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split('T')[0];

  let todayIncome = 0;
  let monthIncome = 0;
  let monthExpense = 0;

  for (const tx of state.transactions) {
    if (tx.type === 'income') {
      if (tx.date === today) todayIncome += tx.amount;
      if (tx.date >= monthStart) monthIncome += tx.amount;
    }
    if (tx.type === 'expense') {
      if (tx.date >= monthStart) monthExpense += tx.amount;
    }
  }

  return { todayIncome, monthIncome, monthExpense };
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletState, setWalletState] = useState<AppState>({
    saldoPegangan: 0,
    saldoTabungan: 0,
    transactions: [],
  });

  useEffect(() => {
    setWalletState(storage.getState());
  }, []);

  const addIncome = useCallback((amount: number, period: IncomePeriod) => {
    setWalletState(storage.addIncome(amount, period));
  }, []);

  const addExpense = useCallback((amount: number, note: string) => {
    setWalletState(storage.addExpense(amount, note));
  }, []);

  const transfer = useCallback(
    (amount: number, from: 'pegangan' | 'tabungan', to: 'pegangan' | 'tabungan') => {
      setWalletState(storage.transferFunds(amount, from, to));
    },
    []
  );

  const stats = computeStats(walletState);

  return (
    <WalletContext.Provider
      value={{
        ...walletState,
        totalSaldo: walletState.saldoPegangan + walletState.saldoTabungan,
        ...stats,
        addIncome,
        addExpense,
        transfer,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet(): WalletContextType {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
}
