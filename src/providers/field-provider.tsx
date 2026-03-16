"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { PlatformField, PLATFORM_FIELDS, DEFAULT_FIELD } from "@/src/types/fields";

interface FieldContextType {
  /** The user's currently active/primary field */
  activeField: PlatformField;
  /** All fields the user is interested in */
  selectedFields: PlatformField[];
  /** Switch the active field */
  setActiveField: (field: PlatformField) => void;
  /** Toggle a field in/out of the user's interest list */
  toggleField: (field: PlatformField) => void;
  /** Set all selected fields at once (e.g. from onboarding) */
  setSelectedFields: (fields: PlatformField[]) => void;
  /** Human-readable label for the active field */
  activeFieldLabel: string;
  /** Icon for the active field */
  activeFieldIcon: string;
  /** Get label for any field */
  getFieldLabel: (field: PlatformField) => string;
  /** Get icon for any field */
  getFieldIcon: (field: PlatformField) => string;
}

const FieldContext = createContext<FieldContextType | undefined>(undefined);

const STORAGE_KEY = "dentispark_active_field";
const FIELDS_STORAGE_KEY = "dentispark_selected_fields";

function mapOnboardingToField(key: string): PlatformField | null {
  const mapping: Record<string, PlatformField> = {
    dental: "DENTAL",
    "medicine-md": "MEDICINE_MD",
    "medicine-do": "MEDICINE_DO",
    nursing: "NURSING",
    pa: "PHYSICIAN_ASSISTANT",
    pharmacy: "PHARMACY",
    vet: "VETERINARY",
  };
  return mapping[key] ?? null;
}

export function FieldProvider({ children }: { children: ReactNode }) {
  const [activeField, setActiveFieldState] = useState<PlatformField>(DEFAULT_FIELD);
  const [selectedFields, setSelectedFieldsState] = useState<PlatformField[]>([DEFAULT_FIELD]);

  // Hydrate from localStorage + onboarding answers on mount
  useEffect(() => {
    // Check for onboarding answers first
    try {
      const onboardingRaw = sessionStorage.getItem("onboarding_answers");
      if (onboardingRaw) {
        const answers = JSON.parse(onboardingRaw);
        // Step 2 contains field selections
        const fieldKeys: string[] = answers["2"] ?? [];
        const mapped = fieldKeys
          .map(mapOnboardingToField)
          .filter((f): f is PlatformField => f !== null);

        if (mapped.length > 0) {
          setSelectedFieldsState(mapped);
          setActiveFieldState(mapped[0]);
          localStorage.setItem(STORAGE_KEY, mapped[0]);
          localStorage.setItem(FIELDS_STORAGE_KEY, JSON.stringify(mapped));
          // Clear onboarding answers after consuming
          sessionStorage.removeItem("onboarding_answers");
          return;
        }
      }
    } catch {
      // Ignore parse errors
    }

    // Fall back to localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && PLATFORM_FIELDS.some((f) => f.value === stored)) {
      setActiveFieldState(stored as PlatformField);
    }

    const storedFields = localStorage.getItem(FIELDS_STORAGE_KEY);
    if (storedFields) {
      try {
        const parsed = JSON.parse(storedFields) as PlatformField[];
        if (parsed.length > 0) {
          setSelectedFieldsState(parsed);
        }
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  const setActiveField = (field: PlatformField) => {
    setActiveFieldState(field);
    localStorage.setItem(STORAGE_KEY, field);
  };

  const toggleField = (field: PlatformField) => {
    setSelectedFieldsState((prev) => {
      const next = prev.includes(field)
        ? prev.filter((f) => f !== field)
        : [...prev, field];
      // Ensure at least one field is selected
      const result = next.length > 0 ? next : [DEFAULT_FIELD];
      localStorage.setItem(FIELDS_STORAGE_KEY, JSON.stringify(result));
      return result;
    });
  };

  const setSelectedFields = (fields: PlatformField[]) => {
    const result = fields.length > 0 ? fields : [DEFAULT_FIELD];
    setSelectedFieldsState(result);
    localStorage.setItem(FIELDS_STORAGE_KEY, JSON.stringify(result));
  };

  const getFieldLabel = (field: PlatformField) =>
    PLATFORM_FIELDS.find((f) => f.value === field)?.label ?? field;

  const getFieldIcon = (field: PlatformField) =>
    PLATFORM_FIELDS.find((f) => f.value === field)?.icon ?? "🎓";

  const activeFieldLabel = getFieldLabel(activeField);
  const activeFieldIcon = getFieldIcon(activeField);

  return (
    <FieldContext.Provider
      value={{
        activeField,
        selectedFields,
        setActiveField,
        toggleField,
        setSelectedFields,
        activeFieldLabel,
        activeFieldIcon,
        getFieldLabel,
        getFieldIcon,
      }}
    >
      {children}
    </FieldContext.Provider>
  );
}

export function useField() {
  const context = useContext(FieldContext);
  if (!context) {
    throw new Error("useField must be used within a FieldProvider");
  }
  return context;
}
