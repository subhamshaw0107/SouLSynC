/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { ChatSession, ChatMessage, MatchProfile, UserProfile } from "../types";
import { CANDIDATE_PROFILES } from "../data";
import { Send, Smile, Mic, Phone, Video, Info, Sparkles, Check, Heart, Trophy, Flame, Play, Square, X, RefreshCw } from "lucide-react";

interface ChatPageProps {
  currentUser: UserProfile;
  initialMatches: MatchProfile[];
}

export default function ChatPage({ currentUser, initialMatches }: ChatPageProps) {
  const [conversations, setConversations] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [inputText, setInputText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTimer, setVoiceTimer] = useState(0);
  const [callState, setCallState] = useState<{ type: "audio" | "video" | null; ringing: boolean; connected: boolean }>({
    type: null,
    ringing: false,
    connected: false
  });

  // AI Icebreaker state
  const [aiIcebreakers, setAiIcebreakers] = useState<string[]>([]);
  const [loadingIcebreakers, setLoadingIcebreakers] = useState(false);

  const activeSession = conversations.find(c => c.matchId === activeSessionId);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Populate Initial match conversation blocks
    const prepopulated = [
      ...initialMatches,
      ...CANDIDATE_PROFILES.filter(c => !initialMatches.some(im => im.id === c.id))
    ].map((candidate, idx) => ({
      matchId: candidate.id,
      matchProfile: candidate,
      online: idx !== 1, // Simulate Aria and Seraphina online, Kaelen offline
      messages: [
        {
          id: `msg-init-${candidate.id}`,
          senderId: candidate.id,
          text: `Hey! I saw we had an awesome alignment rating. Your bio about ${currentUser.interests[0] || "adventure"} looks sweet!`,
          timestamp: "10:45 AM"
        }
      ],
      lastActive: "Active 3m ago"
    }));

    setConversations(prepopulated);
    if (prepopulated.length > 0) {
      setActiveSessionId(prepopulated[0].matchId);
    }
  }, [initialMatches, currentUser]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages, activeSession?.typing]);

  // Loading AI icebreakers
  const fetchIcebreakers = async () => {
    if (!activeSession) return;
    setLoadingIcebreakers(true);
    setAiIcebreakers([]);

    try {
      const response = await fetch("/api/gemini/icebreakers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userA: currentUser,
          userB: activeSession.matchProfile
        })
      });
      const data = await response.json();
      setAiIcebreakers(data.icebreakers || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingIcebreakers(false);
    }
  };

  const handleSendMessage = (textToSend = inputText) => {
    if (!textToSend.trim() || !activeSession) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversations(prev => prev.map(conv => {
      if (conv.matchId === activeSessionId) {
        return {
          ...conv,
          messages: [...conv.messages, newMsg]
        };
      }
      return conv;
    }));

    setInputText("");
    setShowEmojiPicker(false);

    // Simulate match typing dynamic reply
    triggerSimulatedPartnerReply();
  };

  const triggerSimulatedPartnerReply = () => {
    if (!activeSession) return;

    // Set typing to true after 1 second
    setTimeout(() => {
      setConversations(prev => prev.map(conv => {
        if (conv.matchId === activeSessionId) {
          return { ...conv, typing: true };
        }
        return conv;
      }));

      // Send simulated answer after 3 seconds
      setTimeout(() => {
        const potentialReplies = [
          "Wow, that actually resonates beautifully with me! Do you usually do that often or is it more of a mood thing?",
          "That is absolutely adorable. Let's tackle that quiz challenges soon, I want to see if our daily habits align too!",
          "Haha totally! By the way, what song are you currently listening to? I need a soulful recommendation.",
          "That sounds ultra cozy. Definitely down for stargazing together if the frequency matches nicely."
        ];
        const randomAnswer = potentialReplies[Math.floor(Math.random() * potentialReplies.length)];

        const replyMsg: ChatMessage = {
          id: `msg-reply-${Date.now()}`,
          senderId: activeSession.matchId,
          text: randomAnswer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setConversations(prev => prev.map(conv => {
          if (conv.matchId === activeSessionId) {
            return {
              ...conv,
              typing: false,
              messages: [...conv.messages, replyMsg]
            };
          }
          return conv;
        }));
      }, 2500);

    }, 1200);
  };

  // Recording Simulate logic
  const toggleRecording = () => {
    if (isRecording) {
      // Finish recording and send
      clearInterval(timerRef.current!);
      setIsRecording(false);
      
      if (voiceTimer > 1) {
        const voiceMsg: ChatMessage = {
          id: `msg-voice-${Date.now()}`,
          senderId: currentUser.id,
          text: "🎵 Voice Note (Simulated Waveform)",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isVoice: true,
          voiceDuration: `0:${voiceTimer < 10 ? '0' : ''}${voiceTimer}`
        };

        setConversations(prev => prev.map(conv => {
          if (conv.matchId === activeSessionId) {
            return { ...conv, messages: [...conv.messages, voiceMsg] };
          }
          return conv;
        }));

        triggerSimulatedPartnerReply();
      }
      setVoiceTimer(0);
    } else {
      // Start recording
      setIsRecording(true);
      setVoiceTimer(0);
      timerRef.current = window.setInterval(() => {
        setVoiceTimer(prev => prev + 1);
      }, 1000);
    }
  };

  // Reaction addition handler
  const handleAddReaction = (msgId: string, emoji: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.matchId === activeSessionId) {
        return {
          ...conv,
          messages: conv.messages.map(m => {
            if (m.id === msgId) {
              const reactions = m.reactions || [];
              const updatedReactions = reactions.includes(emoji)
                ? reactions.filter(r => r !== emoji)
                : [...reactions, emoji];
              return { ...m, reactions: updatedReactions };
            }
            return m;
          })
        };
      }
      return conv;
    }));
  };

  // Launch simulated phone/webcall
  const launchCall = (type: "audio" | "video") => {
    setCallState({ type, ringing: true, connected: false });
    // Connect calling automatically after 2.5 seconds
    setTimeout(() => {
      setCallState(prev => ({ ...prev, ringing: false, connected: true }));
    }, 2500);
  };

  const endCall = () => {
    setCallState({ type: null, ringing: false, connected: false });
  };

  return (
    <div className="z-10 relative max-w-6xl mx-auto px-4 py-6 select-none flex flex-col md:flex-row gap-6 h-[calc(100vh-140px)]">
      
      {/* MATCH DIRECTORY SIDEBAR */}
      <div className="w-full md:w-80 bg-zinc-950/60 border border-zinc-900 rounded-3xl p-5 flex flex-col gap-4 backdrop-blur-md shrink-0 h-1/3 md:h-full">
        <h3 className="text-sm font-bold text-rose-300 font-mono uppercase tracking-widest px-1">Resonance Threads</h3>
        
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {conversations.map((sess) => (
            <button
              key={sess.matchId}
              onClick={() => setActiveSessionId(sess.matchId)}
              className={`w-full flex items-center gap-3.5 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                sess.matchId === activeSessionId 
                  ? "bg-rose-500/10 border-rose-500/40 shadow-sm" 
                  : "bg-zinc-900/20 border-zinc-850 hover:border-rose-500/20"
              }`}
            >
              <div className="relative">
                <img
                  src={sess.matchProfile.avatar}
                  alt={sess.matchProfile.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-zinc-950 ${
                  sess.online ? "bg-emerald-500" : "bg-zinc-650"
                }`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-100 truncate">{sess.matchProfile.name}</span>
                  <span className="text-[9px] font-mono text-rose-450/80 font-bold">{sess.matchProfile.compatibilityPercentage}% Sync</span>
                </div>
                
                <p className="text-[10px] text-zinc-500 truncate mt-0.5 font-sans">
                  {sess.typing ? (
                    <span className="text-rose-400 font-mono animate-pulse font-semibold">typing melody...</span>
                  ) : (
                    sess.messages[sess.messages.length - 1]?.text || "No conversations started yet."
                  )}
                </p>
              </div>
            </button>
          ))}
          {conversations.length === 0 && (
            <div className="text-center py-6 text-zinc-650 text-xs font-mono">
              Find sync partners on match discovery to chat here!
            </div>
          )}
        </div>
      </div>

      {/* CHAT INTERACTIVE WINDOW */}
      {activeSession ? (
        <div className="flex-1 bg-zinc-950/60 border border-zinc-900 rounded-3xl backdrop-blur-md flex flex-col h-2/3 md:h-full overflow-hidden relative">
          
          {/* Active Header Block */}
          <div className="p-4 border-b border-zinc-900 bg-zinc-950/30 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <img
                src={activeSession.matchProfile.avatar}
                alt={activeSession.matchProfile.name}
                className="w-10 h-10 rounded-xl object-cover"
              />
              <div>
                <h4 className="text-xs font-bold text-rose-100">{activeSession.matchProfile.name}</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${activeSession.online ? "bg-emerald-500 animate-pulse" : "bg-zinc-600"}`} />
                  <span className="text-[9px] text-zinc-500 font-mono uppercase">{activeSession.online ? "Frequencies Synchronized" : "Sleeping Circuit"}</span>
                </div>
              </div>
            </div>

            {/* Calling trigger actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => launchCall("audio")}
                className="w-9 h-9 border border-zinc-850 hover:border-rose-500/35 hover:bg-zinc-900 text-zinc-400 hover:text-rose-400 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                title="Mock Audio Call"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                onClick={() => launchCall("video")}
                className="w-9 h-9 border border-zinc-850 hover:border-rose-500/35 hover:bg-zinc-900 text-zinc-400 hover:text-rose-400 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                title="Mock Video Call"
              >
                <Video className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Frame list */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            
            {/* AI Icebreaker starter recommendation bar */}
            <div className="p-4 bg-rose-500/5 border border-rose-500/15 rounded-2xl mb-4">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-rose-400 fill-rose-500/20" /> AI Wingman Starters
                </span>
                <button
                  onClick={fetchIcebreakers}
                  disabled={loadingIcebreakers}
                  className="text-[10px] text-zinc-400 hover:text-rose-300 font-mono font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${loadingIcebreakers ? "animate-spin" : ""}`} /> Generate
                </button>
              </div>
              
              {aiIcebreakers.length > 0 ? (
                <div className="space-y-2">
                  {aiIcebreakers.map((starter, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(starter)}
                      className="w-full text-left p-2 px-3 rounded-xl bg-zinc-900/50 hover:bg-rose-500/10 border border-zinc-850 hover:border-rose-500/20 text-[11px] text-rose-200/80 hover:text-rose-100 transition-all font-sans cursor-pointer flex items-center gap-2"
                    >
                      <span className="text-rose-400">✨</span>
                      <span className="truncate">{starter}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-zinc-500 font-mono leading-relaxed">
                  Stuck? Consult Gemini Wingman to fetch 3 beautiful relationship starters tailored directly to mutual characteristics.
                </p>
              )}
            </div>

            {/* Conversation Messages Map rendering */}
            {activeSession.messages.map((m) => {
              const isMe = m.senderId === currentUser.id;
              return (
                <div key={m.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"} relative group`}>
                  
                  {/* Reaction panel triggered on message hovering */}
                  <div className={`absolute -top-6 ${isMe ? "right-2" : "left-2"} hidden group-hover:flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 p-1 rounded-lg z-20`}>
                    {["❤️", "🔥", "😊", "✨"].map(emo => (
                      <button
                        key={emo}
                        onClick={() => handleAddReaction(m.id, emo)}
                        className="text-xs hover:scale-125 transition-transform duration-200 cursor-pointer"
                      >
                        {emo}
                      </button>
                    ))}
                  </div>

                  <div className={`max-w-[80%] rounded-2xl p-3 px-4 shadow-sm text-xs font-medium leading-relaxed font-sans ${
                    isMe 
                      ? "bg-gradient-to-tr from-rose-500 to-fuchsia-600 text-white rounded-tr-none" 
                      : "bg-zinc-900/85 border border-zinc-850 text-rose-105 rounded-tl-none"
                  }`}>
                    {m.isVoice ? (
                      <div className="flex items-center gap-3">
                        <button className="w-7 h-7 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white cursor-pointer">
                          <Play className="w-3.5 h-3.5 fill-white" />
                        </button>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 15 }).map((_, i) => (
                            <div
                              key={i}
                              style={{ height: `${2 + Math.sin(i * 0.8) * 12 + Math.random() * 5}px` }}
                              className="w-[2.5px] bg-white rounded-full bg-opacity-70"
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-white/80 font-mono">{m.voiceDuration}</span>
                      </div>
                    ) : (
                      <span>{m.text}</span>
                    )}
                  </div>

                  {/* Reaction indicators */}
                  {m.reactions && m.reactions.length > 0 && (
                    <div className="flex gap-1.5 mt-1">
                      {m.reactions.map((r, ri) => (
                        <span key={ri} className="text-[10px] px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded-full">{r}</span>
                      ))}
                    </div>
                  )}

                  <span className="text-[9px] text-zinc-550 mt-1 font-mono uppercase font-bold px-1">{m.timestamp}</span>
                </div>
              );
            })}

            {/* Typing status bar */}
            {activeSession.typing && (
              <div className="flex items-center gap-2 text-zinc-550 font-mono text-[10px] animate-pulse">
                <span className="text-rose-450">●</span>
                <span>{activeSession.matchProfile.name} is typing emotional harmonies...</span>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Form Action Footer input box */}
          <div className="p-4 border-t border-zinc-905 bg-zinc-950/20 flex items-center gap-3 relative">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="w-10 h-10 border border-zinc-850 hover:border-rose-500/35 text-zinc-400 hover:text-rose-400 rounded-xl flex items-center justify-center transition-all cursor-pointer"
            >
              <Smile className="w-5 h-5" />
            </button>

            {/* Emojis selection overlay */}
            {showEmojiPicker && (
              <div className="absolute bottom-16 left-4 bg-zinc-950 border border-zinc-850 p-2.5 rounded-2xl flex gap-2.5 z-30 shadow-xl shadow-black">
                {["💖", "✨", "🍿", "🍕", "😻", "☕", "🥺"].map((emo) => (
                  <button
                    key={emo}
                    onClick={() => {
                      setInputText(prev => prev + emo);
                      setShowEmojiPicker(false);
                    }}
                    className="text-lg hover:scale-125 transition-transform duration-200 cursor-pointer"
                  >
                    {emo}
                  </button>
                ))}
              </div>
            )}

            {/* Input field text */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder="Inject love note frequencies..."
              className="flex-1 bg-zinc-900 border border-zinc-850 focus:border-rose-500/50 outline-none text-rose-100 rounded-xl py-2.5 px-4 text-xs font-sans placeholder:text-zinc-550"
            />

            {/* Voice notes record triggers */}
            <button
              onClick={toggleRecording}
              className={`w-10 h-10 border text-zinc-400 hover:text-rose-400 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                isRecording ? "bg-rose-500/20 border-rose-500 text-rose-500 animate-pulse" : "border-zinc-850 hover:border-rose-500/35"
              }`}
            >
              {isRecording ? <Square className="w-4 h-4 text-rose-500 fill-rose-500" /> : <Mic className="w-5 h-5" />}
            </button>

            <button
              onClick={() => handleSendMessage()}
              className="w-10 h-10 bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:from-rose-450 hover:to-fuchsia-500 text-white rounded-xl flex items-center justify-center shadow-md cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>

        </div>
      ) : (
        <div className="flex-1 bg-zinc-950/60 border border-zinc-900 rounded-3xl flex items-center justify-center p-8 text-center text-zinc-500">
          <p>Click on one of your active threads to start messaging!</p>
        </div>
      )}

      {/* MOCKUP CALL OVERLAY SCREEN */}
      {callState.type && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4 backdrop-blur-3xl animate-fade-in text-center select-none">
          <div className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-rose-500/30 m-6 shadow-[0_0_30px_rgba(239,68,110,0.3)]">
            <img
              src={activeSession?.matchProfile.avatar}
              alt={activeSession?.matchProfile.name}
              className="w-full h-full object-cover"
            />
          </div>

          <h3 className="text-2xl font-black text-rose-100 mb-1">{activeSession?.matchProfile.name}</h3>
          
          <div className="text-sm font-mono tracking-widest text-zinc-500 uppercase mb-20">
            {callState.ringing ? (
              <span className="animate-pulse">Frequency Ringing Call Signal...</span>
            ) : (
              <span className="text-emerald-500 font-bold">Connected • Decibel Audio Sync active</span>
            )}
          </div>

          {/* Connected screen animation */}
          {!callState.ringing && callState.type === "video" && (
            <div className="mb-20 grid grid-cols-2 gap-3 p-1.5 border border-zinc-800 rounded-2xl bg-zinc-900/40 backdrop-blur-md w-full max-w-sm">
              <div className="aspect-video bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800 relative">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" alt="you" className="w-full h-full object-cover" />
                <span className="absolute bottom-1 left-1.5 text-[9px] font-mono bg-black/60 px-1 rounded">YOU</span>
              </div>
              <div className="aspect-video bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800 relative">
                <img src={activeSession?.matchProfile.avatar} alt="them" className="w-full h-full object-cover animate-pulse" />
                <span className="absolute bottom-1 left-1.5 text-[9px] font-mono bg-black/60 px-1 rounded">{activeSession?.matchProfile.name}</span>
              </div>
            </div>
          )}

          <button
            onClick={endCall}
            className="w-14 h-14 bg-red-650 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-all shadow-lg hover:shadow-red-500/20 cursor-pointer transform hover:scale-[1.05]"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
      )}

    </div>
  );
}
