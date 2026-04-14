import { create } from 'zustand';
import { persist, StateStorage, createJSONStorage } from 'zustand/middleware';
import { get, set, del } from 'idb-keyval';

// IndexedDB storage adapter for handling large base64 strings securely without quota limits
const idbStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    if (typeof window === 'undefined') return null;
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    if (typeof window === 'undefined') return;
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    if (typeof window === 'undefined') return;
    await del(name);
  },
};

export interface ResumeData {
  fileName: string;
  fileSize: number; // in bytes
  fileType: string; // 'application/pdf' | 'text/plain' | etc
  uploadDate: string; // ISO String
  base64Data: string; // the data URI
  textContent?: string; // used if TXT editable
}

interface ResumeStore {
  resume: ResumeData | null;
  setResume: (resume: ResumeData) => void;
  deleteResume: () => void;
  updateTextContent: (text: string) => void;
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      resume: null,
      setResume: (resume) => set({ resume }),
      deleteResume: () => set({ resume: null }),
      updateTextContent: (text) =>
        set((state) => ({
          resume: state.resume ? { ...state.resume, textContent: text } : null,
        })),
    }),
    {
      name: 'vc_portfolio_resume',
      storage: createJSONStorage(() => idbStorage),
    }
  )
);
