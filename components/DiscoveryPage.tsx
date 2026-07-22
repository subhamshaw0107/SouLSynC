/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { MatchProfile, UserProfile } from "../types";
import { CANDIDATE_PROFILES } from "../data";
import { Heart, X, MapPin, Compass, Sparkles, AlertCircle, RefreshCw, MessageSquare } from "lucide-react";

interface DiscoveryPageProps {
  currentUser: UserProfile;
  onMatchCreated: (match: MatchProfile) => void;
  likedProfiles: string[];
  setLikedProfiles: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function DiscoveryPage({ currentUser, onMatchCreated, likedProfiles, setLikedProfiles }: DiscoveryPageProps) {
  const [profiles, setProfiles] = useState<MatchProfile[]>(() => {
    const targetGender = currentUser?.gender === "Male" ? "Female" : "Male";
    return CANDIDATE_PROFILES.filter(p => p.gender === targetGender);
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const targetGender = currentUser?.gender === "Male" ? "Female" : "Male";
    setProfiles(CANDIDATE_PROFILES.filter(p => p.gender === targetGender));
    setCurrentIndex(0); // Reset index when gender orientation changes
  }, [currentUser?.gender]);
  const [showMatchPopup, setShowMatchPopup] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<MatchProfile | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);

  const activeProfile = currentIndex < profiles.length ? profiles[currentIndex] : null;

  const handleSwipe = (direction: "left" | "right") => {
    if (!activeProfile) return;

    setSwipeDirection(direction);

    setTimeout(() => {
      if (direction === "right") {
        // Liked! Add to state
        setLikedProfiles(prev => [...prev, activeProfile.id]);
        
        // Match discovery simulation: 80% chance for a gorgeous instant "Match Match Match!" popup
        const willMatch = Math.random() < 0.85;
        if (willMatch) {
          setMatchedProfile(activeProfile);
          setShowMatchPopup(true);
        }
      }

      setCurrentIndex(prev => prev + 1);
      setSwipeDirection(null);
    }, 450);
  };

  const handlePopupCloseAndChat = () => {
    if (matchedProfile) {
      onMatchCreated(matchedProfile);
    }
    setShowMatchPopup(false);
    setMatchedProfile(null);
  };

  const resetDeck = () => {
    setCurrentIndex(0);
    setLikedProfiles([]);
  };

