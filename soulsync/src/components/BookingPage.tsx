/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { UserProfile } from "../types";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Sparkles, 
  CheckCircle, 
  Video, 
  MessageSquare, 
  Plus, 
  Trash2, 
  Heart, 
  CalendarCheck,
  AlertCircle 
} from "lucide-react";
import { collection, query, where, onSnapshot, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";

interface BookingPageProps {
  currentUser: UserProfile;
}

interface Booking {
  id: string;
  userId: string;
  mentorName: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  notes: string;
  status: string;
  createdAt: string;
}

const MENTORS = [
  {
    name: "Aiden (AI Advisor)",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
    role: "Senior AI Sync Counsel",
    desc: "Leverages emotional metrics & romantic modeling to pinpoint alignment solutions."
  },
  {
    name: "Celeste Moon",
    avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=120&auto=format&fit=crop&q=80",
    role: "Romance Astrologer & Designer",
    desc: "Curates specific date environments matching complementary frequencies."
  },
  {
    name: "Dr. Marcus Vance",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    role: "Relationship Compatibility Therapist",
    desc: "Deep dialogue integration helping couples smooth frictions and build loyalty."
  }
];

const SERVICES = [
  {
    name: "Core Frequency Alignment Session",
    duration: "45 mins",
    price: "$49",
    desc: "Examine green/red flags and review AI-driven compatibility metrics."
  },
  {
    name: "Date Night Preparation & Planning",
    duration: "60 mins",
    price: "$69",
    desc: "Co-create customized date itineraries suited for your distinct love languages."
  },
  {
    name: "Sync-Up Integration Therapy",
    duration: "50 mins",
    price: "$89",
    desc: "Dialogue resolution counseling to overcome active communicative friction."
  }
];

const TIME_SLOTS = [
  "09:30 AM", "11:00 AM", "01:30 PM", "03:00 PM", "04:30 PM", "07:00 PM"
];

// Helper to get next 7 days formatted for picker
const getNextSevenDays = () => {
  const days = [];
  const options: Intl.DateTimeFormatOptions = { weekday: "short", month: "short", day: "numeric" };
  for (let i = 1; i <= 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      isoString: d.toISOString().split("T")[0],
      display: d.toLocaleDateString("en-US", options)
    });
  }
  return days;
};

