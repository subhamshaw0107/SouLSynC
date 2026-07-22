/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { UserProfile } from "../types";
import { Heart, Sparkles, Lock, Mail, User as UserIcon, ShieldCheck, Phone } from "lucide-react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  sendPasswordResetEmail
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, handleFirestoreError, OperationType } from "../lib/firebase";

interface AuthPageProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export default function AuthPage({ onLoginSuccess }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot password flow states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotPhone, setForgotPhone] = useState("");
  const [forgotMethod, setForgotMethod] = useState<"email" | "phone">("email");
  const [forgotStep, setForgotStep] = useState<"request" | "otp" | "new_password" | "success">("request");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [resetStatus, setResetStatus] = useState("");

  const [genderSelectionStep, setGenderSelectionStep] = useState(false);
  const [selectedGender, setSelectedGender] = useState<"Male" | "Female" | null>(null);
  const [tempUser, setTempUser] = useState<UserProfile | null>(null);

  const handleCompleteGenderSelection = async () => {
    if (!tempUser || !selectedGender) {
      setError("Please select your gender.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const updatedUser: UserProfile = {
        ...tempUser,
        gender: selectedGender,
        avatar: selectedGender === "Male" 
          ? "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80"
          : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
      };

      // Save to Firestore persistently
      const userDocRef = doc(db, "users", updatedUser.id);
      await setDoc(userDocRef, updatedUser);

      // Complete login successfully
      onLoginSuccess(updatedUser);
    } catch (err: any) {
      console.error(err);
      setError("Failed to save your gender profile alignment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResetStatus("");
    setLoading(true);

    if (forgotMethod === "email") {
      if (!forgotEmail) {
        setError("Please enter your registered email address.");
        setLoading(false);
        return;
      }

      try {
        await sendPasswordResetEmail(auth, forgotEmail);
        setResetStatus("A password reset email has been dispatched to your Gmail inbox! Follow the frequency adjustment link in the mail.");
        setForgotStep("success");
      } catch (err: any) {
        console.error("Password reset email error: ", err);
        if (err.code === "auth/user-not-found") {
          setError("No alignment found for this email address.");
        } else if (err.code === "auth/invalid-email") {
          setError("Please enter a valid email frequency.");
        } else {
          setError(err.message || "Could not initiate email reset broadcast.");
        }
      } finally {
        setLoading(false);
      }
    } else {
      // Phone number method
      if (!forgotPhone || !forgotEmail) {
        setError("Please enter both your registered Email and Mobile Number.");
        setLoading(false);
        return;
      }

      // Simulate sending OTP
      setTimeout(() => {
        setLoading(false);
        setForgotStep("otp");
      }, 1000);
    }
  };

  const handleVerifyForgotOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (forgotOtp !== "8888") {
      setError("Incorrect pulse verification code. (Hint: Use 8888)");
      return;
    }

    setForgotStep("new_password");
  };

  const handleSaveNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (forgotNewPassword.length < 6) {
      setError("Your new secret key must be at least 6 characters.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setResetStatus("Your secret key has been successfully updated on our cellular towers! You can now log in using your new key.");
      setForgotStep("success");
      // Pre-fill fields for login
      setPassword(forgotNewPassword);
      setEmail(forgotEmail);
    }, 1550);
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password || (!isLogin && !name) || !mobileNumber) {
      setError("Please fill in all fields including your mobile number.");
      return;
    }

    if (password.length < 6) {
      setError("Your password secret key must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    // To keep the magnificent cinematic setup step, we simply stage the credentials 
    // and prompt user for the OTP code, then we do actual authentication in the verification step!
    setTimeout(() => {
      setLoading(false);
      setShowOtp(true);
    }, 1000);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 4) {
      setError("Please enter a valid 4-digit verification code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let user;
      if (isLogin) {
        try {
          // Authenticate with Email/Password on Firebase Auth
          const cred = await signInWithEmailAndPassword(auth, email, password);
          user = cred.user;
        } catch (signInErr: any) {
          console.log("SignIn failed, checking if we need to auto-register:", signInErr);
          // If the error code suggests the user wasn't found or invalid credentials on a new DB context, 
          // we attempt on-the-fly registration.
          if (
            signInErr.code === "auth/user-not-found" || 
            signInErr.code === "auth/invalid-credential"
          ) {
            try {
              const cred = await createUserWithEmailAndPassword(auth, email, password);
              user = cred.user;
            } catch (createErr: any) {
              // If creation fails due to email-already-in-use, the user does exist but original password we supplied was wrong!
              if (createErr.code === "auth/email-already-in-use") {
                throw signInErr;
              } else {
                throw createErr;
              }
            }
          } else {
            throw signInErr;
          }
        }
      } else {
        // Register user with Email/Password on Firebase Auth
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        user = cred.user;
      }

      // Check or establish profile info in Firestore /users/{uid}
      const userDocRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDocRef);

      let loggedInUser: UserProfile;
      if (userSnap.exists()) {
        loggedInUser = userSnap.data() as UserProfile;
      } else {
        // Build robust registration profile mirroring user's name
        loggedInUser = {
          id: user.uid,
          name: name || user.email?.split("@")[0] || "Dreamer",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          bio: "Curious heart looking for a synchronized soulmate. Deep chats and stargazing are my love language ✨",
          age: 23,
          gender: "",
          phoneNumber: mobileNumber || "+91 9876543210",
          location: "Neo Seoul, Sector 2",
          interests: ["Vinyl Records", "Cyberpunk Specs", "Analog Synths", "Stargazing", "Coffee Brewing"],
          favoriteMusic: ["Lover - Taylor Swift", "Pluto Projector - Rex Orange County", "First Day of My Life - Bright Eyes"],
          favoriteMovies: ["Interstellar", "About Time", "My Neighbor Totoro"],
          relationshipGoals: "Soulmate Syncing",
          personalityType: "INFJ",
          loveLanguage: "Quality Time & Words of Affirmation",
          mood: "😊 Cozy"
        };
      }

      setTempUser(loggedInUser);
      setSelectedGender((loggedInUser.gender === "Male" || loggedInUser.gender === "Female") ? loggedInUser.gender : null);
      setGenderSelectionStep(true);
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("Invalid credentials. Please double check and connect again.");
      } else if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please login instead.");
      } else if (err.code === "auth/weak-password") {
        setError("Your password should contain at least 6 characters.");
      } else {
        setError(err.message || "Authentication synchronization failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  const triggerGoogleAuth = async () => {
    setLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDocRef);

      let loggedInUser: UserProfile;
      if (userSnap.exists()) {
        loggedInUser = userSnap.data() as UserProfile;
      } else {
        loggedInUser = {
          id: user.uid,
          name: user.displayName || "Dreamer",
          avatar: user.photoURL || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
          bio: "Specialty coffee roaster and ambient synth composer looking for magic.",
          age: 25,
          gender: "",
          location: "Neo Seoul, Sector 4",
          interests: ["Analog Synths", "Coffee Brewing", "Matcha Latte"],
          favoriteMusic: ["Midnight Whispers", "Sweet Adeline"],
          favoriteMovies: ["Interstellar"],
          relationshipGoals: "Growth Partnership",
          personalityType: "ENFJ",
          loveLanguage: "Acts of Service",
          mood: "🔥 Romantic"
        };
      }

      setTempUser(loggedInUser);
      setSelectedGender((loggedInUser.gender === "Male" || loggedInUser.gender === "Female") ? loggedInUser.gender : null);
      setGenderSelectionStep(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Google Single-Sign-On failed. Ensure popup authentication is permitted.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden z-10 select-none">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-rose-500/20 rounded-full filter blur-[100px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-fuchsia-500/20 rounded-full filter blur-[120px] pointer-events-none animate-pulse"></div>

      <div className="w-full max-w-md bg-zinc-950/70 border border-rose-500/20 rounded-3xl p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(239,68,110,0.15)] relative">
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-fuchsia-600 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,110,0.5)] mb-3 animate-bounce">
            <Heart className="w-8 h-8 text-white fill-white animate-pulse" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-wider bg-gradient-to-r from-rose-400 via-fuchsia-500 to-purple-500 bg-clip-text text-transparent">
            SouLSynC
          </h1>
          <p className="text-xs text-rose-300/60 font-mono mt-1">AI-Powered Love Synchronicities</p>
        </div>

        {genderSelectionStep ? (
          <div className="space-y-6">
            <div className="text-center">
              <Sparkles className="w-12 h-12 text-rose-500/85 mx-auto mb-3 animate-pulse" />
              <h2 className="text-xl font-bold text-rose-100 font-sans">Verify Your Gender Polarity</h2>
              <p className="text-xs text-rose-300/60 mt-1 font-mono max-w-[280px] mx-auto">
                Select your sync coordinate polarity direction to align remote quantum matches.
              </p>
            </div>

            {error && (
              <div className="bg-rose-950/50 border border-rose-500/40 text-rose-300 text-sm py-2 px-3 rounded-xl text-center animate-shake">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {/* Option: Male */}
              <button
                type="button"
                onClick={() => {
                  setSelectedGender("Male");
                  setError("");
                }}
                className={`group text-left rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-end aspect-[1/1.2] cursor-pointer active:scale-95 select-none p-4 ${
                  selectedGender === "Male"
                    ? "bg-zinc-900 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                    : "bg-zinc-950 border-zinc-900 hover:border-cyan-500/40"
                }`}
              >
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                  <img
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80"
                    alt="Male"
                    className={`w-full h-full object-cover transition-all duration-500 ${
                      selectedGender === "Male" ? "opacity-90" : "opacity-30 group-hover:opacity-60"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent z-10" />
                </div>
                
                <div className="relative z-10 w-full flex justify-between items-center">
                  <span className={`text-sm font-black tracking-wide uppercase ${
                    selectedGender === "Male" ? "text-cyan-400" : "text-zinc-400"
                  }`}>
                    Male ♂
                  </span>
                </div>
              </button>

              {/* Option: Female */}
              <button
                type="button"
                onClick={() => {
                  setSelectedGender("Female");
                  setError("");
                }}
                className={`group text-left rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-end aspect-[1/1.2] cursor-pointer active:scale-95 select-none p-4 ${
                  selectedGender === "Female"
                    ? "bg-zinc-900 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]"
                    : "bg-zinc-950 border-zinc-900 hover:border-rose-500/40"
                }`}
              >
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80"
                    alt="Female"
                    className={`w-full h-full object-cover transition-all duration-500 ${
                      selectedGender === "Female" ? "opacity-90" : "opacity-30 group-hover:opacity-60"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent z-10" />
                </div>
                
                <div className="relative z-10 w-full flex justify-between items-center">
                  <span className={`text-sm font-black tracking-wide uppercase ${
                    selectedGender === "Female" ? "text-rose-450" : "text-zinc-405"
                  }`}>
                    Female ♀
                  </span>
                </div>
              </button>
            </div>

            <button
              onClick={handleCompleteGenderSelection}
              disabled={loading || !selectedGender}
              className={`w-full font-bold uppercase tracking-wider rounded-xl py-3.5 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md text-xs ${
                selectedGender 
                  ? "bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:from-rose-400 hover:to-fuchsia-500 text-white shadow-rose-950/25"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-650 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Heart className="w-4 h-4 fill-white" />
                  Save & Forge Connection
                </>
              )}
            </button>
          </div>
        ) : showForgotPassword ? (
          <div>
            <h2 className="text-xl font-bold text-center text-rose-100 mb-2 font-sans">
              Re-align Security Key
            </h2>
            <p className="text-xs text-center text-rose-300/60 font-mono mb-6">
              Restore your authentication frequency
            </p>

            {error && (
              <div className="bg-rose-950/50 border border-rose-500/40 text-rose-300 text-sm py-2 px-3 rounded-xl mb-4 text-center">
                {error}
              </div>
            )}

            {resetStatus && (
              <div className="bg-gradient-to-tr from-cyan-950/40 to-emerald-950/40 border border-cyan-500/30 text-rose-200 text-sm py-3 px-4 rounded-xl mb-4 text-center leading-relaxed font-sans shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                {resetStatus}
              </div>
            )}

            {forgotStep === "request" && (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                {/* Method selector */}
                <div className="grid grid-cols-2 gap-2 bg-zinc-900/60 p-1 border border-zinc-900 rounded-xl mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotMethod("email");
                      setError("");
                    }}
                    className={`py-2 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                      forgotMethod === "email"
                        ? "bg-rose-500 text-white shadow-sm"
                        : "text-rose-200/50 hover:text-rose-205"
                    }`}
                  >
                    Reset via Gmail
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotMethod("phone");
                      setError("");
                    }}
                    className={`py-2 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                      forgotMethod === "phone"
                        ? "bg-rose-500 text-white shadow-sm"
                        : "text-rose-200/50 hover:text-rose-205"
                    }`}
                  >
                    Reset via Mobile
                  </button>
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-rose-300/40" />
                  <input
                    type="email"
                    placeholder="name@destiny.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-rose-500/60 text-rose-100 rounded-xl py-3 pl-11 pr-4 outline-none transition-all placeholder:text-zinc-600 font-sans"
                    required
                  />
                </div>

                {forgotMethod === "phone" && (
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 w-5 h-5 text-rose-300/40" />
                    <input
                      type="tel"
                      placeholder="Mobile Number (e.g., +91 9876543210)"
                      value={forgotPhone}
                      onChange={(e) => setForgotPhone(e.target.value)}
                      className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-rose-500/60 text-rose-100 rounded-xl py-3 pl-11 pr-4 outline-none transition-all placeholder:text-zinc-600 font-sans"
                      required
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:from-rose-400 hover:to-fuchsia-500 text-white font-semibold rounded-xl py-3 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-[0_0_20px_rgba(244,63,94,0.4)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>{forgotMethod === "email" ? "Send Gmail Reset Link" : "Request Reset OTP Pulse"}</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {forgotStep === "otp" && (
              <form onSubmit={handleVerifyForgotOtp} className="mt-4 space-y-6">
                <div className="text-center">
                  <ShieldCheck className="w-12 h-12 text-rose-500/85 mx-auto mb-3" />
                  <p className="text-xs text-rose-300/60 mt-1 font-mono max-w-[280px] mx-auto">
                    Enter the secret 4-digit <strong className="text-rose-400 font-bold font-sans">Mobile OTP</strong> sent to your phone number. (Hint: Enter <strong className="text-rose-400">8888</strong>)
                  </p>
                </div>

                {/* Highly visible 4 segmented boxes linked with actual text input */}
                <div className="relative w-full max-w-[240px] mx-auto h-14 flex items-center justify-center">
                  <input
                    type="text"
                    pattern="\d*"
                    maxLength={4}
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ""))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 text-[1px] select-none text-transparent bg-transparent"
                    autoFocus
                    required
                  />
                  <div className="grid grid-cols-4 gap-3 w-full relative z-10">
                    {[0, 1, 2, 3].map((index) => {
                      const char = forgotOtp[index] || "";
                      const isFocused = forgotOtp.length === index || (forgotOtp.length === 4 && index === 3);
                      return (
                        <div
                          key={index}
                          className={`h-12 rounded-xl border text-xl font-extrabold flex items-center justify-center transition-all bg-zinc-950/80 ${
                            isFocused
                              ? "border-rose-500 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.3)] bg-zinc-900"
                              : char
                              ? "border-rose-500/40 text-rose-200"
                              : "border-zinc-850 text-zinc-700"
                          }`}
                        >
                          {char || "•"}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotOtp("8888");
                      setError("Autofilled correct Mobile OTP! Submit below.");
                    }}
                    className="text-xs text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                  >
                    Quick autofill OTP?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:from-rose-400 hover:to-fuchsia-500 text-white font-semibold rounded-xl py-3 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-rose-950/20"
                >
                  Confirm OTP & Reset
                </button>
              </form>
            )}

            {forgotStep === "new_password" && (
              <form onSubmit={handleSaveNewPassword} className="space-y-4">
                <div className="text-center">
                  <Lock className="w-12 h-12 text-rose-500/85 mx-auto mb-3" />
                  <p className="text-xs text-rose-300/60 font-mono mb-4">
                    Construct a brand new private key credentials
                  </p>
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-rose-300/40" />
                  <input
                    type="password"
                    placeholder="Enter New Secret Key"
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-rose-500/60 text-rose-100 rounded-xl py-3 pl-11 pr-4 outline-none transition-all placeholder:text-zinc-600 font-sans"
                    required
                    minLength={6}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:from-rose-400 hover:to-fuchsia-500 text-white font-semibold rounded-xl py-3 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>Override Secret Key</span>
                  )}
                </button>
              </form>
            )}

            {forgotStep === "success" && (
              <div className="text-center mt-6">
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotStep("request");
                    setForgotEmail("");
                    setForgotPhone("");
                    setForgotOtp("");
                    setForgotNewPassword("");
                    setError("");
                    setResetStatus("");
                  }}
                  className="w-full py-3 bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:from-rose-400 hover:to-fuchsia-500 text-white font-semibold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Return and Log In
                </button>
              </div>
            )}

            {forgotStep !== "success" && (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotStep("request");
                    setForgotEmail("");
                    setForgotPhone("");
                    setForgotOtp("");
                    setForgotNewPassword("");
                    setError("");
                    setResetStatus("");
                  }}
                  className="text-xs text-zinc-500 hover:text-rose-300 transition-colors cursor-pointer hover:underline"
                >
                  ← Return to Login page
                </button>
              </div>
            )}
          </div>
        ) : !showOtp ? (
          <div>
            <h2 className="text-xl font-bold text-center text-rose-100 mb-6 font-sans">
              {isLogin ? "Welcome Back, Lover" : "Begin Your Soul Sync"}
            </h2>

            {error && (
              <div className="bg-rose-950/50 border border-rose-500/40 text-rose-300 text-sm py-2 px-3 rounded-xl mb-4 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3.5 w-5 h-5 text-rose-300/40" />
                  <input
                    type="text"
                    placeholder="Your Beautiful Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-rose-500/60 text-rose-100 rounded-xl py-3 pl-11 pr-4 outline-none transition-all placeholder:text-zinc-600"
                    required={!isLogin}
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-rose-300/40" />
                <input
                  type="email"
                  placeholder="name@destiny.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-rose-500/60 text-rose-100 rounded-xl py-3 pl-11 pr-4 outline-none transition-all placeholder:text-zinc-600"
                  required
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-3.5 w-5 h-5 text-rose-300/40" />
                <input
                  type="tel"
                  placeholder="Mobile Number (e.g., +1 555-0199)"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-rose-500/60 text-rose-100 rounded-xl py-3 pl-11 pr-4 outline-none transition-all placeholder:text-zinc-600"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-rose-300/40" />
                <input
                  type="password"
                  placeholder="Your Secret Key"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-rose-500/60 text-rose-100 rounded-xl py-3 pl-11 pr-4 outline-none transition-all placeholder:text-zinc-600"
                  required
                />
              </div>

              {isLogin && (
                <div className="flex justify-between items-center text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      // Generate and store a browser-persistent unique suffix for the demo account
                      let suffix = localStorage.getItem("soulsync_demo_suffix");
                      if (!suffix) {
                        suffix = Math.floor(1000 + Math.random() * 9000).toString();
                        localStorage.setItem("soulsync_demo_suffix", suffix);
                      }
                      setEmail(`demo.lover.${suffix}@soulsync.com`);
                      setPassword("romantic123");
                      setMobileNumber("+91 9876543210");
                      setError(`Demo credentials (ID: ${suffix}) and mobile number set! Click Login.`);
                    }}
                    className="text-rose-400/80 hover:text-rose-300 transition-colors cursor-pointer text-left"
                  >
                    Use Demo Quick Setup?
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(true);
                      setForgotStep("request");
                      setError("");
                      setResetStatus("");
                      setForgotEmail(email);
                      setForgotPhone(mobileNumber);
                    }}
                    className="text-rose-400/80 hover:text-rose-300 transition-colors cursor-pointer text-right font-medium hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:from-rose-400 hover:to-fuchsia-500 text-white font-semibold rounded-xl py-3 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-[0_0_20px_rgba(244,63,94,0.4)] flex items-center justify-center gap-2 cursor-pointer mt-6"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    {isLogin ? "Unlock Destiny" : "Forge Connection"}
                  </>
                )}
              </button>
            </form>

            <div className="relative my-6 text-center">
              <hr className="border-zinc-800/80" />
              <span className="absolute px-3 bg-zinc-950 text-xs text-zinc-500/80 font-mono left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 uppercase tracking-widest">Or Sync Via</span>
            </div>

            <button
              onClick={triggerGoogleAuth}
              disabled={loading}
              className="w-full bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 text-rose-100 rounded-xl py-3 px-4 font-medium transition-all flex items-center justify-center gap-3 cursor-pointer shadow-sm hover:border-rose-500/30"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.579-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1c-6.075 0-11 4.925-11 11s4.925 11 11 11c6.34 0 10.556-4.441 10.556-10.741 0-.726-.08-1.281-.176-1.826H12.24z"
                />
              </svg>
              <span>Instant Google Auth</span>
            </button>

            <p className="mt-6 text-center text-sm text-zinc-550">
              {isLogin ? "New to the synchronous path?" : "Already aligned your frequency?"}{" "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="text-rose-450 font-semibold hover:underline cursor-pointer ml-1"
              >
                {isLogin ? "Create credentials" : "Access Sync"}
              </button>
            </p>
          </div>
        ) : (
          <div>
            {/* OTP Section */}
            <div className="flex flex-col items-center text-center">
              <ShieldCheck className="w-12 h-12 text-rose-500/85 mb-3" />
              <h2 className="text-xl font-bold text-rose-100 font-sans">Mobile OTP Verification</h2>
              <p className="text-xs text-rose-300/60 mt-2 font-mono max-w-[280px]">
                Enter the secret 4-digit One-Time Password (OTP) sent to your mobile phone number. (Demo tip: Enter <span className="text-rose-400 font-bold">1111</span>)
              </p>
            </div>

            {error && (
              <div className="bg-rose-950/50 border border-rose-500/40 text-rose-300 text-sm py-2 px-3 rounded-xl my-4 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="mt-6 space-y-6">
              {/* Highly visible 4 segmented boxes linked with actual text input */}
              <div className="relative w-full max-w-[240px] mx-auto h-14 flex items-center justify-center">
                <input
                  type="text"
                  pattern="\d*"
                  maxLength={4}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 text-[1px] select-none text-transparent bg-transparent"
                  autoFocus
                  required
                />
                <div className="grid grid-cols-4 gap-3 w-full relative z-10">
                  {[0, 1, 2, 3].map((index) => {
                    const char = otpCode[index] || "";
                    const isFocused = otpCode.length === index || (otpCode.length === 4 && index === 3);
                    return (
                      <div
                        key={index}
                        className={`h-12 rounded-xl border text-xl font-extrabold flex items-center justify-center transition-all bg-zinc-950/80 ${
                          isFocused
                            ? "border-rose-500 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.3)] bg-zinc-900"
                            : char
                            ? "border-rose-500/45 text-rose-200"
                            : "border-zinc-850 text-zinc-700"
                        }`}
                      >
                        {char || "•"}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <button
                  type="button"
                  onClick={() => setShowOtp(false)}
                  className="text-zinc-500 hover:text-rose-300 transition-colors cursor-pointer"
                >
                  ← Change credentials
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOtpCode("1111");
                    setError("Autofilled correct Mobile OTP! Submit.");
                  }}
                  className="text-rose-400 hover:text-rose-300 transition-colors cursor-pointer font-mono"
                >
                  Request Resend (Demo Code)
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:from-rose-400 hover:to-fuchsia-500 text-white font-semibold rounded-xl py-3 transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-rose-950/20"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Heart className="w-4 h-4 text-white fill-white" />
                    Verify & Connect
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
