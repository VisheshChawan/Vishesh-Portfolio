'use client';

import { useEffect, useState, useCallback } from 'react';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';

import { useAdminStore } from '@/store/adminStore';
import { useResumeStore } from '@/store/resumeStore';

const NAV_LINKS = [
  { label: '_about', href: '#about', id: 'about' },
  { label: '_skills', href: '#skills', id: 'skills' },
  { label: '_projects', href: '#projects', id: 'projects' },
  { label: '_experience', href: '#experience', id: 'experience' },
  { label: '_contact', href: '#contact', id: 'contact' },
];

export default function Navbar() {
  const personalData = useAdminStore(state => state.config.personal);
  const resume = useResumeStore(state => state.resume);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 100);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Listen to global section change events from ScrollObserver
  useEffect(() => {
    const onSectionChange = (e: any) => setActiveSection(e.detail);
    window.addEventListener('sectionChange', onSectionChange);
    return () => window.removeEventListener('sectionChange', onSectionChange);
  }, []);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[9990] transition-all duration-300"
        style={{
          height: scrolled ? '52px' : '68px',
          background: 'rgba(1,1,8,0.9)',
          backdropFilter: 'blur(24px) saturate(180%)',
          borderBottom: '1px solid var(--border-default)',
          boxShadow: '0 1px 0 rgba(0,255,200,0.05)',
        }}
      >
        <div className="max-w-[1400px] mx-auto w-full h-full px-6 flex items-center justify-between">
          
          {/* Logo */}
          <a
            href="#"
            className="text-xl tracking-tighter relative group"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              color: 'var(--text-primary)',
            }}
            data-cursor-hover
          >
            <span className="opacity-50 group-hover:opacity-100 transition-opacity">&lt;</span>
            <span className="group-hover:text-[var(--accent-primary)] group-hover:drop-shadow-[0_0_10px_rgba(0,255,200,0.5)] transition-all">{" VC "}</span>
            <span className="opacity-50 group-hover:opacity-100 transition-opacity">/&gt;</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 h-full">
            <div className="flex items-center gap-6 h-full relative">
              {NAV_LINKS.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-[0.65rem] tracking-[0.2em] h-full flex items-center uppercase relative transition-colors duration-300 hover:text-[var(--text-primary)]"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    color: activeSection === link.id ? 'var(--accent-primary)' : 'var(--text-secondary)'
                  }}
                  data-cursor-hover
                >
                  {link.label}
                  {activeSection === link.id && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute bottom-[-1px] left-0 right-0 h-[2px]"
                      style={{ background: 'var(--accent-primary)' }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </a>
              ))}
            </div>

            {/* Separator */}
            <div className="w-px h-6 bg-white/10" />

            {/* Status / Resume */}
            <div className="flex items-center gap-6">
              <div
                className="flex items-center gap-2 text-[0.65rem] tracking-[0.15em] uppercase"
                style={{
                  color: 'var(--accent-primary)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                <span className="pulse-dot-sm" />
                {personalData.statusBadge}
              </div>

              {/* Resume button */}
              {(() => {
                const resumeUrl = useAdminStore.getState().config.resumeUrl;
                const resumeFileName = useAdminStore.getState().config.resumeFileName;
                const href = resume?.base64Data || resumeUrl;
                const fileName = resume?.fileName || resumeFileName || 'resume';
                if (!href) return null;
                return (
                  <a
                    href={href}
                    download={fileName}
                    className="chamfer-sm flex items-center gap-2 px-4 py-1.5 text-[0.7rem] tracking-[0.1em] uppercase border transition-all duration-300 hover:bg-[var(--accent-primary)]/5"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--accent-primary)',
                      borderColor: 'var(--border-default)',
                    }}
                    data-cursor-hover
                  >
                    <Download size={12} />
                    RESUME
                  </a>
                );
              })()}
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            data-cursor-hover
          >
            <span
              className="block w-5 h-px transition-all duration-300"
              style={{
                background: 'var(--accent-primary)',
                transform: mobileMenuOpen ? 'rotate(45deg) translateY(4px)' : 'none',
              }}
            />
            <span
              className="block w-5 h-px transition-all duration-300"
              style={{
                background: 'var(--accent-primary)',
                opacity: mobileMenuOpen ? 0 : 1,
              }}
            />
            <span
              className="block w-5 h-px transition-all duration-300"
              style={{
                background: 'var(--accent-primary)',
                transform: mobileMenuOpen ? 'rotate(-45deg) translateY(-4px)' : 'none',
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[9989] flex flex-col items-center justify-center gap-8"
          style={{
            background: 'rgba(1,1,8,0.97)',
            backdropFilter: 'blur(24px)',
          }}
        >
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl tracking-[0.15em] uppercase transition-colors duration-300"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: activeSection === link.id ? 'var(--accent-primary)' : 'var(--text-primary)',
                animationDelay: `${i * 80}ms`,
              }}
            >
              {link.label}
            </a>
          ))}
          <div className="mt-6 flex items-center gap-2 text-[0.65rem] tracking-[0.15em] uppercase" style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
            <span className="pulse-dot-sm" />
            {personalData.statusBadge}
          </div>
        </div>
      )}
    </>
  );
}
