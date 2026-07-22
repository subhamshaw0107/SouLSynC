/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  id: string;
  name: string;
  avatar: string; // url or reference key
  bio: string;
  age: number;
  gender: string;
  location: string;
  interests: string[];
  favoriteMusic: string[];
  favoriteMovies: string[];
  relationshipGoals: string;
  personalityType: string; // e.g., "INFJ"
  loveLanguage: string; // e.g., "Words of Affirmation"
  mood: string; // e.g., "😊 Cozy", "🔥 Romantic", "💙 Dreamy"
  phoneNumber?: string;
}

export interface MatchProfile {
  id: string;
  name: string;
  avatar: string;
  age: number;
  bio: string;
  location: string;
  distance: string;
  interests: string[];
  personalityType: string;
  relationshipGoals: string;
  compatibilityPercentage: number;
  mutualInterestsCount: number;
  gender: string;
}

export interface QuizQuestion {
  id: string;
  category: "Fun" | "Deep Emotional" | "Relationship Goals" | "Daily Habits" | "Trust & Loyalty";
  question: string;
  options: string[];
  iconName: string;
}

export interface CompatibilityReport {
  overallPercentage: number;
  emotionalScore: number;
  communicationScore: number;
  lifestyleScore: number;
  loveLanguageMatch: string;
  relationshipDynamics: string;
  greenFlags: string[];
  redFlags: string[];
  growthAreas: string[];
  compatibilityAdvice: string;
  suggestedActivities: string[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  reactions?: string[];
  isVoice?: boolean;
  voiceDuration?: string;
  icebreakerType?: string;
}

export interface ChatSession {
  matchId: string;
  matchProfile: MatchProfile;
  messages: ChatMessage[];
  lastActive: string;
  typing?: boolean;
  online: boolean;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  rewardValue: string;
  questions: {
    question: string;
    options: string[];
  }[];
}

export interface CoupleGameState {
  userChoice: string | null;
  opponentChoice: string | null;
  gameState: "idle" | "waiting" | "revealed";
  winner: string | null;
}

export interface PlaylistTrack {
  id: string;
  title: string;
  artist: string;
  genre: string;
  vibes: string[];
}
