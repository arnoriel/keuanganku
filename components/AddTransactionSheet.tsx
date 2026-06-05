'use client';

import { useState, useRef, useEffect } from 'react';
import { useWallet } from '@/context/WalletContext';
import { IncomePeriod } from '@/lib/types';
import { formatRupiah, parseAmountInput } from '@/lib/utils';

type Step = 'choose' | 'income' | 'expense' | 'success';
type TxChoice = 'income' | 'expense';

interface Props {
  onClose: () => void;
}

export default function AddTransactionSheet({ onClose }: Props) {
  const { addIncome, addExpense } = useWallet();
  const [step, setStep] = useState<Step>('choose');
  const [choice, setChoice] = useState<TxChoice>('income');
  const [rawAmount, setRawAmount] = useState('');
  const [period, setPeriod] = useState<IncomePeriod>('harian');
  const [note, setNote] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === 'income' || step === 'expense') {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [step]);

  const amount = parseAmountInput(rawAmount);

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const cleaned = e.target.value.replace(/[^\d]/g, '');
    if (cleaned === '') { setRawAmount(''); return; }
    const num = parseInt(cleaned, 10);
    if (!isNaN(num)) setRawAmount(num.toLocaleString('id-ID'));
  }

  function handleChoose(c: TxChoice) {
    setChoice(c);
    setStep(c);
  }

  function handleSubmit() {
    if (amount <= 0) return;
    if (step === 'income') {
      addIncome(amount, period);
      setSuccessMsg(`${formatRupiah(amount)} ditambahkan ke Saldo Pegangan`);
    } else if (step === 'expense') {
      addExpense(amount, note || 'Pengeluaran');
      setSuccessMsg(`${formatRupiah(amount)} dicatat sebagai pengeluaran`);
    }
    setStep('success');
    setTimeout(() => onClose(), 1800);
  }

  function handleBack() {
    setRawAmount('');
    setNote('');
    setStep('choose');
  }

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className="sheet">
        <div className="sheet-handle" />

        {/* CHOOSE STEP */}
        {step === 'choose' && (
          <div className="sheet-body">
            <div className="sheet-header">
              <button className="sheet-close" onClick={onClose}>
                <i className="fa-solid fa-xmark" />
              </button>
              <h2 className="sheet-title">Catat Transaksi</h2>
              <div style={{ width: 36 }} />
            </div>
            <p className="sheet-subtitle">Mau catat apa hari ini?</p>
            <div className="type-grid">
              <button className="type-card type-card-income" onClick={() => handleChoose('income')}>
                <div className="type-card-icon type-icon-income">
                  <i className="fa-solid fa-arrow-trend-up" />
                </div>
                <div>
                  <div className="type-card-label">Pemasukkan</div>
                  <div className="type-card-sub">Hasil narik hari ini</div>
                </div>
              </button>
              <button className="type-card type-card-expense" onClick={() => handleChoose('expense')}>
                <div className="type-card-icon type-icon-expense">
                  <i className="fa-solid fa-arrow-trend-down" />
                </div>
                <div>
                  <div className="type-card-label">Pengeluaran</div>
                  <div className="type-card-sub">Bensin, makan, dll</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* INCOME STEP */}
        {step === 'income' && (
          <div className="sheet-body">
            <div className="sheet-header">
              <button className="sheet-close" onClick={handleBack}>
                <i className="fa-solid fa-chevron-left" />
              </button>
              <h2 className="sheet-title">Pemasukkan</h2>
              <div style={{ width: 36 }} />
            </div>
            <p className="sheet-subtitle">Masukkan hasil narik kamu</p>

            <div className="form-group">
              <label className="form-label">Jumlah</label>
              <div className="amount-input-wrapper">
                <span className="amount-prefix">Rp</span>
                <input
                  ref={inputRef}
                  type="text"
                  inputMode="numeric"
                  className="amount-input"
                  placeholder="0"
                  value={rawAmount}
                  onChange={handleAmountChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Periode</label>
              <div className="period-tabs">
                <button
                  className={`period-tab ${period === 'harian' ? 'active' : ''}`}
                  onClick={() => setPeriod('harian')}
                  type="button"
                >
                  <i className="fa-solid fa-motorcycle" />
                  Harian
                </button>
                <button
                  className={`period-tab ${period === 'bulanan' ? 'active' : ''}`}
                  onClick={() => setPeriod('bulanan')}
                  type="button"
                >
                  <i className="fa-regular fa-calendar" />
                  Bulanan
                </button>
              </div>
            </div>

            {amount > 0 && (
              <div className="amount-preview income-preview">
                <span className="preview-label">
                  <i className="fa-solid fa-location-dot" />
                  {period === 'harian' ? 'Pemasukkan hari ini' : 'Pemasukkan bulan ini'}
                </span>
                <span className="preview-amount">+{formatRupiah(amount)}</span>
              </div>
            )}

            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={amount <= 0}
            >
              Simpan Pemasukkan
            </button>
            <button className="btn-ghost" onClick={handleBack}>Batal</button>
          </div>
        )}

        {/* EXPENSE STEP */}
        {step === 'expense' && (
          <div className="sheet-body">
            <div className="sheet-header">
              <button className="sheet-close" onClick={handleBack}>
                <i className="fa-solid fa-chevron-left" />
              </button>
              <h2 className="sheet-title">Pengeluaran</h2>
              <div style={{ width: 36 }} />
            </div>
            <p className="sheet-subtitle">Catat pengeluaran kamu</p>

            <div className="form-group">
              <label className="form-label">Jumlah</label>
              <div className="amount-input-wrapper">
                <span className="amount-prefix">Rp</span>
                <input
                  ref={inputRef}
                  type="text"
                  inputMode="numeric"
                  className="amount-input"
                  placeholder="0"
                  value={rawAmount}
                  onChange={handleAmountChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Keterangan <span className="label-optional">(opsional)</span></label>
              <input
                type="text"
                className="text-input"
                placeholder="Contoh: Bensin, Makan siang, Parkir..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={60}
              />
            </div>

            {amount > 0 && (
              <div className="amount-preview expense-preview">
                <span className="preview-label">
                  <i className="fa-solid fa-money-bill-wave" />
                  Keluar dari Saldo Pegangan
                </span>
                <span className="preview-amount">-{formatRupiah(amount)}</span>
              </div>
            )}

            <button
              className="btn-primary btn-danger"
              onClick={handleSubmit}
              disabled={amount <= 0}
            >
              Simpan Pengeluaran
            </button>
            <button className="btn-ghost" onClick={handleBack}>Batal</button>
          </div>
        )}

        {/* SUCCESS STEP */}
        {step === 'success' && (
          <div className="sheet-body sheet-success">
            <div className="success-icon">
              <i className="fa-solid fa-circle-check" />
            </div>
            <h2 className="success-title">Berhasil!</h2>
            <p className="success-msg">{successMsg}</p>
          </div>
        )}
      </div>
    </>
  );
}
