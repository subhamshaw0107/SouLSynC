/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Flame, Sparkles, Heart, HeartHandshake, Zap, Compass, MessageSquare, Award } from "lucide-react";

interface LandingPageProps {
  onStartMatching: () => void;
  onTakeTest: () => void;
  userName?: string;
}

export default function LandingPage({ onStartMatching, onTakeTest, userName }: LandingPageProps) {
  return (
    <div className="z-10 relative text-rose-100 max-w-7xl mx-auto px-4 md:px-8 pt-10 pb-24 overflow-hidden select-none">
      {/* Background Glows */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[80%] h-[350px] bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-indigo-500/10 rounded-full filter blur-[120px] pointer-events-none" />

      {/* Floating Sparkly Hearts Group Layout */}
      <div className="absolute top-10 left-[8%] animate-bounce duration-[6000ms] opacity-40 pointer-events-none">
        <Heart className="w-8 h-8 text-rose-500 fill-rose-500/20 filter blur-[1px]" />
      </div>
      <div className="absolute top-1/3 right-[12%] animate-bounce duration-[8000ms] opacity-50 pointer-events-none delay-1000">
        <Heart className="w-12 h-12 text-fuchsia-500 fill-fuchsia-500/20 filter blur-[0.5px]" />
      </div>
      <div className="absolute bottom-20 left-[15%] animate-bounce duration-[7000ms] opacity-30 pointer-events-none delay-500">
        <Heart className="w-10 h-10 text-rose-600 fill-rose-600/10" />
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center text-center mt-12 md:mt-20 max-w-4xl mx-auto relative px-4">
        
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-mono mb-8 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.1)]">
          <Sparkles className="w-3.5 h-3.5 text-rose-400 fill-rose-500/20" />
          <span>Frequency Alignment Engine V2.0</span>
        </div>

        {/* Large Cinematic Header */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-8 select-none">
          Find Your Perfect{" "}
          <span className="bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(244,63,94,0.2)]">
            Match
          </span>
        </h1>

        {/* Cinematic Subheading */}
        <p className="text-base sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-12">
          Discover genuine compatibility through thoughts, deep emotions, interests, and meaningful live conversations analyzed by human-centric artificial intelligence.
        </p>

        {userName && (
          <p className="text-sm font-semibold font-mono text-rose-400/80 mb-6 uppercase tracking-wider">
            Connected frequency: {userName}
          </p>
        )}

        {/* Two CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full max-w-md mx-auto mb-16 px-4">
          <button
            onClick={onStartMatching}
            id="cta-start-matching"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:from-rose-450 hover:to-fuchsia-500 text-white font-semibold rounded-2xl shadow-[0_4px_25px_rgba(244,63,94,0.4)] hover:shadow-[0_4px_35px_rgba(244,63,94,0.6)] transform hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer text-base"
          >
            <Compass className="w-5 h-5" />
            Start Matching
          </button>

          <button
            onClick={onTakeTest}
            id="cta-compat-test"
            className="w-full sm:w-auto px-8 py-4 bg-zinc-900/80 hover:bg-zinc-850/90 border border-zinc-800 text-rose-100 font-semibold rounded-2xl transform hover:scale-[1.03] active:scale-[0.98] hover:border-rose-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer text-base"
          >
            <HeartHandshake className="w-5 h-5 text-rose-400" />
            Take Compatibility Test
          </button>
        </div>
      </div>

      {/* Feature Bento Grid (Briefly displaying features in stunning cozy modules) */}
      <h3 className="text-center font-bold text-lg md:text-xl text-zinc-500 uppercase tracking-widest font-mono mb-12">
        SouLSynC Core Ecosystem
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
        
        {/* Card 1 */}
        <div className="group bg-zinc-950/40 border border-zinc-900 hover:border-rose-500/20 hover:shadow-[0_0_30px_rgba(239,68,110,0.08)] rounded-2xl p-6 backdrop-blur-md transition-all">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-rose-500/10 to-rose-500/20 border border-rose-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            <Heart className="w-6 h-6 text-rose-450" />
          </div>
          <h4 className="text-lg font-bold text-rose-100 mb-2">Dual Personality Sync</h4>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Answer a masterfully curated layout of fun and deep emotional questions. AI compares communication styles, expectations, and personal traits.
          </p>
        </div>

        {/* Card 2 */}
        <div className="group bg-zinc-950/40 border border-zinc-900 hover:border-fuchsia-500/20 hover:shadow-[0_0_30px_rgba(217,70,239,0.08)] rounded-2xl p-6 backdrop-blur-md transition-all">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-fuchsia-500/10 to-fuchsia-500/20 border border-fuchsia-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            <MessageSquare className="w-6 h-6 text-fuchsia-450" />
          </div>
          <h4 className="text-lg font-bold text-rose-100 mb-2">Interactive Smart Room</h4>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Real-time conversation simulator complete with voice visualizers, romantic reaction dynamics, and customized AI icebreaker prompts.
          </p>
        </div>

        {/* Card 3 */}
        <div className="group bg-zinc-950/40 border border-zinc-900 hover:border-indigo-500/20 hover:shadow-[0_0_30px_rgba(99,102,241,0.08)] rounded-2xl p-6 backdrop-blur-md transition-all">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500/10 to-indigo-500/20 border border-indigo-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            <Flame className="w-6 h-6 text-indigo-400" />
          </div>
          <h4 className="text-lg font-bold text-rose-100 mb-2">Deep Chemistry Dashboard</h4>
          <p className="text-sm text-zinc-500 leading-relaxed">
            View animated analytics mapping out green flags, potential frictions, love language scores, and actionable relationship suggestions.
          </p>
        </div>

      </div>

      {/* Mini Interactive Promo */}
      <div className="mt-20 flex flex-col md:flex-row items-center justify-between p-8 rounded-3xl bg-gradient-to-r from-rose-950/30 via-zinc-950/30 to-indigo-950/30 border border-rose-500/15 max-w-5xl mx-auto gap-6 backdrop-blur-md">
        <div className="flex-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 text-xs font-mono mb-2">
            <Award className="w-3 h-3 text-indigo-400" />
            <span>Sync Challenge Active</span>
          </div>
          <h4 className="text-xl font-bold text-zinc-100 mb-1">Take the Rock-Paper-Scissors Sync-up!</h4>
          <p className="text-sm text-zinc-500">
            A cute, lightweight psychic mini-game is embedded inside our compatibility logic to measure your synchronized choice rate!
          </p>
        </div>
        <button
          onClick={onTakeTest}
          className="px-6 py-2.5 bg-gradient-to-r from-rose-500/25 to-indigo-500/25 hover:from-rose-500/40 hover:to-indigo-500/40 border border-rose-500/30 rounded-xl text-sm font-semibold text-rose-100 tracking-wide transition-all transform hover:scale-[1.02] cursor-pointer"
        >
          Discover Game Play
        </button>
      </div>
    </div>
  );
}
