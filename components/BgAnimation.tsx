"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  alphaDir: number;
}

export default function BgAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let W = 0;
    let H = 0;
    let particles: Particle[] = [];
    let tick = 0;

    // — Theme colors —
    const SIGNAL    = "rgba(126, 242, 156,"; // neon green
    const AMBER     = "rgba(242, 201, 76,";  // amber accent
    const GRID_COL  = "rgba(126, 242, 156, 0.035)";
    const GRID_SIZE = 72;

    function resize() {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = W;
      canvas.height = H;
      initParticles();
    }

    function initParticles() {
      const count = Math.floor((W * H) / 14000);
      particles = Array.from({ length: count }, () => ({
        x:        Math.random() * W,
        y:        Math.random() * H,
        vx:       (Math.random() - 0.5) * 0.28,
        vy:       (Math.random() - 0.5) * 0.28,
        radius:   Math.random() * 1.6 + 0.4,
        alpha:    Math.random(),
        alphaDir: Math.random() > 0.5 ? 1 : -1,
      }));
    }

    function drawGrid() {
      ctx.strokeStyle = GRID_COL;
      ctx.lineWidth   = 0.5;

      // vertical lines
      for (let x = 0; x < W; x += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      // horizontal lines
      for (let y = 0; y < H; y += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
    }

    function drawGlowOrbs() {
      // Slowly drifting big ambient orbs
      const t = tick * 0.0008;

      // Primary green orb — top-center breathing
      const ox1 = W * 0.5  + Math.sin(t * 1.1) * W * 0.12;
      const oy1 = H * 0.08 + Math.cos(t * 0.9) * H * 0.06;
      const r1  = Math.max(W, H) * (0.28 + Math.sin(t * 1.3) * 0.04);
      const grad1 = ctx.createRadialGradient(ox1, oy1, 0, ox1, oy1, r1);
      grad1.addColorStop(0,   `${SIGNAL} 0.055)`);
      grad1.addColorStop(0.5, `${SIGNAL} 0.018)`);
      grad1.addColorStop(1,   `${SIGNAL} 0)`);
      ctx.fillStyle = grad1;
      ctx.beginPath();
      ctx.arc(ox1, oy1, r1, 0, Math.PI * 2);
      ctx.fill();

      // Secondary amber orb — bottom-left drifting
      const ox2 = W * 0.08 + Math.cos(t * 0.7) * W * 0.06;
      const oy2 = H * 0.88 + Math.sin(t * 1.2) * H * 0.07;
      const r2  = Math.max(W, H) * (0.22 + Math.cos(t * 0.9) * 0.03);
      const grad2 = ctx.createRadialGradient(ox2, oy2, 0, ox2, oy2, r2);
      grad2.addColorStop(0,   `${AMBER} 0.035)`);
      grad2.addColorStop(0.5, `${AMBER} 0.010)`);
      grad2.addColorStop(1,   `${AMBER} 0)`);
      ctx.fillStyle = grad2;
      ctx.beginPath();
      ctx.arc(ox2, oy2, r2, 0, Math.PI * 2);
      ctx.fill();

      // Tertiary green orb — right edge wandering
      const ox3 = W * 0.92 + Math.sin(t * 0.6) * W * 0.05;
      const oy3 = H * 0.55 + Math.cos(t * 1.4) * H * 0.15;
      const r3  = Math.max(W, H) * (0.18 + Math.sin(t * 1.7) * 0.03);
      const grad3 = ctx.createRadialGradient(ox3, oy3, 0, ox3, oy3, r3);
      grad3.addColorStop(0,   `${SIGNAL} 0.04)`);
      grad3.addColorStop(0.5, `${SIGNAL} 0.012)`);
      grad3.addColorStop(1,   `${SIGNAL} 0)`);
      ctx.fillStyle = grad3;
      ctx.beginPath();
      ctx.arc(ox3, oy3, r3, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawParticles() {
      particles.forEach((p) => {
        // breathing alpha
        p.alpha += 0.004 * p.alphaDir;
        if (p.alpha >= 1)   { p.alpha = 1;   p.alphaDir = -1; }
        if (p.alpha <= 0.1) { p.alpha = 0.1; p.alphaDir =  1; }

        // drift
        p.x += p.vx;
        p.y += p.vy;

        // wrap
        if (p.x < 0)  p.x = W;
        if (p.x > W)  p.x = 0;
        if (p.y < 0)  p.y = H;
        if (p.y > H)  p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${SIGNAL} ${p.alpha * 0.55})`;
        ctx.fill();

        // tiny halo
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `${SIGNAL} ${p.alpha * 0.06})`;
        ctx.fill();
      });
    }

    function drawConnections() {
      const MAX_DIST = 120;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x;
          const dy   = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.08;
            ctx.strokeStyle = `${SIGNAL} ${alpha})`;
            ctx.lineWidth   = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function frame() {
      ctx.clearRect(0, 0, W, H);
      tick++;
      drawGlowOrbs();
      drawGrid();
      drawConnections();
      drawParticles();
      animId = requestAnimationFrame(frame);
    }

    resize();
    frame();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
