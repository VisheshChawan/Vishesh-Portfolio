'use client';

import { motion } from 'framer-motion';
import SectionHeader from '@/components/SectionHeader';
import { useAdminStore } from '@/store/adminStore';

const ease = [0.16, 1, 0.3, 1] as const;

export default function Experience() {
  const experience = useAdminStore(state => state.config.experience);

  return (
    <section
      className="section-padding relative overflow-hidden"
      style={{ background: 'var(--bg-deep)' }}
      data-section="experience"
      id="experience"
    >
      <div className="max-w-[1400px] mx-auto relative z-10">
        <SectionHeader
          tag="// 03 _ WORK_HISTORY"
          title="EXPERIENCE"
        />

        <div className="space-y-8">
          {experience.map((exp, i) => (
            <motion.div
              key={exp.id || i}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease, delay: i * 0.15 }}
              className="chamfer-xl relative max-w-[900px]"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                padding: 'clamp(1.5rem, 3vw, 3rem)',
                transition: 'border-color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-medium)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)';
              }}
            >
              {/* Top gradient line */}
              <motion.div
                className="absolute top-0 left-0 right-0"
                style={{
                  height: '2px',
                  background: 'linear-gradient(90deg, #00ffc8, #6d28d9)',
                }}
                initial={{ scaleX: 0, transformOrigin: 'left' }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease, delay: 0.3 }}
              />

              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      fontSize: 'clamp(1.2rem, 2vw, 1.6rem)',
                      color: 'var(--text-primary)',
                      lineHeight: 1.2,
                    }}
                  >
                    {exp.role}
                  </h3>
                  <div
                    className="mt-1"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: 'var(--accent-primary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                    }}
                  >
                    {exp.company}
                  </div>
                </div>
                <div
                  className="shrink-0"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.1em',
                  }}
                >
                  {exp.dateRange}
                </div>
              </div>

              {/* Divider */}
              <div className="my-4" style={{ height: '1px', background: 'var(--border-default)' }} />

              {/* Bullets */}
              <div className="space-y-2.5 mb-6">
                {exp.bullets.map((bullet, j) => (
                  <motion.div
                    key={j}
                    className="flex gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + j * 0.08, duration: 0.5, ease }}
                  >
                    <span style={{ color: 'var(--accent-primary)', flexShrink: 0, fontFamily: 'var(--font-mono)' }}>→</span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.83rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.8,
                      }}
                    >
                      {bullet}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {exp.techStack.map((tag) => (
                  <span key={tag} className="tag-pill">{tag}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
