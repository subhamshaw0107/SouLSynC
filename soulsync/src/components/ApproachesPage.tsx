import React from "react";
import { MatchProfile } from "../types";
import { X, Check, Bell, Heart, User, Compass, Info, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ApproachesPageProps {
  incomingRequests: MatchProfile[];
  likedProfiles: MatchProfile[];
  onAcceptRequest: (profile: MatchProfile) => void;
  onDeclineRequest: (profileId: string) => void;
  onNavigateToDiscover: () => void;
}

export default function ApproachesPage({
  incomingRequests,
  likedProfiles,
  onAcceptRequest,
  onDeclineRequest,
  onNavigateToDiscover
}: ApproachesPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 select-none">
      {/* Header Profile Dashboard */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/35 flex items-center justify-center text-rose-400">
              <Bell className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-black tracking-tight bg-gradient-to-r from-rose-200 to-fuchsia-300 bg-clip-text text-transparent uppercase font-sans">
              Connection Signal Center
            </h2>
          </div>
          <p className="text-xs text-zinc-500 font-mono mt-1">
            MONITOR INCOMING APPROACHES & PROPAGATED RESIDUE FREQUENCIES
          </p>
        </div>

        {/* Quick Insight pill */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-zinc-950/40 border border-zinc-900 text-[10px] font-mono flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-zinc-400">INCOMING:</span>
            <span className="text-rose-400 font-bold font-sans text-xs">{incomingRequests.length}</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-zinc-950/40 border border-zinc-900 text-[10px] font-mono flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-zinc-400">OUTBOUND:</span>
            <span className="text-cyan-400 font-bold font-sans text-xs">{likedProfiles.length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN: INCOMING CODES */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-900">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#f43f5e] font-bold">
              <Heart className="w-4 h-4 text-rose-450 shrink-0" />
              <span>Incoming Approaches ({incomingRequests.length})</span>
            </div>
            <span className="text-[10px] text-zinc-650 font-mono">WAITING FOR REVERB</span>
          </div>

          <AnimatePresence mode="popLayout">
            {incomingRequests.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 rounded-3xl bg-zinc-950/40 border border-zinc-900/60 text-center flex flex-col items-center justify-center min-h-[300px] gap-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-zinc-900/40 border border-zinc-850 flex items-center justify-center text-zinc-650 mb-1">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-400 font-sans">No Pending Incoming Requests</h4>
                  <p className="text-[10px] text-zinc-600 max-w-sm mx-auto mt-2 leading-relaxed">
                    Once a compatible partner on SoulSync sends a direct synchronization request, their bio profile stream and compatibility rating will show up here.
                  </p>
                </div>
                <button
                  onClick={onNavigateToDiscover}
                  className="mt-2 text-[10px] font-mono uppercase tracking-wider text-rose-400 hover:text-rose-300 font-bold border border-rose-500/20 hover:border-rose-500/40 px-4 py-2 rounded-xl bg-rose-500/5 transition-all cursor-pointer"
                >
                  Explore Discovery Deck
                </button>
              </motion.div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {incomingRequests.map((profile) => (
                  <motion.div
                    key={profile.id}
                    layoutId={`incoming-${profile.id}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-5 rounded-2xl bg-zinc-950/50 border border-zinc-900/80 hover:border-zinc-800 transition-all flex flex-col sm:flex-row items-start sm:items-center gap-4 relative overflow-hidden group"
                  >
                    {/* Glowing Accent */}
                    <div className="absolute top-0 left-0 w-[2px] h-full bg-rose-500 opacity-60 pointer-events-none" />

                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-16 h-16 rounded-xl object-cover border border-zinc-800 shrink-0"
                    />

                    <div className="flex-grow min-w-0">
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-sm font-black text-rose-50 font-sans tracking-wide">
                          {profile.name}
                        </h3>
                        <span className="text-[10px] font-mono text-zinc-500">{profile.age} yrs • {profile.location}</span>
                      </div>
                      <p className="text-xs text-zinc-400 line-clamp-2 mt-1 font-sans leading-relaxed">
                        {profile.bio}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                        <span className="text-[9px] font-mono uppercase bg-rose-500/10 border border-rose-500/20 rounded-md px-2 py-0.5 text-rose-300 font-bold">
                          {profile.compatibilityPercentage}% Quantum Sync
                        </span>
                        {profile.interests.slice(0, 2).map((interest, i) => (
                          <span key={i} className="text-[8px] font-mono uppercase bg-zinc-900 text-zinc-500 px-1.5 py-0.5 rounded border border-zinc-900">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action buttons list */}
                    <div className="flex items-center gap-2 self-stretch sm:self-center justify-end sm:justify-start border-t border-zinc-900/60 sm:border-t-0 pt-3 sm:pt-0 shrink-0">
                      <button
                        onClick={() => onDeclineRequest(profile.id)}
                        className="h-10 px-4 rounded-xl bg-zinc-900 hover:bg-rose-500/10 border border-zinc-850 hover:border-rose-500/25 text-zinc-400 hover:text-rose-400 transition-all text-[11px] font-bold uppercase tracking-wider cursor-pointer"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => onAcceptRequest(profile)}
                        className="h-10 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:from-rose-400 hover:to-fuchsia-500 text-white transition-all text-[11px] font-bold uppercase tracking-wider cursor-pointer shadow-md shadow-rose-950/20"
                      >
                        Accept
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: SENT PROPOSALS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-900">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              <Send className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Outbound Signals ({likedProfiles.length})</span>
            </div>
            <span className="text-[10px] text-zinc-650 font-mono">PENDING LOCAL BACKEND FEEDBACK</span>
          </div>

          <AnimatePresence mode="popLayout">
            {likedProfiles.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 rounded-3xl bg-zinc-950/40 border border-zinc-900/60 text-center flex flex-col items-center justify-center min-h-[300px] gap-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-zinc-900/40 border border-zinc-850 flex items-center justify-center text-zinc-650 mb-1">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-400 font-sans">No Outbound Signals Transmitted</h4>
                  <p className="text-[10px] text-zinc-600 max-w-sm mx-auto mt-2 leading-relaxed">
                    You haven&apos;t transmitted any alignment synchronization proposals yet. Swipe right on matching cards in the Discover section to send a connection signal.
                  </p>
                </div>
                <button
                  onClick={onNavigateToDiscover}
                  className="mt-2 text-[10px] font-mono uppercase tracking-wider text-cyan-400 hover:text-cyan-300 font-bold border border-cyan-500/20 hover:border-cyan-500/40 px-4 py-2 rounded-xl bg-cyan-500/5 transition-all cursor-pointer"
                >
                  Start Right Swiping
                </button>
              </motion.div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {likedProfiles.map((profile) => (
                  <motion.div
                    key={profile.id}
                    layoutId={`outbound-${profile.id}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-5 rounded-2xl bg-zinc-950/50 border border-zinc-900/80 hover:border-zinc-800 transition-all flex flex-col sm:flex-row items-start sm:items-center gap-4 relative overflow-hidden group"
                  >
                    {/* Glowing Accent */}
                    <div className="absolute top-0 left-0 w-[2px] h-full bg-cyan-500 opacity-60 pointer-events-none" />

                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-16 h-16 rounded-xl object-cover border border-zinc-800 shrink-0"
                    />

                    <div className="flex-grow min-w-0">
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-sm font-black text-cyan-50 font-sans tracking-wide">
                          {profile.name}
                        </h3>
                        <span className="text-[10px] font-mono text-zinc-500">{profile.age} yrs • {profile.location}</span>
                      </div>
                      <p className="text-xs text-zinc-400 line-clamp-2 mt-1 font-sans leading-relaxed">
                        {profile.bio}
                      </p>
                      
                      <div className="flex items-center gap-1.5 mt-2.5">
                        <span className="text-[9px] font-mono uppercase bg-cyan-500/10 border border-cyan-500/20 rounded-md px-2 py-0.5 text-cyan-300 font-bold flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
                          Pending Resonance Response ({profile.compatibilityPercentage}% Compatible)
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xl font-black text-cyan-400 font-sans">{profile.compatibilityPercentage}%</div>
                      <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block mt-0.5">OUTBOUND</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Info Status Banner Footer */}
      <div className="p-4 bg-zinc-950/40 border border-zinc-900/60 rounded-2xl flex items-start gap-3 text-zinc-500 text-[10px] font-mono leading-relaxed mt-10">
        <Info className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-zinc-400">Quantum Signal Transmission Diagnostics:</p>
          <p className="mt-0.5 text-zinc-550">
            Accepting incoming approaches instantly aligns polarization frequency coordinates and moves them directly to your Active Chats dashboard panel so you can begin custom synchronized typing.
          </p>
        </div>
      </div>
    </div>
  );
}
