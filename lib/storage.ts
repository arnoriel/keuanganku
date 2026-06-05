import { AppState, Transaction, IncomePeriod, WalletType } from './types';

const KEY = 'rider_wallet_v1';

const defaultState: AppState = {
  saldoPegangan: 0,
  saldoTabungan: 0,
  transactions: [],
};

export function getState(): AppState {
  if (typeof window === 'undefined') return defaultState;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
}

export function setState(state: AppState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function addIncome(amount: number, period: IncomePeriod): AppState {
  const state = getState();
  const now = new Date();
  const tx: Transaction = {
    id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    type: 'income',
    amount,
    wallet: 'pegangan',
    period,
    date: now.toISOString().split('T')[0],
    createdAt: now.toISOString(),
  };
  const next: AppState = {
    ...state,
    saldoPegangan: state.saldoPegangan + amount,
    transactions: [tx, ...state.transactions],
  };
  setState(next);
  return next;
}

export function addExpense(amount: number, note: string): AppState {
  const state = getState();
  const now = new Date();
  const tx: Transaction = {
    id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    type: 'expense',
    amount,
    wallet: 'pegangan',
    note: note.trim() || 'Pengeluaran',
    date: now.toISOString().split('T')[0],
    createdAt: now.toISOString(),
  };
  const next: AppState = {
    ...state,
    saldoPegangan: Math.max(0, state.saldoPegangan - amount),
    transactions: [tx, ...state.transactions],
  };
  setState(next);
  return next;
}

export function transferFunds(
  amount: number,
  from: WalletType,
  to: WalletType
): AppState {
  const state = getState();
  const now = new Date();
  const toLabel = to === 'tabungan' ? 'Tabungan' : 'Pegangan';
  const fromLabel = from === 'pegangan' ? 'Pegangan' : 'Tabungan';

  const txOut: Transaction = {
    id: `tx_${Date.now()}_out`,
    type: 'transfer_out',
    amount,
    wallet: from,
    note: `Transfer ke Saldo ${toLabel}`,
    date: now.toISOString().split('T')[0],
    createdAt: now.toISOString(),
  };
  const txIn: Transaction = {
    id: `tx_${Date.now()}_in`,
    type: 'transfer_in',
    amount,
    wallet: to,
    note: `Transfer dari Saldo ${fromLabel}`,
    date: now.toISOString().split('T')[0],
    createdAt: new Date(now.getTime() + 1).toISOString(),
  };

  const next: AppState = {
    ...state,
    saldoPegangan:
      from === 'pegangan'
        ? state.saldoPegangan - amount
        : state.saldoPegangan + amount,
    saldoTabungan:
      from === 'tabungan'
        ? state.saldoTabungan - amount
        : state.saldoTabungan + amount,
    transactions: [txOut, txIn, ...state.transactions],
  };
  setState(next);
  return next;
}


