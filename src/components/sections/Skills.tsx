'use client';

import { motion } from 'framer-motion';
import SectionHeader from '@/components/SectionHeader';
import { useAdminStore } from '@/store/adminStore';

const ease = [0.16, 1, 0.3, 1] as const;

export default function Skills() {
  const skills = useAdminStore(state => state.config.skills);

  return (
    <section
      className="section-padding relative overflow-hidden"
      style={{ background: 'var(--bg-surface)' }}
      data-section="skills"
      id="skills"
    >
      {/* Watermark */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
        style={{
          fontFamily: 'var(--font-accent)',
          fontSize: '15vw',
          color: 'var(--text-primary)',
          opacity: 0.02,
          whiteSpace: 'nowrap',
        }}
      >
        SKILLS
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <SectionHeader
          tag="// 02 _ TECHNICAL_ARSENAL"
          title="SKILLS &\nTECHNOLOGIES"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(skills).map(([title, skillList], catIdx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease, delay: catIdx * 0.1 }}
              whileHover={{ y: -8 }}
              className="chamfer-lg relative group"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                padding: '2rem',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'var(--glow-primary)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
              data-cursor-hover
            >
              {/* Top-left corner accent */}
              <div
                className="absolute top-0 left-0 w-[2px] h-[40px]"
                style={{ background: 'var(--accent-primary)' }}
              />

              {/* Category title */}
              <h3
                className="mb-5"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--accent-primary)',
                }}
              >
                {title}
              </h3>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {skillList.map((skill, skillIdx) => (
                  <motion.span
                    key={skill}
                    className="tag-pill"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: catIdx * 0.1 + skillIdx * 0.03, duration: 0.3 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
