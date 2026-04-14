'use client';

import { useEffect, useRef, useState } from 'react';

export default function EasterEggs() {
  const konamiRef = useRef<string[]>([]);
  const [matrixRain, setMatrixRain] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Console message
    console.log(
      '%c Hey there, fellow developer! 👋\n%c Vishesh Chawan — AI & Backend Developer\n%c vishesh.chawan1@gmail.com',
      'font-size: 20px; color: #00ffc8; background: #010108; padding: 10px 20px; font-family: monospace;',
      'font-size: 14px; color: #f1f5f9; background: #010108; padding: 5px 20px; font-family: monospace;',
      'font-size: 12px; color: #94a3b8; background: #010108; padding: 5px 20px; font-family: monospace;'
    );

    // Konami code listener
    const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    const handleKeyDown = (e: KeyboardEvent) => {
      konamiRef.current.push(e.key);
      if (konamiRef.current.length > KONAMI.length) {
        konamiRef.current.shift();
      }
      if (JSON.stringify(konamiRef.current) === JSON.stringify(KONAMI)) {
        setMatrixRain(true);
        konamiRef.current = [];
        setTimeout(() => setMatrixRain(false), 4000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Matrix rain effect
  useEffect(() => {
    if (!matrixRain || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ0123456789ABCDEFVISHESH';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = new Array(columns).fill(1);

    let animId: number;
    const draw = () => {
      ctx.fillStyle = 'rgba(1, 1, 8, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00ffc8';
      ctx.font = `${fontSize}px JetBrains Mono, monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [matrixRain]);

  return (
    <>
      {matrixRain && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none"
          style={{
            zIndex: 99999,
            animation: 'fadeInOut 4s ease-in-out forwards',
          }}
        />
      )}
      <style jsx>{`
        @keyframes fadeInOut {
          0% { opacity: 0; }
          10% { opacity: 0.9; }
          80% { opacity: 0.9; }
          100% { opacity: 0; }
        }
      `}</style>
    </>
  );
}
