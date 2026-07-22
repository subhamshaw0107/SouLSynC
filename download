import React, { useState, useEffect, useRef } from "react";
import { 
  Heart, Sparkles, Coffee, Music, Gamepad2, Tent, MapPin, 
  ArrowRight, ShieldCheck, Check, Search, RotateCcw, User, Eye
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MatchProfile } from "../types";
import { CANDIDATE_PROFILES } from "../data";

interface PartnerTypeMatchWizardProps {
  onClose: () => void;
  onPartnerSelected: (partner: MatchProfile) => void;
}

interface Trait {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
}

const PARTNER_TRAITS: Trait[] = [
  { id: "tall", name: "Tall", description: "Elevated physical height & commanding build", icon: "📐", category: "Physical" },
  { id: "handsome", name: "Handsome / Beautiful", description: "Striking aesthetics & facial symmetry", icon: "✨", category: "Physical" },
  { id: "rich", name: "Rich & Wealthy", description: "Empowered comfort & financial standing", icon: "💎", category: "Lifestyle" },
  { id: "funny", name: "Funny & Humorous", description: "Witty timing & positive vibe generator", icon: "😂", category: "Personality" },
  { id: "fair", name: "Fair Complexion", description: "Luminous and radiant complexion sync", icon: "☀️", category: "Aesthetic" },
  { id: "dusky", name: "Dusky Complexion", description: "Gorgeous, sun-kissed dusky elegance", icon: "🌙", category: "Aesthetic" },
  { id: "intellectual", name: "Intellectual / Smart", description: "Quick brain, deep logic & witty conversation", icon: "🧠", category: "Personality" },
  { id: "caring", name: "Caring & Kind", description: "Warm, empathetic listner with high emotional IQ", icon: "❤️", category: "Personality" },
  { id: "adventurous", name: "Adventurous Explorer", description: "Wild mountain hiking & starry night camping", icon: "🏕️", category: "Lifestyle" },
  { id: "athletic", name: "Athletic & Fit", description: "Active lifestyle & elevated physical stamina", icon: "⚡", category: "Physical" },
  { id: "creative", name: "Creative Soul", description: "Aesthetic music composer or custom designer vibe", icon: "🎨", category: "Personality" },
  { id: "loyal", name: "Loyal & Devoted", description: "Absolute trust & faithful commitment", icon: "🛡️", category: "Personality" }
];

const CANDIDATE_TRAITS_MAP: Record<string, string[]> = {
  m1: ["handsome", "funny", "fair", "intellectual", "caring", "creative", "loyal"], // Aria
  m2: ["handsome", "rich", "funny", "fair", "athletic", "creative", "loyal"], // Kaelen
  m3: ["tall", "dusky", "funny", "caring", "adventurous", "creative", "loyal"], // Seraphina
  m4: ["tall", "rich", "intellectual", "caring", "athletic", "loyal", "handsome"] // Julian
};

