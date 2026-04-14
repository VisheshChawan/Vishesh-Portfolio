'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';

import { Project as ConfigProject } from '@/lib/configTypes';

import { useAdminStore } from '@/store/adminStore';

const ease = [0.16, 1, 0.3, 1] as const;

export default function Projects() {
  const projects = useAdminStore(state => state.config.projects);

  return (
    <section
      className="section-padding relative overflow-hidden"
      style={{ background: 'var(--bg-surface)' }}
      data-section="projects"
      id="projects"
    >
      <div className="max-w-[1400px] mx-auto relative z-10">
        <SectionHeader
          tag="// 04 _ BUILT_&_DEPLOYED"
          title="PROJECTS"
        />

        {/* Project Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Featured project — spans full width on first row */}
          {projects.length > 0 && (
            <div className="lg:col-span-2">
              <ProjectCard project={projects[0]} index={0} />
            </div>
          )}

          {/* Two smaller cards */}
          {projects.slice(1).map((project, idx) => (
            <ProjectCard key={project.id} project={project} index={idx + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Duplicate removed

function ProjectCard({ project, index }: { project: ConfigProject, index: number }) {
  const isFeatured = index === 0;
  const projectNumber = (index + 1).toString().padStart(2, '0');
  const [hovered, setHovered] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hovered) {
      setProgressWidth(100);
    } else {
      setProgressWidth(0);
    }
  }, [hovered]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease }}
      whileHover={{ y: -10 }}
      className="chamfer-lg relative group"
      style={{
        background: 'var(--bg-card)',
        border: `1px solid ${hovered ? 'var(--border-strong)' : 'var(--border-default)'}`,
        padding: isFeatured ? 'clamp(1.5rem, 3vw, 3rem)' : '2rem',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        boxShadow: hovered ? 'inset 0 0 60px rgba(0,255,200,0.04)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor-hover
    >
      {/* Hover progress bar */}
      <div
        className="absolute top-0 left-0 h-[2px] transition-all duration-[800ms] ease-out"
        style={{
          width: `${progressWidth}%`,
          background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))',
        }}
      />

      {/* Project number watermark */}
      <div
        className="absolute top-4 right-6 pointer-events-none select-none transition-opacity duration-300"
        style={{
          fontFamily: 'var(--font-accent)',
          fontSize: isFeatured ? '6rem' : '5rem',
          lineHeight: 1,
          color: 'var(--text-primary)',
          opacity: hovered ? 0.1 : 0.06,
        }}
      >
        {projectNumber}
      </div>

      {/* Header */}
      <div className="mb-1 flex items-center gap-4">
        <span
          style={{
            fontFamily: 'var(--font-accent)',
            fontSize: '1rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.05em',
          }}
        >
          {projectNumber}
        </span>
        <span style={{ flex: 1, height: '1px', background: 'var(--border-default)' }} />
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          {isFeatured ? 'FEATURED PROJECT' : 'PROJECT'}
        </span>
      </div>

      {/* Title */}
      <h3
        className="mt-4 mb-1"
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: isFeatured ? 800 : 700,
          fontSize: isFeatured ? 'clamp(1.5rem, 2.5vw, 2rem)' : 'clamp(1.3rem, 2vw, 1.6rem)',
          color: 'var(--text-primary)',
          lineHeight: 1.1,
        }}
      >
        {project.name}
      </h3>

      {/* Subtitle */}
      <div
        className="mb-4"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          color: 'var(--accent-primary)',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
        }}
      >
        {project.subtitle}
      </div>

      {/* Description */}
      <p
        className="mb-6"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.82rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.9,
          maxWidth: isFeatured ? '700px' : '100%',
        }}
      >
        {project.description}
      </p>

      {/* Metrics */}
      <div className={`grid gap-3 mb-6 ${isFeatured ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2'}`}>
        {project.metrics.map((metric, i) => (
          <MetricBox key={i} value={metric.value} label={metric.label} />
        ))}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {project.techStack.map(tag => (
          <span key={tag} className="tag-pill">{tag}</span>
        ))}
      </div>

      {/* CTA */}
      <a
        href={project.liveUrl || project.githubUrl || "#"}
        className="inline-flex items-center gap-2 group/link transition-all duration-300"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          color: 'var(--accent-primary)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}
        data-cursor-hover
      >
        {isFeatured ? 'VIEW PROJECT' : 'VIEW'}
        <ArrowRight
          size={14}
          className="transition-transform duration-300 group-hover/link:translate-x-1"
        />
      </a>
    </motion.div>
  );
}

function MetricBox({ value, label }: { value: string; label: string }) {
  return (
    <div
      className="chamfer-sm p-3"
      style={{
        border: '1px solid var(--border-default)',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 'clamp(1rem, 1.5vw, 1.3rem)',
          color: 'var(--accent-primary)',
          lineHeight: 1.2,
        }}
      >
        {value}
      </div>
      <div
        className="mt-0.5"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}
      >
        {label}
      </div>
    </div>
  );
}
