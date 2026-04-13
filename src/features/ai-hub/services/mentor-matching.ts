import { PersonalizedMentor } from "@/src/features/(dashboard)/overview/services/overview.api";

export interface StudentMatchPreferences {
  specializationWeight: number; // 0-1
  availabilityWeight: number;   // 0-1
  ratingWeight: number;         // 0-1
  preferredSpecialties: string[];
}

/**
 * Weighted Matching Algorithm for DentiSpark AI Hub
 * Ranks mentors based on student academic goals and mentor expertise.
 */
export function rankMentors(
  mentors: PersonalizedMentor[],
  prefs: StudentMatchPreferences
): (PersonalizedMentor & { matchScore: number; matchReason: string })[] {
  return mentors
    .map((mentor) => {
      let score = 0;
      let reasons: string[] = [];

      // 1. Specialty Match (High Weight)
      const specialtyMatch = prefs.preferredSpecialties.some(s => 
        mentor.title.toLowerCase().includes(s.toLowerCase()) || 
        mentor.description.toLowerCase().includes(s.toLowerCase())
      );
      
      if (specialtyMatch) {
        score += 40 * prefs.specializationWeight;
        reasons.push("Expertise Alignment");
      }

      // 2. Rating Performance (Medium Weight)
      const ratingScore = (mentor.rating / 5) * 30;
      score += ratingScore * prefs.ratingWeight;
      if (mentor.rating >= 4.8) reasons.push("Top Rated Performance");

      // 3. Experience Impact (Base Weight)
      if (mentor.reviewCount > 50) {
        score += 20;
        reasons.push("High Mentorship Volume");
      }

      // 4. Random refinement for unique sorting
      score += Math.random() * 5;

      return {
        ...mentor,
        matchScore: Math.min(100, Math.round(score)),
        matchReason: reasons.slice(0, 2).join(" • ") || "General Academic Fit"
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}
