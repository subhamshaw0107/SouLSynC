import React, { useEffect, useRef, useState } from "react";
import { Sparkles, Heart, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CinematicIntroProps {
  onComplete: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  decay: number;
  gravity?: number;
}

export default function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [phase, setPhase] = useState<"converge" | "fuse" | "heartbeat" | "done">("converge");
  const [showSkip, setShowSkip] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [heartbeatScale, setHeartbeatScale] = useState(1);
  const [currentQuote, setCurrentQuote] = useState("");

  const particlesRef = useRef<Particle[]>([]);
  const animationFrameId = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const quotes = [
    "Two unique frequencies...",
    "Divided by distance...",
    "Bound by destiny...",
    "Synchronized into a single heartbeat."
  ];

  // Trigger phase timers
  useEffect(() => {
    // Show Skip button after a brief gap (1.5s) to let user feel the atmosphere
    const skipTimer = setTimeout(() => setShowSkip(true), 1500);

    // Sequential romantic text reveal
    let quoteIndex = 0;
    setCurrentQuote(quotes[0]);

    const quoteTimer1 = setTimeout(() => setCurrentQuote(quotes[1]), 1600);
    const quoteTimer2 = setTimeout(() => setCurrentQuote(quotes[2]), 3200);
    const quoteTimer3 = setTimeout(() => setCurrentQuote(quotes[3]), 4800);

    // Phase transition timers
    const fuseTimer = setTimeout(() => {
      setPhase("fuse");
      triggerFusionExplosion();
      playSynthSwell();
    }, 3000); // Heart pieces meet at 3.0 seconds

    const heartbeatTimer = setTimeout(() => {
      setPhase("heartbeat");
      startHeartbeatLoop();
    }, 3800); // Star heartbeat double-pulsing

    const completeTimer = setTimeout(() => {
      handleCompleteAnimation();
    }, 7800); // Complete and transition to homepage

    return () => {
      clearTimeout(skipTimer);
      clearTimeout(quoteTimer1);
      clearTimeout(quoteTimer2);
      clearTimeout(quoteTimer3);
      clearTimeout(fuseTimer);
      clearTimeout(heartbeatTimer);
      clearTimeout(completeTimer);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  // Web Audio Synth for premium cinematic sound design (Optional upon user engagement)
  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };

  const toggleAudio = () => {
    if (!isAudioEnabled) {
      initAudio();
      setIsAudioEnabled(true);
      // Play soft cosmic background pad
      playBackgroundPad();
    } else {
      setIsAudioEnabled(false);
    }
  };

  // Cosmic ambient pad sound code
  const playBackgroundPad = () => {
    const ctx = audioCtxRef.current;
    if (!ctx || !isAudioEnabled) return;

    try {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(110, ctx.currentTime); // A2 low warmth (110Hz)
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(165, ctx.currentTime); // E3 perfect fifth (165Hz)

      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 2.0);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start();
      osc2.start();

      // Slowly decay pad over intro duration
      gainNode.gain.setValueAtTime(0.08, ctx.currentTime + 5.5);
      gainNode.gain.quadraticRampToValueAtTime(0, ctx.currentTime + 7.5);

      setTimeout(() => {
        try {
          osc1.stop();
          osc2.stop();
        } catch (_) {}
      }, 8000);
    } catch (e) {
      console.warn("Audio Context pad fail", e);
    }
  };

  // Play synthetic cinematic swell when pieces join
  const playSynthSwell = () => {
    const ctx = audioCtxRef.current;
    if (!ctx || !isAudioEnabled) return;

    try {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, ctx.currentTime); // A3 frequency
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.8); // Rise up octave to A4

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(150, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.6);

      gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.3);
    } catch (_) {}
  };

  // Play deep synthetic heartbeat *lub-dub*
  const playHeartbeatSound = () => {
    const ctx = audioCtxRef.current;
    if (!ctx || !isAudioEnabled) return;

    try {
      // Lub
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.frequency.setValueAtTime(55, ctx.currentTime); // Low A1 (55Hz)
      osc1.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.15);
      gain1.gain.setValueAtTime(0.3, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.2);

      // Dub (slightly higher and tighter amplitude)
      setTimeout(() => {
        if (!audioCtxRef.current || !isAudioEnabled) return;
        const osc2 = audioCtxRef.current.createOscillator();
        const gain2 = audioCtxRef.current.createGain();
        osc2.frequency.setValueAtTime(62, audioCtxRef.current.currentTime); // B1 freq (61.7Hz)
        osc2.frequency.exponentialRampToValueAtTime(10, audioCtxRef.current.currentTime + 0.18);
        gain2.gain.setValueAtTime(0.25, audioCtxRef.current.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.18);
        osc2.connect(gain2);
        gain2.connect(audioCtxRef.current.destination);
        osc2.start();
        osc2.stop(audioCtxRef.current.currentTime + 0.22);
      }, 150);
    } catch (_) {}
  };

  // Canvas particle setup and rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initial stars in stellar sky
    for (let i = 0; i < 60; i++) {
      particlesRef.current.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        color: i % 2 === 0 ? "rgba(244, 63, 94, 0.4)" : "rgba(236, 72, 153, 0.35)",
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.6 + 0.2,
        decay: 0
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render drifting space dust
      particlesRef.current.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around margins
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Apply decay if transient particle
        if (p.decay > 0) {
          p.alpha -= p.decay;
          if (p.gravity) p.vy += p.gravity;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.beginPath();
        // Add subtle neon bloom to sparks
        if (p.size > 2.5) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
        }
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.restore();
      });

      // Filter out depleted particles
      particlesRef.current = particlesRef.current.filter((p) => p.alpha > 0.02);

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  // Shockwave burst of particles when pieces join
  const triggerFusionExplosion = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Create ring and sparkly bursts
    for (let i = 0; i < 120; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4.5 + 1.5;
      const r = Math.random() * 255;
      const g = Math.random() * 80 + 30;
      const b = Math.random() * 140 + 115;

      particlesRef.current.push({
        x: centerX + (Math.random() - 0.5) * 8,
        y: centerY + (Math.random() - 0.5) * 8,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: `rgba(${Math.floor(240 + Math.random() * 15)}, ${Math.floor(50 + Math.random() * 50)}, ${Math.floor(100 + Math.random() * 100)}, 1)`,
        size: Math.random() * 3.5 + 1.5,
        alpha: 1,
        decay: Math.random() * 0.015 + 0.008,
        gravity: 0.02 // slight fall off like fairy dust
      });
    }

    // Add bright high-velocity sparks
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      particlesRef.current.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: "#ffffff",
        size: Math.random() * 2.5 + 1,
        alpha: 1,
        decay: Math.random() * 0.03 + 0.02,
        gravity: 0.05
      });
    }
  };

  // Spark pulses emanating from the heart with visual pulse timing
  const startHeartbeatLoop = () => {
    let loopCount = 0;
    const triggerPulse = () => {
      // Heart double pulse sequence scale animation
      // 1. First beat (lub)
      setHeartbeatScale(1.16);
      spawnHeartbeatSparks();
      playHeartbeatSound();

      setTimeout(() => {
        setHeartbeatScale(1.04);
      }, 100);

      // 2. Second beat (dub)
      setTimeout(() => {
        setHeartbeatScale(1.22);
        spawnHeartbeatSparks();
        setTimeout(() => {
          setHeartbeatScale(1);
        }, 120);
      }, 160);

      loopCount++;
    };

    // Run first immediately
    triggerPulse();

    // Loop interval matching average romantic slow pulse (approx 72 bpm -> every 1.5 seconds)
    const interval = setInterval(triggerPulse, 1600);

    return () => clearInterval(interval);
  };

  const spawnHeartbeatSparks = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Send gentle rings of expanding dust outward
    for (let i = 0; i < 18; i++) {
      const angle = (i * Math.PI * 2) / 18 + (Math.random() - 0.5) * 0.2;
      const speed = 1.8;
      particlesRef.current.push({
        x: centerX + Math.cos(angle) * 45,
        y: centerY + Math.sin(angle) * 45,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: "rgba(244, 63, 94, 0.75)",
        size: 1.5,
        alpha: 0.8,
        decay: 0.02
      });
    }
  };

  const handleCompleteAnimation = () => {
    setPhase("done");
    setTimeout(() => {
      onComplete();
    }, 800); // Wait for AnimatePresence fade-out transition
  };

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          id="viral-romantic-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050209] select-none overflow-hidden"
        >
          {/* Main high performance vector graphics canvas background */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />

          {/* Glowing Radial Vignette Layer */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.03)_0%,rgba(5,2,9,1)_80%)] pointer-events-none" />

          {/* Quick Audio Control Toggle */}
          <div className="absolute top-6 left-6 z-[110] flex items-center gap-3">
            <button
              onClick={toggleAudio}
              className="px-3.5 py-2 rounded-full bg-zinc-950/40 hover:bg-zinc-900 border border-rose-500/15 text-rose-300 flex items-center gap-2 text-xs font-mono transition-all cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.5)] active:scale-95"
            >
              {isAudioEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                  <span>Cinematic Sound ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Tap to Unmute Experience</span>
                </>
              )}
            </button>
          </div>

          {/* Dynamic skip button */}
          {showSkip && (
            <div className="absolute top-6 right-6 z-[110]">
              <button
                id="skip-intro"
                onClick={handleCompleteAnimation}
                className="px-4.5 py-2 rounded-xl bg-zinc-950/40 hover:bg-rose-500/10 border border-zinc-800 hover:border-rose-500/30 text-zinc-400 hover:text-rose-200 transition-all font-mono text-xs cursor-pointer select-none active:scale-95 shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
              >
                Skip Ritual →
              </button>
            </div>
          )}

          {/* MAIN HEART PIECES COMPLEX AREA */}
          <div className="relative flex items-center justify-center w-[280px] h-[280px] md:w-[350px] md:h-[350px] select-none scale-100">
            
            {/* Ambient halo glow ring */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                animate={{
                  scale: phase === "heartbeat" ? [0.85, 1.12, 1.0, 1.18, 0.95] : 0.8,
                  opacity: phase === "heartbeat" ? [0.15, 0.45, 0.25, 0.5, 0.2] : 0.1,
                }}
                transition={{
                  duration: phase === "heartbeat" ? 1.6 : 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-[180px] h-[180px] md:w-[240px] md:h-[240px] rounded-full bg-gradient-to-tr from-rose-500/30 to-fuchsia-600/30 filter blur-[45px]"
              />
            </div>

            {/* Glowing White center core flash on transition */}
            <AnimatePresence>
              {phase === "fuse" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.1 }}
                  animate={{ opacity: [1, 1, 0], scale: [0.1, 7.5, 9.5] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute z-20 w-8 h-8 rounded-full bg-white filter blur-[3px]"
                />
              )}
            </AnimatePresence>

            {/* HEART SVG STAGE */}
            <motion.div
              animate={{ scale: heartbeatScale }}
              transition={{ type: "spring", stiffness: 180, damping: 10 }}
              className="w-full h-full relative flex items-center justify-center"
            >
              <svg
                viewBox="0 0 200 200"
                className="w-full h-full drop-shadow-[0_0_25px_rgba(244,63,94,0.45)]"
              >
                <defs>
                  {/* Neon Glow Filters */}
                  <filter id="cinematic-neon" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#f43f5e" floodOpacity="0.85" />
                    <feDropShadow dx="0" dy="0" stdDeviation="15" floodColor="#ec4899" floodOpacity="0.6" />
                    <feDropShadow dx="0" dy="0" stdDeviation="35" floodColor="#a855f7" floodOpacity="0.3" />
                  </filter>

                  {/* Gradient for left piece */}
                  <linearGradient id="left-neon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#f43f5e" />
                  </linearGradient>

                  {/* Gradient for right piece */}
                  <linearGradient id="right-neon-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f43f5e" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>

                  {/* Fully Fused Sparkle Gradient */}
                  <linearGradient id="fused-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff4b72" />
                    <stop offset="50%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>

                {/* Left Broken Piece */}
                {phase === "converge" && (
                  <motion.path
                    d="M 100 50 C 70 20, 30 40, 30 80 C 30 120, 65 140, 100 160 L 102 145 L 93 130 L 108 110 L 95 90 L 105 70 Z"
                    fill="url(#left-neon-grad)"
                    filter="url(#cinematic-neon)"
                    initial={{ x: -280, y: -40, rotate: -28, opacity: 0 }}
                    animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                    transition={{
                      duration: 3.0,
                      ease: [0.34, 1.35, 0.64, 1], // cinematic back-out easing
                    }}
                  />
                )}

                {/* Right Broken Piece */}
                {phase === "converge" && (
                  <motion.path
                    d="M 100 50 L 105 70 L 95 90 L 108 110 L 93 130 L 102 145 L 100 160 C 135 140, 170 120, 170 80 C 170 40, 130 20, 100 50 Z"
                    fill="url(#right-neon-grad)"
                    filter="url(#cinematic-neon)"
                    initial={{ x: 280, y: 40, rotate: 28, opacity: 0 }}
                    animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                    transition={{
                      duration: 3.0,
                      ease: [0.34, 1.35, 0.64, 1],
                    }}
                  />
                )}

                {/* Single unified completely healed heart - shows up fully fused with gradient and extra glitter */}
                {(phase === "fuse" || phase === "heartbeat") && (
                  <motion.path
                    d="M 100 50 C 70 20, 30 40, 30 80 C 30 120, 70 145, 100 180 C 130 145, 170 120, 170 80 C 170 40, 130 20, 100 50 Z"
                    fill="url(#fused-grad)"
                    filter="url(#cinematic-neon)"
                    initial={{ scale: 0.94, opacity: 0 }}
                    animate={{ 
                      scale: [0.94, 1.15, 1], 
                      opacity: 1 
                    }}
                    transition={{ 
                      duration: 0.6, 
                      ease: "easeOut"
                    }}
                  />
                )}
              </svg>
            </motion.div>
          </div>

          {/* LOWER EMOTIONAL TEXT NARRATIVE */}
          <div className="absolute bottom-20 text-center px-6 max-w-lg z-[110] select-none pointer-events-none">
            
            {/* Soft decorative system line */}
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-rose-500/40 to-transparent mx-auto mb-6" />

            <AnimatePresence mode="wait">
              <motion.p
                key={currentQuote}
                initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                animate={{ opacity: 0.9, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="text-sm md:text-base font-medium tracking-[0.16em] leading-relaxed text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-rose-100 to-fuchsia-200 font-sans"
                style={{ textShadow: "0 0 10px rgba(244,63,94,0.25)" }}
              >
                {currentQuote}
              </motion.p>
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === "heartbeat" ? 0.35 : 0 }}
              transition={{ duration: 1.2 }}
              className="mt-4 flex items-center justify-center gap-1 text-[9px] text-rose-400 font-mono tracking-widest uppercase"
            >
              <Sparkles className="w-2.5 h-2.5 animate-spin duration-[10000ms]" />
              <span>COSMIC RECONCILIATION COMPLETE</span>
            </motion.div>
          </div>

          {/* Elegant background footer brand */}
          <div className="absolute bottom-6 text-center z-50 pointer-events-none select-none">
            <p className="text-[10px] text-zinc-600 font-mono tracking-[0.25em] uppercase">
              SouLSynC Ritual Protocol
            </p>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
