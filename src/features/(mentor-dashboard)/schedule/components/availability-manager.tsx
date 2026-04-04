"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, Plus, Trash2, CheckCircle2, Save, 
  RefreshCcw, AlertCircle, ToggleLeft, ToggleRight 
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/button";

// ─── Types ───────────────────────────────────────────────────────
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const SESSION_COLORS: Record<string, string> = {
  "UCAT Mentoring":       "bg-blue-100 text-blue-700",
  "PS Mentoring":         "bg-indigo-100 text-indigo-700",
  "Interview Prep":       "bg-purple-100 text-purple-700",
  "General Consultation": "bg-emerald-100 text-emerald-700",
};

const HOUR_SLOTS = Array.from({ length: 14 }, (_, i) => {
  const hour = i + 8; // 08:00 – 21:00
  return `${String(hour).padStart(2, "0")}:00`;
});

interface DayAvailability {
  enabled: boolean;
  slots: Array<{ start: string; end: string; type: string }>;
}

type WeekAvailability = Record<string, DayAvailability>;

const DEFAULT_WEEK: WeekAvailability = Object.fromEntries(
  DAYS.map(day => [day, { enabled: false, slots: [] }])
);

// ─── Component ───────────────────────────────────────────────────
export function AvailabilityManager() {
  const [week, setWeek] = useState<WeekAvailability>(DEFAULT_WEEK);
  const [saved, setSaved] = useState(false);
  const [selectedType, setSelectedType] = useState("General Consultation");

  const toggleDay = (day: string) => {
    setWeek(prev => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled }
    }));
  };

  const addSlot = (day: string) => {
    setWeek(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: [
          ...prev[day].slots,
          { start: "09:00", end: "10:00", type: selectedType }
        ]
      }
    }));
  };

  const removeSlot = (day: string, index: number) => {
    setWeek(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.filter((_, i) => i !== index)
      }
    }));
  };

  const updateSlot = (day: string, index: number, field: "start" | "end" | "type", value: string) => {
    setWeek(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.map((slot, i) =>
          i === index ? { ...slot, [field]: value } : slot
        )
      }
    }));
  };

  const handleSave = async () => {
    // TODO: POST to /api/mentor/availability with week data
    console.log("Saving availability:", week);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const enabledDaysCount = DAYS.filter(d => week[d].enabled).length;
  const totalSlots = DAYS.reduce((acc, d) => acc + week[d].slots.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Weekly Availability</h2>
          <p className="text-slate-500 text-sm mt-1">
            Set the recurring hours you're available each week. Students will book from these slots.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {saved && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-emerald-600 text-sm font-bold"
            >
              <CheckCircle2 className="w-4 h-4" /> Availability saved!
            </motion.div>
          )}
          <Button onClick={handleSave} className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-10 px-5 font-bold flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Schedule
          </Button>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="flex items-center gap-6 p-5 bg-slate-50 rounded-2xl border border-slate-100">
        <div className="text-center">
          <p className="text-2xl font-black text-slate-900">{enabledDaysCount}</p>
          <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Days Active</p>
        </div>
        <div className="w-px h-10 bg-slate-200" />
        <div className="text-center">
          <p className="text-2xl font-black text-slate-900">{totalSlots}</p>
          <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Weekly Slots</p>
        </div>
        <div className="w-px h-10 bg-slate-200" />
        <div className="text-center">
          <p className="text-2xl font-black text-slate-900">{totalSlots * 60}</p>
          <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Total Minutes</p>
        </div>
        <div className="ml-auto">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            Times shown in UTC. Students see their local timezone.
          </div>
        </div>
      </div>

      {/* Session Type Picker */}
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Default Session Type for New Slots</p>
        <div className="flex gap-2 flex-wrap">
          {Object.keys(SESSION_COLORS).map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                selectedType === type
                  ? SESSION_COLORS[type] + " ring-2 ring-offset-1 ring-current"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Day Grid */}
      <div className="space-y-3">
        {DAYS.map(day => {
          const dayData = week[day];
          return (
            <div
              key={day}
              className={cn(
                "rounded-[1.5rem] border transition-all duration-300",
                dayData.enabled ? "border-slate-200 bg-white shadow-sm" : "border-slate-100 bg-slate-50/50"
              )}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleDay(day)}
                    className="shrink-0"
                    aria-label={`Toggle ${day}`}
                  >
                    {dayData.enabled
                      ? <ToggleRight className="w-7 h-7 text-emerald-500" />
                      : <ToggleLeft className="w-7 h-7 text-slate-300" />
                    }
                  </button>
                  <span className={cn(
                    "font-black text-base",
                    dayData.enabled ? "text-slate-900" : "text-slate-400"
                  )}>
                    {day}
                  </span>
                  {dayData.enabled && dayData.slots.length > 0 && (
                    <span className="text-xs font-bold text-slate-400">
                      {dayData.slots.length} slot{dayData.slots.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                {dayData.enabled && (
                  <button
                    onClick={() => addSlot(day)}
                    className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Slot
                  </button>
                )}

                {!dayData.enabled && (
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Unavailable</span>
                )}
              </div>

              {/* Slots */}
              <AnimatePresence>
                {dayData.enabled && dayData.slots.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-5 pb-5 space-y-2"
                  >
                    {dayData.slots.map((slot, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 flex-wrap"
                      >
                        <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                        
                        {/* Start */}
                        <select
                          value={slot.start}
                          onChange={e => updateSlot(day, index, "start", e.target.value)}
                          className="text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                        >
                          {HOUR_SLOTS.map(h => <option key={h}>{h}</option>)}
                        </select>

                        <span className="text-slate-400 text-sm font-medium">to</span>

                        {/* End */}
                        <select
                          value={slot.end}
                          onChange={e => updateSlot(day, index, "end", e.target.value)}
                          className="text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                        >
                          {HOUR_SLOTS.map(h => <option key={h}>{h}</option>)}
                        </select>

                        {/* Session Type */}
                        <select
                          value={slot.type}
                          onChange={e => updateSlot(day, index, "type", e.target.value)}
                          className={cn(
                            "text-xs font-bold rounded-lg px-2 py-1 border-0 focus:outline-none focus:ring-1 focus:ring-offset-0 focus:ring-current",
                            SESSION_COLORS[slot.type] || "bg-slate-100 text-slate-600"
                          )}
                        >
                          {Object.keys(SESSION_COLORS).map(t => <option key={t}>{t}</option>)}
                        </select>

                        <button
                          onClick={() => removeSlot(day, index)}
                          className="ml-auto p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
