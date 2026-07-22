/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { UserProfile, MatchProfile, CompatibilityReport } from "./types";
import FallingPetals from "./components/FallingPetals";
import AuthPage from "./components/AuthPage";
import LandingPage from "./components/LandingPage";
import TestPage from "./components/TestPage";
import DiscoveryPage from "./components/DiscoveryPage";
import ChatPage from "./components/ChatPage";
import DashboardPage from "./components/DashboardPage";
import UserProfilePage from "./components/UserProfilePage";
import SettingsPage from "./components/SettingsPage";
import BookingPage from "./components/BookingPage";
import GenderSelectionModal from "./components/GenderSelectionModal";
import CinematicIntro from "./components/CinematicIntro";
import PartnerTypeMatchWizard from "./components/PartnerTypeMatchWizard";
import NotificationsPanel from "./components/NotificationsPanel";
import ApproachesPage from "./components/ApproachesPage";
import { CANDIDATE_PROFILES } from "./data";
import { motion, AnimatePresence } from "motion/react";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "./lib/firebase";

import { Heart, Compass, MessageSquare, Sparkles, User, Settings, Award, LogOut, CalendarCheck, Bell } from "lucide-react";

type ActivePage = "home" | "notifications" | "test" | "discover" | "chat" | "dashboard" | "profile" | "settings" | "booking";

