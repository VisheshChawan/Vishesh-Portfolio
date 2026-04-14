'use client';

import { useAdminStore } from '@/store/adminStore';

const THEMES = [
  {
    name: 'Neural Noir',
    colors: {
      accentPrimary: '#00ffc8',
      accentSecondary: '#6d28d9',
      accentTertiary: '#f0abfc',
      bgVoid: '#010108',
      bgDeep: '#02020f',
      bgSurface: '#06061a',
      bgCard: '#0a0a20',
    }
  },
  {
    name: 'Plasma Violet',
    colors: {
      accentPrimary: '#a855f7',
      accentSecondary: '#ec4899',
      accentTertiary: '#06b6d4',
      bgVoid: '#050010',
      bgDeep: '#0a0020',
      bgSurface: '#120030',
      bgCard: '#1a0040',
    }
  },
  {
    name: 'Ember Forge',
    colors: {
      accentPrimary: '#f97316',
      accentSecondary: '#ef4444',
      accentTertiary: '#fbbf24',
      bgVoid: '#0c0500',
      bgDeep: '#150800',
      bgSurface: '#1f0d00',
      bgCard: '#2a1200',
    }
  },
  {
    name: 'Arctic Blue',
    colors: {
      accentPrimary: '#38bdf8',
      accentSecondary: '#0ea5e9',
      accentTertiary: '#e0f2fe',
      bgVoid: '#00080f',
      bgDeep: '#000d1a',
      bgSurface: '#001a33',
      bgCard: '#00264d',
    }
  },
  {
    name: 'Royal Gold',
    colors: {
      accentPrimary: '#fbbf24',
      accentSecondary: '#d97706',
      accentTertiary: '#fde68a',
      bgVoid: '#080600',
      bgDeep: '#100e00',
      bgSurface: '#1c1800',
      bgCard: '#262100',
    }
  }
];

const FONTS_DISPLAY = ['Syne', 'Oswald', 'Bebas Neue', 'Playfair Display', 'Orbitron', 'Rajdhani', 'Exo 2', 'Space Grotesk'];
const FONTS_MONO = ['JetBrains Mono', 'Fira Code', 'IBM Plex Mono', 'Source Code Pro', 'Space Mono', 'Inconsolata'];

export default function ThemeTab() {
  const theme = useAdminStore(state => state.config.theme);
  const updateTheme = useAdminStore(state => state.updateTheme);

  const applyPreset = (preset: typeof THEMES[0]) => {
    updateTheme({ presetName: preset.name, ...preset.colors });
  };

  return (
    <div className="space-y-8 pb-8">
      
      {/* PRESETS */}
      <section>
        <h3 className="text-[0.6rem] uppercase tracking-widest text-[#5a6175] mb-3">Pre-Configured Themes</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {THEMES.map(preset => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className={`flex flex-col items-center p-2 border transition-all ${
                theme.presetName === preset.name ? 'border-[var(--accent-primary)] bg-white/5' : 'border-white/10 hover:border-white/30'
              }`}
            >
              <div className="w-full h-8 mb-2 flex">
                <div className="flex-1" style={{ background: preset.colors.accentPrimary }} />
                <div className="flex-1" style={{ background: preset.colors.accentSecondary }} />
              </div>
              <span className="text-[0.65rem]">{preset.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* COLOR PICKERS */}
      <section>
        <h3 className="text-[0.6rem] uppercase tracking-widest text-[#5a6175] mb-3">Custom Colors</h3>
        <div className="space-y-3">
          {[
            { label: 'Primary Accent', key: 'accentPrimary' },
            { label: 'Secondary Accent', key: 'accentSecondary' },
            { label: 'Tertiary Accent', key: 'accentTertiary' },
            { label: 'Background Void', key: 'bgVoid' },
            { label: 'Background Deep', key: 'bgDeep' },
            { label: 'Background Surface', key: 'bgSurface' },
            { label: 'Background Card', key: 'bgCard' },
            { label: 'Text Primary', key: 'textPrimary' },
            { label: 'Text Secondary', key: 'textSecondary' },
          ].map(({ label, key }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-[0.7rem] uppercase tracking-wider">{label}</span>
              <div className="flex items-center gap-2">
                <span className="text-[0.6rem] text-white/40 font-mono">{(theme as any)[key]}</span>
                <input
                  type="color"
                  value={(theme as any)[key]}
                  onChange={e => updateTheme({ [key]: e.target.value })}
                  className="w-8 h-6 p-0 border border-white/20 cursor-pointer bg-transparent"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TYPOGRAPHY */}
      <section>
        <h3 className="text-[0.6rem] uppercase tracking-widest text-[#5a6175] mb-3">Typography</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-[0.7rem] uppercase tracking-wider mb-2">Display Font</label>
            <select 
              value={theme.displayFont}
              onChange={e => updateTheme({ displayFont: e.target.value })}
              className="w-full bg-[#08081e] border border-white/10 text-[0.75rem] p-2 focus:border-[var(--accent-primary)] focus:outline-none"
            >
              {FONTS_DISPLAY.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[0.7rem] uppercase tracking-wider mb-2">Monospace Font</label>
            <select 
              value={theme.monoFont}
              onChange={e => updateTheme({ monoFont: e.target.value })}
              className="w-full bg-[#08081e] border border-white/10 text-[0.75rem] p-2 focus:border-[var(--accent-primary)] focus:outline-none"
            >
              {FONTS_MONO.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* GEOMETRY & EFFECTS */}
      <section>
        <h3 className="text-[0.6rem] uppercase tracking-widest text-[#5a6175] mb-3">Geometry & Effects</h3>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-[0.7rem] uppercase tracking-wider">Chamfer Size (Radius)</label>
              <span className="text-[0.65rem] text-[var(--accent-primary)]">{theme.chamferSize}px</span>
            </div>
            <input 
              type="range" min="0" max="32" step="1" 
              value={theme.chamferSize}
              onChange={e => updateTheme({ chamferSize: parseInt(e.target.value) })}
              className="w-full h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[var(--accent-primary)] [&::-webkit-slider-thumb]:rounded-full"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-[0.7rem] uppercase tracking-wider">Glow Intensity</label>
              <span className="text-[0.65rem] text-[var(--accent-primary)]">{theme.glowIntensity.toFixed(2)}</span>
            </div>
            <input 
              type="range" min="0" max="1" step="0.05" 
              value={theme.glowIntensity}
              onChange={e => updateTheme({ glowIntensity: parseFloat(e.target.value) })}
              className="w-full h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[var(--accent-primary)] [&::-webkit-slider-thumb]:rounded-full"
            />
          </div>
        </div>
      </section>

    </div>
  );
}
