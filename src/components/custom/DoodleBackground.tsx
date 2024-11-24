'use client';
import { useEffect, useRef } from 'react';

export default function DoodleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    // Calculate number of doodles based on screen size
    const calculateDoodleCount = () => {
      const area = window.innerWidth * window.innerHeight;
      const baseCount = 20;
      const multiplier = Math.max(1, Math.min(3, area / (1920 * 1080)));
      return Math.floor(baseCount * multiplier);
    };

    // Updated doodle shapes configuration with dynamic count
    const doodles = Array.from({ length: calculateDoodleCount() }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 40 + 20,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      type: Math.floor(Math.random() * 6), // Now 6 different shapes
      color: `hsla(${Math.random() * 360}, 70%, 80%, 0.2)` // Pastel colors
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      doodles.forEach(doodle => {
        ctx.save();
        ctx.translate(doodle.x, doodle.y);
        ctx.rotate(doodle.rotation);
        
        ctx.strokeStyle = doodle.color;
        ctx.lineWidth = 2;

        switch(doodle.type) {
          case 0: // Circle
            ctx.beginPath();
            ctx.arc(0, 0, doodle.size/2, 0, Math.PI * 2);
            ctx.stroke();
            break;
          case 1: // Square
            ctx.strokeRect(-doodle.size/2, -doodle.size/2, doodle.size, doodle.size);
            break;
          case 2: // Star
            drawStar(ctx, 0, 0, 5, doodle.size/2, doodle.size/4);
            ctx.stroke();
            break;
          case 3: // Spiral
            drawSpiral(ctx, doodle.size);
            break;
          case 4: // Heart
            drawHeart(ctx, doodle.size);
            break;
          case 5: // Zigzag
            drawZigzag(ctx, doodle.size);
            break;
        }

        ctx.restore();

        // Update position and rotation
        doodle.x += doodle.speedX;
        doodle.y += doodle.speedY;
        doodle.rotation += doodle.rotationSpeed;

        // Wrap around edges instead of bouncing
        doodle.x = (doodle.x + canvas.width) % canvas.width;
        doodle.y = (doodle.y + canvas.height) % canvas.height;
      });

      requestAnimationFrame(animate);
    };

    // Helper functions for new shapes
    function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) {
      let rot = Math.PI / 2 * 3;
      let x = cx;
      let y = cy;
      let step = Math.PI / spikes;

      ctx.beginPath();
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        
        rot += step;
      }
      ctx.lineTo(cx + Math.cos(Math.PI / 2 * 3) * outerRadius, cy + Math.sin(Math.PI / 2 * 3) * outerRadius);
    }

    function drawSpiral(ctx: CanvasRenderingContext2D, size: number) {
      ctx.beginPath();
      for (let i = 0; i < 360; i += 5) {
        const angle = i * Math.PI / 180;
        const radius = (size / 40) * i / 10;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    function drawHeart(ctx: CanvasRenderingContext2D, size: number) {
      const scale = size / 30;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        -scale * 10, -scale * 10,
        -scale * 10, -scale * 15,
        0, -scale * 15
      );
      ctx.bezierCurveTo(
        scale * 10, -scale * 15,
        scale * 10, -scale * 10,
        0, 0
      );
      ctx.stroke();
    }

    function drawZigzag(ctx: CanvasRenderingContext2D, size: number) {
      ctx.beginPath();
      const steps = 5;
      const stepSize = size / steps;
      for (let i = 0; i <= steps; i++) {
        const x = (i * stepSize) - (size / 2);
        const y = (i % 2 === 0 ? -1 : 1) * (size / 4);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    animate();

    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
}