export default function App() {
  const [showCinematicIntro, setShowCinematicIntro] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<ActivePage>("home");
  const [showGenderSelection, setShowGenderSelection] = useState(false);
  const [showPartnerMatchWizard, setShowPartnerMatchWizard] = useState(false);
  const [selectedPartnerForTest, setSelectedPartnerForTest] = useState<MatchProfile | null>(null);

  // Shared Ecosystem States
  const [likedProfiles, setLikedProfiles] = useState<string[]>([]);
  const [activeMatches, setActiveMatches] = useState<MatchProfile[]>([]);
  const [activeReport, setActiveReport] = useState<CompatibilityReport | null>(null);
  const [activePartner, setActivePartner] = useState<MatchProfile | UserProfile | null>(null);

  // Connection Activity Feed States (Approaches)
  const [showNotifications, setShowNotifications] = useState(false);
  const [incomingRequests, setIncomingRequests] = useState<MatchProfile[]>([]);

  const handleLoginSuccess = (profile: UserProfile) => {
    setCurrentUser(profile);
    setIsAuthenticated(true);
    setActiveTab("home");
    
    // If user already has a gender set, populate incoming requests
    if (profile.gender) {
      const oppositeGender = profile.gender === "Male" ? "Female" : "Male";
      const candidates = CANDIDATE_PROFILES.filter(p => p.gender === oppositeGender);
      setIncomingRequests(candidates);
      setShowGenderSelection(false);
    } else {
      // Show gender preference selector on login success
      setShowGenderSelection(true);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setActiveTab("home");
    setLikedProfiles([]);
    setActiveMatches([]);
    setActiveReport(null);
    setActivePartner(null);
    setIncomingRequests([]);
    setShowNotifications(false);
  };

  const handleMatchCreatedFromDiscovery = (match: MatchProfile) => {
    if (!activeMatches.some(m => m.id === match.id)) {
      setActiveMatches(prev => [...prev, match]);
    }
    setActiveTab("chat");
  };

  const handleReportGeneratedFromTest = (report: CompatibilityReport, partner: MatchProfile | UserProfile) => {
    setActiveReport(report);
    setActivePartner(partner);
    setActiveTab("dashboard");
  };

  const handleSelectGenderRole = async (selectedGender: "Male" | "Female") => {
    if (!currentUser) return;

    // Update locally
    const updatedUser = { ...currentUser, gender: selectedGender };
    setCurrentUser(updatedUser);
    setShowGenderSelection(false);

    // Populate initial incoming requests (approaches) based on opposite gender
    const oppositeGender = selectedGender === "Male" ? "Female" : "Male";
    const candidates = CANDIDATE_PROFILES.filter(p => p.gender === oppositeGender);
    setIncomingRequests(candidates);

    // Save persistently in firestore
    try {
      const userRef = doc(db, "users", currentUser.id);
      await updateDoc(userRef, { gender: selectedGender });
    } catch (err) {
      console.warn("Could not save gender selection to Firestore: ", err);
    }
  };

  const handleAcceptRequest = (profile: MatchProfile) => {
    // 1. Remove from incoming requests list
    setIncomingRequests(prev => prev.filter(r => r.id !== profile.id));
    // 2. Add to active matches list so you can chat with them
    if (!activeMatches.some(m => m.id === profile.id)) {
      setActiveMatches(prev => [...prev, profile]);
    }
    // 3. Close panel and view Chats directly
    setShowNotifications(false);
    setActiveTab("chat");
  };

  const handleDeclineRequest = (profileId: string) => {
    setIncomingRequests(prev => prev.filter(r => r.id !== profileId));
  };

  return (
    <div className="min-h-screen text-rose-100 relative bg-[#0e0712] transition-colors duration-500 overflow-x-hidden flex flex-col">
      {/* Cinematic Falling Petals & Glowing Dots Background */}
      <FallingPetals />

      {showCinematicIntro ? (
        <CinematicIntro onComplete={() => setShowCinematicIntro(false)} />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-grow flex flex-col"
        >
          {!isAuthenticated ? (
            <AuthPage onLoginSuccess={handleLoginSuccess} />
          ) : (
        <>
          {/* Main Top Navigation Header Panel */}
          <header className="z-40 sticky top-0 bg-[#08040b]/70 border-b border-rose-500/10 backdrop-blur-xl px-4 md:px-8 py-4 select-none">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              
              {/* Left Side Logo */}
              <button
                onClick={() => setActiveTab("home")}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-fuchsia-600 flex items-center justify-center shadow-md shadow-rose-950/40">
                  <Heart className="w-5 h-5 text-white fill-white animate-pulse" />
                </div>
                <h1 className="text-xl font-black tracking-wide bg-gradient-to-r from-rose-400 to-fuchsia-500 bg-clip-text text-transparent">
                  SouLSynC
                </h1>
              </button>

              {/* Central Tabs Navigation menu (Desktop) */}
              <nav className="hidden md:flex items-center gap-1.5 p-1 bg-zinc-950/40 border border-zinc-900 rounded-2xl">
                {[
                  { id: "home", label: "Home", icon: Heart },
                  { id: "notifications", label: "Signals Feed", icon: Bell },
                  { id: "discover", label: "Discover", icon: Compass },
                  { id: "test", label: "Sync Test", icon: Sparkles },
                  { id: "chat", label: "Chat", icon: MessageSquare },
                  { id: "booking", label: "Bookings", icon: CalendarCheck },
                  { id: "dashboard", label: "Insights", icon: Award },
                ].map((tab) => {
                  const IconComp = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as ActivePage)}
                      className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer relative ${
                        active 
                          ? "bg-gradient-to-tr from-rose-500/20 to-fuchsia-600/20 border border-rose-500/30 text-rose-300 shadow-sm" 
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                      {tab.label}
                      {tab.id === "notifications" && incomingRequests.length > 0 && (
                        <span className="ml-1.5 px-1.5 py-0.5 rounded-md bg-rose-500 text-white text-[9px] font-black font-mono leading-none">
                          {incomingRequests.length}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Right Side Avatar actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex items-center gap-2.5 p-1.5 pr-3.5 rounded-2xl border transition-all cursor-pointer ${
                    activeTab === "profile" 
                      ? "bg-rose-500/10 border-rose-500 text-rose-300" 
                      : "bg-zinc-950/40 border-zinc-900 text-zinc-450 hover:border-rose-500/20"
                  }`}
                >
                  <img
                    src={currentUser?.avatar}
                    alt="you"
                    className="w-8 h-8 rounded-xl object-cover"
                  />
                  <span className="hidden sm:inline text-xs font-bold font-mono">
                    {currentUser?.name}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-9 h-9 border rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    activeTab === "settings"
                      ? "bg-rose-500/10 border-rose-500 text-rose-400"
                      : "bg-zinc-950/40 border-zinc-900 text-zinc-450 hover:border-zinc-800"
                  }`}
                  title="Configure"
                >
                  <Settings className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveTab(activeTab === "notifications" ? "home" : "notifications")}
                  className={`w-9 h-9 border rounded-xl flex items-center justify-center transition-all cursor-pointer relative ${
                    activeTab === "notifications"
                      ? "bg-rose-500/10 border-rose-500 text-rose-400"
                      : "bg-zinc-950/40 border-zinc-900 text-zinc-450 hover:border-zinc-805"
                  }`}
                  title="Activity Signal"
                >
                  <Bell className="w-4 h-4" />
                  {incomingRequests.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[8px] font-black text-white animate-bounce shadow-md">
                      {incomingRequests.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={handleLogout}
                  className="w-9 h-9 bg-zinc-950/40 border border-zinc-900 hover:border-red-500/40 text-zinc-500 hover:text-red-400 rounded-xl flex items-center justify-center transition-all cursor-pointer"
                  title="Disconnect Signal"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

            </div>
          </header>

          {/* Active Container Panel Panel */}
          <main className="flex-grow z-10">
            {activeTab === "home" && (
              <LandingPage
                userName={currentUser?.name}
                onStartMatching={() => setShowPartnerMatchWizard(true)}
                onTakeTest={() => setActiveTab("test")}
              />
            )}
            {activeTab === "notifications" && currentUser && (
              <ApproachesPage
                incomingRequests={incomingRequests}
                likedProfiles={CANDIDATE_PROFILES.filter(p => likedProfiles.includes(p.id))}
                onAcceptRequest={handleAcceptRequest}
                onDeclineRequest={handleDeclineRequest}
                onNavigateToDiscover={() => setActiveTab("discover")}
              />
            )}
            {activeTab === "test" && currentUser && (
              <TestPage
                currentUser={currentUser}
                initialPartner={selectedPartnerForTest}
                onReportGenerated={handleReportGeneratedFromTest}
              />
            )}
            {activeTab === "discover" && currentUser && (
              <DiscoveryPage
                currentUser={currentUser}
                onMatchCreated={handleMatchCreatedFromDiscovery}
                likedProfiles={likedProfiles}
                setLikedProfiles={setLikedProfiles}
              />
            )}
            {activeTab === "chat" && currentUser && (
              <ChatPage
                currentUser={currentUser}
                initialMatches={activeMatches}
              />
            )}
            {activeTab === "dashboard" && currentUser && (
              <DashboardPage
                currentUser={currentUser}
                activeReport={activeReport}
                activePartner={activePartner}
                onNavigateToTest={() => setActiveTab("test")}
              />
            )}
            {activeTab === "profile" && currentUser && (
              <UserProfilePage
                currentUser={currentUser}
                onUpdateProfile={(updated) => setCurrentUser(updated)}
              />
            )}
            {activeTab === "booking" && currentUser && (
              <BookingPage currentUser={currentUser} />
            )}
            {activeTab === "settings" && <SettingsPage />}
          </main>

          {/* Bottom Panel Navigation for Mobile Devices */}
          <footer className="md:hidden z-40 fixed bottom-0 inset-x-0 bg-[#08040b]/85 border-t border-rose-500/10 backdrop-blur-xl px-4 py-3 flex justify-around select-none">
            {[
              { id: "home", icon: Heart, label: "Home" },
              { id: "notifications", icon: Bell, label: "Signals" },
              { id: "discover", icon: Compass, label: "Explore" },
              { id: "test", icon: Sparkles, label: "Sync" },
              { id: "chat", icon: MessageSquare, label: "Chat" },
              { id: "booking", icon: CalendarCheck, label: "Book" },
              { id: "dashboard", icon: Award, label: "Stats" },
            ].map((tab) => {
              const IconComp = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ActivePage)}
                  className={`flex flex-col items-center gap-1 cursor-pointer ${
                    active ? "text-rose-405 font-bold" : "text-zinc-550 hover:text-zinc-350"
                  }`}
                >
                  <IconComp className="w-5 h-5" />
                  <span className="text-[9px] font-mono tracking-tighter">{tab.label}</span>
                </button>
              );
            })}
          </footer>

          {/* Spacer to prevent mobile footer overlapping content */}
          <div className="h-16 md:hidden" />

          {/* Gender Polarity selection blocker modal */}
          {showGenderSelection && (
            <GenderSelectionModal onSelectGender={handleSelectGenderRole} />
          )}

          {/* Partner Typology Matching Wizard Overlay */}
          {showPartnerMatchWizard && (
            <PartnerTypeMatchWizard
              onClose={() => setShowPartnerMatchWizard(false)}
              onPartnerSelected={(partner) => {
                setSelectedPartnerForTest(partner);
                setShowPartnerMatchWizard(false);
                setActiveTab("test");
              }}
            />
          )}

          {/* Connection Activity Notifications Panel/Slider */}
          <AnimatePresence>
            {showNotifications && (
              <NotificationsPanel
                onClose={() => setShowNotifications(false)}
                incomingRequests={incomingRequests}
                likedProfiles={CANDIDATE_PROFILES.filter(p => likedProfiles.includes(p.id))}
                onAcceptRequest={handleAcceptRequest}
                onDeclineRequest={handleDeclineRequest}
              />
            )}
          </AnimatePresence>
        </>
      )}
        </motion.div>
      )}
    </div>
  );
}
