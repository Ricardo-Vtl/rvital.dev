"use client";

import { useEffect, useRef } from "react";

interface Dot {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
}

const PARTICLE_HEX = typeof window === "undefined" ? "#ffffff"
  : document.documentElement.classList.contains("light") ? "#222222" : "#ffffff";

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16) || 150;
  const g = parseInt(hex.slice(3, 5), 16) || 150;
  const b = parseInt(hex.slice(5, 7), 16) || 150;
  return `rgba(${r},${g},${b},${alpha})`;
}

export function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let dots: Dot[] = [];
    let mouseX = -999;
    let mouseY = -999;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const init = () => {
      resize();
      const count = Math.min(50, Math.floor((canvas.width * canvas.height) / 25000));
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.4 + 0.5,
        speedX: (Math.random() - 0.5) * 0.15,
        speedY: (Math.random() - 0.5) * 0.15,
      }));
    };

    const hex = PARTICLE_HEX;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      dots.forEach((dot, i) => {
        dot.x += dot.speedX;
        dot.y += dot.speedY;

        if (dot.x < 0) dot.x = canvas.width;
        if (dot.x > canvas.width) dot.x = 0;
        if (dot.y < 0) dot.y = canvas.height;
        if (dot.y > canvas.height) dot.y = 0;

        const dx = mouseX - dot.x;
        const dy = mouseY - dot.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          dot.x -= dx * 0.003;
          dot.y -= dy * 0.003;
        }

        const opacity = (dot.size / 1.9) * 0.35 + 0.08;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(hex, opacity);
        ctx.fill();

        for (let j = i + 1; j < dots.length; j++) {
          const dx2 = dots[j].x - dot.x;
          const dy2 = dots[j].y - dot.y;
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          if (dist2 < 100) {
            ctx.beginPath();
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = hexToRgba(hex, 0.04 * (1 - dist2 / 100));
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animId = requestAnimationFrame(draw);
    };

    const handleMouse = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleLeave = () => {
      mouseX = -999;
      mouseY = -999;
    };

    init();
    draw();
    window.addEventListener("resize", init);
    window.addEventListener("mousemove", handleMouse);
    document.addEventListener("mouseleave", handleLeave);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", init);
      window.removeEventListener("mousemove", handleMouse);
      document.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
}
