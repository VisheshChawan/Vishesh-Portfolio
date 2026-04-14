'use client';

import { useAdminStore } from '@/store/adminStore';

export default function AnimationsTab() {
  const anims = useAdminStore(state => state.config.animations);
  const updateAnimations = useAdminStore(state => state.updateAnimations);

  const SectionTitle = ({ title }: { title: string }) => (
    <h3 className="text-[0.6rem] uppercase tracking-widest text-[#5a6175] mb-3 mt-6 first:mt-0">{title}</h3>
  );

  return (
    <div className="space-y-6 pb-8">
      
      <div className="flex items-center justify-between p-3 border border-white/10 bg-[#08081e]">
        <div>
          <div className="text-[0.7rem] uppercase tracking-wider font-bold text-[var(--accent-primary)] mb-1">Master Switch</div>
          <div className="text-[0.6rem] text-white/50">Disabling removes all animations</div>
        </div>
        <div 
          onClick={() => updateAnimations({ masterEnabled: !anims.masterEnabled })}
          className={`toggle ${anims.masterEnabled ? 'on' : ''}`}
        />
      </div>

      <div className="space-y-4">
        <SectionTitle title="Boot Sequence" />
        
        <div className="flex items-center justify-between">
          <span className="text-[0.7rem] uppercase tracking-wider">Enable Boot Sequence</span>
          <div 
            onClick={() => updateAnimations({ bootEnabled: !anims.bootEnabled })}
            className={`toggle ${anims.bootEnabled ? 'on' : ''}`}
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-[0.65rem] uppercase text-white/50">Boot Duration</label>
            <span className="text-[0.65rem] text-[var(--accent-primary)]">{anims.bootDuration}ms</span>
          </div>
          <input 
            type="range" min="500" max="6000" step="100" 
            value={anims.bootDuration}
            onChange={e => updateAnimations({ bootDuration: parseInt(e.target.value) })}
            className="w-full h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[var(--accent-primary)] [&::-webkit-slider-thumb]:rounded-full"
            disabled={!anims.bootEnabled}
          />
        </div>
      </div>

      <div className="space-y-4">
        <SectionTitle title="Particle System" />
        
        <div className="flex items-center justify-between">
          <span className="text-[0.7rem] uppercase tracking-wider">Enable Particles</span>
          <div 
            onClick={() => updateAnimations({ particles: { ...anims.particles, enabled: !anims.particles.enabled }})}
            className={`toggle ${anims.particles.enabled ? 'on' : ''}`}
          />
        </div>

        <div>
           <div className="flex justify-between mb-2">
            <label className="text-[0.65rem] uppercase text-white/50">Particle Count</label>
            <span className="text-[0.65rem] text-[var(--accent-primary)]">{anims.particles.count}</span>
          </div>
          <input 
            type="range" min="0" max="300" step="10" 
            value={anims.particles.count}
            onChange={e => updateAnimations({ particles: { ...anims.particles, count: parseInt(e.target.value) }})}
            className="w-full h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[var(--accent-primary)] [&::-webkit-slider-thumb]:rounded-full"
          />
        </div>
      </div>

      <div className="space-y-4">
        <SectionTitle title="Custom Cursor" />
        <div className="grid grid-cols-5 gap-1 mb-2">
          {['circle', 'cross', 'diamond', 'arrow', 'system'].map(style => (
            <button
              key={style}
              onClick={() => updateAnimations({ cursor: { ...anims.cursor, style: style as any }})}
              className={`p-2 text-[0.6rem] border ${anims.cursor.style === style ? 'border-[var(--accent-primary)] text-[var(--accent-primary)] bg-white/5' : 'border-white/10 text-white/40 hover:text-white hover:border-white/30'} flex flex-col items-center gap-1`}
            >
              {style === 'circle' && '●'}
              {style === 'cross' && '✛'}
              {style === 'diamond' && '◈'}
              {style === 'arrow' && '▸'}
              {style === 'system' && 'A'}
              <span className="uppercase text-[0.5rem] mt-1">{style.substr(0,3)}</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
