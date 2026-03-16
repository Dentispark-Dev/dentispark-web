"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useField } from "@/src/providers/field-provider";
import { PLATFORM_FIELDS } from "@/src/types/fields";

/**
 * A dropdown switcher that lets users change their active healthcare field.
 * Designed to sit in the dashboard sidebar or top nav.
 */
export function FieldSwitcher({ compact = false }: { compact?: boolean }) {
  const { activeField, selectedFields, setActiveField, activeFieldLabel, activeFieldIcon } =
    useField();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Only show fields that user has selected (or all if none selected)
  const displayFields =
    selectedFields.length > 0
      ? PLATFORM_FIELDS.filter((f) => selectedFields.includes(f.value))
      : PLATFORM_FIELDS;

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-emerald-300 hover:bg-emerald-50/30 ${
          open ? "border-emerald-400 ring-1 ring-emerald-200" : ""
        } ${compact ? "px-2 py-1.5" : ""}`}
      >
        <span className="text-base leading-none">{activeFieldIcon}</span>
        {!compact && <span className="truncate max-w-[140px]">{activeFieldLabel}</span>}
        <ChevronDown
          className={`h-3.5 w-3.5 text-gray-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-[220px] rounded-xl border border-gray-200 bg-white py-1 shadow-xl animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Switch Field
          </div>
          {displayFields.map((field) => {
            const isActive = field.value === activeField;
            return (
              <button
                key={field.value}
                onClick={() => {
                  setActiveField(field.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="text-base leading-none">{field.icon}</span>
                <span className="flex-1 text-left">{field.label}</span>
                {isActive && <Check className="h-4 w-4 text-emerald-600" />}
              </button>
            );
          })}

          {/* Manage fields link */}
          <div className="border-t border-gray-100 mt-1 pt-1 px-3 py-2">
            <button className="text-xs text-emerald-600 hover:underline font-medium">
              + Manage my fields
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
