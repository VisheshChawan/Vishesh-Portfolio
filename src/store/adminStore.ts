import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { temporal } from 'zundo';
import { PortfolioConfig } from '../lib/configTypes';
import { defaultConfig } from '../lib/defaultConfig';

interface AdminStore {
  config: PortfolioConfig;
  updateTheme: (updates: Partial<PortfolioConfig['theme']>) => void;
  updateAnimations: (updates: Partial<PortfolioConfig['animations']>) => void;
  updateContent: <K extends keyof PortfolioConfig>(section: K, data: PortfolioConfig[K]) => void;
  resetConfig: () => void;
}

export const useAdminStore = create<AdminStore>()(
  temporal(
    persist(
      (set) => ({
      config: defaultConfig,
      updateTheme: (updates) =>
        set((state) => ({
          config: {
            ...state.config,
            theme: { ...state.config.theme, ...updates },
          },
        })),
      updateAnimations: (updates) =>
        set((state) => ({
          config: {
            ...state.config,
            animations: { ...state.config.animations, ...updates },
          },
        })),
      updateContent: (section, data) =>
        set((state) => ({
          config: { ...state.config, [section]: data },
        })),
      resetConfig: () => set({ config: defaultConfig }),
    }),
    {
      name: 'vc_portfolio_config',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') return localStorage;
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  ),
  { limit: 30 }
)
);
