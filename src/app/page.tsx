'use client';

import dynamic from 'next/dynamic';

// Dynamic imports for client components to enable code-splitting
const BootSequence = dynamic(() => import('@/components/BootSequence'), { ssr: false });
const CanvasParticles = dynamic(() => import('@/components/CanvasParticles'), { ssr: false });
const CustomCursor = dynamic(() => import('@/components/CustomCursor'), { ssr: false });
const EasterEggs = dynamic(() => import('@/components/EasterEggs'), { ssr: false });
const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });

// Sections
import Hero from '@/components/sections/Hero';
import AboutTerminal from '@/components/sections/AboutTerminal';
import Skills from '@/components/sections/Skills';
import Experience from '@/components/sections/Experience';
import Projects from '@/components/sections/Projects';
import Recognition from '@/components/sections/Recognition';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/sections/Footer';
import { useAdminStore } from '@/store/adminStore';

const sectionComponentsMap: Record<string, React.FC> = {
  hero: Hero,
  about: AboutTerminal,
  skills: Skills,
  experience: Experience,
  projects: Projects,
  recognition: Recognition,
  contact: Contact,
};

export default function Home() {
  const sectionsConfig = useAdminStore(state => state.config.sections);
  const orderedSections = [...sectionsConfig].sort((a, b) => a.order - b.order);

  return (
    <>
      {/* Global overlays */}
      <BootSequence />
      <CanvasParticles />
      <CustomCursor />
      <EasterEggs />
      <div className="scanlines" />
      <div className="noise-overlay" />

      {/* Skip to content for accessibility */}
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[99999] focus:px-4 focus:py-2 focus:text-sm"
        style={{
          background: 'var(--accent-primary)',
          color: '#010108',
          fontFamily: 'var(--font-mono)',
        }}
      >
        Skip to content
      </a>

      {/* Navigation */}
      <Navbar />

      {/* Page content */}
      <main className="flex-1 relative z-[1]">
        {orderedSections.map((sec) => {
          if (!sec.visible) return null;
          const SectionComponent = sectionComponentsMap[sec.type];
          if (!SectionComponent) return null;
          
          return (
            <div key={sec.id}>
              {sec.content && sec.content.trim() !== '' && (
                <section className="pt-24 pb-8 max-w-[1400px] mx-auto px-6 relative z-10">
                  <div 
                    className="p-8 border border-white/10 bg-black/40 backdrop-blur-md chamfer-md"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    <div className="text-[var(--accent-primary)] text-[0.65rem] uppercase tracking-widest mb-4">
                      {`// INJECTED_BLOCK: ${sec.id.toUpperCase()}`}
                    </div>
                    <div className="text-[#c4cad6] text-[0.85rem] leading-[1.8] whitespace-pre-wrap">
                      {sec.content}
                    </div>
                  </div>
                </section>
              )}
              <SectionComponent />
            </div>
          );
        })}
      </main>

      <Footer />
    </>
  );
}