  return (
    <div className="z-10 relative max-w-lg mx-auto px-4 py-8 select-none">
      
      {/* 1. Deck Cards */}
      {activeProfile ? (
        <div className="relative">
          
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-widest text-rose-300 bg-rose-950/40 border border-rose-500/25 px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Discover Sync Partners</span>
          </div>

          <div
            className={`w-full aspect-[3/4] sm:aspect-[4/5] bg-zinc-950 border border-zinc-900 rounded-[30px] overflow-hidden shadow-[0_15px_60px_rgba(244,63,94,0.12)] relative transition-all duration-[400ms] ease-out select-none ${
              swipeDirection === "left" ? "-translate-x-[150%] rotate-[-15deg] opacity-0" : ""
            } ${
              swipeDirection === "right" ? "translate-x-[150%] rotate-[15deg] opacity-0" : ""
            }`}
          >
            {/* Main Cover Picture */}
            <img
              src={activeProfile.avatar}
              alt={activeProfile.name}
              className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
            />

            {/* Neon Rose Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-950/30 to-transparent pointer-events-none" />

            {/* Profile Info Card footer */}
            <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col gap-3">
              
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="text-2xl font-black text-rose-100 flex items-center gap-2">
                    {activeProfile.name}, <span className="text-xl text-rose-300 font-normal">{activeProfile.age}</span>
                  </h3>
                  <div className="text-xs text-zinc-400 flex items-center gap-1 mt-1 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{activeProfile.location} • {activeProfile.distance}</span>
                  </div>
                </div>

                {/* Compatibility Core Badge */}
                <div className="w-16 h-16 rounded-full bg-zinc-950/80 border-2 border-rose-500/60 shadow-[0_0_20px_rgba(244,63,94,0.4)] flex flex-col items-center justify-center font-mono">
                  <span className="text-[10px] text-rose-400 font-bold uppercase tracking-tighter">Sync</span>
                  <span className="text-lg font-black text-white leading-none">{activeProfile.compatibilityPercentage}%</span>
                </div>
              </div>

              {/* Bio block */}
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans line-clamp-3">
                {activeProfile.bio}
              </p>

              {/* Interests tag row */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {activeProfile.interests.map((interest) => (
                  <span
                    key={interest}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300/80 font-mono"
                  >
                    #{interest.toLowerCase().replace(" ", "")}
                  </span>
                ))}
              </div>

              <div className="text-[10px] text-rose-450 font-mono mt-1 font-bold">
                🔮 {activeProfile.mutualInterestsCount} Mutual Interests Identified
              </div>

            </div>

          </div>

          {/* Controller buttons */}
          <div className="flex justify-center items-center gap-6 mt-8">
            <button
              onClick={() => handleSwipe("left")}
              className="w-14 h-14 bg-zinc-900 hover:bg-zinc-805 border border-zinc-800 hover:border-zinc-700/80 text-zinc-400 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg transform active:scale-90"
            >
              <X className="w-6 h-6 text-rose-400" />
            </button>
            <button
              onClick={() => handleSwipe("right")}
              className="w-16 h-16 bg-gradient-to-tr from-rose-500 to-fuchsia-600 text-white rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xl shadow-rose-950/40 transform hover:scale-105 active:scale-90 animate-pulse"
            >
              <Heart className="w-7 h-7 text-white fill-white" />
            </button>
          </div>

        </div>
      ) : (
        <div className="bg-zinc-950/60 border border-zinc-850 p-10 rounded-3xl text-center backdrop-blur-md">
          <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800/80 flex items-center justify-center mx-auto mb-5 animate-spin">
            <RefreshCw className="w-6 h-6 text-rose-450" />
          </div>
          <h3 className="text-xl font-bold text-zinc-250 mb-2">No more local frequency profiles!</h3>
          <p className="text-xs text-zinc-500 leading-relaxed max-w-sm mx-auto mb-6 font-sans">
            You've explored all matching candidates in your immediate vicinity. Reset the deck queue to expand your resonance loop again.
          </p>
          <button
            onClick={resetDeck}
            className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:from-rose-450 hover:to-fuchsia-500 text-white text-xs font-bold rounded-xl tracking-wide font-mono transition-all transform hover:scale-[1.02] cursor-pointer"
          >
            Reset Frequency Deck
          </button>
        </div>
      )}

      {/* 2. MATCH DISCOVER POPUP SCREEN */}
      {showMatchPopup && matchedProfile && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-lg animate-fade-in select-none">
          
          <div className="w-full max-w-md bg-zinc-950 border border-rose-500/20 p-8 rounded-[35px] text-center shadow-[0_0_60px_rgba(244,63,94,0.3)] duration-300">
            
            <div className="w-14 h-14 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Heart className="w-7 h-7 text-rose-500 fill-rose-500 animate-pulse" />
            </div>

            <h2 className="text-3xl font-black bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-400 bg-clip-text text-transparent mb-1 uppercase tracking-wider font-sans">
              It's a Match!
            </h2>
            <p className="text-[11px] text-rose-300/85 font-mono mb-8 uppercase tracking-widest">Aesthetic Alignment Confirmed</p>

            {/* Profile Side-by-Side Avatars */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  alt="You"
                  className="w-20 h-20 rounded-2xl border-2 border-rose-500/40 object-cover rotate-[-6deg] shadow-md"
                />
                <span className="absolute -bottom-2 -left-1 text-[10px] font-mono px-1.5 bg-rose-950 border border-rose-500/40 text-rose-300 font-bold rounded-md">YOU</span>
              </div>
              
              <div className="w-8 h-8 rounded-full bg-rose-950/20 border border-rose-500/30 flex items-center justify-center font-black text-rose-350">
                +
              </div>

              <div className="relative">
                <img
                  src={matchedProfile.avatar}
                  alt={matchedProfile.name}
                  className="w-20 h-20 rounded-2xl border-2 border-fuchsia-500/40 object-cover rotate-[6deg] shadow-md"
                />
                <span className="absolute -bottom-2 -right-1 text-[10px] font-mono px-1.5 bg-fuchsia-950 border border-fuchsia-500/40 text-fuchsia-300 font-bold rounded-md">{matchedProfile.name.toUpperCase()}</span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed mb-8 max-w-sm mx-auto">
              Your mutual interests in film choices, music tastes, and companion goals resolved in a spectacular <span className="font-bold text-rose-450">{matchedProfile.compatibilityPercentage}% compatibility score</span>.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handlePopupCloseAndChat}
                className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:from-rose-450 hover:to-fuchsia-550 text-white font-bold rounded-xl tracking-wide transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer shadow-md text-sm"
              >
                <MessageSquare className="w-4.5 h-4.5" /> Speak with {matchedProfile.name} Now
              </button>
              
              <button
                onClick={() => setShowMatchPopup(false)}
                className="w-full py-3 hover:bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-rose-200 transition-colors rounded-xl text-xs font-semibold cursor-pointer"
              >
                Keep Discovering
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
