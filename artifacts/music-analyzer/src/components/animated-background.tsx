import { useEffect, useRef } from 'react';

interface WaveBar {
  x: number;
  height: number;
  targetHeight: number;
  speed: number;
  phase: number;
}

interface Orb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hue: number;
  alpha: number;
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let waveBars: WaveBar[] = [];
    let orbs: Orb[] = [];
    let animFrame: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    const init = () => {
      const barCount = Math.floor(canvas.width / 8);
      waveBars = Array.from({ length: barCount }, (_, i) => ({
        x: i * 8 + 4,
        height: 4,
        targetHeight: 4,
        speed: 0.02 + Math.random() * 0.04,
        phase: Math.random() * Math.PI * 2,
      }));

      orbs = Array.from({ length: 6 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: 150 + Math.random() * 200,
        hue: 230 + Math.random() * 60,
        alpha: 0.04 + Math.random() * 0.04,
      }));
    };

    const render = () => {
      time += 0.012;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isDark = document.documentElement.classList.contains('dark');

      // Draw floating orbs (glowing blobs)
      for (const orb of orbs) {
        orb.x += orb.vx;
        orb.y += orb.vy;
        if (orb.x < -orb.radius) orb.x = canvas.width + orb.radius;
        if (orb.x > canvas.width + orb.radius) orb.x = -orb.radius;
        if (orb.y < -orb.radius) orb.y = canvas.height + orb.radius;
        if (orb.y > canvas.height + orb.radius) orb.y = -orb.radius;

        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        const alpha = isDark ? orb.alpha * 1.8 : orb.alpha;
        gradient.addColorStop(0, `hsla(${orb.hue}, 80%, ${isDark ? 65 : 55}%, ${alpha})`);
        gradient.addColorStop(1, `hsla(${orb.hue}, 80%, ${isDark ? 65 : 55}%, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw frequency wave bars at the bottom
      const waveY = canvas.height - 60;
      const maxBarHeight = 80;

      for (const bar of waveBars) {
        const wave1 = Math.sin(time * 1.2 + bar.phase) * 0.5 + 0.5;
        const wave2 = Math.sin(time * 0.7 + bar.phase * 1.3 + 1) * 0.3 + 0.3;
        const wave3 = Math.sin(time * 2.1 + bar.phase * 0.8 + 2) * 0.2 + 0.2;
        bar.targetHeight = (wave1 + wave2 + wave3) / 1.5 * maxBarHeight + 2;
        bar.height += (bar.targetHeight - bar.height) * bar.speed;

        const normalizedX = bar.x / canvas.width;
        const hue = 220 + normalizedX * 80;
        const barAlpha = isDark ? 0.25 : 0.12;

        const barGrad = ctx.createLinearGradient(bar.x, waveY, bar.x, waveY - bar.height);
        barGrad.addColorStop(0, `hsla(${hue}, 80%, 60%, ${barAlpha * 0.2})`);
        barGrad.addColorStop(1, `hsla(${hue}, 80%, 65%, ${barAlpha})`);

        ctx.fillStyle = barGrad;
        ctx.beginPath();
        ctx.roundRect(bar.x - 2, waveY - bar.height, 4, bar.height, 2);
        ctx.fill();
      }

      // Draw a subtle frequency sine wave across the middle
      const midY = canvas.height * 0.45;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 2) {
        const y = midY +
          Math.sin(x * 0.02 + time * 1.5) * 15 +
          Math.sin(x * 0.008 + time * 0.8) * 25 +
          Math.sin(x * 0.04 - time * 2.2) * 8;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = isDark
        ? 'rgba(129, 140, 248, 0.07)'
        : 'rgba(99, 102, 241, 0.05)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Second wave
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 2) {
        const y = midY + 40 +
          Math.sin(x * 0.015 + time * 1.1 + 1) * 12 +
          Math.sin(x * 0.009 + time * 0.6 + 2) * 20 +
          Math.sin(x * 0.035 - time * 1.8 + 0.5) * 6;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = isDark
        ? 'rgba(167, 139, 250, 0.05)'
        : 'rgba(139, 92, 246, 0.04)';
      ctx.lineWidth = 1;
      ctx.stroke();

      animFrame = requestAnimationFrame(render);
    };

    window.addEventListener('resize', resize);
    resize();
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
