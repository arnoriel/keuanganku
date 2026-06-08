'use client';

import { Transaction } from '@/lib/types';
import { formatRupiah, formatDateAndTime } from '@/lib/utils';

interface TransactionItemProps {
  tx: Transaction;
}

const txConfig = {
  income: {
    icon: <i className="fa-solid fa-coins" />,
    label: (tx: Transaction) =>
      tx.period === 'harian' ? 'Pemasukkan Harian' : 'Pemasukkan Bulanan',
    colorClass: 'tx-amount-positive',
    iconClass: 'tx-icon-income',
    prefix: '+',
  },
  expense: {
    icon: <i className="fa-solid fa-cart-shopping" />,
    label: (tx: Transaction) => tx.note || 'Pengeluaran',
    colorClass: 'tx-amount-negative',
    iconClass: 'tx-icon-expense',
    prefix: '-',
  },
  transfer_out: {
    icon: <i className="fa-solid fa-arrow-up" />,
    label: (tx: Transaction) => tx.note || 'Transfer Keluar',
    colorClass: 'tx-amount-transfer-out',
    iconClass: 'tx-icon-transfer',
    prefix: '-',
  },
  transfer_in: {
    icon: <i className="fa-solid fa-arrow-down" />,
    label: (tx: Transaction) => tx.note || 'Transfer Masuk',
    colorClass: 'tx-amount-positive',
    iconClass: 'tx-icon-transfer-in',
    prefix: '+',
  },
};

export default function TransactionItem({ tx }: TransactionItemProps) {
  const cfg = txConfig[tx.type];
  const label = cfg.label(tx);
  const amountStr = `${cfg.prefix}${formatRupiah(tx.amount)}`;

  return (
    <div className="tx-item">
      <div className={`tx-icon ${cfg.iconClass}`}>
        {cfg.icon}
      </div>
      <div className="tx-info">
        <div className="tx-title">{label}</div>
        <div className="tx-subtitle">{formatDateAndTime(tx.createdAt)}</div>
      </div>
      <div className={`tx-amount ${cfg.colorClass}`}>{amountStr}</div>
    </div>
  );
}