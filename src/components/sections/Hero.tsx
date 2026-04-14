'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';

const spring = { type: 'spring' as const, stiffness: 300, damping: 24 };
const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const heroData = useAdminStore(state => state.config.hero);
  const personalData = useAdminStore(state => state.config.personal);
  const [bootDone, setBootDone] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [lineDrawn, setLineDrawn] = useState(false);
  const [scrollVisible, setScrollVisible] = useState(true);
  const [glitching, setGlitching] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // Check if boot is done (sessionStorage or after timeout)
  useEffect(() => {
    if (sessionStorage.getItem('boot-done')) {
      setBootDone(true);
    } else {
      const t = setTimeout(() => setBootDone(true), 1500);
      return () => clearTimeout(t);
    }
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (!bootDone || heroData.roles.length === 0) return;

    const role = heroData.roles[roleIndex % heroData.roles.length];
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      if (typedText.length < role.length) {
        timeout = setTimeout(() => setTypedText(role.slice(0, typedText.length + 1)), 80);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 2000);
      }
    } else {
      if (typedText.length > 0) {
        timeout = setTimeout(() => setTypedText(typedText.slice(0, -1)), 40);
      } else {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % heroData.roles.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, roleIndex, bootDone, heroData.roles]);

  // Line draw trigger
  useEffect(() => {
    if (bootDone) {
      const t = setTimeout(() => setLineDrawn(true), 500);
      return () => clearTimeout(t);
    }
  }, [bootDone]);

  // Scroll indicator fade
  useEffect(() => {
    const onScroll = () => setScrollVisible(window.scrollY < 100);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Periodic name glitch
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 200);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Magnetic button effect
  const handleMagnetic = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (window.innerWidth < 640) return;
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    btn.style.transform = `translate(${dx * 0.3}px, ${dy * 0.3}px)`;
  }, []);

  const handleMagneticLeave = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.transform = 'translate(0, 0)';
  }, []);

  if (!bootDone) return <div className="min-h-screen" />;

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col justify-center section-padding overflow-hidden"
      style={{ background: 'var(--bg-void)' }}
      data-section="hero"
    >
      {/* Watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{
          fontFamily: 'var(--font-accent)',
          fontSize: '30vw',
          color: 'var(--text-primary)',
          opacity: 0.02,
          lineHeight: 1,
        }}
      >
        {personalData.name.split(' ')[0]}
      </div>

      {/* Radial spotlight */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '30%',
          left: '20%',
          width: '60vw',
          height: '60vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,255,200,0.04) 0%, transparent 70%)',
        }}
      />

      {/* Horizon line */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          top: '50%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(0,255,200,0.06) 30%, rgba(0,255,200,0.06) 70%, transparent 100%)',
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto w-full">
        {/* Status Tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0 }}
          className="chamfer-sm inline-flex items-center gap-3 px-4 py-2 mb-8 text-[0.65rem] tracking-[0.2em] uppercase"
          style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--accent-primary)',
            border: '1px solid var(--border-soft)',
            background: 'rgba(0,255,200,0.03)',
          }}
        >
          <span className="pulse-dot-sm" />
          {personalData.statusBadge} · {personalData.location}
        </motion.div>

        {/* Name Block */}
        <div className="overflow-hidden mb-2">
          <motion.h1
            initial={{ x: -100, opacity: 0, scale: 0.95 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease, delay: 0.1 }}
            className={`glitch-text ${glitching ? 'glitching' : ''} uppercase`}
            data-text={personalData.name.split(' ')[0]}
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(5rem, 12vw, 10rem)',
              lineHeight: 0.88,
              letterSpacing: '-0.04em',
              color: '#ffffff',
            }}
          >
            {personalData.name.split(' ')[0]}
          </motion.h1>
        </div>

        <div className="overflow-hidden mb-6">
          <motion.h1
            initial={{ x: 100, opacity: 0, scale: 0.95 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease, delay: 0.2 }}
            className="uppercase"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(5rem, 12vw, 10rem)',
              lineHeight: 0.88,
              letterSpacing: '-0.04em',
              color: 'var(--accent-primary)',
              textShadow: 'var(--glow-text)',
            }}
          >
            {personalData.name.split(' ')[1] || ''}
          </motion.h1>
        </div>

        {/* Role + Typewriter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mb-6"
          style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 500,
            fontSize: 'clamp(0.9rem, 1.8vw, 1.2rem)',
          }}
        >
          <span style={{ color: 'var(--text-secondary)' }}>{personalData.titleLine1} — </span>
          <span style={{ color: 'var(--accent-tertiary)', textShadow: '0 0 8px rgba(240,171,252,0.4)' }}>
            {typedText}
          </span>
          <span className="typewriter-cursor" />
        </motion.div>

        {/* Accent Line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className={`accent-line-draw ${lineDrawn ? 'drawn' : ''}`} />
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7, ease }}
          className="max-w-[560px] mb-10"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.9,
          }}
        >
          {heroData.description}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, ...spring }}
          className="flex flex-wrap gap-4 mb-16"
        >
          <a
            href="#projects"
            className="chamfer-md inline-flex items-center gap-2 px-8 py-3 text-[0.8rem] tracking-[0.08em] uppercase transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,200,0.2),0_0_60px_rgba(0,255,200,0.08)]"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              background: 'var(--accent-primary)',
              color: '#010108',
            }}
            onMouseMove={handleMagnetic}
            onMouseLeave={handleMagneticLeave}
            data-cursor-hover
          >
            VIEW PROJECTS
          </a>
          <a
            href="#contact"
            className="chamfer-md inline-flex items-center gap-2 px-8 py-3 text-[0.8rem] tracking-[0.08em] uppercase transition-all duration-300 hover:bg-[rgba(0,255,200,0.05)]"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              background: 'transparent',
              color: 'var(--accent-primary)',
              border: '1px solid var(--border-medium)',
            }}
            onMouseMove={handleMagnetic}
            onMouseLeave={handleMagneticLeave}
            data-cursor-hover
          >
            GET IN TOUCH <ArrowRight size={16} />
          </a>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.6, ease }}
        >
          <div
            className="mb-6"
            style={{ height: '1px', background: 'var(--border-default)' }}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x" style={{ borderColor: 'var(--border-default)' }}>
            {heroData.stats.map((stat, i) => (
              <StatCounter key={stat.id} value={stat.number} label={stat.label} delay={i * 150} />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-500"
        style={{ opacity: scrollVisible ? 1 : 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: scrollVisible ? 1 : 0 }}
      >
        <span
          className="text-[0.6rem] tracking-[0.3em] uppercase"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}
        >
          SCROLL
        </span>
        <ChevronDown size={16} className="scroll-indicator" style={{ color: 'var(--text-muted)' }} />
      </motion.div>
    </section>
  );
}

/* ─── Stat Counter Sub-component ─── */

function StatCounter({ value, label, delay }: { value: string; label: string; delay: number }) {
  const [displayed, setDisplayed] = useState(value);
  const [counted, setCounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted) {
          setCounted(true);
          // Scramble phase
          let scrambleCount = 0;
          const scrambleInterval = setInterval(() => {
            const rand = Math.floor(Math.random() * 99);
            setDisplayed(rand.toString());
            scrambleCount++;
            if (scrambleCount > 6) {
              clearInterval(scrambleInterval);
              setDisplayed(value);
            }
          }, 40);
        }
      },
      { threshold: 0.5 }
    );

    const t = setTimeout(() => observer.observe(el), delay);
    return () => {
      clearTimeout(t);
      observer.disconnect();
    };
  }, [value, delay, counted]);

  return (
    <div ref={ref} className="text-center md:px-6">
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
          color: 'var(--accent-primary)',
          lineHeight: 1.2,
        }}
      >
        {displayed}
      </div>
      <div
        className="mt-1"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </div>
    </div>
  );
}
