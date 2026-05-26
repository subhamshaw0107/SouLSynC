/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Sparkles, Shield, Bell, HelpCircle, Key, RefreshCw, Volume2 } from "lucide-react";

export default function SettingsPage() {
  const [sounds, setSounds] = useState(true);
  const [privateMode, setPrivateMode] = useState(false);
  const [matchingStatus, setMatchingStatus] = useState("Active & Seeking");
  const [appVersion] = useState("v2.2.0-Alpha");
  
  // Health API state
  const [aiMode, setAiMode] = useState("Determining...");
  const [aiDetails, setAiDetails] = useState("Quering SouLSynC cluster services...");
  const [loadingHealth, setLoadingHealth] = useState(false);

  useEffect(() => {
    fetchHealthStatus();
  }, []);

  const fetchHealthStatus = async () => {
    setLoadingHealth(true);
    try {
      const response = await fetch("/api/health");
      const data = await response.json();
      setAiMode(data.aiMode === "real" ? "Online (Pris-Intelligence Mode)" : "High-Fidelity Simulation Mode");
      setAiDetails(data.message || "");
    } catch (e) {
      setAiMode("Simulated Fallback active");
      setAiDetails("Running secure local analytical metrics. Attach key in AI Studio for real generative lore.");
    } finally {
      setLoadingHealth(false);
    }
  };

  return (
    <div className="z-10 relative max-w-3xl mx-auto px-4 py-8 select-none space-y-6">
      
      {/* 1. Header Hero */}
      <div className="p-6 bg-zinc-950/60 border border-zinc-900 rounded-3xl backdrop-blur-md">
        <h2 className="text-xl font-black text-rose-100 mb-1">Ecosystem Configuration</h2>
        <p className="text-xs text-zinc-500 font-sans">
          Calibrate notification channels, toggle matching visibility parameters, and monitor your AI pipeline cluster cores.
        </p>
      </div>

      {/* 2. Core Config categories */}
      <div className="space-y-4">
        
        {/* Category A: AI Cluster Health */}
        <div className="bg-zinc-950/40 p-5 rounded-2xl border border-zinc-900 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-450 shrink-0">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-rose-100 flex items-center gap-2">
                SouLSynC AI Cluster Engine
                {aiMode.includes("Online") ? (
                  <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-450 font-mono text-[9px] px-1.5 py-0.5 rounded-full uppercase font-bold">REAL INTEL</span>
                ) : (
                  <span className="bg-rose-500/10 border border-rose-500/20 text-rose-450 font-mono text-[9px] px-1.5 py-0.5 rounded-full uppercase font-bold">SIMULATED</span>
                )}
              </div>
              <p className="text-[10px] text-zinc-500 leading-normal max-w-md mt-1 font-sans">{aiDetails}</p>
            </div>
          </div>
          
          <button
            onClick={fetchHealthStatus}
            disabled={loadingHealth}
            className="px-4 py-2 border border-rose-500/25 hover:bg-rose-500/10 text-[10px] text-rose-300 font-bold rounded-lg font-mono transition-colors cursor-pointer shrink-0 flex items-center justify-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingHealth ? "animate-spin" : ""}`} /> Ping Status
          </button>
        </div>

        {/* Category B: Toggle controllers */}
        <div className="bg-zinc-950/40 p-5 rounded-2xl border border-zinc-900 space-y-4">
          <h4 className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-900 pb-3 mb-2">Interactions</h4>
          
          {/* Toggle 1: Sounds */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Volume2 className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-zinc-250">Decibel Sound Nodes</span>
                <p className="text-[10px] text-zinc-550 mt-0.5 font-sans">Trigger acoustic signals when fresh messages or chemistry evaluations arrive.</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={sounds}
              onChange={() => setSounds(!sounds)}
              className="w-10 h-5 bg-zinc-900 border border-zinc-800 checked:bg-rose-500 rounded-full cursor-pointer transition-all outline-none"
            />
          </div>

          {/* Toggle 2: Private matching */}
          <div className="flex items-center justify-between gap-4 pt-3 border-t border-zinc-900/60">
            <div className="flex items-start gap-3">
              <Shield className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-zinc-250">Private Frequency Protection</span>
                <p className="text-[10px] text-zinc-550 mt-0.5 font-sans">Hides your visual profile parameters from local neighborhood radar sweeps.</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={privateMode}
              onChange={() => setPrivateMode(!privateMode)}
              className="w-10 h-5 bg-zinc-900 border border-zinc-800 checked:bg-rose-500 rounded-full cursor-pointer transition-all outline-none"
            />
          </div>

          {/* Profile visibility category */}
          <div className="flex items-center justify-between gap-4 pt-3 border-t border-zinc-900/60">
            <div className="flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-zinc-250">Radar Seeking Status</span>
                <p className="text-[10px] text-zinc-550 mt-0.5 font-sans">Active resonance index mode.</p>
              </div>
            </div>
            <select
              value={matchingStatus}
              onChange={(e) => setMatchingStatus(e.target.value)}
              className="bg-zinc-900 text-rose-100 border border-zinc-800 rounded-lg text-[10px] font-mono font-bold px-2 py-1 outline-none"
            >
              {["Active & Seeking", "Soul Matching Suspended", "Stargazing Off-grid"].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Category C: FAQ / Instructions */}
        <div className="bg-zinc-950/20 p-5 rounded-2xl border border-zinc-900">
          <div className="flex items-center gap-2 mb-3.5 pb-2 border-b border-zinc-900/60">
            <HelpCircle className="w-4 h-4 text-rose-450" />
            <h5 className="text-xs font-bold text-zinc-250">Ecosystem FAQ</h5>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-[11px] font-bold text-rose-300">How do real compatibility analytics calculate?</div>
              <p className="text-[10px] text-zinc-500 font-sans leading-relaxed mt-0.5">
                Our server proxies requests of comparative answers directly to the Gemini 3.5 Flash model inside AI Studio container nodes. We translate answers and gaming logs into standard psychologist-guided evaluations.
              </p>
            </div>
            <div>
              <div className="text-[11px] font-bold text-rose-300">Is the chat encrypted or secure?</div>
              <p className="text-[10px] text-zinc-500 font-sans leading-relaxed mt-0.5">
                Absolutely. Everything runs safely under sandbox SSL sockets. Your personalized entries are stored locally on client memory buffers.
              </p>
            </div>
          </div>
        </div>

      </div>

      <div className="text-center font-mono text-[9px] text-zinc-700 uppercase pt-6">
        SouLSynC Dating Network • Build: {appVersion} • All core functions normal
      </div>

    </div>
  );
}
