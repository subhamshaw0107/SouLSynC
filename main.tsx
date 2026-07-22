/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { QuizQuestion, MatchProfile, PlaylistTrack } from "./types";

export const COMPATIBILITY_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    category: "Fun",
    question: "What is your absolute perfect spontaneous date idea?",
    options: [
      "Stargazing in the bed of an open truck with blankets",
      "An intense, high-energy arcade and laser-tag faceoff",
      "Sneaking into a beautiful greenhouse during off-hours",
      "Getting completely lost in an old vinyl record store"
    ],
    iconName: "Sparkles"
  },
  {
    id: "q2",
    category: "Deep Emotional",
    question: "When you are going through heavy stress, how can a partner comfort you best?",
    options: [
      "Giving me deep physical touch (hugs, holding hand) in absolute silence",
      "Listening closely and offering highly practical advice or solutions",
      "Giving me complete quiet space but sliding a cozy snack to my desk",
      "Validating my thoughts and telling me 'I have your back no matter what'"
    ],
    iconName: "HeartHandshake"
  },
  {
    id: "q3",
    category: "Relationship Goals",
    question: "What does the ultimate shared workspace or life looks like for you?",
    options: [
      "A rustic cabin surrounded by pine trees, reading books by the fireplace",
      "A high-rise cyberpunk metropolitan flat with neon lights and smart widgets",
      "A fluid, nomadic camper-van lifestyle traveling across coasts every month",
      "A warm suburban home filled with laughing animals, plants, and close friends"
    ],
    iconName: "Target"
  },
  {
    id: "q4",
    category: "Daily Habits",
    question: "How do you recharge your social battery after an exhaustive work week?",
    options: [
      "Absolutely alone in active dark mode playing video games or binge watching",
      "An intimate cozy dinner party with only 2 or 3 of my favorite humans",
      "Wandering through raw nature, taking photographs, and feeling breeze",
      "Throwing custom theme parties or attending electric local live shows"
    ],
    iconName: "Coffee"
  },
  {
    id: "q5",
    category: "Trust & Loyalty",
    question: "If a boundary of yours is accidentally crossed, what is your conflict resolution style?",
    options: [
      "Cooling down completely before talking calmly under structured guidelines",
      "Resolving it immediately on the spot, even if emotions are briefly hot",
      "Writing a long, deeply honest letter explaining my feelings and perspectives",
      "Cracking a joke to ease the tension and seeking light-hearted reconciliation"
    ],
    iconName: "Key"
  },
  {
    id: "q6",
    category: "Fun",
    question: "Choose a movie genre that fits your emotional frequency on Sunday afternoon:",
    options: [
      "Chilling existential science-fiction (Interstellar, Arrival)",
      "Cozy, nostalgic studio Ghibli anime with magical tea-making sequences",
      "A clever, dark psychological thriller with multiple mind-bending twists",
      "A warm, absolute classic indie-comedy romance with dry-witted characters"
    ],
    iconName: "Film"
  },
  {
    id: "q7",
    category: "Deep Emotional",
    question: "What does Vulnerability mean to you in a loving connection?",
    options: [
      "Sharing my messy, unedited childhood memories and secret fears",
      "Admitting immediately when I am wrong without feeling less loved",
      "Crying together during emotional scenes without trying to make jokes",
      "Entrusting the other with passwords, keys, and absolute financial trust"
    ],
    iconName: "Heart"
  }
];

export const CANDIDATE_PROFILES: MatchProfile[] = [
  {
    id: "m1",
    name: "Aria Sterling",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80",
    age: 24,
    bio: "Obsessed with cozy Ghibli soundtracks, rainy city skylines, and building custom mechanical keyboards. Seeking someone who can lose track of time in beautiful libraries.",
    location: "Neo Seoul, Sector 4",
    distance: "1.2 km away",
    interests: ["Digital Art", "Vinyl Records", "Ghibli Movies", "Matcha Latte", "Cyberpunk Specs"],
    personalityType: "INFJ",
    relationshipGoals: "Soulmate Syncing",
    compatibilityPercentage: 94,
    mutualInterestsCount: 4,
    gender: "Female"
  },
  {
    id: "m2",
    name: "Kaelen Vane",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    age: 26,
    bio: "An active dark-theme developer who designs indie video games. Let's debate sci-fi lore over a plate of spicy ramen and fresh green tea. My cat approves of cool partners.",
    location: "Zen City, Heights",
    distance: "4.5 km away",
    interests: ["Game Dev", "Spicy Ramen", "Retro Gaming", "Acoustic Pop", "Cats", "Interstellar"],
    personalityType: "ENFP",
    relationshipGoals: "Adventurous Partner",
    compatibilityPercentage: 88,
    mutualInterestsCount: 3,
    gender: "Male"
  },
  {
    id: "m3",
    name: "Seraphina Lin",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80",
    age: 25,
    bio: "Landscape architect by day, ambient synthesizer compiler by night. I find absolute beauty in starry night camping and old film camera negatives. Let's capture the moon.",
    location: "Bloomfield Valley",
    distance: "9.1 km away",
    interests: ["Analog Synths", "Stargazing", "Film Cameras", "Matcha Latte", "Hiking", "Vinyl Records"],
    personalityType: "INTJ",
    relationshipGoals: "Cozy Life Companion",
    compatibilityPercentage: 91,
    mutualInterestsCount: 5,
    gender: "Female"
  },
  {
    id: "m4",
    name: "Julian Woods",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    age: 27,
    bio: "Specialty coffee roaster who spends free days restoring old mid-century modern furniture. I believe loyalty and deep communication outweigh all superficial glitz.",
    location: "Downtown Echoes",
    distance: "3.2 km away",
    interests: ["Coffee Brewing", "Jazz Classics", "Design Architecture", "Indie Folk", "Thrift Shopping"],
    personalityType: "ENFJ",
    relationshipGoals: "Growth Partnership",
    compatibilityPercentage: 84,
    mutualInterestsCount: 2,
    gender: "Male"
  }
];

export const DEFAULT_TRACKS: PlaylistTrack[] = [
  { id: "t1", title: "Midnight Whispers", artist: "Hologram Love", genre: "Chillwave", vibes: ["Dreamy", "Neon Glow"] },
  { id: "t2", title: "Coffee & Rainbeats", artist: "Lo-Fi Soulmate", genre: "Cozy Beats", vibes: ["Warm", "Comforting"] },
  { id: "t3", title: "Ethereal Echoes", artist: "Seraphina Synthesized", genre: "Ambient Synth", vibes: ["Deep", "Spiritual"] },
  { id: "t4", title: "Sinking in Your Eyes", artist: "Cherry Ruby", genre: "Dream Pop", vibes: ["Romantic", "Sweeeet"] },
  { id: "t5", title: "Acoustic Fireplace", artist: "Indie Meadow", genre: "Indie Folk", vibes: ["Intimate", "Nostalgic"] }
];
