"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock, CheckCircle2, Calendar } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { addDays, format, startOfWeek, isSameDay, isToday } from "date-fns";
import { LooseRecord } from "@/src/types/loose";

// ─── Mock Availability ────────────────────────────────────────────
// In production this would be fetched from /api/mentor/:slug/availability
interface TimeSlotPickerProps {
  mentorName: string;
  onSlotSelected: (date: string, time: string) => void;
  selectedDate?: string;
  selectedTime?: string;
}

// ─── Component ───────────────────────────────────────────────────
export function TimeSlotPicker({ mentorName, onSlotSelected, selectedDate, selectedTime }: TimeSlotPickerProps) {
  const today = new Date();
  const [weekOffset, setWeekOffset] = useState(0);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  
  const [availability, setAvailability] = useState<LooseRecord | null>(null);
  const [bookedSlots, setBookedSlots] = useState<Array<{date: string, time: string}>>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load availability from backend
  useState(() => {
    async function load() {
      try {
        const res = await fetch(`/api/mentorship/any-slug/availability`); // In real app use slug
        const data = await res.json();
        setAvailability(data.availability);
        setBookedSlots(data.bookedSlots || []);
      } catch (err) {
        console.error("Failed to load availability", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const weekStart = addDays(startOfWeek(today, { weekStartsOn: 1 }), weekOffset * 7);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const pickedDate = hoveredDate || selectedDate;
  
  // Calculate slots for the specific picked date based on weekly availability
  const getSlotsForDate = (dateStr: string) => {
    if (!availability) return [];
    
    // Parse date in a way that avoids timezone shifts (YYYY-MM-DD)
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m-1, d);
    
    const dayName = format(date, "EEEE");
    const dayData = availability[dayName];
    
    if (!dayData || !dayData.enabled) return [];
    
    // Extract all slots for this day
    const slots = dayData.slots.map((s: LooseRecord) => s.start);
    
    // Filter out booked slots
    return slots.filter((time: string) => {
        return !bookedSlots.some(b => b.date === dateStr && b.time === time);
    });
  };

  const slotsForDay = pickedDate ? getSlotsForDate(pickedDate) : [];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-slate-900 text-lg">Pick a Date & Time</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setWeekOffset(w => Math.max(0, w - 1))}
            disabled={weekOffset === 0}
            className="p-2 rounded-xl hover:bg-slate-100 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          </button>
          <span className="text-sm font-bold text-slate-600 min-w-[140px] text-center">
            {format(weekStart, "MMM d")} – {format(addDays(weekStart, 6), "MMM d, yyyy")}
          </span>
          <button
            onClick={() => setWeekOffset(w => w + 1)}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Day Picker */}
      <div className="grid grid-cols-7 gap-1.5">
        {weekDays.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const isAvailable = getSlotsForDate(dateStr).length > 0;
          const isSelected = selectedDate === dateStr;
          const isPast = day < today && !isToday(day);

          return (
            <button
              key={dateStr}
              disabled={!isAvailable || isPast}
              onMouseEnter={() => isAvailable && setHoveredDate(dateStr)}
              onMouseLeave={() => setHoveredDate(null)}
              onClick={() => isAvailable && onSlotSelected(dateStr, "")}
              className={cn(
                "flex flex-col items-center gap-1 py-3 rounded-xl border-2 transition-all text-sm",
                isPast && "opacity-30 cursor-not-allowed",
                !isAvailable && !isPast && "border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed",
                isAvailable && !isSelected && "border-slate-200 bg-white hover:border-emerald-400 hover:bg-emerald-50 cursor-pointer",
                isSelected && "border-emerald-500 bg-emerald-50",
              )}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {format(day, "EEE")}
              </span>
              <span className={cn(
                "font-extrabold text-base",
                isToday(day) && "text-emerald-600",
                isSelected ? "text-emerald-700" : "text-slate-800",
                (!isAvailable || isPast) && "text-slate-400"
              )}>
                {format(day, "d")}
              </span>
              {isAvailable && !isPast && (
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Time Slots */}
      <AnimatePresence mode="wait">
        {pickedDate && slotsForDay.length > 0 && (
          <motion.div
            key={pickedDate}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <p className="text-sm font-bold text-slate-700">
                Available slots on {format(new Date(pickedDate + "T00:00:00"), "EEEE, MMMM d")}
              </p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {slotsForDay.map((time) => {
                const isSelected = selectedDate === pickedDate && selectedTime === time;
                return (
                  <button
                    key={time}
                    onClick={() => onSlotSelected(pickedDate, time)}
                    className={cn(
                      "flex items-center justify-center gap-2 py-3 px-3 rounded-xl border-2 text-sm font-bold transition-all",
                      isSelected
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-white text-slate-700 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700"
                    )}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    {time}
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {pickedDate && slotsForDay.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-6 text-slate-400 font-medium"
          >
            No available slots on this day.
          </motion.div>
        )}

        {!pickedDate && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-4 text-slate-400 text-sm font-medium"
          >
            Hover over a highlighted date to see available times.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
