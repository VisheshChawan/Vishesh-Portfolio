'use client';

import { useEffect, useState } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { useAdminAuth } from '@/hooks/useAdminAuth';

/**
 * ConfigProvider fetches the remote config from Vercel Blob on mount.
 * - For visitors: hydrates the store with the admin's saved config
 * - For admin: skips remote fetch (admin uses local state + saves to remote)
 */
export default function ConfigProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAdminAuth();
  const updateContent = useAdminStore((s) => s.updateContent);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Only fetch remote config for non-admin visitors
    if (isAuthenticated) {
      setLoaded(true);
      return;
    }

    const fetchRemoteConfig = async () => {
      try {
        const res = await fetch('/api/config');
        const json = await res.json();

        if (json.data) {
          // Hydrate each section of the store with remote data
          const config = json.data;
          if (config.personal) updateContent('personal', config.personal);
          if (config.hero) updateContent('hero', config.hero);
          if (config.projects) updateContent('projects', config.projects);
          if (config.experience) updateContent('experience', config.experience);
          if (config.skills) updateContent('skills', config.skills);
          if (config.achievements) updateContent('achievements', config.achievements);
          if (config.certifications) updateContent('certifications', config.certifications);
          if (config.theme) updateContent('theme', config.theme);
          if (config.animations) updateContent('animations', config.animations);
          if (config.sections) updateContent('sections', config.sections);
          if (config.advanced) updateContent('advanced', config.advanced);
          if (config.avatarUrl) updateContent('avatarUrl', config.avatarUrl);
          if (config.resumeUrl) updateContent('resumeUrl', config.resumeUrl);
          if (config.resumeFileName) updateContent('resumeFileName', config.resumeFileName);
        }
      } catch (err) {
        // Silently fall back to default config if API is unavailable
        console.log('Remote config unavailable, using defaults.');
      } finally {
        setLoaded(true);
      }
    };

    fetchRemoteConfig();
  }, [isAuthenticated, updateContent]);

  // Show nothing until config is loaded to prevent flash of default content
  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-void)' }}>
        <div className="text-[var(--accent-primary)] text-[0.7rem] uppercase tracking-widest font-mono animate-pulse">
          Loading Neural Interface...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
