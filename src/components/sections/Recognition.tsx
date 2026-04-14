'use client';

import { motion } from 'framer-motion';
import SectionHeader from '@/components/SectionHeader';
import { Trophy, Medal, Award, Award as AwardIcon } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';

const ease = [0.16, 1, 0.3, 1] as const;

export default function Recognition() {
  const achievements = useAdminStore(state => state.config.achievements);
  const certifications = useAdminStore(state => state.config.certifications);

  // Map string icon names to Lucide react components
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Trophy': return Trophy;
      case 'Medal': return Medal;
      case 'Award': return Award;
      default: return AwardIcon;
    }
  };

  return (
    <>
      {/* ─── Achievements ─── */}
      <section
        className="section-padding relative overflow-hidden"
        style={{ background: 'var(--bg-deep)' }}
      >
        <div className="max-w-[1400px] mx-auto relative z-10">
          <SectionHeader
            tag="// 05 _ RECOGNITION"
            title="ACHIEVEMENTS"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {achievements.map((ach, i) => {
              const Icon = getIconComponent(ach.iconName);
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, ease, delay: i * 0.15 }}
                  whileHover={{ y: -8 }}
                  className="chamfer-lg text-center relative overflow-hidden"
                  style={{
                    background: 'var(--bg-card)',
                    border: `1px solid var(--border-default)`,
                    padding: '2.5rem 2rem',
                    transition: 'border-color 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = ach.color;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)';
                  }}
                  data-cursor-hover
                >
                  {/* Flash effect */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: [0, 0.05, 0] }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.15 + 0.3 }}
                    style={{ background: '#ffffff' }}
                  />

                  <Icon
                    size={40}
                    className="mx-auto mb-4"
                    style={{ color: ach.color }}
                  />

                  <div
                    className="mb-3"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      fontSize: '2.5rem',
                      color: ach.color,
                      lineHeight: 1,
                    }}
                  >
                    {ach.rank}
                  </div>

                  <h3
                    className="mb-1"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      fontSize: '1rem',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {ach.title}
                  </h3>

                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {ach.subtitle}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Certifications ─── */}
      <section
        className="section-padding relative overflow-hidden"
        style={{ background: 'var(--bg-surface)' }}
      >
        <div className="max-w-[1400px] mx-auto relative z-10">
          <SectionHeader
            tag="// 06 _ CREDENTIALS"
            title="CERTIFICATIONS"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {certifications.map((cert, i) => (
              <motion.div
                key={cert.id || i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="chamfer-md relative flex gap-4"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-default)',
                  padding: '1.5rem',
                  transition: 'border-color 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-medium)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)';
                }}
                data-cursor-hover
              >
                {/* Left accent strip */}
                <div
                  className="shrink-0 w-[3px] self-stretch"
                  style={{ background: 'var(--accent-primary)' }}
                />

                <div>
                  <h3
                    className="mb-1"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      color: 'var(--text-primary)',
                      lineHeight: 1.4,
                    }}
                  >
                    {cert.title}
                  </h3>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      color: 'var(--accent-primary)',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {cert.issuer}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Education ─── */}
      <section
        className="section-padding relative overflow-hidden"
        style={{ background: 'var(--bg-deep)' }}
      >
        <div className="max-w-[1400px] mx-auto relative z-10">
          <SectionHeader
            tag="// 07 _ EDUCATION"
            title="ACADEMIC\nBACKGROUND"
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease }}
            className="chamfer-xl relative max-w-[700px] flex gap-6"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-default)',
              padding: 'clamp(1.5rem, 3vw, 2.5rem)',
            }}
          >
            {/* Animated progress line on left */}
            <div className="relative shrink-0 w-[3px]">
              <div
                className="absolute top-0 left-0 w-full bg-[var(--border-default)]"
                style={{ height: '100%' }}
              />
              <motion.div
                className="absolute top-0 left-0 w-full"
                style={{ background: 'var(--accent-primary)' }}
                initial={{ height: '0%' }}
                whileInView={{ height: '75%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease, delay: 0.3 }}
              />
            </div>

            <div>
              <h3
                className="mb-2"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: 'clamp(1.2rem, 2vw, 1.4rem)',
                  color: 'var(--text-primary)',
                  lineHeight: 1.2,
                }}
              >
                Vignan Institute of Technology and Science
              </h3>

              <div
                className="mb-2"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                }}
              >
                B.Tech in Computer Science &amp; Engineering (Data Science)
              </div>

              <div
                className="flex flex-wrap gap-x-4 gap-y-1"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.08em',
                }}
              >
                <span>2022 – Expected 2026</span>
                <span>CGPA: 7.2</span>
                <span>Hyderabad, Telangana</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
