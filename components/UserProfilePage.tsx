/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { UserProfile } from "../types";
import { Sparkles, Heart, Plus, Trash2, Save, Smile, MessageSquare, ListPlus } from "lucide-react";
import { doc, setDoc } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";

interface UserProfilePageProps {
  currentUser: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
}

export default function UserProfilePage({ currentUser, onUpdateProfile }: UserProfilePageProps) {
  const [name, setName] = useState(currentUser.name);
  const [age, setAge] = useState(currentUser.age);
  const [bio, setBio] = useState(currentUser.bio);
  const [location, setLocation] = useState(currentUser.location);
  const [personalityType, setPersonalityType] = useState(currentUser.personalityType);
  const [loveLanguage, setLoveLanguage] = useState(currentUser.loveLanguage);
  const [relationshipGoals, setRelationshipGoals] = useState(currentUser.relationshipGoals);
  const [mood, setMood] = useState(currentUser.mood);

  // Lists state
  const [interests, setInterests] = useState<string[]>(currentUser.interests);
  const [interestInput, setInterestInput] = useState("");

  const [music, setMusic] = useState<string[]>(currentUser.favoriteMusic);
  const [musicInput, setMusicInput] = useState("");

  const [movies, setMovies] = useState<string[]>(currentUser.favoriteMovies);
  const [movieInput, setMovieInput] = useState("");

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async () => {
    const updated: UserProfile = {
      ...currentUser,
      name,
      age: Number(age),
      bio,
      location,
      personalityType,
      loveLanguage,
      relationshipGoals,
      mood,
      interests,
      favoriteMusic: music,
      favoriteMovies: movies
    };

    try {
      await setDoc(doc(db, "users", currentUser.id), updated);
      onUpdateProfile(updated);
      setSaveSuccess(true);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${currentUser.id}`);
    }
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const addItem = (type: "interests" | "music" | "movies", val: string) => {
    if (!val.trim()) return;

    if (type === "interests") {
      if (!interests.includes(val)) setInterests([...interests, val]);
      setInterestInput("");
    } else if (type === "music") {
      if (!music.includes(val)) setMusic([...music, val]);
      setMusicInput("");
    } else {
      if (!movies.includes(val)) setMovies([...movies, val]);
      setMovieInput("");
    }
  };

  const removeItem = (type: "interests" | "music" | "movies", item: string) => {
    if (type === "interests") {
      setInterests(interests.filter(i => i !== item));
    } else if (type === "music") {
      setMusic(music.filter(m => m !== item));
    } else {
      setMovies(movies.filter(m => m !== item));
    }
  };

  return (
    <div className="z-10 relative max-w-4xl mx-auto px-4 py-8 select-none space-y-8">
      
      {/* 1. Header Hero Banner */}
      <div className="relative bg-zinc-950/60 border border-zinc-900 rounded-[35px] overflow-hidden p-6 sm:p-10 backdrop-blur-md flex flex-col sm:flex-row items-center gap-6 shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
        <div className="relative group shrink-0">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-28 h-28 rounded-3xl object-cover border-2 border-rose-500/20"
          />
          <span className="absolute -bottom-2 -right-2 bg-gradient-to-tr from-rose-500 to-fuchsia-600 rounded-xl px-2.5 py-1 text-[10px] text-white font-mono font-bold uppercase shadow-md select-none">
            {personalityType}
          </span>
        </div>

        <div className="text-center sm:text-left flex-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[10px] font-mono mb-2 uppercase tracking-widest font-bold">
            Profile Synchronization Mode
          </div>
          <h2 className="text-2xl font-black text-rose-100">{name}, <span className="font-light text-zinc-500 text-xl">{age}</span></h2>
          <p className="text-xs text-zinc-500 mt-1 max-w-md font-sans leading-relaxed">
            {bio || "Keep your character parameter set complete so matching results yield pristine, flawless intelligence values from Aiden."}
          </p>

          {/* Active Mood selector */}
          <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
            {["😊 Cozy", "🔥 Romantic", "💙 Dreamy", "☕ Active"].map((m) => {
              const active = mood === m;
              return (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                    active 
                      ? "bg-rose-500/20 border-rose-500 text-rose-300 shadow-sm shadow-rose-950/10" 
                      : "bg-zinc-900/60 border-zinc-850 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Core Profile Editing Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Column A: Characteristics config */}
        <div className="bg-zinc-950/60 border border-zinc-900 p-6 rounded-3xl backdrop-blur-sm space-y-4">
          <h4 className="text-xs font-mono font-bold text-rose-350 uppercase tracking-widest mb-4">Core Resonance Set</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] text-zinc-400 uppercase font-mono tracking-wider mb-1.5">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-850 text-rose-100 placeholder:text-zinc-600 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-rose-500/40"
              />
            </div>
            <div>
              <label className="block text-[10px] text-zinc-400 uppercase font-mono tracking-wider mb-1.5">Your Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-850 text-rose-100 placeholder:text-zinc-600 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-rose-500/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-zinc-400 uppercase font-mono tracking-wider mb-1.5">Your Location coordinates</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-850 text-rose-100 placeholder:text-zinc-600 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-rose-500/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] text-zinc-400 uppercase font-mono tracking-wider mb-1.5">Personality</label>
              <select
                value={personalityType}
                onChange={(e) => setPersonalityType(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-850 text-rose-100 rounded-xl px-3 py-2.5 outline-none text-xs"
              >
                {["INFJ", "ENFP", "INTJ", "ENFJ", "INFP", "INTP", "ENTP", "ESFJ", "ISTJ", "ISFP"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-zinc-400 uppercase font-mono tracking-wider mb-1.5">Love Language</label>
              <select
                value={loveLanguage}
                onChange={(e) => setLoveLanguage(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-850 text-rose-100 rounded-xl px-3 py-2.5 outline-none text-xs"
              >
                {["Words of Affirmation", "Quality Time", "Acts of Service", "Physical Touch", "Receiving Gifts"].map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-zinc-400 uppercase font-mono tracking-wider mb-1.5">Relationship Goals</label>
            <select
              value={relationshipGoals}
              onChange={(e) => setRelationshipGoals(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-850 text-rose-100 rounded-xl px-3 py-2.5 outline-none text-xs"
            >
              {["Soulmate Syncing", "Adventurous Partner", "Cozy Life Companion", "Growth Partnership"].map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-zinc-400 uppercase font-mono tracking-wider mb-1.5">Your Short Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full bg-zinc-900 border border-zinc-850 text-rose-100 placeholder:text-zinc-650 rounded-xl p-3 text-xs outline-none focus:border-rose-500/40 resize-none"
            />
          </div>

        </div>

        {/* Column B: Editable Lists (Interests, Movies, Music) */}
        <div className="bg-zinc-950/60 border border-zinc-900 p-6 rounded-3xl backdrop-blur-sm space-y-5 flex flex-col justify-between">
          
          {/* Interests segment */}
          <div>
            <label className="block text-[10px] text-zinc-400 uppercase font-mono tracking-wider mb-2">Interests</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Add hobby..."
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addItem("interests", interestInput);
                }}
                className="flex-1 bg-zinc-900 text-rose-100 placeholder:text-zinc-600 rounded-xl px-3 text-xs outline-none border border-zinc-850 focus:border-rose-500/40"
              />
              <button
                onClick={() => addItem("interests", interestInput)}
                className="w-10 h-10 bg-zinc-900 border border-zinc-850 text-rose-300 rounded-xl flex items-center justify-center cursor-pointer hover:border-rose-500/35"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
              {interests.map((item) => (
                <span
                  key={item}
                  onClick={() => removeItem("interests", item)}
                  className="text-[10px] px-2.5 py-1 rounded-full bg-zinc-900/40 border border-zinc-800 text-rose-350 font-mono flex items-center gap-1 cursor-pointer hover:bg-rose-500/10 hover:border-rose-500/30 transition-all"
                  title="Click to remove"
                >
                  #{item.toLowerCase()} • <span className="text-zinc-650">x</span>
                </span>
              ))}
            </div>
          </div>

          {/* Favorite Tracks segment */}
          <div>
            <label className="block text-[10px] text-zinc-400 uppercase font-mono tracking-wider mb-2">Favorite Tracks (Love Mixtape parameters)</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Add 'Track Name - Artist'..."
                value={musicInput}
                onChange={(e) => setMusicInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addItem("music", musicInput);
                }}
                className="flex-1 bg-zinc-900 text-rose-100 placeholder:text-zinc-600 rounded-xl px-3 text-xs outline-none border border-zinc-850 focus:border-rose-500/40"
              />
              <button
                onClick={() => addItem("music", musicInput)}
                className="w-10 h-10 bg-zinc-900 border border-zinc-850 text-rose-300 rounded-xl flex items-center justify-center cursor-pointer hover:border-rose-500/35"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
              {music.map((item) => (
                <div key={item} className="flex justify-between items-center bg-zinc-900/40 p-1.5 px-3 border border-zinc-850/65 rounded-xl text-[11px]">
                  <span className="text-zinc-300 truncate">{item}</span>
                  <button onClick={() => removeItem("music", item)} className="text-zinc-650 hover:text-rose-450 cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Favorite Movies segment */}
          <div>
            <label className="block text-[10px] text-zinc-400 uppercase font-mono tracking-wider mb-2">Favorite Film lore</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Add movie title..."
                value={movieInput}
                onChange={(e) => setMovieInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addItem("movies", movieInput);
                }}
                className="flex-1 bg-zinc-900 text-rose-100 placeholder:text-zinc-600 rounded-xl px-3 text-xs outline-none border border-zinc-850 focus:border-rose-500/40"
              />
              <button
                onClick={() => addItem("movies", movieInput)}
                className="w-10 h-10 bg-zinc-900 border border-zinc-850 text-rose-300 rounded-xl flex items-center justify-center cursor-pointer hover:border-rose-500/35"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
              {movies.map((item) => (
                <span
                  key={item}
                  onClick={() => removeItem("movies", item)}
                  className="text-[10px] px-2.5 py-1 bg-zinc-900 border border-zinc-850 hover:border-rose-500/30 rounded-lg text-rose-105 select-none cursor-pointer flex items-center gap-1.5 hover:bg-rose-500/5"
                  title="Click to remove"
                >
                  🎞️ {item} <span className="text-zinc-600 hover:text-rose-400">×</span>
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Save Action Controller Footer */}
      <div className="flex justify-end items-center gap-4 bg-zinc-950/40 p-4 border border-zinc-900 rounded-2xl">
        {saveSuccess && (
          <span className="text-xs text-rose-400 font-mono font-bold animate-pulse">
            ✓ Core Synchronicities Saved!
          </span>
        )}
        <button
          onClick={handleSave}
          className="px-8 py-3 bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:from-rose-450 hover:to-fuchsia-500 text-white text-xs font-bold rounded-xl tracking-wide font-mono transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 cursor-pointer shadow-md"
        >
          <Save className="w-4 h-4 text-white" />
          Update Synchronization Files
        </button>
      </div>

      {/* Historical Calculations list */}
      <div className="bg-zinc-950/40 border border-zinc-900 p-6 rounded-3xl pb-8">
        <h4 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest mb-6">Historic Calibration Indexes</h4>
        <div className="space-y-3">
          {[
            { name: "Aria Sterling", score: 94, status: "Connected", date: "May 25, 2026", details: "Highly aligned acoustic specs" },
            { name: "Seraphina Lin", score: 91, status: "Connected", date: "May 25, 2026", details: "Star mapping dynamics matching" }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-zinc-900/30 border border-zinc-850/70 hover:border-rose-500/15 rounded-2xl gap-3">
              <div>
                <div className="text-xs font-bold text-rose-100">{item.name}</div>
                <div className="text-[10px] text-zinc-500 mt-1 font-sans">{item.details} • Checked on {item.date}</div>
              </div>
              <div className="flex items-center gap-4 shrink-0 font-mono">
                <span className="text-[10px] uppercase font-bold text-emerald-500">{item.status}</span>
                <span className="text-sm font-black text-rose-450">{item.score}% Sync</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
