'use client';

import { useEffect, useRef, useState } from 'react';
import { useAdminStore } from '@/store/adminStore';

export default function CustomCursor() {
  const cursorConfig = useAdminStore(state => state.config.animations.cursor);
  const masterEnabled = useAdminStore(state => state.config.animations.masterEnabled);
  
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [visible, setVisible] = useState(true);
  const animRef = useRef<number>(0);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(hover: none)').matches) {
      setVisible(false);
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
    };

    const onMouseDown = () => {
      setClicking(true);
      setTimeout(() => setClicking(false), 100);
    };

    const onMouseEnterInteractive = () => setHovering(true);
    const onMouseLeaveInteractive = () => setHovering(false);

    // Lerp ring position
    const animateRing = () => {
      const dx = pos.current.x - ringPos.current.x;
      const dy = pos.current.y - ringPos.current.y;
      ringPos.current.x += dx * 0.12;
      ringPos.current.y += dy * 0.12;

      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.current.x}px`;
        ringRef.current.style.top = `${ringPos.current.y}px`;
      }

      animRef.current = requestAnimationFrame(animateRing);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);

    // Track interactive elements
    const addListeners = () => {
      const interactives = document.querySelectorAll('a, button, [data-cursor-hover]');
      interactives.forEach(el => {
        el.addEventListener('mouseenter', onMouseEnterInteractive);
        el.addEventListener('mouseleave', onMouseLeaveInteractive);
      });
      return interactives;
    };

    // Initial + MutationObserver for dynamic elements
    let interactives = addListeners();
    const observer = new MutationObserver(() => {
      interactives.forEach(el => {
        el.removeEventListener('mouseenter', onMouseEnterInteractive);
        el.removeEventListener('mouseleave', onMouseLeaveInteractive);
      });
      interactives = addListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    animRef.current = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      cancelAnimationFrame(animRef.current);
      observer.disconnect();
      interactives.forEach(el => {
        el.removeEventListener('mouseenter', onMouseEnterInteractive);
        el.removeEventListener('mouseleave', onMouseLeaveInteractive);
      });
    };
  }, []);

  if (!visible || !masterEnabled || cursorConfig.style === 'system') return null;

  const dotBaseStyle: React.CSSProperties = {
    clipPath: cursorConfig.style === 'diamond' ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
            : cursorConfig.style === 'cross' ? 'polygon(40% 0, 60% 0, 60% 40%, 100% 40%, 100% 60%, 60% 60%, 60% 100%, 40% 100%, 40% 60%, 0 60%, 0 40%, 40% 40%)'
            : cursorConfig.style === 'arrow' ? 'polygon(0% 0%, 100% 50%, 0% 100%, 25% 50%)'
            : 'circle(50% at 50% 50%)',
    mixBlendMode: cursorConfig.blendMode as any,
    background: cursorConfig.color === 'accent' ? 'var(--accent-primary)' : cursorConfig.color
  };

  return (
    <>
      <div
        ref={dotRef}
        className={`cursor-dot ${hovering ? 'hovering' : ''} ${clicking ? 'clicking' : ''}`}
        style={dotBaseStyle}
      />
      <div
        ref={ringRef}
        className={`cursor-ring ${hovering ? 'hovering' : ''} ${clicking ? 'clicking' : ''}`}
        style={{
          clipPath: cursorConfig.style === 'diamond' ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' : 'circle(50% at 50% 50%)',
          mixBlendMode: cursorConfig.blendMode as any,
          borderColor: cursorConfig.color === 'accent' ? 'var(--accent-primary)' : cursorConfig.color
        }}
      />
    </>
  );
}
