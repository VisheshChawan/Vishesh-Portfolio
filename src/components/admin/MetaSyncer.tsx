'use client';

import { useEffect } from 'react';
import { useAdminStore } from '@/store/adminStore';

export default function MetaSyncer() {
  const advanced = useAdminStore(state => state.config.advanced);
  const seoTitle = advanced?.seoTitle || '';
  const seoDescription = advanced?.seoDescription || '';

  useEffect(() => {
    // Sync document title
    if (seoTitle) {
      document.title = seoTitle;
    }

    // Sync meta description
    if (seoDescription) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', seoDescription);
    }
  }, [seoTitle, seoDescription]);

  return null;
}
