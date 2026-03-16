/**
 * Represents the various healthcare fields supported by the DentiSpark platform.
 * Mirrors the backend PlatformField enum.
 */
export type PlatformField = 
  | "DENTAL"
  | "MEDICINE_MD"
  | "MEDICINE_DO"
  | "NURSING"
  | "PHYSICIAN_ASSISTANT"
  | "PHARMACY"
  | "VETERINARY";

export const PLATFORM_FIELDS: { value: PlatformField; label: string; icon: string }[] = [
  { value: "DENTAL", label: "Dental", icon: "🦷" },
  { value: "MEDICINE_MD", label: "Medicine (MD)", icon: "🩺" },
  { value: "MEDICINE_DO", label: "Medicine (DO)", icon: "🩺" },
  { value: "NURSING", label: "Nursing", icon: "🏥" },
  { value: "PHYSICIAN_ASSISTANT", label: "Physician Assistant", icon: "💊" },
  { value: "PHARMACY", label: "Pharmacy", icon: "⚗️" },
  { value: "VETERINARY", label: "Veterinary", icon: "🐾" },
];

export const DEFAULT_FIELD: PlatformField = "DENTAL";
