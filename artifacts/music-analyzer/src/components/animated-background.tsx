import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
}

interface WaveLine {
  amplitude: number;
  frequency: number;
  speed: number;
  phase: number;
  yOffset: number;
  alpha: number;
  hue: number;
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let waveLines: WaveLine[] = [];
    let animFrame: number;
    let t = 0;
    let W = 0, H = 0;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      initWaves();
    };

    const initWaves = () => {
      waveLines = [
        { amplitude: 22, frequency: 0.008, speed: 0.6, phase: 0, yOffset: H * 0.38, alpha: 1, hue: 262 },
        { amplitude: 14, frequency: 0.012, speed: -0.4, phase: 1.5, yOffset: H * 0.45, alpha: 1, hue: 192 },
        { amplitude: 30, frequency: 0.005, speed: 0.3, phase: 0.7, yOffset: H * 0.52, alpha: 1, hue: 280 },
        { amplitude: 10, frequency: 0.018, speed: -0.8, phase: 2.1, yOffset: H * 0.6, alpha: 1, hue: 210 },
      ];
    };

    const spawnParticle = () => {
      if (particles.length > 60) return;
      const isDark = document.documentElement.classList.contains('dark');
      if (Math.random() > 0.03) return;
      const hues = [262, 192, 280, 38, 152];
      particles.push({
        x: Math.random() * W,
        y: H * (0.3 + Math.random() * 0.4),
        vx: (Math.random() - 0.5) * 0.3,
        vy: -(0.2 + Math.random() * 0.5),
        life: 0,
        maxLife: 120 + Math.random() * 180,
        size: 1 + Math.random() * 2.5,
        hue: hues[Math.floor(Math.random() * hues.length)],
      });
    };

    const drawScanLine = () => {
      const isDark = document.documentElement.classList.contains('dark');
      if (!isDark) return;
      const progress = (t * 0.4) % (H + 200);
      const grad = ctx.createLinearGradient(0, progress - 40, 0, progress + 40);
      grad.addColorStop(0, 'rgba(200, 160, 255, 0)');
      grad.addColorStop(0.5, `rgba(200, 160, 255, 0.025)`);
      grad.addColorStop(1, 'rgba(200, 160, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, progress - 40, W, 80);
    };

    const drawGrid = () => {
      const isDark = document.documentElement.classList.contains('dark');
      const alpha = isDark ? 0.025 : 0.04;
      const gridSize = 72;

      ctx.strokeStyle = `rgba(${isDark ? '180,160,255' : '100,80,200'}, ${alpha})`;
      ctx.lineWidth = 0.5;

      for (let x = 0; x < W; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
    };

    const drawWaves = () => {
      const isDark = document.documentElement.classList.contains('dark');
      for (const wave of waveLines) {
        wave.phase += wave.speed * 0.016;
        const baseAlpha = isDark ? 0.09 : 0.055;
        ctx.beginPath();
        for (let x = 0; x <= W; x += 3) {
          const y = wave.yOffset
            + Math.sin(x * wave.frequency + wave.phase) * wave.amplitude
            + Math.sin(x * wave.frequency * 2.3 + wave.phase * 1.4) * wave.amplitude * 0.35
            + Math.sin(x * wave.frequency * 0.5 + wave.phase * 0.6) * wave.amplitude * 0.5;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }

        const grad = ctx.createLinearGradient(0, 0, W, 0);
        grad.addColorStop(0, `hsla(${wave.hue}, 80%, ${isDark ? 70 : 50}%, 0)`);
        grad.addColorStop(0.2, `hsla(${wave.hue}, 80%, ${isDark ? 70 : 50}%, ${baseAlpha})`);
        grad.addColorStop(0.8, `hsla(${wave.hue}, 80%, ${isDark ? 70 : 50}%, ${baseAlpha})`);
        grad.addColorStop(1, `hsla(${wave.hue}, 80%, ${isDark ? 70 : 50}%, 0)`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = isDark ? 1.2 : 0.9;
        ctx.stroke();
      }
    };

    const drawParticles = () => {
      const isDark = document.documentElement.classList.contains('dark');
      particles = particles.filter(p => p.life < p.maxLife);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        const progress = p.life / p.maxLife;
        const alpha = (isDark ? 0.5 : 0.35) * Math.sin(progress * Math.PI);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - progress * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, ${isDark ? 75 : 50}%, ${alpha})`;
        ctx.fill();
      }
    };

    const drawSpectrum = () => {
      const isDark = document.documentElement.classList.contains('dark');
      const barCount = 80;
      const barW = W / barCount;
      const baseY = H;

      for (let i = 0; i < barCount; i++) {
        const nx = i / barCount;
        const wave1 = Math.sin(t * 0.9 + nx * 6 + i * 0.4) * 0.5 + 0.5;
        const wave2 = Math.sin(t * 0.5 + nx * 12 + i * 0.2) * 0.3 + 0.3;
        const wave3 = Math.sin(t * 1.4 + nx * 4) * 0.2 + 0.2;
        const h = (wave1 + wave2 + wave3) / 1.5 * 48 + 3;

        const hue = 220 + nx * 100;
        const alpha = isDark ? 0.22 : 0.1;
        const x = i * barW + barW * 0.1;
        const w = barW * 0.8;

        const grad = ctx.createLinearGradient(0, baseY, 0, baseY - h);
        grad.addColorStop(0, `hsla(${hue}, 80%, ${isDark ? 65 : 45}%, 0)`);
        grad.addColorStop(1, `hsla(${hue}, 80%, ${isDark ? 65 : 45}%, ${alpha})`);
        ctx.fillStyle = grad;

        ctx.beginPath();
        ctx.roundRect(x, baseY - h, w, h, 2);
        ctx.fill();
      }
    };

    const render = () => {
      t += 1;
      ctx.clearRect(0, 0, W, H);

      drawGrid();
      drawScanLine();
      drawWaves();
      spawnParticle();
      drawParticles();
      drawSpectrum();

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
      style={{ opacity: 0.95 }}
    />
  );
}
