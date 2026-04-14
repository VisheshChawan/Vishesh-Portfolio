'use client';

import { useState } from 'react';
import { useAdminStore } from '@/store/adminStore';

export default function ContentTab() {
  const config = useAdminStore(state => state.config);
  const updateContent = useAdminStore(state => state.updateContent);
  const [expandedSection, setExpandedSection] = useState<string | null>('PERSONAL');

  const Accordion = ({ title, id, children }: { title: string, id: string, children: React.ReactNode }) => {
    const isOpen = expandedSection === id;
    return (
      <div className="border border-white/10 mb-2 bg-[#08081e]">
        <button 
          onClick={() => setExpandedSection(isOpen ? null : id)}
          className="w-full flex items-center justify-between p-3 text-[0.7rem] uppercase tracking-wider hover:bg-white/5"
        >
          <span>{title}</span>
          <span className={`transform transition-transform ${isOpen ? 'rotate-90' : ''}`}>▶</span>
        </button>
        {isOpen && <div className="p-4 border-t border-white/10 space-y-4">{children}</div>}
      </div>
    );
  };

  const updatePersonal = (key: string, val: string) => updateContent('personal', { ...config.personal, [key]: val });
  const updateHero = (key: string, val: any) => updateContent('hero', { ...config.hero, [key]: val });

  return (
    <div className="space-y-2 pb-8">
      
      <Accordion id="PERSONAL" title="Personal Information">
        {Object.entries(config.personal).map(([key, value]) => (
          <div key={key}>
            <label className="block text-[0.65rem] text-white/50 uppercase tracking-widest mb-1">{key}</label>
            <input 
              type="text" 
              value={value as string}
              onChange={e => updatePersonal(key, e.target.value)}
              className="w-full bg-[#030310] border border-white/10 p-2 text-[0.75rem] font-mono text-white focus:border-[var(--accent-primary)] focus:outline-none"
            />
          </div>
        ))}
      </Accordion>

      <Accordion id="HERO" title="Hero Section">
        <div>
          <label className="block text-[0.65rem] text-white/50 uppercase tracking-widest mb-1">Description</label>
          <textarea 
            rows={4}
            value={config.hero.description}
            onChange={e => updateHero('description', e.target.value)}
            className="w-full bg-[#030310] border border-white/10 p-2 text-[0.75rem] font-mono text-white focus:border-[var(--accent-primary)] focus:outline-none resize-y"
          />
        </div>
        
        <div className="mt-4">
          <label className="block text-[0.65rem] text-white/50 uppercase tracking-widest mb-2">Typewriter Roles</label>
          <div className="space-y-2">
            {config.hero.roles.map((role, idx) => (
              <div key={idx} className="flex gap-2">
                <input 
                  type="text" 
                  value={role}
                  onChange={e => {
                    const newRoles = [...config.hero.roles];
                    newRoles[idx] = e.target.value;
                    updateHero('roles', newRoles);
                  }}
                  className="flex-1 bg-[#030310] border border-white/10 p-2 text-[0.75rem]"
                />
                <button 
                  onClick={() => {
                    const newRoles = config.hero.roles.filter((_, i) => i !== idx);
                    updateHero('roles', newRoles);
                  }}
                  className="px-3 border border-red-500/30 text-red-400 hover:bg-red-500/10"
                >×</button>
              </div>
            ))}
            <button 
              onClick={() => updateHero('roles', [...config.hero.roles, 'New Role'])}
              className="text-[0.65rem] text-[var(--accent-primary)] hover:underline"
            >+ ADD ROLE</button>
          </div>
        </div>
      </Accordion>

      <Accordion id="PROJECTS" title="Projects">
        <div className="text-white/40 text-xs text-center py-4">
          Full projects editor (In development for phase 2. Edit in code for now).
        </div>
      </Accordion>

      <Accordion id="SKILLS" title="Skills & Tech">
         <div className="text-white/40 text-xs text-center py-4">
          Tag manager (In development for phase 2. Edit in code for now).
        </div>
      </Accordion>

    </div>
  );
}
