import React from "react";
import { MatchProfile } from "../types";
import { X, Check, BellRing, Heart, User, Compass, Info, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NotificationsPanelProps {
  onClose: () => void;
  incomingRequests: MatchProfile[];
  likedProfiles: MatchProfile[];
  onAcceptRequest: (profile: MatchProfile) => void;
  onDeclineRequest: (profileId: string) => void;
}

export default function NotificationsPanel({
  onClose,
  incomingRequests,
  likedProfiles,
  onAcceptRequest,
  onDeclineRequest
}: NotificationsPanelProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-0 bg-black/60 backdrop-blur-md select-none">
      {/* Click outside to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 220 }}
        className="relative z-10 w-full max-w-md h-full bg-[#0d0714] border-l border-zinc-900 shadow-2xl flex flex-col justify-between overflow-hidden"
      >
        {/* Soft edge reactive light frame */}
        <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-rose-500/25 via-fuchsia-500/10 to-transparent" />

        {/* Content Area */}
        <div className="flex-grow flex flex-col h-full overflow-y-auto pb-10">
          
          {/* Header */}
          <div className="sticky top-0 bg-[#0d0714]/90 backdrop-blur-md p-6 border-b border-zinc-900/60 flex items-center justify-between z-20">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500/20 to-fuchsia-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <BellRing className="w-4 h-4 animate-ring" />
              </div>
              <div>
                <h2 className="text-base font-black tracking-wide bg-gradient-to-r from-rose-200 to-fuchsia-300 bg-clip-text text-transparent uppercase font-sans">
                  Activity Signal
                </h2>
                <span className="text-[9px] font-mono text-zinc-500 tracking-wider">SECURE SYNC TERMINAL PANEL</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 flex items-center justify-center text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-7">
            
            {/* Live Metrics Dashboard */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-950/15 to-zinc-950 border border-rose-500/15 flex flex-col gap-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-12 h-12 bg-rose-500/5 blur-xl pointer-events-none" />
                <span className="text-[9px] font-mono text-rose-400 font-bold uppercase tracking-wider">Approaches Received</span>
                <span className="text-2xl font-black text-rose-100">{incomingRequests.length}</span>
                <span className="text-[8px] text-zinc-500 mt-1">{incomingRequests.length > 0 ? "✨ Real-time potential aligns" : "No open signals"}</span>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/15 to-zinc-950 border border-cyan-500/15 flex flex-col gap-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-12 h-12 bg-cyan-500/5 blur-xl pointer-events-none" />
                <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-wider">Approaches Sent</span>
                <span className="text-2xl font-black text-cyan-100">{likedProfiles.length}</span>
                <span className="text-[8px] text-zinc-500 mt-1">{likedProfiles.length > 0 ? "⚡ Pending remote link syncs" : "Explore and swipe right!"}</span>
              </div>
            </div>

            {/* SECTION 1: INCOMING REQUESTS ("if someone give me request it will show") */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-zinc-400 font-bold">
                <span>Incoming Approaches</span>
                <span className="bg-rose-500/20 text-rose-300 text-[10px] px-1.5 py-0.5 rounded-md border border-rose-500/20">
                  {incomingRequests.length} active
                </span>
              </div>

              <AnimatePresence mode="popLayout">
                {incomingRequests.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-6 rounded-2xl bg-zinc-950 border border-zinc-900 text-center flex flex-col items-center gap-2"
                  >
                    <User className="w-5 h-5 text-zinc-650" />
                    <p className="text-xs text-zinc-400 font-medium">No pending incoming requests</p>
                    <p className="text-[10px] text-zinc-600 max-w-[200px] leading-relaxed">
                      Matches will populate when new local streams transmit polarization coordinates.
                    </p>
                  </motion.div>
                ) : (
                  incomingRequests.map((profile) => (
                    <motion.div
                      key={profile.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group relative p-4 rounded-2xl bg-zinc-950 border border-zinc-900 flex items-start gap-3.5 transition-all hover:bg-zinc-900/40 hover:border-zinc-800"
                    >
                      <img
                        src={profile.avatar}
                        alt={profile.name}
                        className="w-11 h-11 rounded-lg object-cover border border-zinc-800/60"
                      />

                      <div className="flex-grow min-w-0 pr-10">
                        <div className="flex items-baseline gap-1.5">
                          <h4 className="text-xs font-black text-rose-50 text-ellipsis overflow-hidden whitespace-nowrap">
                            {profile.name}
                          </h4>
                          <span className="text-[9px] font-mono text-zinc-500">{profile.age} yrs</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5 font-sans">
                          {profile.bio}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className="text-[8px] font-mono uppercase bg-rose-500/15 border border-rose-500/20 rounded px-1.5 py-0.5 text-rose-300">
                            {profile.compatibilityPercentage}% Compatible
                          </span>
                        </div>
                      </div>

                      {/* Floating Action Buttons inside item card */}
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                        <button
                          onClick={() => onDeclineRequest(profile.id)}
                          className="w-7 h-7 rounded-lg bg-zinc-950 hover:bg-red-500/10 border border-zinc-900 hover:border-red-500/30 flex items-center justify-center text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                          title="Reject Signal"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onAcceptRequest(profile)}
                          className="w-7 h-7 rounded-lg bg-[#f43f5e]/10 hover:bg-gradient-to-tr hover:from-rose-500 hover:to-fuchsia-600 border border-[#f43f5e]/40 hover:border-transparent flex items-center justify-center text-rose-450 hover:text-white transition-all cursor-pointer shadow-sm"
                          title="Confirm Sync"
                        >
                          <Check className="w-3.5 h-3.5 font-bold" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* SECTION 2: SENT PROPOSALS ("if i request someone then it will show") */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-zinc-400 font-bold">
                <span>Your Sent Approvals</span>
                <span className="bg-cyan-500/20 text-cyan-300 text-[10px] px-1.5 py-0.5 rounded-md border border-cyan-500/20">
                  {likedProfiles.length} requested
                </span>
              </div>

              <AnimatePresence mode="popLayout">
                {likedProfiles.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-6 rounded-2xl bg-zinc-950 border border-zinc-900 text-center flex flex-col items-center gap-2"
                  >
                    <Compass className="w-5 h-5 text-zinc-650" />
                    <p className="text-xs text-zinc-400 font-medium">No outbound signals yet</p>
                    <p className="text-[10px] text-zinc-600 max-w-[200px] leading-relaxed">
                      Swipe right on prospective partners on the Discover Deck, or execute a query search to send an approach.
                    </p>
                  </motion.div>
                ) : (
                  likedProfiles.map((profile) => (
                    <motion.div
                      key={profile.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group p-4 rounded-2xl bg-zinc-950 border border-zinc-900 flex items-start gap-3.5"
                    >
                      <img
                        src={profile.avatar}
                        alt={profile.name}
                        className="w-11 h-11 rounded-lg object-cover border border-zinc-850"
                      />

                      <div className="flex-grow min-w-0">
                        <div className="flex items-baseline gap-1.5">
                          <h4 className="text-xs font-black text-cyan-50">
                            {profile.name}
                          </h4>
                          <span className="text-[9px] font-mono text-zinc-500">{profile.age} yrs</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5 font-sans">
                          {profile.location} • {profile.distance}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className="text-[8px] font-mono uppercase bg-cyan-500/10 border border-cyan-500/20 rounded px-1.5 py-0.5 text-cyan-300 flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
                            Pending Resonance Feedback
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] font-mono font-bold text-cyan-400">{profile.compatibilityPercentage}%</span>
                        <span className="text-[8px] font-mono text-zinc-600">OUTBOUND</span>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>

        {/* Informative footer status block */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-900 flex items-center gap-2 text-zinc-550 text-[10px] font-mono leading-relaxed mt-auto">
          <Info className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
          <span>Confirming approaches adds candidates directly to your secure sync stream chats instantly.</span>
        </div>
      </motion.div>
    </div>
  );
}