export default function PartnerTypeMatchWizard({ onClose, onPartnerSelected }: PartnerTypeMatchWizardProps) {
  const [step, setStep] = useState<"ask_type" | "scanning" | "results">("ask_type");
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [matches, setMatches] = useState<MatchProfile[]>([]);
  const [focusedPartner, setFocusedPartner] = useState<MatchProfile | null>(null);
  const [runningLogs, setRunningLogs] = useState<string[]>([]);
  
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Sound Engine
  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };

  const playSynthesizerNotes = (type: "select" | "hover" | "success" | "rumble") => {
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = "lowpass";

      if (type === "select") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      } else if (type === "success") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.linearRampToValueAtTime(1046.50, ctx.currentTime + 0.3); // C6 over-tone
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      } else if (type === "rumble") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(80, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(40, ctx.currentTime + 1.2);
        filter.frequency.setValueAtTime(200, ctx.currentTime);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.3);
      } else {
        osc.type = "sine";
        osc.frequency.setValueAtTime(900, ctx.currentTime);
        gain.gain.setValueAtTime(0.015, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      }

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    } catch (_) {}
  };

  // Safe logic log simulation for matching
  useEffect(() => {
    if (step !== "scanning") return;

    const phrases = [
      "Broadcasting bio-telemetries across local sector nodes...",
      `Aligning matched traits: ${selectedTraits.map(id => PARTNER_TRAITS.find(t => t.id === id)?.name || id).join(", ")}`,
      "Evaluating harmonic personality indices (INFJ, ENFP, INTJ)...",
      "Analyzing geographical proximity parameters...",
      "Generating dynamic compatibility metrics...",
      "Matrix compiled. Displaying top romantic matches sorted by matching traits."
    ];

    let currentPhraseIndex = 0;
    setRunningLogs([phrases[0]]);

    const logInterval = setInterval(() => {
      currentPhraseIndex++;
      if (currentPhraseIndex < phrases.length) {
        setRunningLogs(prev => [...prev, phrases[currentPhraseIndex]]);
      } else {
        clearInterval(logInterval);
      }
    }, 300);

    // Filter Profiles based on selected traits
    const computeMatches = () => {
      const candidateList = CANDIDATE_PROFILES.map(profile => {
        const profileTraits = CANDIDATE_TRAITS_MAP[profile.id] || [];
        const matchingTraits = selectedTraits.filter(t => profileTraits.includes(t));
        const score = matchingTraits.length;
        // score is between 0 and 5. Matching percentage goes from 72% + score * 5% with cap at 98%
        const rawPercent = 72 + (score * 5);
        const finalPercent = Math.min(rawPercent, 98);

        return {
          ...profile,
          compatibilityPercentage: finalPercent,
          mutualInterestsCount: score // Reuse field as count of matched traits
        };
      });

      // Sort matches descending by compatibility percentage
      candidateList.sort((a, b) => b.compatibilityPercentage - a.compatibilityPercentage);

      setMatches(candidateList);
      if (candidateList.length > 0) {
        setFocusedPartner(candidateList[0]);
      }
    };

    computeMatches();

    const timer = setTimeout(() => {
      setStep("results");
      playSynthesizerNotes("success");
    }, 2200);

    return () => {
      clearInterval(logInterval);
      clearTimeout(timer);
    };
  }, [step, selectedTraits]);

  const handleToggleTrait = (traitId: string) => {
    if (selectedTraits.includes(traitId)) {
      setSelectedTraits(prev => prev.filter(t => t !== traitId));
      playSynthesizerNotes("select");
    } else {
      if (selectedTraits.length < 5) {
        setSelectedTraits(prev => [...prev, traitId]);
        playSynthesizerNotes("select");
      } else {
        // limit reached, play standard cute audio buzz
        try {
          initAudio();
          const ctx = audioCtxRef.current;
          if (ctx) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.setValueAtTime(150, ctx.currentTime);
            gain.gain.setValueAtTime(0.04, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.15);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.16);
          }
        } catch (_) {}
      }
    }
  };

  const handleChooseMatch = (partner: MatchProfile) => {
    playSynthesizerNotes("select");
    onPartnerSelected(partner);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#06030a]/95 backdrop-blur-3xl select-none overflow-y-auto">
      
      {/* Background Neon Grid Decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(244,63,94,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(244,63,94,0.01)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* Floating Ambient Aura */}
      <div 
        className="absolute top-1/4 left-1/4 w-[450px] h-[450px] rounded-full filter blur-[150px] pointer-events-none transition-all duration-1000 ease-out animate-pulse bg-rose-500/5"
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full filter blur-[150px] pointer-events-none transition-all duration-1000 ease-out animate-pulse bg-indigo-500/5"
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -30 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-4xl bg-zinc-950/90 border border-zinc-900 rounded-[36px] p-6 md:p-10 shadow-[0_25px_100px_rgba(0,0,0,0.9)] relative overflow-hidden my-8"
      >
        
        {/* Soft interactive frame border */}
        <div className="absolute inset-[0.8px] rounded-[36px] border border-zinc-850 pointer-events-none" />

        {/* Top Glow bar decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[2px] bg-gradient-to-r from-transparent via-rose-500 to-transparent blur-[2px]" />

        {/* Step: ASK PARTNER TYPE */}
        {step === "ask_type" && (
          <div>
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-950/40 border border-rose-500/35 text-rose-300 text-[10px] font-mono uppercase tracking-widest mb-4">
                <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-spin duration-[6000ms]" />
                Interactive Typology Filter
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-fuchsia-200 to-cyan-100 uppercase tracking-tight">
                Who matches your vibe?
              </h2>
              <p className="text-xs md:text-sm text-zinc-450 mt-3 max-w-md mx-auto leading-relaxed">
                Everyone can construct their ideal partner stream. Select <span className="font-bold text-rose-400">exactly 5 traits</span> you require. Our quantum matcher will compile compatible profiles.
              </p>
            </div>

            {/* Selection Status Tracker */}
            <div className="max-w-xl mx-auto mb-8 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-900 flex flex-col items-center gap-3">
              <div className="flex items-center justify-between w-full text-xs font-mono">
                <span className="text-zinc-500 uppercase tracking-wider">Required Qualities Locked</span>
                <span className={`font-bold ${selectedTraits.length === 5 ? "text-rose-400" : "text-cyan-400"}`}>
                  {selectedTraits.length} / 5 Selected
                </span>
              </div>
              <div className="w-full bg-zinc-950 rounded-full h-2 p-[2px] border border-zinc-850 overflow-hidden">
                <motion.div 
                  initial={false}
                  animate={{ width: `${(selectedTraits.length / 5) * 100}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-rose-500 shadow-[0_0_10px_rgba(236,72,153,0.3)]"
                />
              </div>
              
              {/* Displaying selected items as nice pill tags */}
              <div className="flex flex-wrap justify-center gap-1.5 mt-1.5 min-h-[24px]">
                {selectedTraits.length === 0 ? (
                  <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider italic">No qualities selected yet</span>
                ) : (
                  selectedTraits.map(id => {
                    const found = PARTNER_TRAITS.find(t => t.id === id);
                    return (
                      <span key={id} className="inline-flex items-center gap-1 bg-rose-500/10 border border-rose-500/25 px-2 py-0.5 rounded-lg text-[10px] text-rose-300 font-mono font-medium">
                        <span>{found?.icon}</span>
                        <span>{found?.name}</span>
                        <button 
                          onClick={() => handleToggleTrait(id)}
                          className="text-rose-500 hover:text-white ml-1 font-bold font-sans cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    );
                  })
                )}
              </div>
            </div>

            {/* Traits Selection Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              {PARTNER_TRAITS.map((trait) => {
                const isSelected = selectedTraits.includes(trait.id);
                return (
                  <button
                    key={trait.id}
                    type="button"
                    onMouseEnter={() => playSynthesizerNotes("hover")}
                    onClick={() => handleToggleTrait(trait.id)}
                    className={`group relative rounded-2xl border p-4 flex flex-col justify-between text-left transition-all duration-300 transform active:scale-98 select-none cursor-pointer overflow-hidden ${
                      isSelected 
                        ? "bg-rose-950/20 border-rose-500/50 shadow-[0_4px_20px_rgba(244,63,94,0.12)]" 
                        : "bg-zinc-900/20 hover:bg-zinc-900/60 border-zinc-900 hover:border-zinc-800"
                    }`}
                  >
                    {/* Corner category label */}
                    <div className="flex justify-between items-start w-full">
                      <span className="text-xl leading-none">{trait.icon}</span>
                      <span className={`text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded transition-colors ${
                        isSelected ? "bg-rose-500/20 text-rose-300" : "bg-zinc-950 text-zinc-600"
                      }`}>
                        {trait.category}
                      </span>
                    </div>

                    <div className="mt-4">
                      <h4 className={`text-xs sm:text-sm font-bold transition-colors uppercase tracking-tight ${
                        isSelected ? "text-rose-300" : "text-rose-50 group-hover:text-rose-200"
                      }`}>
                        {trait.name}
                      </h4>
                      <p className="text-[10px] text-zinc-500 mt-1 leading-normal group-hover:text-zinc-450 transition-colors">
                        {trait.description}
                      </p>
                    </div>

                    {/* Check indicator */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 flex items-center justify-center w-4 h-4 rounded-full bg-rose-500 text-white">
                        <Check className="w-2.5 h-2.5 stroke-[3px]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Main Action Button for Matching once 5 traits are verified */}
            <div className="flex flex-col items-center justify-center gap-4 py-4 pt-6 mt-4.5 border-t border-zinc-900">
              {selectedTraits.length === 5 ? (
                <motion.button
                  type="button"
                  onClick={() => {
                    playSynthesizerNotes("select");
                    setStep("scanning");
                    playSynthesizerNotes("rumble");
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full max-w-md py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:from-rose-600 hover:to-fuchsia-700 text-white font-extrabold text-xs uppercase tracking-widest transition-all duration-300 transform hover:shadow-[0_0_30px_rgba(244,63,94,0.4)] flex items-center justify-center gap-2 cursor-pointer shadow-lg border border-rose-400/20"
                >
                  <Search className="w-4 h-4 animate-pulse" />
                  <span>Execute Compatibility Stream Search</span>
                </motion.button>
              ) : (
                <div className="py-2.5 px-6 rounded-xl bg-zinc-950/80 border border-zinc-900 text-[10px] font-mono text-zinc-500 uppercase tracking-widest text-center">
                  Select <strong className="text-cyan-400">{5 - selectedTraits.length} more</strong> characteristics to start scan
                </div>
              )}

              <div className="flex items-center justify-between w-full mt-4">
                <p className="text-[10px] font-mono text-zinc-650 tracking-wider">
                  SECURE TRAIT-SYNC PROTOCOL SECT-99
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 rounded-xl text-xs font-semibold font-mono border border-transparent hover:border-zinc-800 transition-all cursor-pointer"
                >
                  Go Back to Core
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step: SCANNING & FILTERING ANIMATION */}
        {step === "scanning" && (
          <div className="py-14 flex flex-col items-center justify-center text-center">
            
            {/* Pulsing Sonar Orb Visual */}
            <div className="relative mb-10 w-28 h-28 flex items-center justify-center">
              
              {/* Outer Waves Ripple */}
              <motion.div 
                animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-full border border-rose-500/40 pointer-events-none"
              />
              <motion.div 
                animate={{ scale: [1, 2.2], opacity: [0.2, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: 0.6, ease: "easeOut" }}
                className="absolute inset-0 rounded-full border border-fuchsia-500/20 pointer-events-none"
              />

              {/* Glowing Center Shield Hub */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 to-fuchsia-600 border border-rose-400/50 flex items-center justify-center shadow-lg shadow-rose-950/50 relative z-10 animate-pulse">
                <Search className="w-6 h-6 text-white" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-rose-50 uppercase tracking-widest font-mono">
              Aligning System Grids...
            </h3>
            
            {/* Progress status */}
            <div className="w-full max-w-md bg-zinc-900/60 rounded-full h-1.5 mt-5 mb-8 overflow-hidden p-[1px] border border-zinc-800">
              <motion.div 
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.0, ease: "easeInOut" }}
                className="h-full rounded-full bg-gradient-to-r from-rose-500 via-fuchsia-500 to-indigo-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]"
              />
            </div>

            {/* Simulated Live Broadcast Matrix Terminal Terminal logs */}
            <div className="w-full max-w-lg bg-zinc-950/80 border border-zinc-900 rounded-xl p-4 text-left font-mono text-[10px] text-zinc-500 space-y-2 h-36 overflow-y-auto shadow-inner">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-900 text-zinc-600 mb-1">
                <span>TERMINAL ACTIVE FEED</span>
                <span className="animate-pulse">● SEARCHING</span>
              </div>
              <AnimatePresence>
                {runningLogs.map((logStr, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-start gap-1.5 text-zinc-450"
                  >
                    <span className="text-rose-500/70 font-semibold">&gt;&gt;</span>
                    <span>{logStr}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Step: MATCH RESULTS VIEW */}
        {step === "results" && (
          <div>
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-emerald-400 text-[10px] font-mono uppercase tracking-widest mb-3">
                <Check className="w-3.5 h-3.5" />
                Dynamic Orbits Locked ({matches.length} Matches Found)
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-100 to-indigo-200 uppercase tracking-tight leading-tight">
                Your Compatible Candidates
              </h2>
              <p className="text-[11px] text-zinc-400 mt-2">
                Click on any profile below to deep dive. Selecting a partner will activate the custom Compatibility Sync questionnaire.
              </p>
            </div>

            {/* Split Screen Panel Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start mb-8 min-h-[350px]">
              
              {/* Left Side Match List (6 columns) */}
              <div className="md:col-span-5 space-y-3.5 max-h-[420px] overflow-y-auto pr-1">
                {matches.map((item) => {
                  const focused = focusedPartner?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onMouseEnter={() => playSynthesizerNotes("hover")}
                      onClick={() => setFocusedPartner(item)}
                      className={`w-full text-left p-4.5 rounded-2xl border transition-all duration-300 select-none cursor-pointer flex items-center gap-4 relative overflow-hidden ${
                        focused 
                          ? "bg-rose-950/20 border-rose-500/60 shadow-[0_4px_25px_rgba(244,63,94,0.12)]" 
                          : "bg-zinc-900/40 border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/70"
                      }`}
                    >
                      {/* Left glowing marker indicator */}
                      <div className={`absolute top-0 left-0 bottom-0 w-[4px] transition-colors duration-300 ${focused ? "bg-rose-500" : "bg-transparent"}`} />

                      <div className="relative flex-shrink-0">
                        <img 
                          src={item.avatar} 
                          alt={item.name} 
                          className={`w-14 h-14 object-cover rounded-xl border transition-all duration-300 ${
                            focused ? "border-rose-500/50 scale-102" : "border-zinc-800"
                          }`} 
                        />
                        <div className="absolute -bottom-1 -right-1 bg-zinc-950 border border-zinc-800 px-1.5 py-0.5 rounded-md text-[8px] font-mono font-bold text-rose-300">
                          {item.age}
                        </div>
                      </div>

                      <div className="flex-grow min-w-0">
                        <div className="flex items-center justify-between gap-1.5">
                          <h4 className="text-xs sm:text-sm font-black text-rose-50 truncate">
                            {item.name}
                          </h4>
                          <span className="text-[10px] font-bold font-mono text-emerald-400">
                            {item.compatibilityPercentage}% Match
                          </span>
                        </div>

                        <div className="flex items-center gap-1 mt-1 text-[10px] text-zinc-550 font-mono">
                          <MapPin className="w-3 h-3 text-rose-500/80" />
                          <span className="truncate">{item.location}</span>
                        </div>

                        {/* Visual checklist summary line */}
                        <p className="text-[10px] text-zinc-450 mt-1.5 truncate italic font-light">
                          "{item.bio}"
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right Side Selected Profile Profile Deep Dive (7 columns) */}
              <div className="md:col-span-7">
                {focusedPartner ? (
                  <motion.div 
                    key={focusedPartner.id}
                    initial={{ opacity: 0, x: 10, scale: 0.98 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="bg-zinc-900/30 border border-zinc-900 rounded-3xl p-5.5 relative overflow-hidden"
                  >
                    {/* Futuristic background decoration badge symbol */}
                    <div className="absolute right-4 top-4 text-[7rem] font-mono font-extrabold text-white/[0.015] pointer-events-none select-none">SYNC</div>

                    {/* Banner Layout */}
                    <div className="flex flex-col sm:flex-row gap-5 pb-5.5 border-b border-zinc-900">
                      <img 
                        src={focusedPartner.avatar} 
                        alt={focusedPartner.name} 
                        referrerPolicy="no-referrer"
                        className="w-22 h-22 sm:w-24 sm:h-24 object-cover rounded-2xl border border-rose-500/20 shadow-md shadow-zinc-950" 
                      />
                      <div className="flex-grow">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg sm:text-xl font-extrabold text-rose-100">{focusedPartner.name}</h3>
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-[9px] font-bold font-mono text-rose-300">
                            Age {focusedPartner.age}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-zinc-950 text-[9px] font-bold font-mono text-zinc-400 border border-zinc-900">
                            {focusedPartner.personalityType}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-zinc-450 font-mono">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-rose-500" />
                            {focusedPartner.location}
                          </span>
                          <span>•</span>
                          <span className="text-zinc-550">{focusedPartner.distance || "Near Sector"}</span>
                        </div>

                        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-950/80 rounded-xl border border-zinc-900 text-[10px] font-mono text-zinc-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          <span>Goal: <strong className="text-rose-350">{focusedPartner.relationshipGoals || "Soulmate Sync"}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Bio Section */}
                    <div className="mt-5 space-y-4">
                      <div>
                        <h4 className="text-[10px] font-bold font-mono uppercase text-zinc-500 tracking-widest mb-1.5">
                          Soul Transmission Bio
                        </h4>
                        <p className="text-xs sm:text-sm text-zinc-350 leading-relaxed italic font-light">
                          "{focusedPartner.bio}"
                        </p>
                      </div>

                      {/* Matching Core Interests */}
                      <div>
                        <h4 className="text-[10px] font-bold font-mono uppercase text-zinc-500 tracking-widest mb-2">
                          Synchronic Vibe Tags
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {focusedPartner.interests.map((it) => (
                            <span 
                              key={it}
                              className="px-2.5 py-1 rounded-xl bg-zinc-950/90 border border-zinc-900 text-[10px] text-zinc-400 hover:text-zinc-200 hover:border-rose-500/25 transition-all text-ellipsis"
                            >
                              {it}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Call to sync action */}
                      <div className="pt-4 mt-2">
                        <button
                          type="button"
                          onClick={() => handleChooseMatch(focusedPartner)}
                          className="w-full py-3 px-5 rounded-2xl bg-[#ec4899] hover:bg-[#db2777] text-white font-extrabold text-xs uppercase tracking-widest transition-all duration-300 transform active:scale-99 hover:shadow-[0_0_25px_rgba(236,72,153,0.35)] flex items-center justify-center gap-2 cursor-pointer border border-[#fb7185]/30 shadow-lg"
                        >
                          <ShieldCheck className="w-4 h-4 animate-pulse" />
                          <span>Sync Compatibility Questionnaire</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full border border-dashed border-zinc-850 rounded-3xl flex flex-col items-center justify-center p-8 text-center text-zinc-550">
                    <User className="w-12 h-12 stroke-1 text-zinc-700 animate-pulse mb-3" />
                    <p className="text-xs font-mono">Select a compatible feed file to deep dive matches</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-zinc-900 mt-4">
              <button
                type="button"
                onClick={() => {
                  setSelectedTraits([]);
                  setStep("ask_type");
                }}
                className="flex items-center gap-1.5 px-4.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-semibold font-mono cursor-pointer transition-all active:scale-98"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Select Other Traits
              </button>
              
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 border border-zinc-900 hover:border-zinc-800 text-zinc-500 hover:text-zinc-455 rounded-xl text-xs font-semibold font-mono transition-all cursor-pointer"
              >
                Go Back to Core Launcher
              </button>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
}
