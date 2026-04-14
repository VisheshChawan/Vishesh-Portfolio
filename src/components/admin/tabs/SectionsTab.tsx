import { useState } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { SectionBlock } from '@/lib/configTypes';
import { Reorder, motion } from 'framer-motion';
import { GripVertical, Eye, EyeOff, Edit2 } from 'lucide-react';

export default function SectionsTab() {
  const sections = useAdminStore(state => state.config.sections);
  const updateContent = useAdminStore(state => state.updateContent);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleReorder = (newOrder: SectionBlock[]) => {
    // Update the 'order' property based on the new array index
    const updatedSections = newOrder.map((section, index) => ({
      ...section,
      order: index,
    }));
    updateContent('sections', updatedSections);
  };

  const toggleVisibility = (id: string) => {
    const updatedSections = sections.map(sec => 
      sec.id === id ? { ...sec, visible: !sec.visible } : sec
    );
    updateContent('sections', updatedSections);
  };

  const updateSectionContent = (id: string, newContent: string) => {
    const updatedSections = sections.map(sec => 
      sec.id === id ? { ...sec, content: newContent } : sec
    );
    updateContent('sections', updatedSections);
  };

  return (
    <div className="space-y-6 pb-12 text-[#c4cad6]">
      <section className="space-y-4">
        <h3 className="text-[0.7rem] uppercase tracking-[0.2em] font-bold text-[var(--accent-primary)] mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-[var(--accent-primary)]" />
          Sections Visibility & Order
        </h3>

        <div className="text-[0.65rem] text-white/50 mb-4 bg-white/5 p-3 border border-white/10">
          Drag to reorder sections. The Hero section (if visible) will always dynamically align first, but you can control the hierarchy of the rest natively here. Click the edit icon to inject custom text.
        </div>

        <Reorder.Group 
          axis="y" 
          values={sections} 
          onReorder={handleReorder}
          className="space-y-2"
        >
          {sections.map((section) => (
            <Reorder.Item 
              key={section.id} 
              value={section}
              className="flex flex-col bg-black/40 border border-white/10 rounded-none cursor-grab active:cursor-grabbing hover:border-[var(--accent-primary)]/50 transition-colors group"
            >
              <div className="flex items-center gap-3 p-3">
                <GripVertical size={16} className="text-white/20 group-hover:text-[var(--accent-primary)] transition-colors" />
                
                <div className="flex-1 flex flex-col cursor-pointer select-none">
                  <span className="text-[0.8rem] font-bold uppercase tracking-wider text-white">
                    {section.id}
                  </span>
                  {section.title && (
                    <span className="text-[0.6rem] text-white/40 font-mono">
                      {section.title.replace('\n', ' ')}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(editingId === section.id ? null : section.id);
                    }}
                    className={`p-1.5 border transition-all ${
                      editingId === section.id
                        ? 'border-[var(--accent-primary)]/30 text-[var(--accent-primary)] bg-[var(--accent-primary)]/10' 
                        : 'border-white/10 text-white/30 hover:text-white/60'
                    }`}
                    title="Edit Section Body Content"
                  >
                    <Edit2 size={16} />
                  </button>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleVisibility(section.id);
                    }}
                    className={`p-1.5 border transition-all ${
                      section.visible 
                        ? 'border-[var(--accent-primary)]/30 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10' 
                        : 'border-white/10 text-white/30 hover:text-white/60 text-red-500/50 hover:text-red-500'
                    }`}
                    title={section.visible ? "Hide Section" : "Show Section"}
                  >
                    {section.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
              </div>

              {editingId === section.id && (
                <div 
                  className="p-3 border-t border-white/10 bg-black/60 cursor-default"
                  onPointerDown={(e) => e.stopPropagation()} // Prevent reorder drag inside textarea
                >
                  <label className="block text-[0.6rem] uppercase tracking-wider text-white/40 mb-2">
                    Inject Custom Content Body
                  </label>
                  <textarea 
                    rows={4}
                    value={section.content || ''}
                    onChange={(e) => updateSectionContent(section.id, e.target.value)}
                    placeholder="Type raw text or content here..."
                    className="w-full bg-[#02020a] border border-white/10 p-2 text-[0.75rem] font-mono text-white focus:border-[var(--accent-primary)] focus:outline-none resize-y"
                  />
                </div>
              )}
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </section>
    </div>
  );
}
