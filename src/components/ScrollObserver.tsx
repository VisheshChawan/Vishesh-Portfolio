'use client';

import { useEffect } from 'react';

export default function ScrollObserver() {
  useEffect(() => {
    // Observer for active section highlighting in nav (data-section="...")
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Dispatch a custom event that Navbar will listen to
            window.dispatchEvent(
              new CustomEvent('sectionChange', {
                detail: entry.target.getAttribute('data-section')
              })
            );
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px' }
    );

    document.querySelectorAll('[data-section]').forEach(s => sectionObserver.observe(s));

    // Observer for scroll entry animations (data-animate="...")
    const animateObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-play');
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll('[data-animate]').forEach(el => animateObserver.observe(el));

    return () => {
      sectionObserver.disconnect();
      animateObserver.disconnect();
    };
  }, []);

  return null;
}