export default function BookingPage({ currentUser }: BookingPageProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedMentor, setSelectedMentor] = useState(MENTORS[0].name);
  const [selectedService, setSelectedService] = useState(SERVICES[0].name);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [bookingStatus, setBookingStatus] = useState<"idle" | "booking" | "success" | "error">("idle");
  const [errorText, setErrorText] = useState("");

  const futureDates = getNextSevenDays();

  // Load future dates initial state
  useEffect(() => {
    if (futureDates.length > 0) {
      setSelectedDate(futureDates[0].isoString);
    }
  }, []);

  // Listen to bookings collection in real-time
  useEffect(() => {
    const q = query(
      collection(db, "bookings"),
      where("userId", "==", currentUser.id)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched: Booking[] = [];
        snapshot.forEach((docSnap) => {
          fetched.push({ id: docSnap.id, ...docSnap.data() } as Booking);
        });
        // Sort bookings by creation date descending
        fetched.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        setBookings(fetched);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, "bookings");
      }
    );

    return () => unsubscribe();
  }, [currentUser.id]);

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      setErrorText("Please choose a time slot for alignment.");
      return;
    }
    setErrorText("");
    setBookingStatus("booking");

    const newBookingId = `booking_${Date.now()}`;
    const payload: Booking = {
      id: newBookingId,
      userId: currentUser.id,
      mentorName: selectedMentor,
      serviceName: selectedService,
      date: selectedDate,
      timeSlot: selectedSlot,
      notes: notes.trim(),
      status: "scheduled",
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, "bookings", newBookingId), payload);
      setBookingStatus("success");
      setNotes("");
      setSelectedSlot("");
      setTimeout(() => {
        setBookingStatus("idle");
      }, 3000);
    } catch (err: any) {
      console.error(err);
      setBookingStatus("error");
      setErrorText("Failed to schedule booking. Ensure database permission settings conform.");
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm("Cancel this emotional alignment booking?")) return;
    try {
      await deleteDoc(doc(db, "bookings", bookingId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `bookings/${bookingId}`);
    }
  };

  return (
    <div id="booking-container" className="z-10 relative max-w-6xl mx-auto px-4 py-8 select-none space-y-10">
      
      {/* Visual Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono uppercase tracking-wider font-semibold">
          <CalendarCheck className="w-3.5 h-3.5 text-rose-400" />
          <span>Synchronicity Schedulers</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-rose-100">
          Book Your{" "}
          <span className="bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-400 bg-clip-text text-transparent">
            Alignment Session
          </span>
        </h2>
        <p className="text-sm text-zinc-500 max-w-lg mx-auto">
          Reserve physical audio integrations, customized date curation counseling, or active stress reviews with our specialized SouLSynC team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form Panel: 7 Columns */}
        <div className="lg:col-span-7 bg-zinc-950/40 border border-zinc-900 rounded-[30px] p-6 backdrop-blur-md space-y-6">
          <h3 className="text-lg font-bold text-rose-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-450" />
            Initiate Alignment Booking
          </h3>

          <form onSubmit={handleCreateBooking} className="space-y-6">
            
            {/* 1. Mentor Selection */}
            <div className="space-y-3">
              <label className="block text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider">
                1. Select Harmony Advisor
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {MENTORS.map((m) => {
                  const active = selectedMentor === m.name;
                  return (
                    <button
                      key={m.name}
                      type="button"
                      onClick={() => setSelectedMentor(m.name)}
                      className={`text-left p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-full ${
                        active 
                          ? "bg-rose-500/10 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.1)]" 
                          : "bg-zinc-900/40 border-zinc-850 hover:border-rose-500/10"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 mb-2">
                        <img
                          src={m.avatar}
                          alt={m.name}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover border border-rose-500/20"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-zinc-200">{m.name}</h4>
                          <span className="text-[9px] text-zinc-500 font-mono">{m.role}</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-snug">{m.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Service Selection */}
            <div className="space-y-3">
              <label className="block text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider">
                2. Select Alignment Service
              </label>
              <div className="space-y-2">
                {SERVICES.map((s) => {
                  const active = selectedService === s.name;
                  return (
                    <button
                      key={s.name}
                      type="button"
                      onClick={() => setSelectedService(s.name)}
                      className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        active 
                          ? "bg-rose-500/10 border-rose-500/40 shadow-sm" 
                          : "bg-zinc-900/40 border-zinc-850 hover:border-rose-500/10"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-zinc-200">{s.name}</h4>
                          <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-550/10 border border-rose-500/20 px-1.5 py-0.5 rounded">
                            {s.price}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-1">{s.desc}</p>
                      </div>
                      <span className="shrink-0 text-xs font-mono text-rose-400 bg-rose-500/5 px-2 py-1 rounded-lg border border-rose-500/15">
                        {s.duration}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Date Selection */}
            <div className="space-y-3">
              <label className="block text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider">
                3. Choose Alignment Date
              </label>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {futureDates.map((fd) => {
                  const active = selectedDate === fd.isoString;
                  return (
                    <button
                      key={fd.isoString}
                      type="button"
                      onClick={() => setSelectedDate(fd.isoString)}
                      className={`px-4 py-3 rounded-xl border text-center cursor-pointer shrink-0 transition-all ${
                        active 
                          ? "bg-rose-500/20 border-rose-500 text-rose-305 font-bold" 
                          : "bg-zinc-900/40 border-zinc-850 text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      <CalendarIcon className="w-4 h-4 mx-auto mb-1 opacity-70" />
                      <span className="text-xs font-mono block">{fd.display}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Time Slot Selection */}
            <div className="space-y-3">
              <label className="block text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider">
                4. Select Time Pulse (UTC Zone)
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {TIME_SLOTS.map((slot) => {
                  const active = selectedSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                        active 
                          ? "bg-gradient-to-tr from-rose-500/20 to-fuchsia-600/20 border-rose-500 text-rose-300 font-bold" 
                          : "bg-zinc-900/40 border-zinc-850 text-zinc-450 hover:text-zinc-200"
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Custom Notes */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider">
                5. Harmony notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Share your partner's profile name, current emotional syncing level, or areas of hope you wish to touch upon..."
                rows={3}
                className="w-full bg-zinc-900/40 border border-zinc-850 hover:border-zinc-800 focus:border-rose-500/45 text-rose-100 rounded-xl p-3 outline-none text-xs transition-all placeholder:text-zinc-600"
              />
            </div>

            {/* Submit Action Block */}
            <div className="pt-2">
              {errorText && (
                <div className="bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs py-2 px-3 rounded-xl mb-4 flex items-center gap-1.5 font-mono">
                  <AlertCircle className="w-4 h-4 text-rose-455 shrink-0" />
                  <span>{errorText}</span>
                </div>
              )}

              {bookingStatus === "success" && (
                <div className="bg-emerald-950/40 border border-emerald-500/30 text-emerald-305 text-xs py-2 px-3 rounded-xl mb-4 flex items-center gap-1.5 font-mono">
                  <CheckCircle className="w-4 h-4 text-emerald-450 shrink-0" />
                  <span>Prism integration locked! Booking successfully scheduled.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={bookingStatus === "booking"}
                className="w-full py-3.5 rounded-2xl font-bold text-white text-sm bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:from-rose-450 hover:to-fuchsia-500 transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-rose-950/20"
              >
                {bookingStatus === "booking" ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CalendarCheck className="w-4 h-4 text-white fill-white/10" />
                    Secure Booking Slot
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Right Bookings List Panel: 5 Columns */}
        <div className="lg:col-span-5 bg-zinc-950/40 border border-zinc-900 rounded-[30px] p-6 backdrop-blur-md flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-rose-100 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-rose-450" />
              Your Scheduled Integrations
            </h3>

            {bookings.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-zinc-900 rounded-2xl px-4">
                <CalendarIcon className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                <p className="text-xs text-zinc-550 font-mono">No active alignment slots captured.</p>
                <p className="text-[10px] text-zinc-600 mt-1 max-w-[200px] mx-auto">
                  Reserve a slot above to initiate deep compatibility consultation and counseling.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-2xl bg-zinc-900/60 border border-rose-500/10 hover:border-rose-500/20 transition-all space-y-3 relative"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="space-y-1.5 flex-grow">
                        <span className="inline-block bg-rose-500/10 border border-rose-500/20 text-[#f43f5e] font-mono text-[9px] px-2 py-0.5 rounded-full uppercase font-bold">
                          {b.timeSlot}
                        </span>
                        <h4 className="text-zinc-200 text-xs font-bold font-sans">{b.serviceName}</h4>
                      </div>

                      <button
                        onClick={() => handleCancelBooking(b.id)}
                        className="text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-2.5 py-1 rounded-lg text-[10px] uppercase font-mono tracking-wider flex items-center gap-1 transition-all cursor-pointer border border-red-500/20 shrink-0"
                        title="Delete Alignment Slot"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-[10px] text-zinc-500 flex items-center gap-1.5 font-mono">
                        <Heart className="w-3 h-3 text-rose-450 inline" />
                        Advisor: {b.mentorName}
                      </p>
                      <p className="text-[10px] text-zinc-500 flex items-center gap-1.5 font-mono">
                        <CalendarIcon className="w-3 h-3 text-rose-450 inline" />
                        Target: {b.date}
                      </p>
                    </div>

                    {b.notes && (
                      <div className="p-2 py-1.5 bg-zinc-950/50 rounded-lg text-[9px] text-zinc-500 italic font-mono border border-zinc-900 leading-normal">
                        "{b.notes}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-zinc-900 pt-5 mt-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-505/10 border border-indigo-500/20 flex items-center justify-center">
              <Video className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h5 className="text-[10px] font-bold text-zinc-300">Synchronous Integration Link</h5>
              <p className="text-[9px] text-zinc-500 font-mono">Meeting frequencies generate 5 mins prior to the slot.</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
