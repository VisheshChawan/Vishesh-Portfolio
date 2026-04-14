'use client';

import { useAdminStore } from '@/store/adminStore';
import { Download, Upload, ShieldAlert, FileJson } from 'lucide-react';
import { useRef } from 'react';

export default function AdvancedTab() {
  const advanced = useAdminStore(state => state.config.advanced) || { seoTitle: '', seoDescription: '' };
  const updateContent = useAdminStore(state => state.updateContent);
  const resetConfig = useAdminStore(state => state.resetConfig);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const dataStr = localStorage.getItem('vc_portfolio_config');
    if (!dataStr) return;
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vc-portfolio-config-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (parsed.version && parsed.personal && parsed.theme) {
          // Valid looking config
          localStorage.setItem('vc_portfolio_config', text);
          window.location.reload(); // Reload to hydrate zustand with new localstorage
        } else {
          alert('Invalid configuration file structure.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 pb-12 text-[#c4cad6]">
      {/* ─── SEO configurations ─── */}
      <section className="space-y-4">
        <h3 className="text-[0.7rem] uppercase tracking-[0.2em] font-bold text-[var(--accent-primary)] mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-[var(--accent-primary)]" />
          SEO & Meta Overrides
        </h3>

        <div className="bg-black/20 p-4 border border-white/5 space-y-4">
          <div className="space-y-2">
            <label className="text-[0.65rem] uppercase tracking-wider text-white/50">Page Title</label>
            <input
              type="text"
              value={advanced.seoTitle}
              onChange={(e) => updateContent('advanced', { ...advanced, seoTitle: e.target.value })}
              className="w-full bg-black/40 border border-white/10 px-3 py-2 text-[0.8rem] text-white focus:border-[var(--accent-primary)] focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[0.65rem] uppercase tracking-wider text-white/50">Meta Description</label>
            <textarea
              value={advanced.seoDescription}
              onChange={(e) => updateContent('advanced', { ...advanced, seoDescription: e.target.value })}
              rows={3}
              className="w-full bg-black/40 border border-white/10 px-3 py-2 text-[0.8rem] text-white focus:border-[var(--accent-primary)] focus:outline-none transition-colors resize-none"
            />
            <div className="text-right text-[0.6rem] text-white/30">{advanced.seoDescription.length} / 160 characters</div>
          </div>
        </div>
      </section>

      {/* ─── Data Management ─── */}
      <section className="space-y-4">
        <h3 className="text-[0.7rem] uppercase tracking-[0.2em] font-bold text-[var(--accent-primary)] mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-[var(--accent-primary)]" />
          Data Backup & Restore
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleExport}
            className="flex flex-col items-center justify-center gap-2 p-6 bg-black/20 border border-white/10 hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/5 transition-all text-center group"
          >
            <Download className="text-white/40 group-hover:text-[var(--accent-primary)] transition-colors" size={24} />
            <div>
              <div className="text-[0.75rem] font-bold text-white mb-1">Export Config</div>
              <div className="text-[0.6rem] text-white/40 uppercase tracking-widest">.json formatted</div>
            </div>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-2 p-6 bg-black/20 border border-white/10 hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/5 transition-all text-center group"
          >
            <Upload className="text-white/40 group-hover:text-[var(--accent-primary)] transition-colors" size={24} />
            <div>
              <div className="text-[0.75rem] font-bold text-white mb-1">Import Config</div>
              <div className="text-[0.6rem] text-white/40 uppercase tracking-widest">Overwrite local</div>
            </div>
          </button>
          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            onChange={handleImport}
            className="hidden"
          />
        </div>
      </section>

      {/* ─── Danger Zone ─── */}
      <section className="space-y-4 pt-4">
        <h3 className="text-[0.7rem] uppercase tracking-[0.2em] font-bold text-red-400 mb-4 flex items-center gap-2">
          <ShieldAlert size={14} />
          Danger Zone
        </h3>

        <div className="bg-red-500/10 p-4 border border-red-500/20 space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-[0.75rem] text-red-50 font-bold">Factory Reset</div>
              <div className="text-[0.65rem] text-red-200/60">Wipe all local customizations.</div>
            </div>
            <button
              onClick={() => {
                if(window.confirm('Are you absolutely sure? This will wipe your config from local storage.')) {
                  resetConfig();
                  window.location.reload();
                }
              }}
              className="px-4 py-2 border border-red-500/40 text-red-400 text-[0.65rem] uppercase tracking-wider hover:bg-red-500 hover:text-white transition-colors"
            >
              Reset Data
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
