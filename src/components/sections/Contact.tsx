'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Phone, Loader2, CheckCircle2, XCircle } from 'lucide-react';

const LinkedinIcon = ({ size = 16, ...props }: { size?: number; [key: string]: unknown }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
  </svg>
);
const GithubIcon = ({ size = 16, ...props }: { size?: number; [key: string]: unknown }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
);

import { useAdminStore } from '@/store/adminStore';

const ease = [0.16, 1, 0.3, 1] as const;

export default function Contact() {
  const personalData = useAdminStore(state => state.config.personal);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const CONTACT_LINKS = [
    { label: 'EMAIL', value: personalData.email, href: `mailto:${personalData.email}`, icon: Mail },
    { label: 'LINKEDIN', value: personalData.linkedinUrl.replace('https://', ''), href: personalData.linkedinUrl, icon: LinkedinIcon },
    { label: 'GITHUB', value: personalData.githubUrl.replace('https://', ''), href: personalData.githubUrl, icon: GithubIcon },
    { label: 'PHONE', value: personalData.phone, href: `tel:${personalData.phone.replace(/\s/g, '')}`, icon: Phone },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to send');
      
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error(error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section
      className="section-padding relative overflow-hidden"
      style={{ background: 'var(--bg-void)' }}
      data-section="contact"
      id="contact"
    >
      {/* VC monogram watermark */}
      <div
        className="absolute bottom-0 right-[5%] pointer-events-none select-none translate-y-1/4"
        style={{
          fontFamily: 'var(--font-accent)',
          fontSize: '40vw',
          color: 'var(--text-primary)',
          opacity: 0.02,
          lineHeight: 1,
        }}
      >
        VC
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        {/* Left column */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease }}
        >
          <div
            className="chamfer-sm inline-flex items-center gap-3 px-4 py-2 mb-8 text-[0.65rem] tracking-[0.2em] uppercase"
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--accent-primary)',
              border: '1px solid var(--border-soft)',
              background: 'rgba(0,255,200,0.03)',
            }}
          >
            <span className="pulse-dot-sm" />
            {personalData.statusBadge}
          </div>

          <h2
            className="mb-8"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
              lineHeight: 1.0,
              color: 'var(--text-primary)',
            }}
          >
            LET&apos;S<br />
            BUILD<br />
            SOMETHING<br />
            <span style={{ color: 'var(--accent-primary)', textShadow: 'var(--glow-text)' }}>
              GREAT.
            </span>
          </h2>

          <p
            className="mb-10"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.9,
              maxWidth: '480px',
            }}
          >
            Looking for AI/backend roles, internships, or exciting collaborative
            projects. Drop a message via the secure neural channel.
          </p>

          <div className="flex flex-wrap gap-4">
            {CONTACT_LINKS.map(link => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.label !== 'PHONE' && link.label !== 'EMAIL' ? '_blank' : undefined}
                  rel={link.label !== 'PHONE' && link.label !== 'EMAIL' ? 'noopener noreferrer' : undefined}
                  className="w-12 h-12 flex items-center justify-center chamfer-sm transition-all duration-300"
                  style={{
                    border: '1px solid var(--border-default)',
                    background: 'var(--bg-card)',
                    color: 'var(--accent-primary)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-strong)';
                    e.currentTarget.style.background = 'rgba(0,255,200,0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-default)';
                    e.currentTarget.style.background = 'var(--bg-card)';
                  }}
                  data-cursor-hover
                  title={link.value}
                >
                  <Icon size={20} />
                </a>
              );
            })}
          </div>
        </motion.div>

        {/* Right column — Backend Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease, delay: 0.2 }}
          className="flex flex-col justify-center"
        >
          <form 
            onSubmit={handleSubmit}
            className="chamfer-lg p-6 sm:p-8"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-default)',
            }}
          >
            <div className="mb-6 flex items-center gap-3" style={{ color: 'var(--text-muted)' }}>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[0.6rem] uppercase tracking-[0.2em]" style={{ fontFamily: 'var(--font-mono)' }}>
                SECURE SECRETS // API ROUTE ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div className="flex flex-col gap-2">
                <label className="text-[0.7rem] uppercase tracking-[0.1em] text-accent-primary" style={{ fontFamily: 'var(--font-mono)' }}>Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="chamfer-sm w-full bg-transparent p-3 text-sm focus:outline-none focus:border-accent-primary transition-colors"
                  style={{ border: '1px solid var(--border-medium)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}
                  placeholder="John Doe"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.7rem] uppercase tracking-[0.1em] text-accent-primary" style={{ fontFamily: 'var(--font-mono)' }}>Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="chamfer-sm w-full bg-transparent p-3 text-sm focus:outline-none focus:border-accent-primary transition-colors"
                  style={{ border: '1px solid var(--border-medium)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 mb-8">
              <label className="text-[0.7rem] uppercase tracking-[0.1em] text-accent-primary" style={{ fontFamily: 'var(--font-mono)' }}>Message</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="chamfer-sm w-full bg-transparent p-3 text-sm focus:outline-none focus:border-accent-primary transition-colors resize-none"
                style={{ border: '1px solid var(--border-medium)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}
                placeholder="Let's build something..."
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="chamfer-sm w-full py-4 flex items-center justify-center gap-2 text-[0.8rem] tracking-[0.1em] uppercase transition-all duration-300 disabled:opacity-70"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                background: 'var(--accent-primary)',
                color: '#010108',
              }}
              data-cursor-hover
            >
              {status === 'idle' && <>INITIALIZE TRANSMISSION <ArrowRight size={16} /></>}
              {status === 'loading' && <><Loader2 size={16} className="animate-spin" /> ESTABLISHING UPLINK...</>}
              {status === 'success' && <><CheckCircle2 size={16} /> TRANSMISSION SUCCESSFUL</>}
              {status === 'error' && <><XCircle size={16} /> TRANSMISSION FAILED</>}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
