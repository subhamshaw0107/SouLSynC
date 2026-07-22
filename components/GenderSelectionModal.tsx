import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Heart, Zap, Waves, Activity, Fingerprint, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface GenderSelectionModalProps {
  onSelectGender: (gender: "Male" | "Female") => void;
}

const CALIBRATION_STEPS = [
  "Booting Quantum Bio-Resonance Link...",
  "Analyzing Polar Field Harmonics...",
  "Aligning Temporal Destiny Coordinates...",
  "Harmonizing Binary Frequency Vectors...",
  "Establishing Secure Multipath Sync..."
];

export default function GenderSelectionModal({ onSelectGender }: GenderSelectionModalProps) {
  const [selected, setSelected] = useState<"Male" | "Female" | null>(null);
  const [loading, setLoading] = useState(false);
  const [calibrationPhase, setCalibrationPhase] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<"Male" | "Female" | null>(null);
  const [ripple, setRipple] = useState<{ x: number; y: number; id: number } | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize Web Audio context safely
  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };

  // Play custom synthesizer chime matching selected gender polarity
  const playSelectSound = (type: "male" | "female" | "hover") => {
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = "lowpass";

      if (type === "male") {
        // Futuristic cyber clean perfect fifth interval
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.16); // G5
        filter.frequency.setValueAtTime(1400, ctx.currentTime);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      } else if (type === "female") {
        // Rich warm mystical celestial sound
        osc.type = "triangle";
        osc.frequency.setValueAtTime(440.0, ctx.currentTime); // A4
        osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.2); // E5
        filter.frequency.setValueAtTime(1100, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      } else {
        // Soft ambient hover tic
        osc.type = "sine";
        osc.frequency.setValueAtTime(960, ctx.currentTime);
        gain.gain.setValueAtTime(0.015, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      }

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch (_) {}
  };

  // Safe sub-resonance rumble for calibration startup
  const playCalibrationSub = () => {
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(45, ctx.currentTime); // Very rich 45Hz sub
      osc.frequency.linearRampToValueAtTime(90, ctx.currentTime + 1.8);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 2.1);
    } catch (_) {}
  };

  // Calibration progress cycling
  useEffect(() => {
    let interval: any = null;
    if (loading) {
      interval = setInterval(() => {
        setCalibrationPhase((prev) => {
          if (prev < CALIBRATION_STEPS.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 350);
    } else {
      setCalibrationPhase(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading]);

  const handleSelect = (gender: "Male" | "Female") => {
    setSelected(gender);
    playSelectSound(gender === "Male" ? "male" : "female");
  };

  const handleCardClick = (e: React.MouseEvent<HTMLButtonElement>, gender: "Male" | "Female") => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipple({ x, y, id: Date.now() });
    handleSelect(gender);
  };

  const handleSubmit = () => {
    if (!selected) return;
    setLoading(true);
    playCalibrationSub();

    setTimeout(() => {
      onSelectGender(selected);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050209]/92 backdrop-blur-3xl select-none overflow-y-auto">
      
      {/* Dynamic Cinematic Glimmers in Background */}
      <div 
        className="absolute top-1/4 left-1/4 w-[450px] h-[450px] rounded-full filter blur-[140px] pointer-events-none transition-all duration-[1200ms] ease-out opacity-40 animate-pulse"
        style={{
          background: selected === "Male" 
            ? "radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)" 
            : selected === "Female" 
            ? "radial-gradient(circle, rgba(244,63,94,0.2) 0%, transparent 70%)" 
            : "radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)"
        }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full filter blur-[140px] pointer-events-none transition-all duration-[1200ms] ease-out opacity-40 animate-pulse"
        style={{
          background: selected === "Male" 
            ? "radial-gradient(circle, rgba(14,116,144,0.15) 0%, transparent 70%)" 
            : selected === "Female" 
            ? "radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)" 
            : "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)"
        }}
      />

      {/* Cybernetic High-Tech Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(244,63,94,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(244,63,94,0.012)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* Outer Floating Star Elements */}
      <div className="absolute top-12 left-[12%] opacity-10 animate-bounce duration-[8000ms] pointer-events-none">
        <Heart className="w-12 h-12 text-rose-500 fill-rose-500" />
      </div>
      <div className="absolute bottom-16 right-[10%] opacity-15 animate-bounce duration-[10000ms] pointer-events-none">
        <Heart className="w-14 h-14 text-cyan-500 fill-cyan-500" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl bg-zinc-950/85 border border-zinc-900/60 rounded-[36px] p-6 md:p-10 shadow-[0_25px_100px_rgba(0,0,0,0.85)] relative overflow-hidden"
      >
        {/* Soft edge reactive light frame */}
        <div 
          className="absolute inset-[0.8px] rounded-[36px] pointer-events-none transition-all duration-1000 border"
          style={{
            borderColor: selected === "Male" 
              ? "rgba(6, 182, 212, 0.3)" 
              : selected === "Female" 
              ? "rgba(244, 63, 94, 0.3)" 
              : "rgba(244, 63, 94, 0.1)"
          }}
        />

        {/* Ambient Top Glow Point */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[2px] blur-[3px] transition-all duration-1000"
          style={{
            background: selected === "Male" 
              ? "linear-gradient(90deg, transparent, #06b6d4, transparent)" 
              : selected === "Female" 
              ? "linear-gradient(90deg, transparent, #f43f5e, transparent)" 
              : "linear-gradient(90deg, transparent, #ec4899, transparent)"
          }}
        />

        <div className="flex flex-col items-center text-center relative z-10">
          
          {/* Futuristic Signal Radiator Badge */}
          <div className="relative mb-6">
            <motion.div 
              animate={{ 
                scale: selected ? [1, 1.15, 1.05] : 1,
                rotate: 360 
              }}
              transition={{ 
                scale: { duration: 0.6 }, 
                rotate: { duration: 30, repeat: Infinity, ease: "linear" } 
              }}
              className={`w-16 h-16 rounded-[22px] flex items-center justify-center relative transition-all duration-500 shadow-xl ${
                selected === "Male"
                  ? "bg-gradient-to-tr from-cyan-500 to-sky-600 shadow-cyan-900/30"
                  : selected === "Female"
                  ? "bg-gradient-to-tr from-rose-500 to-fuchsia-600 shadow-rose-900/30"
                  : "bg-zinc-900 border border-zinc-800 text-rose-350"
              }`}
            >
              {selected ? (
                <Heart className="w-7 h-7 text-white fill-white animate-pulse" />
              ) : (
                <Fingerprint className="w-6 h-6 text-rose-300 animate-pulse" />
              )}
            </motion.div>
            
            {/* Ambient outer orbit radar vector lines */}
            <div className={`absolute -inset-4 rounded-[26px] border border-dashed transition-colors duration-500 ${
              selected === "Male" 
                ? "border-cyan-500/30 animate-[spin_40s_linear_infinite]" 
                : selected === "Female" 
                ? "border-rose-500/30 animate-[spin_40s_linear_infinite_reverse]" 
                : "border-zinc-800"
            }`} />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-fuchsia-200 to-cyan-100 mb-2 font-sans uppercase">
            Synthesize Polarity
          </h2>
          
          {/* Subtitle / Live Frequency Tagline */}
          <div className="h-6 mb-8 flex items-center justify-center">
            <p className="text-[10px] md:text-xs font-mono tracking-[0.2em] transition-all duration-500 font-semibold"
               style={{
                 color: selected === "Male" ? "#22d3ee" : selected === "Female" ? "#f43f5e" : "#a1a1aa"
               }}
            >
              {selected === "Male" 
                ? "[♂ MODEL BROADCAST]: PROJECTOR ACTIVE • TARGET RESIDENCY (♀)" 
                : selected === "Female" 
                ? "[♀ MODEL BROADCAST]: RECEPTOR ACTIVE • TARGET RESIDENCY (♂)" 
                : "AWAITING BIOMETRIC POLARIZATION SIGNAL..."}
            </p>
          </div>
        </div>

        {/* Dynamic Equalizer Visualizer Bars - only visible/dancing when selected or hovered */}
        <div className="flex items-end justify-center gap-1.5 h-10 mb-8 z-10 relative">
          {[...Array(12)].map((_, i) => {
            const delay = i * 0.08;
            return (
              <motion.div
                key={i}
                initial={{ height: 4 }}
                animate={{
                  height: loading
                    ? [8, 38, 12, 40, 8]
                    : hoveredCard || selected
                    ? [4, 18 + Math.sin(i) * 14, 4, i % 2 === 0 ? 28 : 14, 4]
                    : [4, 8, 4]
                }}
                transition={{
                  repeat: Infinity,
                  duration: loading ? 0.6 + i * 0.05 : 1.2,
                  delay: delay,
                  ease: "easeInOut"
                }}
                className={`w-1 rounded-full transition-colors duration-700 ${
                  selected === "Male" || hoveredCard === "Male"
                    ? "bg-gradient-to-t from-cyan-600 to-cyan-400"
                    : selected === "Female" || hoveredCard === "Female"
                    ? "bg-gradient-to-t from-rose-600 to-rose-400"
                    : "bg-zinc-800"
                }`}
              />
            );
          })}
            {/* Polarity Choices Deck */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8 relative z-10 w-full">
          
          {/* Option: Male (Cyan) */}
          <button
            type="button"
            onMouseEnter={() => {
              setHoveredCard("Male");
              if (!selected) playSelectSound("hover");
            }}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={(e) => handleCardClick(e, "Male")}
            disabled={loading}
            className={`group text-left rounded-2xl border transition-all duration-500 relative overflow-hidden flex flex-col justify-end aspect-[1.2/1] md:aspect-[1.1/1] cursor-pointer active:scale-98 select-none p-5 ${
              selected === "Male"
                ? "bg-zinc-950 border-cyan-500 shadow-[0_0_35px_rgba(6,182,212,0.3)]"
                : "bg-zinc-950 border-zinc-900 hover:border-cyan-500/50"
            }`}
          >
            {/* Portrait Background View */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              <img 
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80" 
                alt="Male portrait" 
                className={`w-full h-full object-cover transition-all duration-700 ${
                  selected === "Male" 
                    ? "opacity-80 scale-105" 
                    : "opacity-40 group-hover:opacity-75 group-hover:scale-105 filter grayscale-[20%]"
                }`}
              />
              {/* Bottom and overall dark gradient shield overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-black/10 z-10" />
            </div>

            {/* Foreground Content */}
            <div className="relative z-10 w-full flex flex-col justify-between h-full">
              {/* Top Row indicators */}
              <div className="flex justify-between items-start w-full">
                <span className={`text-3xl font-black font-mono transition-colors duration-500 ${
                  selected === "Male" ? "text-cyan-400" : "text-zinc-500 group-hover:text-cyan-400"
                }`}>
                  ♂
                </span>
                
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-500 ${
                  selected === "Male" 
                    ? "bg-cyan-500/20 border-cyan-400/50 text-cyan-200" 
                    : "bg-zinc-950/80 border-zinc-800 text-zinc-500 group-hover:text-cyan-400 group-hover:border-cyan-500/30"
                }`}>
                  <Zap className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Simple Label Content */}
              <div>
                <h3 className={`text-xl font-black uppercase tracking-wider transition-colors duration-500 ${
                  selected === "Male" ? "text-cyan-400" : "text-slate-100 group-hover:text-cyan-300"
                }`}>
                  Male
                </h3>
              </div>
            </div>

            {/* Micro ripples */}
            {selected === "Male" && ripple && (
              <motion.span 
                key={ripple.id}
                initial={{ scale: 0.1, opacity: 0.8 }}
                animate={{ scale: 3.5, opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute w-12 h-12 rounded-full bg-cyan-400/20 pointer-events-none"
                style={{ left: ripple.x - 24, top: ripple.y - 24 }}
              />
            )}
          </button>

          {/* Option: Female (Rose/Pink) */}
          <button
            type="button"
            onMouseEnter={() => {
              setHoveredCard("Female");
              if (!selected) playSelectSound("hover");
            }}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={(e) => handleCardClick(e, "Female")}
            disabled={loading}
            className={`group text-left rounded-2xl border transition-all duration-500 relative overflow-hidden flex flex-col justify-end aspect-[1.2/1] md:aspect-[1.1/1] cursor-pointer active:scale-98 select-none p-5 ${
              selected === "Female"
                ? "bg-zinc-950 border-rose-500 shadow-[0_0_35px_rgba(244,63,94,0.3)]"
                : "bg-zinc-950 border-zinc-900 hover:border-rose-500/50"
            }`}
          >
            {/* Portrait Background View */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80" 
                alt="Female portrait" 
                className={`w-full h-full object-cover transition-all duration-700 ${
                  selected === "Female" 
                    ? "opacity-80 scale-105" 
                    : "opacity-40 group-hover:opacity-75 group-hover:scale-105 filter grayscale-[20%]"
                }`} 
              />
              {/* Bottom and overall dark gradient shield overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-black/10 z-10" />
            </div>

            {/* Foreground Content */}
            <div className="relative z-10 w-full flex flex-col justify-between h-full">
              {/* Top Row indicators */}
              <div className="flex justify-between items-start w-full font-sans">
                <span className={`text-3xl font-black font-mono transition-colors duration-500 ${
                  selected === "Female" ? "text-rose-400" : "text-zinc-500 group-hover:text-rose-400"
                }`}>
                  ♀
                </span>
                
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-500 ${
                  selected === "Female" 
                    ? "bg-rose-500/20 border-rose-400/50 text-rose-200" 
                    : "bg-zinc-950/80 border-zinc-800 text-zinc-500 group-hover:text-rose-400 group-hover:border-rose-500/30"
                }`}>
                  <Waves className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Simple Label Content */}
              <div>
                <h3 className={`text-xl font-black uppercase tracking-wider transition-colors duration-500 ${
                  selected === "Female" ? "text-rose-400" : "text-slate-100 group-hover:text-rose-300"
                }`}>
                  Female
                </h3>
              </div>
            </div>

            {/* Micro ripples */}
            {selected === "Female" && ripple && (
              <motion.span 
                key={ripple.id}
                initial={{ scale: 0.1, opacity: 0.8 }}
                animate={{ scale: 3.5, opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute w-12 h-12 rounded-full bg-rose-400/20 pointer-events-none"
                style={{ left: ripple.x - 24, top: ripple.y - 24 }}
              />
            )}
          </button>

        </div>

        </div>

        {/* Loading / Active Calibration Matrix progress display */}
        <div className="min-h-[64px] mb-6 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="space-y-4 relative z-10 w-full"
              >
                {/* Micro progression stats */}
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 tracking-wider">
                  <span className="flex items-center gap-1">
                    <Activity className="w-3 h-3 text-rose-500 animate-pulse" />
                    STATUS: SYNAPSE CALIBRATION
                  </span>
                  <span>{Math.floor((calibrationPhase + 1) * 20)}% COMPLETE</span>
                </div>

                {/* Animated glowing bar */}
                <div className="w-full bg-zinc-900/40 rounded-full h-2 overflow-hidden p-[1px] border border-zinc-800/60 relative">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2.0, ease: "easeInOut" }}
                    className={`h-full rounded-full relative ${
                      selected === "Male" 
                        ? "bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 shadow-[0_0_15px_rgba(6,182,212,0.6)]" 
                        : "bg-gradient-to-r from-rose-500 via-pink-400 to-fuchsia-500 shadow-[0_0_15px_rgba(244,63,94,0.6)]"
                    }`}
                  />
                </div>

                <div className="text-center">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={CALIBRATION_STEPS[calibrationPhase]}
                      initial={{ opacity: 0, y: 6, filter: "blur(2px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -6, filter: "blur(2px)" }}
                      transition={{ duration: 0.18 }}
                      className="text-xs font-mono font-medium tracking-wide text-rose-200"
                    >
                      {CALIBRATION_STEPS[calibrationPhase]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </motion.div>
            ) : selected ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-zinc-900/30 border border-zinc-900 rounded-xl text-center flex items-center justify-center gap-2"
              >
                <div className={`w-2 h-2 rounded-full animate-ping ${selected === "Male" ? "bg-cyan-400" : "bg-rose-400"}`} />
                <span className="text-[11px] font-mono tracking-wider text-zinc-400 uppercase">
                  Biometrics Registered • Ready to activate terminal stream
                </span>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Calibration trigger action button */}
        <button
          type="button"
          disabled={!selected || loading}
          onClick={handleSubmit}
          className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2.5 text-sm uppercase tracking-wider relative select-none cursor-pointer outline-none ${
            selected && !loading
              ? selected === "Male"
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_25px_rgba(6,182,212,0.3)] active:scale-99"
                : "bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:from-rose-400 hover:to-fuchsia-500 text-white shadow-[0_0_25px_rgba(244,63,94,0.3)] active:scale-99"
              : "bg-zinc-900/40 text-zinc-600 border border-zinc-900/80 pointer-events-none"
          }`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Confirm Calibration Protocol</span>
            </>
          )}
        </button>

        {/* Security / System Footer */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="h-[1px] w-8 bg-zinc-900" />
          <p className="text-[9px] text-zinc-600 font-mono tracking-[0.25em] uppercase text-center">
            SouLSynC secure telemetry protocol active
          </p>
          <div className="h-[1px] w-8 bg-zinc-900" />
        </div>

      </motion.div>
    </div>
  );
}
