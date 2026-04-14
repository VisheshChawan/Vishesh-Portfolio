'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const TERMINAL_LINES = [
  { type: 'cmd', text: '> whoami' },
  { type: 'out', text: 'Vishesh Chawan' },
  { type: 'empty', text: '' },
  { type: 'cmd', text: '> cat skills.txt' },
  { type: 'out', text: 'Python · FastAPI · Docker · GCP' },
  { type: 'out', text: 'LLMs · RAG · React · Next.js' },
  { type: 'empty', text: '' },
  { type: 'cmd', text: '> echo $CGPA' },
  { type: 'out', text: '7.2' },
  { type: 'empty', text: '' },
  { type: 'cmd', text: '> echo $STATUS' },
  { type: 'out', text: 'Open to opportunities ●' },
];

const ease = [0.16, 1, 0.3, 1] as const;

export default function AboutTerminal() {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [typedChars, setTypedChars] = useState<number[]>(new Array(TERMINAL_LINES.length).fill(0));
  const [inView, setInView] = useState(false);
  const [cgpaHover, setCgpaHover] = useState(false);
  const [cgpaTimer, setCgpaTimer] = useState<NodeJS.Timeout | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Intersection Observer
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Sequential typing per line
  useEffect(() => {
    if (!inView) return;

    let currentLine = 0;
    let currentChar = 0;

    const type = () => {
      if (currentLine >= TERMINAL_LINES.length) return;

      const line = TERMINAL_LINES[currentLine];

      if (line.type === 'empty') {
        setVisibleLines(prev => Math.max(prev, currentLine + 1));
        currentLine++;
        currentChar = 0;
        setTimeout(type, 100);
        return;
      }

      if (currentChar <= line.text.length) {
        setVisibleLines(prev => Math.max(prev, currentLine + 1));
        setTypedChars(prev => {
          const next = [...prev];
          next[currentLine] = currentChar;
          return next;
        });
        currentChar++;
        setTimeout(type, line.type === 'cmd' ? 40 : 20);
      } else {
        currentLine++;
        currentChar = 0;
        setTimeout(type, 200);
      }
    };

    const t = setTimeout(type, 300);
    return () => clearTimeout(t);
  }, [inView]);

  // CGPA Easter egg
  const handleCgpaEnter = () => {
    const timer = setTimeout(() => setShowTooltip(true), 3000);
    setCgpaTimer(timer);
    setCgpaHover(true);
  };

  const handleCgpaLeave = () => {
    if (cgpaTimer) clearTimeout(cgpaTimer);
    setCgpaHover(false);
    setShowTooltip(false);
  };

  return (
    <section
      ref={ref}
      className="section-padding relative overflow-hidden"
      style={{ background: 'var(--bg-deep)' }}
      data-section="about"
      id="about"
    >
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left: Bio text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease }}
        >
          <div
            className="mb-4 text-[0.65rem] tracking-[0.2em] uppercase"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}
          >
            {'// 01 _ ABOUT_ME'}
          </div>
          <h2
            className="mb-8"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
              lineHeight: 1.05,
              color: 'var(--text-primary)',
            }}
          >
            I BUILD THINGS<br />
            <span style={{ color: 'var(--accent-primary)' }}>THAT THINK.</span>
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.9,
              maxWidth: '520px',
            }}
          >
            Final year B.Tech student in Computer Science (Data Science) at Vignan
            Institute of Technology and Science, Hyderabad. I build things that
            think — from intelligent document retrieval systems to community
            platforms serving 1,200+ users. My work sits at the intersection of
            AI engineering and practical software development.
          </p>
        </motion.div>

        {/* Right: Terminal Card */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease, delay: 0.2 }}
          className="chamfer-lg"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-soft)',
            padding: '2rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            lineHeight: 1.8,
          }}
        >
          {/* Terminal header */}
          <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid var(--border-default)' }}>
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f56' }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ffbd2e' }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#27c93f' }} />
            <span className="ml-3 text-[0.6rem] tracking-[0.15em] uppercase" style={{ color: 'var(--text-muted)' }}>
              terminal — vishesh@neural
            </span>
          </div>

          {/* Terminal lines */}
          <div className="space-y-0">
            {TERMINAL_LINES.map((line, i) => {
              if (i >= visibleLines) return null;
              if (line.type === 'empty') return <div key={i} className="h-4" />;

              const text = line.text.slice(0, typedChars[i] || 0);
              const isCgpa = text.includes('7.2');

              return (
                <div key={i} className="whitespace-nowrap overflow-hidden">
                  <span style={{ color: line.type === 'cmd' ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                    {isCgpa ? (
                      <span
                        className="relative"
                        onMouseEnter={handleCgpaEnter}
                        onMouseLeave={handleCgpaLeave}
                        data-cursor-hover
                      >
                        {text}
                        {showTooltip && (
                          <span
                            className="absolute -top-8 left-0 px-2 py-1 text-[0.6rem] whitespace-nowrap rounded"
                            style={{
                              background: 'var(--bg-card-hover)',
                              border: '1px solid var(--border-soft)',
                              color: 'var(--accent-tertiary)',
                            }}
                          >
                            Working on it 👨‍💻
                          </span>
                        )}
                      </span>
                    ) : (
                      text
                    )}
                  </span>
                  {i === visibleLines - 1 && <span className="typewriter-cursor" />}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
