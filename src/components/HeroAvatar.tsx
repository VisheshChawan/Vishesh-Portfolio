'use client';

import { useProfileImageStore } from '@/store/profileImageStore';
import { useAdminStore } from '@/store/adminStore';
import { useAvatarStore } from '@/store/avatarStore';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function HeroAvatar() {
  const image = useProfileImageStore((s) => s.image);
  const name = useAdminStore((s) => s.config.personal.name);
  const avatarUrl = useAdminStore((s) => s.config.avatarUrl);
  const settings = useAvatarStore((s) => s.settings);
  const [isMobile, setIsMobile] = useState(false);

  // Priority: local base64 (admin has it) > remote blob URL (visitors) > null
  const imageSrc = image?.base64Data || avatarUrl || null;
  const hasImage = !!imageSrc;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // Resolve size based on breakpoint
  const size = isMobile ? settings.mobileSize : settings.desktopSize;
  const offsetX = isMobile ? settings.mobileX : settings.desktopX;
  const offsetY = isMobile ? settings.mobileY : settings.desktopY;

  // Compute border radius from customRadius percentage
  const borderRadius = `${settings.customRadius}%`;

  // Compute glow/shadow strings from intensity sliders
  const glowAlpha = settings.glowIntensity / 100;
  const shadowAlpha = settings.shadowDepth / 100;
  const boxShadow = [
    `0 0 ${20 + settings.glowIntensity * 0.4}px rgba(0,255,200,${glowAlpha * 0.4})`,
    `0 0 ${40 + settings.glowIntensity * 0.6}px rgba(0,255,200,${glowAlpha * 0.15})`,
    `0 ${4 + settings.shadowDepth * 0.2}px ${20 + settings.shadowDepth * 0.4}px rgba(0,0,0,${shadowAlpha * 0.6})`,
    `inset 0 0 ${20 + settings.glowIntensity * 0.2}px rgba(0,255,200,${glowAlpha * 0.08})`,
  ].join(', ');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        x: offsetX,
        translateY: offsetY,
        rotate: settings.rotation,
      }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      className="relative group"
      style={{
        zIndex: settings.zIndex,
        padding: settings.padding,
      }}
    >
      {/* Outer glow ring */}
      {settings.spinGlow && settings.glowIntensity > 0 && (
        <div
          className={`absolute -inset-2 opacity-60 group-hover:opacity-100 transition-opacity duration-500 ${settings.spinGlow ? 'animate-spin-slow' : ''}`}
          style={{
            borderRadius,
            background: `conic-gradient(from 0deg, transparent, rgba(0,255,200,${glowAlpha}), transparent, rgba(109,40,217,${glowAlpha * 0.6}), transparent)`,
            filter: `blur(${4 + settings.glowIntensity * 0.06}px)`,
          }}
        />
      )}

      {/* Main frame */}
      <motion.div
        className="relative overflow-hidden group-hover:border-[var(--accent-primary)] transition-colors duration-500"
        animate={{ width: size, height: size }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        style={{
          borderRadius,
          borderWidth: settings.borderWidth,
          borderStyle: 'solid',
          borderColor: `rgba(0,255,200,${0.3 + glowAlpha * 0.3})`,
          boxShadow,
        }}
      >
        {hasImage ? (
          <motion.img
            src={imageSrc!}
            alt="Profile"
            className="w-full h-full object-cover"
            loading="lazy"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.4 }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-surface) 100%)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: `${size * 0.25}px`,
                color: 'var(--accent-primary)',
                textShadow: '0 0 20px rgba(0,255,200,0.4)',
              }}
            >
              {initials}
            </span>
          </div>
        )}
      </motion.div>

      {/* Status dot */}
      <div
        className="absolute bottom-2 right-2 w-4 h-4 border-2 border-[var(--bg-void)]"
        style={{
          borderRadius: '50%',
          background: 'var(--accent-primary)',
          boxShadow: '0 0 10px rgba(0,255,200,0.6)',
        }}
      />
    </motion.div>
  );
}
