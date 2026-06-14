'use client';

import '@/styles/home.css';
import { useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import TransactionItem from '@/components/TransactionItem';
import TransferModal from '@/components/TransferModal';
import { formatRupiah, formatRupiahShort, getGreeting, formatFullDate, getTodayDateStr } from '@/lib/utils';

export default function DashboardPage() {
  const wallet = useWallet();
  const [showTransfer, setShowTransfer] = useState(false);
  const [hidePegangan, setHidePegangan] = useState(false);
  const [hideTabungan, setHideTabungan] = useState(false);

  const recentTx = wallet.transactions.slice(0, 8);
  const todayStr = getTodayDateStr();
  const today = formatFullDate(todayStr);
  const greeting = getGreeting();

  const maskPegangan = (amount: number) =>
    hidePegangan ? '••••••' : formatRupiah(amount);
  const maskPeganganShort = (amount: number) =>
    hidePegangan ? '•••' : formatRupiahShort(amount);
  const maskTabungan = (amount: number) =>
    hideTabungan ? '••••••' : formatRupiah(amount);

  const maskTotal = (amount: number) =>
    (hidePegangan && hideTabungan) ? '••••••' : formatRupiah(amount);
  const maskMonthIncome = (amount: number) =>
    hidePegangan ? '•••' : formatRupiahShort(amount);
  const maskMonthExpense = (amount: number) =>
    hidePegangan ? '•••' : formatRupiahShort(amount);

  return (
    <>
      {/* HEADER */}
      <header className="page-header">
        <div>
          <div className="header-greeting">{greeting}</div>
          <div className="header-name">
            <span className="header-name-brand">Keuanganku</span>
          </div>
          <div className="header-date">{today}</div>
        </div>
        <div className="header-actions">
          <div className="header-avatar">
            <i className="fa-solid fa-motorcycle" />
          </div>
        </div>
      </header>

      {/* TOTAL SALDO CARD - AT TOP */}
      <section className="total-section">
        <div className="total-card">
          <div className="total-card-top">
            <div>
              <div className="total-card-label">
                <i className="fa-solid fa-table-cells" />
                Saldo Aku (Total)
              </div>
              <div className="total-card-amount">{maskTotal(wallet.totalSaldo)}</div>
            </div>
          </div>

          <div className="total-divider" />

          <div className="quick-stats">
            <div className="quick-stat">
              <div className="quick-stat-label">
                <i className="fa-solid fa-arrow-trend-up" />
                Pemasukkan Bulan Ini
              </div>
              <div className="quick-stat-value stat-income">
                +{maskMonthIncome(wallet.monthIncome)}
              </div>
            </div>
            <div className="quick-stat">
              <div className="quick-stat-label">
                <i className="fa-solid fa-arrow-trend-down" />
                Pengeluaran Bulan Ini
              </div>
              <div className="quick-stat-value stat-expense">
                -{maskMonthExpense(wallet.monthExpense)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div style={{ height: 16 }} />

      {/* WALLET CARDS SECTION */}
      <section className="wallet-section">

        {/* SALDO PEGANGAN - GREEN CARD */}
        <div className="wallet-card wallet-card-green">
          <div className="card-glow card-glow-green" />
          <div className="card-circles">
            <div className="card-circle card-circle-1" />
            <div className="card-circle card-circle-2" />
          </div>
          <div className="card-content">
            <div className="card-label">
              <i className="fa-solid fa-wallet" />
              Saldo Pegangan
            </div>
            <div className="card-amount">{maskPegangan(wallet.saldoPegangan)}</div>
            <div className="card-footer">
              <span className="card-badge">
                +{maskPeganganShort(wallet.todayIncome)} hari ini
              </span>
              <button
                className="card-eye-btn"
                onClick={() => setHidePegangan((h) => !h)}
                aria-label={hidePegangan ? 'Tampilkan saldo pegangan' : 'Sembunyikan saldo pegangan'}
              >
                <i className={hidePegangan ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'} />
              </button>
            </div>
          </div>
        </div>

        {/* TRANSFER BUTTON */}
        <div className="transfer-btn-wrapper">
          <div className="transfer-line" />
          <button
            className="transfer-btn"
            onClick={() => setShowTransfer(true)}
            aria-label="Transfer dana"
          >
            <i className="fa-solid fa-arrow-right-arrow-left" />
          </button>
          <div className="transfer-line" />
        </div>

        {/* SALDO TABUNGAN - BLUE CARD */}
        <div className="wallet-card wallet-card-blue">
          <div className="card-glow card-glow-blue" />
          <div className="card-circles">
            <div className="card-circle card-circle-1" />
            <div className="card-circle card-circle-2" />
          </div>
          <div className="card-content">
            <div className="card-label">
              <i className="fa-solid fa-piggy-bank" />
              Saldo Tabungan
            </div>
            <div className="card-amount">{maskTabungan(wallet.saldoTabungan)}</div>
            <div className="card-footer">
              <span className="card-badge card-badge-blue">
                Total tersimpan
              </span>
              <button
                className="card-eye-btn"
                onClick={() => setHideTabungan((h) => !h)}
                aria-label={hideTabungan ? 'Tampilkan saldo tabungan' : 'Sembunyikan saldo tabungan'}
              >
                <i className={hideTabungan ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* RECENT TRANSACTIONS */}
      <section className="recent-section">
        <div className="section-header">
          <span className="section-label">Transaksi Terbaru</span>
          {wallet.transactions.length > 0 && (
            <span className="section-count">{wallet.transactions.length} total</span>
          )}
        </div>

        {recentTx.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <i className="fa-regular fa-clipboard" />
            </div>
            <div className="empty-state-text">Belum ada transaksi</div>
            <div className="empty-state-sub">
              Klik tombol + untuk catat pemasukkan pertamamu
            </div>
          </div>
        ) : (
          <div className="tx-list">
            {recentTx.map((tx) => (
              <TransactionItem key={tx.id} tx={tx} />
            ))}
          </div>
        )}
      </section>

      <div style={{ height: 24 }} />

      {showTransfer && (
        <TransferModal onClose={() => setShowTransfer(false)} />
      )}
    </>
  );
}