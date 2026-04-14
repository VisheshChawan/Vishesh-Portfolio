'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAdminStore } from '@/store/adminStore';
import ThemeTab from './tabs/ThemeTab';
import ContentTab from './tabs/ContentTab';
import AnimationsTab from './tabs/AnimationsTab';
import SectionsTab from './tabs/SectionsTab';
import AdvancedTab from './tabs/AdvancedTab';
import ResumePanel from './tabs/ResumePanel';
import ProfileImagePanel from './tabs/ProfileImagePanel';
import AvatarSettingsPanel from './tabs/AvatarSettingsPanel';

export default function AdminPanel() {
  const { logout } = useAdminAuth();
  const resetConfig = useAdminStore(state => state.resetConfig);
  const [activeTab, setActiveTab] = useState<'CONTENT' | 'THEME' | 'ANIMATIONS' | 'SECTIONS' | 'DOCUMENTS' | 'PROFILE' | 'AVATAR' | 'ADVANCED'>('THEME');

  // Type assertion or standard access for Zundo temporal store
  const undo = (useAdminStore as any).temporal?.getState()?.undo;
  const redo = (useAdminStore as any).temporal?.getState()?.redo;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault();
          if (e.shiftKey) {
            redo?.();
          } else {
            undo?.();
          }
        } else if (e.key === 'y') {
          e.preventDefault();
          redo?.();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const tabs = ['CONTENT', 'THEME', 'ANIMATIONS', 'SECTIONS', 'DOCUMENTS', 'PROFILE', 'AVATAR', 'ADVANCED'] as const;

  const handleSaveAll = async () => {
    setSaving(true);
    setSaveStatus('idle');
    try {
      const config = useAdminStore.getState().config;
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const json = await res.json();
      if (json.success) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    } catch (err) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setSaving(false);
    }
  };

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

  return (
    <motion.div
      className="fixed inset-y-0 right-0 w-full sm:w-[420px] z-[99997] flex flex-col font-mono text-[0.8rem]"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      style={{
        background: 'rgba(4, 4, 18, 0.97)',
        backdropFilter: 'blur(24px)',
        borderLeft: '1px solid var(--accent-primary)',
        boxShadow: '-4px 0 30px rgba(0,255,200,0.15)',
        color: '#c4cad6'
      }}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold text-[var(--accent-primary)] tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
            ⚡ PORTFOLIO CONTROL CENTER
          </h2>
          <button 
            onClick={logout}
            className="w-6 h-6 flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 transition-colors"
          >
            ×
          </button>
        </div>
        
        <div className="text-[0.65rem] text-white/50 mb-4">Vishesh Chawan · Admin Mode</div>
        
        <div className="flex gap-2 text-[0.7rem] uppercase">
          <button 
            onClick={handleSaveAll}
            disabled={saving}
            className={`flex-1 py-1.5 font-bold active:scale-95 transition-all ${
              saveStatus === 'success' 
                ? 'bg-green-500 text-white' 
                : saveStatus === 'error'
                ? 'bg-red-500 text-white'
                : 'bg-[var(--accent-primary)] text-[#010108] hover:brightness-110'
            } ${saving ? 'opacity-70 cursor-wait' : ''}`}
          >
            {saving ? '⏳ SAVING...' : saveStatus === 'success' ? '✓ SAVED!' : saveStatus === 'error' ? '✗ FAILED' : '💾 SAVE ALL'}
          </button>
          <button 
            onClick={() => { if(confirm('Reset all settings to defaults?')) resetConfig(); }}
            className="px-3 py-1.5 border border-white/20 hover:bg-white/5 active:scale-95 transition-all"
          >
            RESET
          </button>
          <button onClick={handleExport} className="px-3 py-1.5 border border-white/20 hover:bg-white/5 active:scale-95 transition-all">
            EXPORT
          </button>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex overflow-x-auto shrink-0 border-b border-white/10 scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-[0.65rem] tracking-[0.15em] shrink-0 border-b-2 transition-colors ${
              activeTab === tab 
                ? 'border-[var(--accent-primary)] text-[var(--accent-primary)] bg-[var(--accent-primary)]/5' 
                : 'border-transparent text-white/40 hover:text-white/80'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content Area */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="min-h-full"
          >
            {activeTab === 'THEME' && <ThemeTab />}
            {activeTab === 'CONTENT' && <ContentTab />}
            {activeTab === 'ANIMATIONS' && <AnimationsTab />}
            {activeTab === 'SECTIONS' && <SectionsTab />}
            {activeTab === 'DOCUMENTS' && <ResumePanel />}
            {activeTab === 'PROFILE' && <ProfileImagePanel />}
            {activeTab === 'AVATAR' && <AvatarSettingsPanel />}
            {activeTab === 'ADVANCED' && <AdvancedTab />}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Scrollbar styles specific to admin */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </motion.div>
  );
}
