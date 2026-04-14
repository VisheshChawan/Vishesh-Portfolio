'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

interface SectionHeaderProps {
  tag: string;
  title: string;
  id?: string;
}

export default function SectionHeader({ tag, title, id }: SectionHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          setGlitching(true);
          setTimeout(() => setGlitching(false), 400);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isVisible]);

  const titleLines = title.split('\\n');

  return (
    <div ref={ref} className="mb-12 md:mb-16" id={id}>
      {/* Section tag */}
      <div
        className="mb-4 text-[0.65rem] tracking-[0.2em] uppercase transition-all duration-700"
        style={{
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        }}
      >
        {tag}
      </div>

      {/* Section title with glitch */}
      <h2
        className={`glitch-text ${glitching ? 'glitching' : ''} transition-all duration-700`}
        data-text={titleLines.join(' ')}
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          lineHeight: 1.0,
          color: 'var(--text-primary)',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
          transitionDelay: '0.15s',
        }}
      >
        {titleLines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </h2>
    </div>
  );
}
