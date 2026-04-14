'use client';

import { ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className="relative"
      style={{
        height: '64px',
        borderTop: '1px solid var(--border-default)',
        background: 'var(--bg-void)',
      }}
    >
      <div className="max-w-[1400px] mx-auto h-full flex items-center justify-between px-6">
        <div
          className="flex items-center flex-wrap gap-x-3 gap-y-1"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
          }}
        >
          <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{'< VC />'}</span>
          <span>·</span>
          <span>© 2025 Vishesh Chawan</span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">Hyderabad, India</span>
          <span className="hidden md:inline">·</span>
          <span className="hidden md:inline">Designed &amp; developed by Vishesh Chawan</span>
        </div>

        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5 group"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
            background: 'none',
            border: 'none',
          }}
          data-cursor-hover
        >
          BACK TO TOP
          <ArrowUp
            size={12}
            className="transition-transform duration-300 group-hover:-translate-y-0.5"
            style={{ color: 'var(--accent-primary)' }}
          />
        </button>
      </div>
    </footer>
  );
}
