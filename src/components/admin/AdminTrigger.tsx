'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import dynamic from 'next/dynamic';

// Conditionally load the panel so users don't download the heavy admin JS unless authenticated
const AdminPanel = dynamic(() => import('./AdminPanel'), { ssr: false });

export default function AdminTrigger() {
  const { isAuthenticated, verifyPassword } = useAdminAuth();
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const [shake, setShake] = useState(false);
  const [errorFlash, setErrorFlash] = useState(false);
  
  // Rate limiting state
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger: Keyboard Shortcut (Ctrl + Shift + Alt + A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setShowModal(true);
      }
      if (e.key === 'Escape' && showModal) {
        setShowModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Sync global logout event properly for smooth unmounts
    const handleLogout = () => {
      setShowModal(false);
      // Wait for framer-motion exit animation (approx 300ms) before hard reload
      setTimeout(() => window.location.reload(), 350); 
    };
    window.addEventListener('vc_admin_logout', handleLogout);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('vc_admin_logout', handleLogout);
    }
  }, [showModal]);

  // Trigger: Hidden click zone
  const handleHiddenClick = () => {
    clickCountRef.current += 1;
    
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    
    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 1500);

    if (clickCountRef.current === 3) {
      setShowModal(true);
      clickCountRef.current = 0;
    }
  };

  // Lockout countdown
  useEffect(() => {
    if (lockoutTimer > 0) {
      const t = setTimeout(() => setLockoutTimer(prev => prev - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [lockoutTimer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTimer > 0) return;

    const isValid = await verifyPassword(password);
    
    if (isValid) {
      setFailedAttempts(0);
      setShowModal(false);
      setPassword('');
      // Audio cue
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.05);
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.2);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.2);
      } catch (err) {
        // Ignore audio failures
      }
    } else {
      setFailedAttempts(prev => {
        const next = prev + 1;
        if (next >= 5) {
          setLockoutTimer(60);
          return 0;
        }
        return next;
      });
      setShake(true);
      setErrorFlash(true);
      setTimeout(() => setShake(false), 400);
      setTimeout(() => setErrorFlash(false), 1000);
      setPassword('');
    }
  };

  return (
    <>
      {/* Hidden Click Zone - bottom right 8px from edge */}
      <div 
        className="fixed bottom-[8px] right-[8px] w-[1px] h-[1px] opacity-0 z-[99999]"
        style={{ pointerEvents: 'all', cursor: 'default' }}
        onClick={handleHiddenClick}
      />

      {/* Admin Panel (If Authenticated) */}
      {isAuthenticated && <AdminPanel />}

      {/* Password Modal */}
      <AnimatePresence>
        {showModal && !isAuthenticated && (
          <motion.div
            className="fixed inset-0 z-[99998] flex items-center justify-center bg-black/95 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="p-8 pb-10 w-full max-w-[400px]"
              style={{
                background: '#010108',
                border: `1px solid ${errorFlash ? 'var(--accent-danger)' : 'var(--accent-primary)'}`,
                clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)',
                transition: 'border-color 0.2s',
              }}
            >
              <h2 
                className="text-center mb-8 glitch-text"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '1.5rem',
                  color: 'var(--accent-primary)',
                  letterSpacing: '0.1em'
                }}
              >
                ADMIN ACCESS
              </h2>

              <div className="w-full h-[1px] bg-[var(--border-strong)] mb-8 opacity-50 relative">
                <div className="absolute top-0 left-0 h-full w-1/3 bg-[var(--accent-primary)] animate-pulse" />
              </div>

              {lockoutTimer > 0 ? (
                <div className="text-center text-[var(--accent-danger)]" style={{ fontFamily: 'var(--font-mono)' }}>
                  <span className="block mb-2 text-sm">SECURITY LOCKOUT</span>
                  <span className="text-2xl">{lockoutTimer}s</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div
                    animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
                    transition={{ duration: 0.4 }}
                  >
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="● ● ● ● ● ● ●"
                      autoFocus
                      className="w-full bg-transparent border-b border-[var(--border-strong)] pb-2 text-center focus:outline-none focus:border-[var(--accent-primary)] text-lg"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--text-primary)',
                        letterSpacing: '0.3em'
                      }}
                      autoComplete="off"
                    />
                  </motion.div>

                  <button
                    type="submit"
                    className="w-full py-3 text-sm font-bold tracking-widest text-[#010108] bg-[var(--accent-primary)] hover:bg-white transition-colors"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
                    }}
                  >
                    AUTHENTICATE →
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
