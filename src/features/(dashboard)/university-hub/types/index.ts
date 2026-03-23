export interface University {
  id: string;
  name: string;
  location: string;
  fullAddress: string;
  image: string;
  admissionStatus: "open" | "closed";
  slug: string;
  // Comparison Metrics
  entryRequirements?: string;
  studentSatisfaction?: number; // percentage
  graduateProspects?: number; // percentage
  ucasPoints?: number;
  courseDuration?: string;
}

export interface UniversityCardProps {
  university: University;
  onViewProfile: (university: University) => void;
  isSelected?: boolean;
  onToggleSelection?: (id: string) => void;
}

export interface CompareSchoolsProps {
  selectedCount?: number;
  onCompare?: () => void;
}
