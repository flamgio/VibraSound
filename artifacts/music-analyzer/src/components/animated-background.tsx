import { useEffect, useRef } from 'react';

interface Orb {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
  hue: number; sat: number; lit: number;
  alpha: number;
}

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  size: number; hue: number;
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let orbs: Orb[] = [];
    let particles: Particle[] = [];
    let raf: number;
    let t = 0;
    let W = 0, H = 0;

    const isDark = () => document.documentElement.classList.contains('dark');

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      initOrbs();
    };

    const initOrbs = () => {
      const dark = isDark();
      orbs = [
        { x: W * 0.15, y: H * 0.2, vx: 0.12, vy: 0.07, r: Math.min(W, H) * 0.45, hue: 258, sat: dark ? 90 : 75, lit: dark ? 65 : 55, alpha: dark ? 0.14 : 0.1 },
        { x: W * 0.80, y: H * 0.15, vx: -0.09, vy: 0.11, r: Math.min(W, H) * 0.4, hue: 196, sat: dark ? 100 : 80, lit: dark ? 58 : 48, alpha: dark ? 0.10 : 0.08 },
        { x: W * 0.5, y: H * 0.65, vx: 0.05, vy: -0.08, r: Math.min(W, H) * 0.38, hue: 330, sat: dark ? 90 : 70, lit: dark ? 60 : 50, alpha: dark ? 0.08 : 0.06 },
        { x: W * 0.85, y: H * 0.75, vx: -0.07, vy: -0.05, r: Math.min(W, H) * 0.32, hue: 38, sat: dark ? 100 : 80, lit: dark ? 62 : 52, alpha: dark ? 0.07 : 0.05 },
      ];
    };

    const drawOrbs = () => {
      for (const orb of orbs) {
        orb.x += orb.vx;
        orb.y += orb.vy;
        if (orb.x < -orb.r) orb.x = W + orb.r;
        if (orb.x > W + orb.r) orb.x = -orb.r;
        if (orb.y < -orb.r) orb.y = H + orb.r;
        if (orb.y > H + orb.r) orb.y = -orb.r;

        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
        grad.addColorStop(0, `hsla(${orb.hue}, ${orb.sat}%, ${orb.lit}%, ${orb.alpha})`);
        grad.addColorStop(0.5, `hsla(${orb.hue}, ${orb.sat}%, ${orb.lit}%, ${orb.alpha * 0.4})`);
        grad.addColorStop(1, `hsla(${orb.hue}, ${orb.sat}%, ${orb.lit}%, 0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(orb.x - orb.r, orb.y - orb.r, orb.r * 2, orb.r * 2);
      }
    };

    const drawGrid = () => {
      const dark = isDark();
      const alpha = dark ? 0.018 : 0.028;
      const gs = 80;
      ctx.strokeStyle = dark ? `rgba(160,130,255,${alpha})` : `rgba(80,60,180,${alpha})`;
      ctx.lineWidth = 0.5;
      for (let x = 0; x < W; x += gs) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += gs) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }
    };

    const drawWaves = () => {
      const dark = isDark();
      const waves = [
        { amp: 28, freq: 0.007, speed: 0.5, phase: 0, y: H * 0.4, hue: 258, alpha: dark ? 0.12 : 0.07 },
        { amp: 18, freq: 0.011, speed: -0.35, phase: 1.8, y: H * 0.48, hue: 196, alpha: dark ? 0.09 : 0.055 },
        { amp: 34, freq: 0.004, speed: 0.22, phase: 0.9, y: H * 0.55, hue: 280, alpha: dark ? 0.10 : 0.06 },
        { amp: 12, freq: 0.016, speed: -0.6, phase: 2.5, y: H * 0.62, hue: 216, alpha: dark ? 0.07 : 0.04 },
      ];

      for (const w of waves) {
        w.phase += w.speed * 0.016;
        ctx.beginPath();
        for (let x = 0; x <= W; x += 2) {
          const y = w.y
            + Math.sin(x * w.freq + w.phase) * w.amp
            + Math.sin(x * w.freq * 2.1 + w.phase * 1.3) * w.amp * 0.32
            + Math.sin(x * w.freq * 0.4 + w.phase * 0.5) * w.amp * 0.55;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        const grad = ctx.createLinearGradient(0, 0, W, 0);
        grad.addColorStop(0, `hsla(${w.hue}, 85%, ${dark ? 72 : 52}%, 0)`);
        grad.addColorStop(0.15, `hsla(${w.hue}, 85%, ${dark ? 72 : 52}%, ${w.alpha})`);
        grad.addColorStop(0.85, `hsla(${w.hue}, 85%, ${dark ? 72 : 52}%, ${w.alpha})`);
        grad.addColorStop(1, `hsla(${w.hue}, 85%, ${dark ? 72 : 52}%, 0)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = dark ? 1.4 : 1.0;
        ctx.stroke();
      }
    };

    const spawnParticle = () => {
      if (particles.length > 50) return;
      if (Math.random() > 0.025) return;
      const hues = [258, 196, 280, 38, 152, 330];
      particles.push({
        x: Math.random() * W,
        y: H * (0.25 + Math.random() * 0.5),
        vx: (Math.random() - 0.5) * 0.25,
        vy: -(0.15 + Math.random() * 0.45),
        life: 0,
        maxLife: 140 + Math.random() * 200,
        size: 0.8 + Math.random() * 2.2,
        hue: hues[Math.floor(Math.random() * hues.length)],
      });
    };

    const drawParticles = () => {
      const dark = isDark();
      particles = particles.filter(p => p.life < p.maxLife);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        const progress = p.life / p.maxLife;
        const alpha = (dark ? 0.55 : 0.38) * Math.sin(progress * Math.PI);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - progress * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 85%, ${dark ? 78 : 55}%, ${alpha})`;
        ctx.fill();
      }
    };

    const drawSpectrum = () => {
      const dark = isDark();
      const barCount = 90;
      const barW = W / barCount;
      const baseY = H;
      for (let i = 0; i < barCount; i++) {
        const nx = i / barCount;
        const h =
          (Math.sin(t * 0.8 + nx * 7 + i * 0.35) * 0.5 + 0.5) * 28
          + (Math.sin(t * 0.45 + nx * 13 + i * 0.18) * 0.3 + 0.3) * 18
          + (Math.sin(t * 1.2 + nx * 3.5) * 0.2 + 0.2) * 12
          + 3;
        const hue = 220 + nx * 100;
        const alpha = dark ? 0.24 : 0.1;
        const x = i * barW + barW * 0.12;
        const w = barW * 0.78;
        const grad = ctx.createLinearGradient(0, baseY, 0, baseY - h);
        grad.addColorStop(0, `hsla(${hue}, 85%, ${dark ? 68 : 50}%, 0)`);
        grad.addColorStop(0.4, `hsla(${hue}, 85%, ${dark ? 68 : 50}%, ${alpha * 0.5})`);
        grad.addColorStop(1, `hsla(${hue}, 85%, ${dark ? 68 : 50}%, ${alpha})`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, baseY - h, w, h, 2);
        ctx.fill();
      }
    };

    const drawScanLine = () => {
      if (!isDark()) return;
      const progress = ((t * 0.35) % (H + 160)) - 80;
      const grad = ctx.createLinearGradient(0, progress - 50, 0, progress + 50);
      grad.addColorStop(0, 'rgba(160,120,255,0)');
      grad.addColorStop(0.5, 'rgba(160,120,255,0.018)');
      grad.addColorStop(1, 'rgba(160,120,255,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, progress - 50, W, 100);
    };

    const render = () => {
      t += 1;
      ctx.clearRect(0, 0, W, H);
      drawOrbs();
      drawGrid();
      drawScanLine();
      drawWaves();
      spawnParticle();
      drawParticles();
      drawSpectrum();
      raf = requestAnimationFrame(render);
    };

    window.addEventListener('resize', resize);
    resize();
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
      style={{ opacity: 0.9 }}
    />
  );
}
