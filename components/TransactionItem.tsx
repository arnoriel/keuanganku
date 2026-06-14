'use client';

import '@/styles/transaction-item.css';
import { Transaction } from '@/lib/types';
import { formatRupiah, formatDateAndTime, getIncomeCategory, getExpenseCategory } from '@/lib/utils';

interface TransactionItemProps { tx: Transaction; }

export default function TransactionItem({ tx }: TransactionItemProps) {
  // Derive icon/color from category if available
  let icon: React.ReactNode;
  let iconBg: string;
  let label: string;
  let amountColor: string;
  let prefix: string;

  if (tx.type === 'income') {
    const cat = getIncomeCategory(tx.category as string | undefined);
    icon = <i className={`fa-solid ${cat.icon}`} />;
    iconBg = cat.color;
    label = cat.label;
    amountColor = 'tx-amount-positive';
    prefix = '+';
  } else if (tx.type === 'expense') {
    const cat = getExpenseCategory(tx.category as string | undefined);
    icon = <i className={`fa-solid ${cat.icon}`} />;
    iconBg = cat.color;
    label = tx.note || cat.label;
    amountColor = 'tx-amount-negative';
    prefix = '-';
  } else if (tx.type === 'transfer_in') {
    icon = <i className="fa-solid fa-arrow-down" />;
    iconBg = '#4B7BF5';
    label = tx.note || 'Transfer Masuk';
    amountColor = 'tx-amount-positive';
    prefix = '+';
  } else {
    icon = <i className="fa-solid fa-arrow-up" />;
    iconBg = '#8E95B0';
    label = tx.note || 'Transfer Keluar';
    amountColor = 'tx-amount-transfer-out';
    prefix = '-';
  }

  return (
    <div className="tx-item">
      <div className="tx-icon-cat" style={{ background: iconBg + '22', color: iconBg }}>
        {icon}
      </div>
      <div className="tx-info">
        <div className="tx-title">{label}</div>
        <div className="tx-subtitle">{formatDateAndTime(tx.createdAt)}</div>
      </div>
      <div className={`tx-amount ${amountColor}`}>{prefix}{formatRupiah(tx.amount)}</div>
    </div>
  );
}
