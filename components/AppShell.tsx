'use client';

import { useState, type ReactNode } from 'react';
import BottomNav from './BottomNav';
import AddTransactionSheet from './AddTransactionSheet';
import SplashScreen from './SplashScreen';

export default function AppShell({ children }: { children: ReactNode }) {
  const [showAddSheet, setShowAddSheet] = useState(false);

  return (
    <div className="app-root">
      <SplashScreen />
      <div className="page">
        {children}
      </div>
      <BottomNav onFabClick={() => setShowAddSheet(true)} />
      {showAddSheet && (
        <AddTransactionSheet onClose={() => setShowAddSheet(false)} />
      )}
    </div>
  );
}
