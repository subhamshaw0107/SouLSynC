/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { UserProfile, MatchProfile, QuizQuestion, CompatibilityReport, CoupleGameState } from "../types";
import { COMPATIBILITY_QUESTIONS, CANDIDATE_PROFILES } from "../data";
import { Heart, Sparkles, ChevronLeft, ChevronRight, Zap, Target, Star, Gift, Shuffle, RefreshCw, Trophy, User } from "lucide-react";

interface TestPageProps {
  currentUser: UserProfile;
  initialPartner?: MatchProfile | null;
  onReportGenerated: (report: CompatibilityReport, partner: MatchProfile | UserProfile) => void;
}

export default function TestPage({ currentUser, initialPartner, onReportGenerated }: TestPageProps) {
  const [testMode, setTestMode] = useState<"ai-sync" | "pass-play">("ai-sync");
  const [selectedPartner, setSelectedPartner] = useState<MatchProfile>(() => initialPartner || CANDIDATE_PROFILES[0]);

  useEffect(() => {
    if (initialPartner) {
      setSelectedPartner(initialPartner);
    }
  }, [initialPartner]);
  
  // Pass & Play partner info
  const [guestName, setGuestName] = useState("");
  const [guestPersonality, setGuestPersonality] = useState("ENFP");
  const [guestLoveLanguage, setGuestLoveLanguage] = useState("Words of Affirmation");

  // Quiz state
  const [step, setStep] = useState<"intro" | "questions" | "mini-game" | "calculating">("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentUserAnswers, setCurrentUserAnswers] = useState<Record<string, string>>({});
  const [partnerAnswers, setPartnerAnswers] = useState<Record<string, string>>({});
  const [currentTurn, setCurrentTurn] = useState<"userA" | "userB">("userA");

  // Stone Paper Scissors State
  const [gameState, setGameState] = useState<CoupleGameState>({
    userChoice: null,
    opponentChoice: null,
    gameState: "idle",
    winner: null
  });

  const [loadingText, setLoadingText] = useState("Aligning psychic resonance...");

  const activeQuestions = COMPATIBILITY_QUESTIONS;
  const currentQuestion = activeQuestions[currentQuestionIndex];

  // Logic to advance question
  const handleAnswerSelect = (option: string) => {
    if (testMode === "ai-sync") {
      // Single User Mode
      setCurrentUserAnswers(prev => ({ ...prev, [currentQuestion.id]: option }));
      
      // Auto-simulate partner answer immediately
      // AI chooses based on a deterministic index or randomly
      const partnerIndex = Math.floor(Math.random() * currentQuestion.options.length);
      const simulatedAnswer = currentQuestion.options[partnerIndex];
      setPartnerAnswers(prev => ({ ...prev, [currentQuestion.id]: simulatedAnswer }));

      if (currentQuestionIndex < activeQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setStep("mini-game");
      }
    } else {
      // Pass & Play Mode
      if (currentTurn === "userA") {
        setCurrentUserAnswers(prev => ({ ...prev, [currentQuestion.id]: option }));
        if (currentQuestionIndex < activeQuestions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
        } else {
          // Switch turn to guest partner
          setCurrentTurn("userB");
          setCurrentQuestionIndex(0);
        }
      } else {
        setPartnerAnswers(prev => ({ ...prev, [currentQuestion.id]: option }));
        if (currentQuestionIndex < activeQuestions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
        } else {
          setStep("mini-game");
        }
      }
    }
  };

  const handleChoice = (choice: string) => {
    if (testMode === "ai-sync") {
      const choices = ["Rock", "Paper", "Scissors"];
      const rpsSimChoice = choices[Math.floor(Math.random() * 3)];
      
      let winner: string | null = null;
      if (choice === rpsSimChoice) {
        winner = "Tie";
      } else if (
        (choice === "Rock" && rpsSimChoice === "Scissors") ||
        (choice === "Paper" && rpsSimChoice === "Rock") ||
        (choice === "Scissors" && rpsSimChoice === "Paper")
      ) {
        winner = "UserA";
      } else {
        winner = "Opponent";
      }

      setGameState({
        userChoice: choice,
        opponentChoice: rpsSimChoice,
        gameState: "revealed",
        winner
      });
    } else {
      if (!gameState.userChoice) {
        setGameState(prev => ({ ...prev, userChoice: choice, gameState: "waiting" }));
      } else if (!gameState.opponentChoice) {
        let winner: string | null = null;
        if (gameState.userChoice === choice) {
          winner = "Tie";
        } else if (
          (gameState.userChoice === "Rock" && choice === "Scissors") ||
          (gameState.userChoice === "Paper" && choice === "Rock") ||
          (gameState.userChoice === "Scissors" && choice === "Paper")
        ) {
          winner = "UserA";
        } else {
          winner = "Opponent";
        }

        setGameState({
          userChoice: gameState.userChoice,
          opponentChoice: choice,
          gameState: "revealed",
          winner
        });
      }
    }
  };

  const executeCompatibilityCalculation = async () => {
    setStep("calculating");
    setLoadingText("SouLSynC core initializing sync frequencies...");
    
    // Construct matched metadata
    let partnerInfo: MatchProfile | UserProfile;
    if (testMode === "ai-sync") {
      partnerInfo = selectedPartner;
    } else {
      partnerInfo = {
        id: "guest-user",
        name: guestName || "Secret Soul",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
        bio: "Special guest sync member",
        age: 24,
        gender: "Partner",
        location: currentUser.location,
        interests: ["Vinyl Records", "Cats", "Stargazing"],
        favoriteMusic: [],
        favoriteMovies: [],
        relationshipGoals: "Soulmate Syncing",
        personalityType: guestPersonality,
        loveLanguage: guestLoveLanguage,
        mood: "💖 Aligned"
      };
    }

    const payload = {
      userA: currentUser,
      userB: partnerInfo,
      answers: COMPATIBILITY_QUESTIONS.map(q => ({
        question: q.question,
        category: q.category,
        userAAnswer: currentUserAnswers[q.id],
        userBAnswer: partnerAnswers[q.id]
      })),
      gameRecord: {
        game: "Stone-Paper-Scissors Cozy-Choice",
        userAChoice: gameState.userChoice,
        userBChoice: gameState.opponentChoice,
        result: gameState.winner
      }
    };

    try {
      setLoadingText("Gathering love parameters & conflict style matrices...");
      const response = await fetch("/api/gemini/compatibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const textStatus = await response.json();
      setLoadingText("Synthesizing custom relationship insights from Aiden...");
      
      setTimeout(() => {
        onReportGenerated(textStatus.response, partnerInfo);
      }, 1000);
    } catch (e) {
      console.error(e);
      // Failover calculated report in server.ts handled gracefully
    }
  };

  const resetRps = () => {
    setGameState({
      userChoice: null,
      opponentChoice: null,
      gameState: "idle",
      winner: null
    });
  };

  return (
    <div className="z-10 relative max-w-4xl mx-auto px-4 py-8 select-none">
      
      {/* 1. INTRO STEP */}
      {step === "intro" && (
        <div className="bg-zinc-950/60 border border-rose-500/20 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-[0_0_50px_rgba(239,68,110,0.1)]">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500/20 to-fuchsia-600/20 border border-rose-500/30 flex items-center justify-center animate-pulse mb-6">
              <Sparkles className="w-8 h-8 text-rose-500" />
            </div>
            
            <h2 className="text-3xl font-extrabold text-zinc-100 mb-3 tracking-tight">AI Compatibility Sync System</h2>
            <p className="text-zinc-500 text-sm max-w-xl mb-8 leading-relaxed">
              Synthesize compatibility metrics through high-fidelity emotional analytics. Choose between AI synchronization with our local candidate or Pass-and-Play shared session with a real-life guest.
            </p>

            {/* Mode Selectors */}
            <div className="flex gap-4 p-1.5 bg-zinc-900/80 border border-zinc-800/80 rounded-2xl mb-8">
              <button
                type="button"
                onClick={() => setTestMode("ai-sync")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer select-none ${testMode === "ai-sync" ? "bg-gradient-to-r from-rose-500 to-fuchsia-600 text-white shadow-md shadow-rose-950/20" : "text-zinc-400 hover:text-zinc-200"}`}
              >
                <Zap className="w-3.5 h-3.5" />
                AI Dual Sync (vs. Candidate)
              </button>
              <button
                type="button"
                onClick={() => setTestMode("pass-play")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer select-none ${testMode === "pass-play" ? "bg-gradient-to-r from-rose-500 to-fuchsia-600 text-white shadow-md shadow-rose-950/20" : "text-zinc-400 hover:text-zinc-200"}`}
              >
                <User className="w-3.5 h-3.5" />
                Pass & Play (Crush / Partner)
              </button>
            </div>

            {/* Context Inputs based on mode */}
            {testMode === "ai-sync" ? (
              <div className="w-full max-w-md">
                <label className="block text-left text-xs text-rose-300 font-mono mb-2">COMPARISON SOULMATE SELECTOR</label>
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {CANDIDATE_PROFILES.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPartner(p)}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${selectedPartner.id === p.id ? "bg-rose-500/10 border-rose-500" : "bg-zinc-900/40 border-zinc-800/80 hover:border-rose-500/30"}`}
                    >
                      <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <div className="text-xs font-bold text-rose-100">{p.name}</div>
                        <div className="text-[10px] text-zinc-500 font-mono uppercase font-semibold">{p.personalityType} • {p.age}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="w-full max-w-md bg-zinc-900/40 border border-zinc-800 p-6 rounded-2xl mb-8 text-left space-y-4">
                <h4 className="text-sm font-bold text-rose-200 uppercase tracking-widest font-mono mb-2">Partner Profiles Metadata</h4>
                
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5">Their Beautiful Name</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Enter destiny name..."
                    className="w-full bg-zinc-950 border border-zinc-850 focus:border-rose-500/60 rounded-xl px-4 py-2.5 text-rose-100 outline-none placeholder:text-zinc-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">Personality Code</label>
                    <select
                      value={guestPersonality}
                      onChange={(e) => setGuestPersonality(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-850 text-rose-100 rounded-xl px-3 py-2.5 outline-none text-sm"
                    >
                      {["INFJ", "ENFP", "INTJ", "ENFJ", "INFP", "INTP", "ENTP", "ESFJ", "ISTJ", "ISFP"].map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">Primary Love Language</label>
                    <select
                      value={guestLoveLanguage}
                      onChange={(e) => setGuestLoveLanguage(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-850 text-rose-100 rounded-xl px-3 py-2.5 outline-none text-sm"
                    >
                      {["Words of Affirmation", "Quality Time", "Acts of Service", "Physical Touch", "Receiving Gifts"].map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Interactive Couple Milestone & Step Display */}
                <div className="mt-6 pt-4 border-t border-zinc-800/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-rose-300 font-semibold tracking-wider uppercase flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-rose-450 fill-rose-500/20" />
                      Active Couple Progress
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">Synchronized Orbit</span>
                  </div>

                  {/* Cinematic Picture of a Couple Accomplishing Steps together */}
                  <div className="group relative rounded-xl overflow-hidden aspect-[2.1/1] border border-rose-500/15 flex items-end p-4">
                    <div className="absolute inset-0 bg-zinc-950/25 z-10" />
                    {/* Cinematic Couple Photo */}
                    <img 
                      src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80" 
                      alt="Romantic couple doing steps together" 
                      className="absolute inset-0 w-full h-full object-cover filter brightness-[0.7] group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                    />
                    {/* Gradient overlay to read description clearly */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090514] via-zinc-950/20 to-transparent z-15" />
                    
                    <div className="relative z-20">
                      <span className="text-[9px] font-mono font-bold tracking-widest px-2 py-0.5 rounded-full bg-rose-500 text-white uppercase mb-1.5 inline-block">
                        Step Milestone Reached
                      </span>
                      <h5 className="text-sm font-black text-rose-50 tracking-tight leading-tight">
                        A couple that syncs together, stays together.
                      </h5>
                      <p className="text-[10px] text-zinc-450 mt-0.5 font-light">
                        Your terminal is primed. Complete the questions & interactive psychic RPS simulator to unlock joint relationship coordinates.
                      </p>
                    </div>
                  </div>

                  {/* Custom Step-by-Step progress path */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-xl bg-zinc-950/80 border border-emerald-500/30 flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-[8px] text-emerald-300 font-bold mb-1.5">✓</div>
                      <div className="text-[9px] font-bold text-emerald-300 font-mono">STEP 1</div>
                      <div className="text-[8px] text-zinc-500 font-mono">Biometrics Calibrated</div>
                    </div>
                    <div className="p-2 rounded-xl bg-zinc-950/80 border border-rose-500/30 flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-rose-500/20 border border-rose-400/50 flex items-center justify-center text-[8px] text-rose-300 font-bold mb-1.5 animate-pulse">2</div>
                      <div className="text-[9px] font-bold text-rose-300 font-mono">STEP 2</div>
                      <div className="text-[8px] text-zinc-500 font-mono">Sync Questionnaire</div>
                    </div>
                    <div className="p-2 rounded-xl bg-zinc-950/40 border border-zinc-900 flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[8px] text-zinc-400 font-bold mb-1.5">3</div>
                      <div className="text-[9px] font-bold text-zinc-550 font-mono">STEP 3</div>
                      <div className="text-[8px] text-zinc-650 font-mono">RPS Telepathy Link</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Launch trigger */}
            <button
              onClick={() => {
                setStep("questions");
                setCurrentQuestionIndex(0);
                setCurrentTurn("userA");
              }}
              className="px-10 py-4 bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:from-rose-450 hover:to-fuchsia-550 text-white font-bold rounded-2xl shadow-lg shadow-rose-950/45 tracking-wide transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              Align Sync & Start Questions
            </button>
          </div>
        </div>
      )}

      {/* 2. QUESTIONNAIRE STEPS */}
      {step === "questions" && (
        <div className="bg-zinc-950/60 border border-zinc-900 rounded-3xl p-6 sm:p-10 backdrop-blur-xl relative">
          
          {/* Header indicator details */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold uppercase">
              Category: {currentQuestion.category}
            </span>
            <span className="text-xs text-zinc-500 font-mono">
              Question {currentQuestionIndex + 1} of {activeQuestions.length}
            </span>
          </div>

          {/* Turn alert badge for pass-play mode */}
          {testMode === "pass-play" && (
            <div className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-teal-950 to-indigo-950 border border-indigo-500/20 text-xs font-bold font-mono text-zinc-200 mb-6 uppercase tracking-wider animate-pulse">
              🎮 Turn alert:{" "}
              <span className="text-rose-400">
                {currentTurn === "userA" ? currentUser.name : (guestName || "Guest Soul")}
              </span>{" "}- Answer Honest Choices!
            </div>
          )}

          {/* Question Text */}
          <h3 className="text-xl sm:text-2xl font-bold text-zinc-100 mb-8 min-h-[64px] leading-snug">
            {currentQuestion.question}
          </h3>

          {/* Choice Option Lists */}
          <div className="space-y-3.5 mb-8">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswerSelect(option)}
                className="w-full text-left p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 hover:border-rose-500/45 hover:bg-zinc-850/60 text-zinc-250 text-sm font-medium transition-all cursor-pointer flex items-start gap-4"
              >
                <div className="w-5.5 h-5.5 rounded-full border border-rose-500/30 flex items-center justify-center text-[10px] text-rose-400 font-mono font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <span>{option}</span>
              </button>
            ))}
          </div>

          {/* Progress bar metrics */}
          <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden flex">
            {Array.from({ length: activeQuestions.length }).map((_, i) => {
              const active = i <= currentQuestionIndex;
              return (
                <div
                  key={i}
                  className={`flex-1 h-full transition-all duration-300 ${active ? "bg-gradient-to-r from-rose-500 to-fuchsia-600" : "bg-zinc-850"} border-r border-zinc-950`}
                />
              );
            })}
          </div>

          <div className="flex justify-between items-center mt-6 text-xs text-zinc-550 font-mono">
            <span>Progress: {Math.round(((currentQuestionIndex + 1) / activeQuestions.length) * 100)}%</span>
            <span>SouLSynC Questionnaire Engaged</span>
          </div>

        </div>
      )}

      {/* 3. ROCK-PAPER-SCISSORS MINI-GAME */}
      {step === "mini-game" && (
        <div className="bg-zinc-950/60 border border-rose-500/20 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-[0_0_50px_rgba(239,68,110,0.1)] text-center relative">
          
          <div className="inline-flex items-center gap-1 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs px-3.5 py-1 rounded-full font-mono mb-6">
            <Trophy className="w-3.5 h-3.5 text-rose-400" />
            <span>Interactive Couple Mini-Game</span>
          </div>

          <h3 className="text-2xl font-black text-rose-100 mb-2">The Stone-Paper-Scissors Sync-up!</h3>
          <p className="text-zinc-500 text-sm max-w-lg mx-auto mb-8">
            Let's measure your choice alignment rate in real-time. Pick a dynamic hand choice secretly. Both selections are matched together to map organic telepathy patterns!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto mb-8">
            
            {/* Player 1 Selection State */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center">
              <span className="text-xs text-rose-350 font-mono uppercase mb-4 tracking-wider">{currentUser.name}</span>
              {gameState.userChoice ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="text-5xl animate-bounce">
                    {gameState.userChoice === "Rock" && "✊"}
                    {gameState.userChoice === "Paper" && "✋"}
                    {gameState.userChoice === "Scissors" && "✌️"}
                  </div>
                  <span className="text-xs text-zinc-500 uppercase font-mono mt-1">Locked selection</span>
                </div>
              ) : (
                <div className="text-[11px] text-zinc-650 font-mono italic">No decision entered yet</div>
              )}
            </div>

            {/* Player 2/AI Selection State */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center">
              <span className="text-xs text-rose-350 font-mono uppercase mb-4 tracking-wider">
                {testMode === "ai-sync" ? selectedPartner.name : (guestName || "Guest Partner")}
              </span>
              
              {gameState.gameState === "waiting" && (
                <div className="flex flex-col items-center gap-2 animate-pulse text-zinc-400 font-mono text-xs">
                  <div className="w-8 h-8 rounded-full border border-teal-500 border-t-transparent animate-spin mb-1" />
                  Pass device to {guestName || "Guest Partner"} to seal decision
                </div>
              )}

              {gameState.gameState === "revealed" ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="text-5xl animate-bounce">
                    {gameState.opponentChoice === "Rock" && "✊"}
                    {gameState.opponentChoice === "Paper" && "✋"}
                    {gameState.opponentChoice === "Scissors" && "✌️"}
                  </div>
                  <span className="text-xs text-zinc-500 uppercase font-mono mt-1">Locked selection</span>
                </div>
              ) : (
                gameState.gameState !== "waiting" && (
                  <div className="text-[11px] text-zinc-650 font-mono italic">Awaiting selection</div>
                )
              )}
            </div>

          </div>

          {/* Results Reveal Block */}
          {gameState.gameState === "revealed" && (
            <div className="bg-gradient-to-b from-rose-950/20 to-zinc-950/20 border border-rose-500/20 p-5 rounded-2xl max-w-md mx-auto mb-8 animate-fade-in animate-scale-up">
              <div className="text-base font-bold text-rose-300 mb-2">
                {gameState.winner === "Tie" ? "✨ Perfect Choice Sync!" : ""}
                {gameState.winner === "UserA" ? `✊ ${currentUser.name} claims match sync superiority!` : ""}
                {gameState.winner === "Opponent" ? `👑 ${testMode === "ai-sync" ? selectedPartner.name : (guestName || "Partner")} claims the tiebreaker!` : ""}
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed font-mono">
                {gameState.winner === "Tie" 
                  ? "Absolutely incredible! You selected the identical frequency under extreme odds. Pure alignment!"
                  : "Different choices show complementary dynamics - opposing frequencies anchor balance."
                }
              </p>
              <button
                type="button"
                onClick={resetRps}
                className="mt-4 inline-flex items-center gap-1.5 text-xs text-rose-450 hover:underline cursor-pointer font-bold font-mono"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Re-play Game
              </button>
            </div>
          )}

          {/* Actual Choice Buttons */}
          {(!gameState.userChoice || (testMode === "pass-play" && !gameState.opponentChoice)) && (
            <div className="flex justify-center gap-4 mb-8">
              {[
                { label: "Rock", icon: "✊" },
                { label: "Paper", icon: "✋" },
                { label: "Scissors", icon: "✌️" }
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleChoice(item.label)}
                  className="w-20 h-20 bg-zinc-900 border border-zinc-850 hover:border-rose-500 hover:bg-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer transform hover:scale-105"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-[10px] uppercase font-mono font-bold text-zinc-400">{item.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Submit Trigger to move towards reports */}
          <div className="flex justify-center flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <button
              onClick={executeCompatibilityCalculation}
              disabled={gameState.userChoice === null || (testMode === "pass-play" && gameState.opponentChoice === null)}
              className="w-full px-8 py-3.5 bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:from-rose-450 hover:to-fuchsia-500 text-white font-bold rounded-xl transition-all disabled:opacity-40 disabled:pointer-events-none shadow-md shadow-rose-950/25 cursor-pointer text-sm"
            >
              Analyze Synchronicities Now
            </button>
          </div>
          
        </div>
      )}

      {/* 4. CALCULATION CINEMATIC LOADING TIMER */}
      {step === "calculating" && (
        <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-zinc-950/80 border border-zinc-900 rounded-3xl backdrop-blur-xl relative">
          <div className="relative mb-8">
            <div className="w-24 h-24 rounded-full border-4 border-rose-500/10 border-t-rose-500 animate-spin" />
            <Heart className="w-10 h-10 text-rose-500 fill-rose-500/30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-rose-400 to-fuchsia-500 bg-clip-text text-transparent mb-3 font-sans animate-pulse">
            Consulting Destiny Channels
          </h3>
          <p className="text-xs text-zinc-500 font-mono tracking-widest uppercase max-w-md min-h-[30px] duration-500">
            {loadingText}
          </p>
          
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[9px] text-zinc-650 uppercase">
            SouLSynC AI Engine Activated • Secure SSL Encryption
          </div>
        </div>
      )}

    </div>
  );
}
