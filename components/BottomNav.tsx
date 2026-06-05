'use client';

import { usePathname, useRouter } from 'next/navigation';

interface BottomNavProps {
  onFabClick: () => void;
}

export default function BottomNav({ onFabClick }: BottomNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="bottom-nav">
      <button
        className={`nav-btn ${pathname === '/' ? 'active' : ''}`}
        onClick={() => router.push('/')}
        aria-label="Beranda"
      >
        <i className={`fa-${pathname === '/' ? 'solid' : 'regular'} fa-house`} />
        <span>Beranda</span>
      </button>

      <div className="nav-fab-wrapper">
        <button
          className="nav-fab"
          onClick={onFabClick}
          aria-label="Tambah Transaksi"
        >
          <i className="fa-solid fa-plus" />
        </button>
      </div>

      <button
        className={`nav-btn ${pathname === '/history' ? 'active' : ''}`}
        onClick={() => router.push('/history')}
        aria-label="Riwayat"
      >
        <i className="fa-solid fa-clock-rotate-left" />
        <span>Riwayat</span>
      </button>
    </nav>
  );
}
