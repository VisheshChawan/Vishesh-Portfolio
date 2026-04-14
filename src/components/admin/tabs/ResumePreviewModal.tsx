import { useResumeStore } from '@/store/resumeStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Check } from 'lucide-react';
import { useState } from 'react';

export default function ResumePreviewModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { resume, updateTextContent } = useResumeStore();
  const [editing, setEditing] = useState(false);
  const [editorText, setEditorText] = useState('');

  if (!resume) return null;

  const handleEditInit = () => {
    setEditorText(resume.textContent || '');
    setEditing(true);
  };

  const handleSave = () => {
    updateTextContent(editorText);
    setEditing(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-[999999] bg-black/95 flex flex-col backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Header */}
          <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 shrink-0 bg-[#010108]">
            <div className="flex items-center gap-4">
              <FileText className="text-[var(--accent-primary)]" />
              <div>
                <h3 className="text-white text-[0.8rem] font-bold font-mono tracking-wide">{resume.fileName}</h3>
                <p className="text-white/40 text-[0.65rem] uppercase tracking-widest font-mono">
                  {resume.fileType === 'application/pdf' ? 'PDF Visual Overlay' : 'Text Matrix Viewer'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {resume.fileType === 'text/plain' && (
                editing ? (
                  <button 
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 border border-[var(--accent-primary)]/50 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-black transition-colors font-mono text-[0.65rem] uppercase tracking-widest"
                  >
                    <Check size={14} /> Commit Changes
                  </button>
                ) : (
                  <button 
                    onClick={handleEditInit}
                    className="px-4 py-2 border border-white/20 text-white/70 hover:text-white hover:border-white transition-colors font-mono text-[0.65rem] uppercase tracking-widest"
                  >
                    Edit Mode
                  </button>
                )
              )}
              <button 
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center border border-white/10 text-white/50 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all rounded-full"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Viewer Area */}
          <div className="flex-1 w-full max-w-6xl mx-auto p-6 overflow-hidden">
            {resume.fileType === 'application/pdf' ? (
              <iframe 
                src={resume.base64Data}
                title="Resume PDF Viewer"
                className="w-full h-full border border-white/10 rounded bg-white shadow-[0_0_50px_rgba(255,255,255,0.05)]"
              />
            ) : resume.fileType === 'text/plain' ? (
              editing ? (
                <textarea 
                  value={editorText}
                  onChange={(e) => setEditorText(e.target.value)}
                  className="w-full h-full bg-[#02020a] border border-white/20 p-6 text-[0.85rem] font-mono text-[#c4cad6] focus:border-[var(--accent-primary)] focus:outline-none resize-none shadow-[0_0_30px_rgba(0,255,200,0.05)]"
                />
              ) : (
                <div className="w-full h-full bg-[#02020a] border border-white/10 p-6 text-[0.85rem] font-mono text-[#c4cad6] overflow-y-auto whitespace-pre-wrap leading-loose">
                  {resume.textContent}
                </div>
              )
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center border border-white/10 bg-[#02020a] border-dashed text-center">
                <FileText size={48} className="text-white/20 mb-4" />
                <h2 className="text-white/70 font-mono text-sm uppercase tracking-widest mb-2">Binary Format</h2>
                <p className="text-white/40 font-mono text-[0.7rem] max-w-md">
                  Browser previews for `.docx` Microsoft Word payloads are not natively supported to maintain zero-dependency frontend constraints. Please download to view safely.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
