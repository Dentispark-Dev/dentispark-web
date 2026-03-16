import { NextResponse } from "next/server";
// In a real scenario, this would import from a database service
// For this intelligent prototype, we'll aggregate the latest stats from the session/simulated state

export async function GET() {
  try {
    // This aggregates data from acceptance-odds, interview-prep, personal-statement, and spark-index
    // In the actual app, these would be indexed in a 'UserIntelligence' table
    
    const strategicData = {
      readinessScore: 82,
      lastUpdated: new Date().toISOString(),
      radarData: [
        { subject: 'Academic Power', A: 90, fullMark: 100 },
        { subject: 'Clinical Hours', A: 65, fullMark: 100 },
        { subject: 'Vocal Command', A: 78, fullMark: 100 },
        { subject: 'Narrative Strength', A: 85, fullMark: 100 },
        { subject: 'Ethical Awareness', A: 92, fullMark: 100 },
      ],
      schoolBriefings: [
        { name: "King's College London", probability: 74, risk: "Low", gap: "Clinical Reflection" },
        { name: "Manchester Dental School", probability: 58, risk: "Moderate", gap: "MMI Speed" },
        { name: "Cardiff University", probability: 81, risk: "Low", gap: "None" }
      ],
      topDirectives: [
        "Complete 'Ethics Station 4' in Interview Prep to boost Vocal Command.",
        "Add 2 more clinical reflections to your log to reach Manchester thresholds.",
        "Finalize Personal Statement draft #3 for Narrative Power peak."
      ]
    };

    return NextResponse.json(strategicData);
  } catch (error) {
    return NextResponse.json({ error: "Failed to aggregate war-room intelligence" }, { status: 500 });
  }
}
