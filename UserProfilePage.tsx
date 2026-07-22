/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { CompatibilityReport, UserProfile, MatchProfile, PlaylistTrack } from "../types";
import { DEFAULT_TRACKS } from "../data";
import { Sparkles, Calendar, Heart, Shield, Award, Zap, Smile, BookOpen, Send, RefreshCw, Volume2, Flame, RefreshCcw } from "lucide-react";

interface DashboardPageProps {
  currentUser: UserProfile;
  activeReport: CompatibilityReport | null;
  activePartner: MatchProfile | UserProfile | null;
  onNavigateToTest: () => void;
}

export default function DashboardPage({ currentUser, activeReport, activePartner, onNavigateToTest }: DashboardPageProps) {
  const [advicePrompt, setAdvicePrompt] = useState("");
  const [adviceHistory, setAdviceHistory] = useState<{ role: "user" | "bot"; text: string }[]>([]);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  // Playlist generator
  const [playlist, setPlaylist] = useState<PlaylistTrack[]>(DEFAULT_TRACKS);
  const [generatingPlaylist, setGeneratingPlaylist] = useState(false);

  // Daily Quiz state
  const [dailyQuizCompleted, setDailyQuizCompleted] = useState(false);
  const [dailyQuizAnswers, setDailyQuizAnswers] = useState<Record<number, string>>({});

  // Triggering advisor chat
  const handleSendAdvicePrompt = async () => {
    if (!advicePrompt.trim()) return;

    const userEntry = advicePrompt;
    setAdviceHistory(prev => [...prev, { role: "user", text: userEntry }]);
    setAdvicePrompt("");
    setLoadingAdvice(true);

    try {
      const response = await fetch("/api/gemini/love-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userEntry,
          chatHistory: adviceHistory
        })
      });
      const data = await response.json();
      setAdviceHistory(prev => [...prev, { role: "bot", text: data.advice || "" }]);
    } catch (e) {
      console.error(e);
      setAdviceHistory(prev => [...prev, { role: "bot", text: "💖 My advisory frequency is fluttering. Take deep breaths; honest core discussions are usually your most powerful path forward!" }]);
    } finally {
      setLoadingAdvice(false);
    }
  };

  // Blending Shared Playlist
  const handleBlendPlaylist = async () => {
    setGeneratingPlaylist(true);
    try {
      const response = await fetch("/api/gemini/playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userA: currentUser,
          userB: activePartner || { name: "Mystery Sync" }
        })
      });
      const data = await response.json();
      if (data.response && data.response.tracks) {
        setPlaylist(data.response.tracks);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingPlaylist(false);
    }
  };

  // Helper values for active compatibility metrics
  const displayReport = activeReport || {
    overallPercentage: 88,
    emotionalScore: 92,
    communicationScore: 84,
    lifestyleScore: 88,
    loveLanguageMatch: "Quality Time & Physical Touch",
    relationshipDynamics: "A beautiful synchronic balance showing strong communicative loyalty, shared acoustic tastes, and aligned visions for cosy off-grid living.",
    greenFlags: [
      "Incredibly matched recharge styles (Both enjoy introspective alone-time).",
      "Identical resolution priorities (Prefer settling details before sleeping).",
      "Shared movie and music tastes forming cohesive conversation layers."
    ],
    redFlags: [
      "Varying pacing for traveling choices (Active nomad vs cozy homebody).",
      "Minor divergence in love language preferences."
    ],
    growthAreas: [
      "Dedicate one weekend evening exclusively for vintage vinyl play dates.",
      "Calibrate travel plans with specific resting hours so no batteries drain out."
    ],
    compatibilityAdvice: "To maintain this beautiful synchronization, focus on small joint milestones. Build playfulness via the Couple Games section, share playlists, and let Aiden advise your difficult communication hurdles.",
    suggestedActivities: ["Build a cozy fort in the lounge", "Compile a blended acoustic tape", "Take an unexpected night drive"]
  };

  const displayPartnerName = activePartner?.name || "Dreamer Match";

  return (
    <div className="z-10 relative max-w-7xl mx-auto px-4 py-8 select-none space-y-8">
      
      {/* 1. Header Hero Panel */}
      <div className="flex flex-col md:flex-row items-center justify-between p-6 sm:p-8 rounded-3xl bg-zinc-950/60 border border-zinc-900 gap-6 backdrop-blur-md">
        <div>
          <span className="text-[10px] font-mono text-rose-450 font-bold bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20 uppercase tracking-widest">
            AI Love Analytics
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-rose-100 mt-3">Chemistry Sync Matrix</h2>
          <p className="text-xs text-zinc-500 mt-1 max-w-xl font-sans">
            Sync records mapped between <span className="text-rose-400 font-semibold">{currentUser.name}</span> and <span className="text-fuchsia-400 font-semibold">{displayPartnerName}</span>. Update your questionnaire to reload report models.
          </p>
        </div>
        
        {!activeReport && (
          <button
            onClick={onNavigateToTest}
            className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:from-rose-450 hover:to-fuchsia-500 text-white text-xs font-bold rounded-xl tracking-wide font-mono transition-all transform hover:scale-[1.02] cursor-pointer"
          >
            Refine Sync Questionnaire
          </button>
        )}
      </div>

      {/* 2. Custom Analytical SVG Visualizing Gears/Meters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Core Compatibility Gauge (SVG) */}
        <div className="bg-zinc-950/60 border border-zinc-900 rounded-3xl p-6 backdrop-blur-md flex flex-col items-center justify-center text-center relative overflow-hidden h-[300px]">
          <div className="absolute top-4 left-4 text-[9px] font-mono text-rose-400/85">Overall Resonance</div>
          
          <div className="relative w-44 h-44">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Back Circle */}
              <circle cx="50" cy="50" r="40" stroke="rgba(244,63,94,0.05)" strokeWidth="6" fill="transparent" />
              {/* Front Circle with Glow */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="url(#gradient-overall)"
                strokeWidth="7"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * displayReport.overallPercentage) / 100}
                strokeLinecap="round"
                fill="transparent"
                style={{ filter: "drop-shadow(0px 0px 8px rgba(244,63,94,0.65))" }}
              />
              <defs>
                <linearGradient id="gradient-overall" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="50%" stopColor="#d946ef" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
              <span className="text-3xl font-black text-rose-100">{displayReport.overallPercentage}%</span>
              <span className="text-[9px] text-zinc-550 uppercase font-bold tracking-widest mt-1">Match Core</span>
            </div>
          </div>
        </div>

        {/* Triple Sync Channels Meter */}
        <div className="bg-zinc-950/60 border border-zinc-900 rounded-3xl p-6 backdrop-blur-md h-[300px] md:col-span-3 flex flex-col justify-between">
          <div className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-widest mb-4">Emotional Frequency Breakdown</div>
          
          <div className="space-y-5 flex-1 flex flex-col justify-center">
            
            {/* Meter 1 */}
            <div>
              <div className="flex justify-between items-center text-xs mb-2 font-mono">
                <span className="text-rose-350">Emotional Connection</span>
                <span className="text-rose-105 font-bold">{displayReport.emotionalScore}%</span>
              </div>
              <div className="w-full bg-zinc-900 h-2.5 rounded-full overflow-hidden border border-zinc-800">
                <div
                  style={{ width: `${displayReport.emotionalScore}%` }}
                  className="bg-gradient-to-r from-red-500 to-rose-500 h-full rounded-full animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.3)] transition-all duration-[600ms]"
                />
              </div>
            </div>

            {/* Meter 2 */}
            <div>
              <div className="flex justify-between items-center text-xs mb-2 font-mono">
                <span className="text-fuchsia-350">Communication Patterns</span>
                <span className="text-rose-105 font-bold">{displayReport.communicationScore}%</span>
              </div>
              <div className="w-full bg-zinc-900 h-2.5 rounded-full overflow-hidden border border-zinc-800">
                <div
                  style={{ width: `${displayReport.communicationScore}%` }}
                  className="bg-gradient-to-r from-rose-500 to-fuchsia-600 h-full rounded-full animate-pulse shadow-[0_0_8px_rgba(217,70,239,0.3)] transition-all duration-[600ms]"
                />
              </div>
            </div>

            {/* Meter 3 */}
            <div>
              <div className="flex justify-between items-center text-xs mb-2 font-mono">
                <span className="text-indigo-400">Lifestyle Choices</span>
                <span className="text-rose-105 font-bold">{displayReport.lifestyleScore}%</span>
              </div>
              <div className="w-full bg-zinc-900 h-2.5 rounded-full overflow-hidden border border-zinc-800">
                <div
                  style={{ width: `${displayReport.lifestyleScore}%` }}
                  className="bg-gradient-to-r from-fuchsia-600 to-indigo-500 h-full rounded-full animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.3)] transition-all duration-[600ms]"
                />
              </div>
            </div>

          </div>

          <p className="text-[10px] text-zinc-550 italic leading-relaxed font-sans pt-3 border-t border-zinc-900">
            *Love Language Consensus: {displayReport.loveLanguageMatch}.
          </p>
        </div>

      </div>

      {/* 3. Green Flags vs. friction warning grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Green Flags */}
        <div className="bg-zinc-950/40 border border-zinc-900 p-6 rounded-3xl backdrop-blur-sm">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-450 font-bold bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 rounded-full mb-6">
            <Shield className="w-3.5 h-3.5" />
            <span>AI Green Flags (Strong Pillars)</span>
          </div>

          <ul className="space-y-3.5">
            {displayReport.greenFlags.map((flag, idx) => (
              <li key={idx} className="flex gap-3 text-xs sm:text-sm text-zinc-300 leading-relaxed items-start">
                <span className="text-emerald-500 shrink-0 select-none">✓</span>
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Red / Amber Friction Flags */}
        <div className="bg-zinc-950/40 border border-zinc-900 p-6 rounded-3xl backdrop-blur-sm">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-orange-450 font-bold bg-orange-500/10 border border-orange-500/25 px-3 py-1 rounded-full mb-6">
            <Volume2 className="w-3.5 h-3.5" />
            <span>Calibration Directions (Friction Signals)</span>
          </div>

          <ul className="space-y-3.5">
            {displayReport.redFlags.map((flag, idx) => (
              <li key={idx} className="flex gap-3 text-xs sm:text-sm text-zinc-300 leading-relaxed items-start">
                <span className="text-orange-450 shrink-0 select-none">!</span>
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* 4. Relationship Advice & Suggested Cozy Activities */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-zinc-950/60 to-rose-950/15 border border-rose-500/15 rounded-3xl backdrop-blur-md">
        <h4 className="text-xl font-bold text-rose-100 flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-rose-450 animate-pulse" />
          Relationship Dynamics Alignment
        </h4>
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6">
          {displayReport.relationshipDynamics}
        </p>

        {/* Activities grid */}
        <div className="pt-4 border-t border-rose-500/15">
          <h5 className="text-xs font-mono font-bold text-rose-350 uppercase tracking-widest mb-3">Suggested Synchronization Tasks</h5>
          <div className="flex flex-wrap gap-2">
            {displayReport.suggestedActivities.map((act, idx) => (
              <span key={idx} className="text-xs px-4 py-2 bg-zinc-900/60 border border-zinc-800 text-rose-100/80 rounded-xl">
                🛋️ {act}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 5. MULTIPLE PREMIUM SUB-VIEWS IN SEPARATE MODULES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Module A: AIDEN THE LOVE ADVISOR (CHATBOT) */}
        <div className="bg-zinc-950/60 border border-zinc-900 p-6 rounded-3xl backdrop-blur-md flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-rose-100">Aiden, AI Relationship Coach</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <span className="text-[9px] font-mono text-zinc-500 uppercase">Consult Counsel</span>
          </div>

          {/* Advice Thread list */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
            <div className="text-[11px] text-zinc-450 leading-relaxed bg-zinc-900/40 p-2.5 rounded-xl border border-zinc-850/60">
              💖 Hello, I am Aiden. Ask me questions about emotional balances, conflict calibrations, or conversational guidelines. Let's design harmony together.
            </div>

            {adviceHistory.map((h, hi) => (
              <div key={hi} className={`flex flex-col ${h.role === "user" ? "items-end" : "items-start"}`}>
                <div className={`max-w-[85%] rounded-xl p-2.5 px-3.5 leading-relaxed text-xs ${
                  h.role === "user" 
                    ? "bg-rose-500/10 border border-rose-500/30 text-rose-100" 
                    : "bg-zinc-900 text-zinc-300 border border-zinc-850"
                }`}>
                  {h.text}
                </div>
              </div>
            ))}

            {loadingAdvice && (
              <div className="text-[10px] text-rose-450 font-mono animate-pulse font-semibold">
                Aiden is drafting relationship perspectives...
              </div>
            )}
          </div>

          {/* Action inputs */}
          <div className="flex gap-2">
            <input
              type="text"
              value={advicePrompt}
              onChange={(e) => setAdvicePrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendAdvicePrompt();
              }}
              placeholder="Ask Aiden: Ask about red flags, dating ideas..."
              className="flex-1 bg-zinc-900 text-rose-100 placeholder:text-zinc-600 rounded-xl px-3 text-xs outline-none border border-zinc-850 focus:border-rose-500/40"
            />
            <button
              onClick={handleSendAdvicePrompt}
              disabled={loadingAdvice || !advicePrompt.trim()}
              className="w-10 h-10 bg-gradient-to-tr from-rose-500 to-fuchsia-600 rounded-xl flex items-center justify-center cursor-pointer shadow-sm text-white shrink-0"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Module B: SHARED PLAYLIST FEATURE */}
        <div className="bg-zinc-950/60 border border-zinc-900 p-6 rounded-3xl backdrop-blur-md flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-1.5 font-sans font-bold text-rose-100">
              <Calendar className="w-4 h-4 text-rose-450" />
              <span>Blended Dynamic Tape</span>
            </div>
            <button
              onClick={handleBlendPlaylist}
              disabled={generatingPlaylist}
              className="px-3 py-1 rounded-lg border border-rose-500/30 hover:bg-rose-500/10 text-[10px] text-rose-300 font-mono font-bold tracking-wide transition-all cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3 h-3 ${generatingPlaylist ? "animate-spin" : ""}`} /> Blend AI Playlist
            </button>
          </div>

          <p className="text-[10px] text-zinc-550 mb-4 leading-normal font-sans">
            Blend your mutual music tastes listed in user profiles to synthesize an original 5-track cinematic mixtape.
          </p>

          {/* Tracks list scroll */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {playlist.map((track) => (
              <div key={track.id} className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/30 border border-zinc-850/80 hover:border-rose-500/15">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 bg-rose-500/10 border border-rose-500/25 flex items-center justify-center rounded-lg text-rose-400 font-black shrink-0 font-mono text-xs">
                    ♬
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-rose-100 truncate">{track.title}</div>
                    <div className="text-[10px] text-zinc-500 truncate mt-0.5">{track.artist} • <span className="text-[9px] font-mono text-zinc-600 font-semibold">{track.genre}</span></div>
                  </div>
                </div>

                <div className="flex gap-1">
                  {track.vibes.map((vib) => (
                    <span key={vib} className="text-[8px] font-mono font-bold px-1.5 py-0.5 bg-rose-950/20 border border-rose-500/15 text-rose-350 rounded-md truncate max-w-[55px]">{vib}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 6. DAILY COMPATIBILITY CHALLENGE PANEL */}
      <div className="p-6 bg-zinc-950/60 border border-zinc-900 rounded-3xl backdrop-blur-md">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Award className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-200">Couple Challenge: Daily Sync Point</h4>
              <p className="text-[9px] text-zinc-650 font-mono">250 SYNCDOTS REWARD</p>
            </div>
          </div>
          <span className="text-xs text-indigo-400 font-mono font-semibold">TODAY ACTIVE</span>
        </div>

        {!dailyQuizCompleted ? (
          <div className="space-y-4">
            <h5 className="text-xs font-bold text-pink-200">Question: How do you both value spontaneous small gifts?</h5>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Highly vital - it shows they hold you in active thoughts",
                "Nice but absolutely not needed if communication is deep",
                "I prefer giving custom-crafted letters rather than material options",
                "I prefer organic shared coffee sessions over physical packages"
              ].map((opt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDailyQuizAnswers(prev => ({ ...prev, [1]: opt }));
                    setDailyQuizCompleted(true);
                  }}
                  className="w-full text-left p-3.5 bg-zinc-900/40 border border-zinc-850 hover:border-indigo-500/40 hover:bg-zinc-850/30 rounded-xl text-xs font-medium text-zinc-300 cursor-pointer transition-all"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-indigo-950/15 border border-indigo-500/20 p-4 rounded-2xl text-center">
            <span className="text-3xl animate-bounce block mb-2">🎉</span>
            <div className="text-xs font-bold text-indigo-300">Daily Sync Answer Logged!</div>
            <p className="text-[10px] text-zinc-550 leading-relaxed max-w-sm mx-auto mt-1">
              Your choice matches beautifully with Aria's profile database choice. Sync dots reward logged onto historical parameters.
            </p>
          </div>
        )}
      </div>

      {/* 7. COUPLE MEMORY TIMELINE */}
      <div className="p-6 bg-zinc-950/40 border border-zinc-900 rounded-3xl pb-8">
        <h4 className="text-xs font-mono font-bold text-rose-350 uppercase tracking-widest mb-6">Harmonization Timeline Log</h4>
        
        <div className="space-y-6 relative border-l border-rose-500/15 ml-3 pl-6">
          
          <div className="relative">
            <span className="absolute -left-9.5 top-0.5 w-6 h-6 rounded-full bg-rose-500/25 border border-rose-500 flex items-center justify-center text-[10px] text-rose-100 font-bold">1</span>
            <div className="text-xs font-bold text-rose-250">Ecosystem Initiation</div>
            <div className="text-[9px] text-zinc-550 font-mono uppercase mt-1">May 25, 2026</div>
            <p className="text-[11px] text-zinc-500 leading-relaxed mt-1.5">
              Both parties merged frequency profiles, configured personality tags INFJ, and initialized destiny calibrations.
            </p>
          </div>

          <div className="relative">
            <span className="absolute -left-9.5 top-0.5 w-6 h-6 rounded-full bg-rose-500/25 border border-rose-500 flex items-center justify-center text-[10px] text-rose-100 font-bold">2</span>
            <div className="text-xs font-bold text-rose-250">The Stone-Paper-Scissors Sync-up Game Complete</div>
            <div className="text-[9px] text-zinc-550 font-mono uppercase mt-1">Simulated Session Code Completed</div>
            <p className="text-[11px] text-zinc-500 leading-relaxed mt-1.5">
              Participated in a dynamic synchronized choice tie-breaker mapping spontaneous thoughts under stress.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
