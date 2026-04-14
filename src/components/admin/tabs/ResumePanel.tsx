'use client';

import { useState, useRef } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { Upload, FileMinus, Download, Eye, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ResumePreviewModal from './ResumePreviewModal';

export default function ResumePanel() {
  const { resume, setResume, deleteResume } = useResumeStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null);

  const triggerToast = (msg: string, type: 'success'|'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const processFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      triggerToast('File size exceeds 5MB limit.', 'error');
      return;
    }

    const validTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.docx')) {
      triggerToast('Invalid file format. Upload PDF, TXT, or DOCX.', 'error');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 15;
      });
    }, 100);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Data = e.target?.result as string;

      let textContent = '';
      if (file.type === 'text/plain') {
        const textReader = new FileReader();
        textReader.onload = (te) => {
          clearInterval(interval);
          setUploadProgress(100);
          setResume({
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            uploadDate: new Date().toISOString(),
            base64Data,
            textContent: te.target?.result as string,
          });
          setTimeout(() => {
            setUploading(false);
            triggerToast('Resume uploaded securely.', 'success');
          }, 300);
        };
        textReader.readAsText(file);
        return;
      }

      clearInterval(interval);
      setUploadProgress(100);
      setResume({
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type || (file.name.endsWith('.docx') ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'unknown'),
        uploadDate: new Date().toISOString(),
        base64Data,
      });

      setTimeout(() => {
        setUploading(false);
        triggerToast('Resume uploaded securely.', 'success');
      }, 300);
    };
    
    // Using DataURL natively handles the Base64 representation needed to restore files visually
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDownload = () => {
    if (!resume) return;
    const a = document.createElement('a');
    a.href = resume.base64Data;
    a.download = resume.fileName;
    a.click();
  };

  return (
    <div className="space-y-6 pb-12 text-[#c4cad6] relative">
      <section className="space-y-4">
        <h3 className="text-[0.7rem] uppercase tracking-[0.2em] font-bold text-[var(--accent-primary)] mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-[var(--accent-primary)]" />
          Neural Document Storage
        </h3>

        {/* Uploader UI */}
        {!resume || uploading ? (
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
                  Encrypting Payload... {Math.round(uploadProgress)}%
                </div>
              </div>
            ) : (
              <>
                <Upload size={32} className={`mb-4 transition-colors ${isDragging ? 'text-[var(--accent-primary)]' : 'text-white/20 group-hover:text-[var(--accent-primary)]'}`} />
                <div className="text-[0.8rem] font-bold text-white mb-1">DRAG & DROP RESUME</div>
                <div className="text-[0.6rem] text-white/40 uppercase tracking-widest mb-6">Support: PDF, DOCX, TXT. Max: 5MB.</div>
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-2 border border-white/10 text-[0.65rem] uppercase tracking-wider text-white hover:bg-white hover:text-black transition-colors"
                >
                  Browse Local Files
                </button>
              </>
            )}
            <input 
              type="file" 
              accept=".pdf,.txt,.docx,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
              className="hidden" 
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files?.[0]) processFile(e.target.files[0]);
              }}
            />
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 border border-white/10 bg-black/40 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 flex items-center justify-center border border-white/10">
                  <FileText className="text-[var(--accent-primary)]" size={24} />
                </div>
                <div>
                  <div className="text-[0.8rem] text-white font-bold max-w-[200px] truncate">{resume.fileName}</div>
                  <div className="text-[0.6rem] text-white/50 font-mono uppercase mt-1">
                    {(resume.fileSize / 1024 / 1024).toFixed(2)} MB • {new Date(resume.uploadDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
              <button 
                onClick={() => setShowPreview(true)}
                className="flex items-center justify-center gap-2 py-2 text-[0.65rem] uppercase tracking-widest border border-white/10 hover:border-[var(--accent-primary)]/50 hover:bg-[var(--accent-primary)]/10 hover:text-[var(--accent-primary)] transition-colors"
              >
                <Eye size={14} /> Preview
              </button>
              <button 
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 py-2 text-[0.65rem] uppercase tracking-widest border border-white/10 hover:border-[var(--accent-primary)]/50 hover:bg-[var(--accent-primary)]/10 hover:text-[var(--accent-primary)] transition-colors"
              >
                <Download size={14} /> Download
              </button>
            </div>

            <div className="pt-2">
              {showDeleteConfirm ? (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 p-2">
                  <span className="text-[0.65rem] text-red-400 flex-1 uppercase tracking-widest font-bold ml-2">Wipe File?</span>
                  <button 
                    onClick={() => {
                      deleteResume();
                      setShowDeleteConfirm(false);
                      triggerToast('Resume destroyed.', 'success');
                    }}
                    className="px-3 py-1 bg-red-500 text-white text-[0.6rem] tracking-wider uppercase hover:bg-white hover:text-red-500 transition-colors"
                  >
                    Confirm
                  </button>
                  <button 
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-3 py-1 border border-white/10 text-white/50 text-[0.6rem] tracking-wider uppercase hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                   <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 py-1.5 text-[0.65rem] border border-white/10 text-white/50 hover:text-white uppercase tracking-widest transition-colors"
                  >
                    Replace File
                  </button>
                  <button 
                    onClick={() => setShowDeleteConfirm(true)}
                    className="py-1.5 px-3 text-[0.65rem] border border-red-500/30 text-red-500/50 hover:bg-red-500/10 hover:text-red-400 uppercase tracking-widest transition-colors flex items-center justify-center"
                    title="Delete Resume"
                  >
                    <FileMinus size={14} />
                  </button>
                </div>
              )}
            </div>
            
            <input 
              type="file" 
              accept=".pdf,.txt,.docx,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
              className="hidden" 
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files?.[0]) processFile(e.target.files[0]);
              }}
            />
          </motion.div>
        )}
      </section>

      {/* Global Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`fixed bottom-4 right-4 z-[999999] px-4 py-3 flex items-center gap-3 backdrop-blur-md border ${
              toast.type === 'success' 
                ? 'bg-black/80 border-[var(--accent-primary)]/50 text-[var(--accent-primary)]' 
                : 'bg-black/80 border-red-500/50 text-red-400'
            }`}
            style={{
               boxShadow: toast.type === 'success' ? '0 0 30px rgba(0,255,200,0.1)' : '0 0 30px rgba(255,0,0,0.1)'
            }}
          >
            {toast.type === 'success' ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />}
            <span className="text-[0.7rem] uppercase tracking-widest font-mono">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <ResumePreviewModal isOpen={showPreview} onClose={() => setShowPreview(false)} />
    </div>
  );
}
