'use client';

import '@/styles/history.css';
import { useState, useMemo } from 'react';
import { useWallet } from '@/context/WalletContext';
import TransactionItem from '@/components/TransactionItem';
import EditTransactionSheet from '@/components/EditTransactionSheet';
import { Transaction, TransactionType } from '@/lib/types';
import { formatDateHeader, formatRupiah } from '@/lib/utils';

type Filter = 'all' | 'income' | 'expense' | 'transfer';

const FILTERS: { key: Filter; label: string; icon: string }[] = [
  { key: 'all',      label: 'Semua',       icon: 'fa-solid fa-list' },
  { key: 'income',   label: 'Pemasukkan',  icon: 'fa-solid fa-coins' },
  { key: 'expense',  label: 'Pengeluaran', icon: 'fa-solid fa-cart-shopping' },
  { key: 'transfer', label: 'Transfer',    icon: 'fa-solid fa-arrow-right-arrow-left' },
];

function matchesFilter(tx: Transaction, filter: Filter): boolean {
  if (filter === 'all') return true;
  if (filter === 'income') return tx.type === 'income';
  if (filter === 'expense') return tx.type === 'expense';
  if (filter === 'transfer') return tx.type === 'transfer_out' || tx.type === 'transfer_in';
  return true;
}

function groupByDate(txs: Transaction[]): Map<string, Transaction[]> {
  const map = new Map<string, Transaction[]>();
  for (const tx of txs) {
    const list = map.get(tx.date) || [];
    list.push(tx);
    map.set(tx.date, list);
  }
  return map;
}

export default function HistoryPage() {
  const { transactions } = useWallet();
  const [filter, setFilter] = useState<Filter>('all');
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const filtered = useMemo(
    () => transactions.filter((tx) => matchesFilter(tx, filter)),
    [transactions, filter]
  );

  const grouped = useMemo(() => groupByDate(filtered), [filtered]);
  const dates = Array.from(grouped.keys()).sort((a, b) => b.localeCompare(a));

  const stats = useMemo(() => {
    const income = filtered
      .filter((t) => t.type === 'income')
      .reduce((s, t) => s + t.amount, 0);
    const expense = filtered
      .filter((t) => t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0);
    return { income, expense, count: filtered.length };
  }, [filtered]);

  return (
    <>
      {/* HEADER */}
      <header className="page-header history-header">
        <div>
          <div className="header-greeting">Rekap</div>
          <div className="header-name">Riwayat Transaksi</div>
        </div>
      </header>

      {/* SUMMARY MINI CARDS */}
      <div className="history-summary">
        <div className="history-summary-card">
          <div className="hs-label">
            <i className="fa-solid fa-coins" />
            Total Masuk
          </div>
          <div className="hs-value hs-green">+{formatRupiah(stats.income)}</div>
        </div>
        <div className="history-summary-card">
          <div className="hs-label">
            <i className="fa-solid fa-cart-shopping" />
            Total Keluar
          </div>
          <div className="hs-value hs-red">-{formatRupiah(stats.expense)}</div>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="filter-tabs">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`filter-tab ${filter === f.key ? 'active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            <i className={f.icon} />
            {f.label}
          </button>
        ))}
      </div>

      {/* TRANSACTION COUNT */}
      {filtered.length > 0 && (
        <div className="history-count">
          {filtered.length} transaksi
        </div>
      )}

      {/* GROUPED TRANSACTIONS */}
      {dates.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <i className="fa-regular fa-folder-open" />
          </div>
          <div className="empty-state-text">Tidak ada transaksi</div>
          <div className="empty-state-sub">
            {filter === 'all'
              ? 'Mulai catat transaksi dengan tombol +'
              : `Belum ada transaksi ${FILTERS.find((f) => f.key === filter)?.label.toLowerCase()}`}
          </div>
        </div>
      ) : (
        <div className="history-list">
          {dates.map((date) => {
            const txs = grouped.get(date) || [];
            const dayIncome = txs
              .filter((t) => t.type === 'income')
              .reduce((s, t) => s + t.amount, 0);
            const dayExpense = txs
              .filter((t) => t.type === 'expense')
              .reduce((s, t) => s + t.amount, 0);

            return (
              <div key={date} className="history-group">
                <div className="history-date-header">
                  <span>{formatDateHeader(date)}</span>
                  <div className="history-date-summary">
                    {dayIncome > 0 && (
                      <span className="hds-income">+{formatRupiah(dayIncome)}</span>
                    )}
                    {dayExpense > 0 && (
                      <span className="hds-expense">-{formatRupiah(dayExpense)}</span>
                    )}
                  </div>
                </div>
                <div className="tx-list">
                  {txs.map((tx) => (
                    <TransactionItem key={tx.id} tx={tx} onClick={setEditingTx} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ height: 24 }} />

      {editingTx && (
        <EditTransactionSheet tx={editingTx} onClose={() => setEditingTx(null)} />
      )}
    </>
  );
}
