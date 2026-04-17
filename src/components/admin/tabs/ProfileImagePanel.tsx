'use client';

import { useState, useRef } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { Upload, Trash2, RefreshCw, ImageIcon, CheckCircle2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfileImagePanel() {
  const updateContent = useAdminStore((s) => s.updateContent);
  const avatarUrl = useAdminStore((s) => s.config.avatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [uploadedMeta, setUploadedMeta] = useState<{ fileName: string; fileSize: number; fileType: string } | null>(null);

  const triggerToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const processFile = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      triggerToast('File exceeds 5MB limit.', 'error');
      return;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      triggerToast('Invalid format. Use JPG, PNG, or WEBP.', 'error');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 80) { clearInterval(interval); return prev; }
        return prev + 12;
      });
    }, 100);

    try {
      // Upload to Supabase Storage via API route
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'avatar');
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const json = await res.json();

      clearInterval(interval);

      if (json.success && json.url) {
        setUploadProgress(100);
        // Update the store with the public URL from Supabase
        updateContent('avatarUrl', json.url);
        setUploadedMeta({
          fileName: json.fileName,
          fileSize: json.fileSize,
          fileType: json.fileType,
        });

        // Auto-save the full config to Supabase DB
        setTimeout(async () => {
          try {
            const config = useAdminStore.getState().config;
            await fetch('/api/config', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(config),
            });
          } catch {}
        }, 200);

        setTimeout(() => {
          setUploading(false);
          triggerToast('Avatar uploaded & synced to cloud.', 'success');
        }, 300);
      } else {
        setUploadProgress(0);
        setUploading(false);
        triggerToast(json.error || 'Upload failed.', 'error');
      }
    } catch (err) {
      clearInterval(interval);
      setUploading(false);
      triggerToast('Upload failed. Check connection.', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: 'avatar' }),
      });
    } catch {}
    updateContent('avatarUrl', undefined);
    setUploadedMeta(null);
    setShowDeleteConfirm(false);

    // Auto-save config after delete
    try {
      const config = useAdminStore.getState().config;
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
    } catch {}

    triggerToast('Image removed.', 'success');
  };

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };

  const hasAvatar = !!avatarUrl;

  return (
    <div className="space-y-6 pb-12 text-[#c4cad6] relative">
      <section className="space-y-4">
        <h3 className="text-[0.7rem] uppercase tracking-[0.2em] font-bold text-[var(--accent-primary)] mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-[var(--accent-primary)]" />
          Profile Avatar Module
        </h3>

        {avatarUrl && (
          <div className="text-[0.55rem] text-white/30 font-mono bg-white/5 p-2 border border-white/5 break-all">
            ✓ Synced to cloud: {avatarUrl.substring(0, 60)}...
          </div>
        )}

        {!hasAvatar || uploading ? (
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`relative p-8 flex flex-col items-center justify-center text-center border-2 border-dashed transition-all duration-300 group
              ${isDragging ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 shadow-[0_0_20px_rgba(0,255,200,0.15)]' : 'border-white/10 bg-black/40 hover:border-white/30'}
              ${uploading ? 'pointer-events-none opacity-80' : ''}`}
          >
            {uploading ? (
              <div className="w-full flex flex-col items-center gap-4">
                <div className="w-full h-1 bg-white/10 overflow-hidden relative">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-[var(--accent-primary)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ type: 'tween' }}
                  />
                </div>
                <div className="text-[0.6rem] uppercase tracking-widest text-[var(--accent-primary)] animate-pulse">
                  Uploading to Cloud... {Math.round(uploadProgress)}%
                </div>
              </div>
            ) : (
              <>
                <ImageIcon size={32} className={`mb-4 transition-colors ${isDragging ? 'text-[var(--accent-primary)]' : 'text-white/20 group-hover:text-[var(--accent-primary)]'}`} />
                <div className="text-[0.8rem] font-bold text-white mb-1">DRAG & DROP AVATAR</div>
                <div className="text-[0.6rem] text-white/40 uppercase tracking-widest mb-6">JPG, PNG, WEBP — Max 5MB</div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-2 border border-white/10 text-[0.65rem] uppercase tracking-wider text-white hover:bg-white hover:text-black transition-colors"
                >
                  Browse Files
                </button>
              </>
            )}
            <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" ref={fileInputRef}
              onChange={(e) => { if (e.target.files?.[0]) processFile(e.target.files[0]); }}
            />
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            <div className="flex items-center gap-6 p-4 border border-white/10 bg-black/40">
              <div className="w-24 h-24 shrink-0 overflow-hidden border-2 border-[var(--accent-primary)]/40"
                style={{ borderRadius: '50%', boxShadow: '0 0 20px rgba(0,255,200,0.15), inset 0 0 20px rgba(0,255,200,0.05)' }}>
                <img src={avatarUrl!} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[0.8rem] text-white font-bold truncate">{uploadedMeta?.fileName || 'Profile Image'}</div>
                <div className="text-[0.6rem] text-white/40 font-mono uppercase space-y-1 mt-2">
                  {uploadedMeta && <div>{(uploadedMeta.fileSize / 1024).toFixed(1)} KB</div>}
                  <div className="text-green-400/70">✓ Persisted on Supabase</div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 py-2 text-[0.65rem] uppercase tracking-widest border border-white/10 hover:border-[var(--accent-primary)]/50 hover:bg-[var(--accent-primary)]/10 hover:text-[var(--accent-primary)] transition-colors">
                <RefreshCw size={14} /> Replace
              </button>
              <button onClick={() => setShowDeleteConfirm(true)}
                className="py-2 px-4 text-[0.65rem] border border-red-500/30 text-red-500/50 hover:bg-red-500/10 hover:text-red-400 uppercase tracking-widest transition-colors flex items-center justify-center">
                <Trash2 size={14} />
              </button>
            </div>

            <AnimatePresence>
              {showDeleteConfirm && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 p-3">
                    <span className="text-[0.65rem] text-red-400 flex-1 uppercase tracking-widest font-bold ml-1">Delete Avatar?</span>
                    <button onClick={handleDelete} className="px-3 py-1 bg-red-500 text-white text-[0.6rem] tracking-wider uppercase hover:bg-white hover:text-red-500 transition-colors">Confirm</button>
                    <button onClick={() => setShowDeleteConfirm(false)} className="px-3 py-1 border border-white/10 text-white/50 text-[0.6rem] tracking-wider uppercase hover:text-white transition-colors">Cancel</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" ref={fileInputRef}
              onChange={(e) => { if (e.target.files?.[0]) processFile(e.target.files[0]); }}
            />
          </motion.div>
        )}
      </section>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`fixed bottom-4 right-4 z-[999999] px-4 py-3 flex items-center gap-3 backdrop-blur-md border ${
              toast.type === 'success' ? 'bg-black/80 border-[var(--accent-primary)]/50 text-[var(--accent-primary)]' : 'bg-black/80 border-red-500/50 text-red-400'
            }`}
            style={{ boxShadow: toast.type === 'success' ? '0 0 30px rgba(0,255,200,0.1)' : '0 0 30px rgba(255,0,0,0.1)' }}>
            {toast.type === 'success' ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />}
            <span className="text-[0.7rem] uppercase tracking-widest font-mono">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
