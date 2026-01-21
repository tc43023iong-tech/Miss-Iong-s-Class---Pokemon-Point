
import React, { useEffect, useRef } from 'react';

export const Fireworks: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: any[] = [];
    const colors = ['#FF0000', '#FFD700', '#00FF00', '#00BFFF', '#FF00FF', '#FFFFFF', '#FFA500', '#7FFF00', '#FF4500'];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
      size: number;
      constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2; // Slightly faster
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1;
        this.size = Math.random() * 3 + 1.5; // Slightly larger
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.07; // gravity
        this.alpha -= 0.01; // Slower fade
      }
      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const createFirework = (x: number, y: number) => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const count = 50 + Math.floor(Math.random() * 30); // More particles
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(x, y, color));
      }
    };

    let lastTime = 0;
    const loop = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Much more frequent: Every 350ms
      if (time - lastTime > 350) {
        createFirework(Math.random() * canvas.width, Math.random() * canvas.height * 0.7);
        lastTime = time;
      }

      particles = particles.filter(p => p.alpha > 0);
      particles.forEach(p => {
        p.update();
        p.draw(ctx);
      });

      requestAnimationFrame(loop);
    };

    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(loop);

    return () => window.removeEventListener('resize', resize);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-60" />;
};
