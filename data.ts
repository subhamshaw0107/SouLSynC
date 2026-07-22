/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from "react";

interface SeededPetal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  oscillateSpeed: number;
}

interface GlowingDot {
  x: number;
  y: number;
  size: number;
  speedY: number;
  opacity: number;
  pulseSpeed: number;
  pulseTimer: number;
}

export default function FallingPetals() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let petals: SeededPetal[] = [];
    let dots: GlowingDot[] = [];
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Initialize petals
    const initElements = () => {
      petals = Array.from({ length: 40 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 12 + 8,
        speedY: Math.random() * 0.8 + 0.6,
        speedX: Math.random() * 0.4 - 0.2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: Math.random() * 0.015 - 0.0075,
        opacity: Math.random() * 0.45 + 0.35,
        oscillateSpeed: Math.random() * 0.02 + 0.005,
      }));

      dots = Array.from({ length: 45 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 1.0,
        speedY: Math.random() * 0.2 + 0.1,
        opacity: Math.random() * 0.5 + 0.2,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        pulseTimer: Math.random() * Math.PI * 2,
      }));
    };

    initElements();

    // Drawer function
    const drawPetals = (petal: SeededPetal, time: number) => {
      ctx.save();
      // Add slight swaying motion
      const swayX = Math.sin(time * petal.oscillateSpeed) * 1.2;
      ctx.translate(petal.x + swayX, petal.y);
      ctx.rotate(petal.rotation);

      // Creative drawing of a rose petal
      ctx.beginPath();
      ctx.ellipse(0, 0, petal.size, petal.size * 0.7, 0, 0, Math.PI * 2);
      ctx.closePath();

      // Soft red, magenta glow gradient
      const gradient = ctx.createLinearGradient(-petal.size, -petal.size, petal.size, petal.size);
      gradient.addColorStop(0, `rgba(239, 68, 110, ${petal.opacity})`); // Pinkish red
      gradient.addColorStop(0.5, `rgba(225, 29, 72, ${petal.opacity * 0.95})`); // Primary rose ruby
      gradient.addColorStop(1, `rgba(159, 18, 57, ${petal.opacity * 0.7})`); // Dark cherry ruby

      ctx.fillStyle = gradient;
      
      // Shadow/Glow effect on petal
      ctx.shadowBlur = petal.size / 2;
      ctx.shadowColor = "rgba(239, 68, 68, 0.4)";
      ctx.fill();

      // Petal center crease line
      ctx.beginPath();
      ctx.moveTo(-petal.size, 0);
      ctx.quadraticCurveTo(0, petal.size * 0.1, petal.size, 0);
      ctx.strokeStyle = `rgba(255, 120, 150, ${petal.opacity * 0.5})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();
    };

    const drawDot = (dot: GlowingDot) => {
      ctx.save();
      
      // Pulsating glow dots
      const dynamicOpacity = dot.opacity * (0.4 + 0.6 * Math.sin(dot.pulseTimer));
      ctx.fillStyle = `rgba(244, 63, 94, ${dynamicOpacity})`; // Glowing rose
      ctx.shadowBlur = dot.size * 4;
      ctx.shadowColor = "rgba(244, 63, 94, 0.7)";
      
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    let lastTime = 0;
    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render glowing soft warm background spots
      const centerGrad = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, canvas.width * 0.1,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.8
      );
      centerGrad.addColorStop(0, "rgba(20, 10, 25, 1)");
      centerGrad.addColorStop(1, "rgba(8, 4, 12, 1)");
      ctx.fillStyle = centerGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render dots
      dots.forEach((dot) => {
        dot.y += dot.speedY;
        dot.pulseTimer += dot.pulseSpeed;
        if (dot.y > canvas.height) {
          dot.y = -5;
          dot.x = Math.random() * canvas.width;
        }
        drawDot(dot);
      });

      // Render petals
      petals.forEach((petal) => {
        petal.y += petal.speedY;
        petal.x += petal.speedX;
        petal.rotation += petal.rotationSpeed;

        if (petal.y > canvas.height + 20) {
          petal.y = -20;
          petal.x = Math.random() * canvas.width;
          petal.opacity = Math.random() * 0.45 + 0.35;
        }

        if (petal.x > canvas.width + 20) petal.x = -20;
        else if (petal.x < -20) petal.x = canvas.width + 20;

        drawPetals(petal, time);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="cozy-background-canvas"
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}
