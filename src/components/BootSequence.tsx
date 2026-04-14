'use client';

import { useEffect, useState, useRef } from 'react';
import { useAdminStore } from '@/store/adminStore';

export default function BootSequence() {
  const anims = useAdminStore(state => state.config.animations);
  const [phase, setPhase] = useState(0);
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [typedTexts, setTypedTexts] = useState<string[]>([]);
  const [gridVisible, setGridVisible] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const [removed, setRemoved] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if boot was already shown this session or if it's disabled globally
    if (!anims.bootEnabled || sessionStorage.getItem('boot-done')) {
      setRemoved(true);
      return;
    }

    setTypedTexts(new Array(anims.bootMessages.length).fill(''));

    // Phase 0: Scanline sweeps (0-0.1s)
    const t1 = setTimeout(() => setPhase(1), 100);

    // Phase 1: Grid lines appear (0.1-0.3s)
    const t2 = setTimeout(() => setGridVisible(true), 200);

    // Phase 2: Terminal text typing (0.5s start)
    const typeLineSequentially = (lineIndex: number, charIndex: number) => {
      if (lineIndex >= anims.bootMessages.length) return;

      const line = anims.bootMessages[lineIndex];

      if (charIndex === 0) {
        setVisibleLines(prev => [...prev, lineIndex]);
      }

      if (charIndex <= line.length) {
        setTypedTexts(prev => {
          const next = [...prev];
          next[lineIndex] = line.slice(0, charIndex);
          return next;
        });
        setTimeout(() => typeLineSequentially(lineIndex, charIndex + 1), 10);
      } else {
        setTimeout(() => typeLineSequentially(lineIndex + 1, 0), 50);
      }
    };

    const t3 = setTimeout(() => typeLineSequentially(0, 0), 500);

    // Phase 3: Fade out (bootDuration - 600ms)
    const t4 = setTimeout(() => setFadingOut(true), Math.max(anims.bootDuration - 600, 500));

    // Phase 4: Remove from DOM
    const t5 = setTimeout(() => {
      setRemoved(true);
      sessionStorage.setItem('boot-done', '1');
    }, anims.bootDuration);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  if (removed) return null;

  const gridLines = [];
  // Vertical lines
  for (let i = 0; i < 12; i++) {
    gridLines.push(
      <div
        key={`v-${i}`}
        className="boot-grid-line vertical"
        style={{
          left: `${(i + 1) * (100 / 13)}%`,
          opacity: gridVisible ? 1 : 0,
          transitionDelay: `${i * 40}ms`,
        }}
      />
    );
  }
  // Horizontal lines
  for (let i = 0; i < 8; i++) {
    gridLines.push(
      <div
        key={`h-${i}`}
        className="boot-grid-line horizontal"
        style={{
          top: `${(i + 1) * (100 / 9)}%`,
          opacity: gridVisible ? 1 : 0,
          transitionDelay: `${500 + i * 40}ms`,
        }}
      />
    );
  }

  return (
    <div
      id="boot-overlay"
      ref={overlayRef}
      className={fadingOut ? 'fade-out' : ''}
    >
      {phase === 0 && <div className="boot-scanline" />}
      {gridLines}
      <div className="boot-terminal">
        {anims.bootMessages.map((_, i) => (
          <span
            key={i}
            className={`boot-line ${visibleLines.includes(i) ? 'visible' : ''}`}
            style={{ display: visibleLines.includes(i) ? 'inline' : 'none' }}
          >
            {typedTexts[i]}
            {visibleLines.includes(i) && i === visibleLines[visibleLines.length - 1] && (
              <span className="typewriter-cursor" />
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
