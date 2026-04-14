'use client';

import { useEffect, useState } from 'react';
import { useAdminStore } from '@/store/adminStore';

export default function ThemeSyncer() {
  const theme = useAdminStore((state) => state.config.theme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    // Apply Colors
    root.style.setProperty('--accent-primary', theme.accentPrimary);
    root.style.setProperty('--accent-secondary', theme.accentSecondary);
    root.style.setProperty('--accent-tertiary', theme.accentTertiary);
    root.style.setProperty('--bg-void', theme.bgVoid);
    root.style.setProperty('--bg-deep', theme.bgDeep);
    root.style.setProperty('--bg-surface', theme.bgSurface);
    root.style.setProperty('--bg-card', theme.bgCard);
    root.style.setProperty('--text-primary', theme.textPrimary);
    root.style.setProperty('--text-secondary', theme.textSecondary);

    // Geometry + Glows
    root.style.setProperty('--chamfer-base', `${theme.chamferSize}px`);
    root.style.setProperty(
      '--glow-primary',
      `0 0 20px rgba(0,255,200,${theme.glowIntensity * 0.5}), 0 0 60px rgba(0,255,200,${theme.glowIntensity * 0.2})`
    );
    root.style.setProperty(
      '--glow-strong',
      `0 0 40px rgba(0,255,200,${theme.glowIntensity}), 0 0 80px rgba(0,255,200,${theme.glowIntensity * 0.4})`
    );

    // Apply Fonts (just setting the variables, the @import is handled by the dynamic style tag below)
    const formatFont = (name: string) => (name.includes(' ') ? `'${name}', sans-serif` : `${name}, sans-serif`);
    const formatMono = (name: string) => (name.includes(' ') ? `'${name}', monospace` : `${name}, monospace`);

    root.style.setProperty('--font-display', formatFont(theme.displayFont));
    root.style.setProperty('--font-accent', formatFont(theme.accentFont));
    root.style.setProperty('--font-mono', formatMono(theme.monoFont));
  }, [theme, mounted]);

  if (!mounted) return null;

  // Build the Google Fonts URL dynamically
  const fontFamilies = [theme.displayFont, theme.monoFont, theme.accentFont]
    .map((name) => name.replace(/ /g, '+'))
    .join('&family=');

  const fontUrl = `https://fonts.googleapis.com/css2?family=${fontFamilies}&display=swap`;

  return (
    <>
      <link rel="stylesheet" href={fontUrl} />
      <style>{`
        /* Dynamic Chamfer Class */
        .chamfer-dynamic {
          clip-path: polygon(
            ${theme.chamferSize}px 0, 
            100% 0, 
            100% calc(100% - ${theme.chamferSize}px), 
            calc(100% - ${theme.chamferSize}px) 100%, 
            0 100%, 
            0 ${theme.chamferSize}px
          );
        }
      `}</style>
    </>
  );
}
