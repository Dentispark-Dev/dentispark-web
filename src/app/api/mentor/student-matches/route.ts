import { NextResponse } from "next/server";
import prisma from "@/src/lib/db";

export async function GET(req: Request) {
  try {
    // In a real app, we would get the mentorId from the session/token.
    // For this prototype, we'll fetch the first available student or a mocked representation
    // of a student matched to a holding mentor pattern to resolve the UI lock.
    
    const students = await prisma.user.findMany({
      where: { role: "STUDENT" },
      take: 1,
      orderBy: { createdAt: "desc" }
    });

    if (students.length === 0) {
      // Fallback if DB is empty
      return NextResponse.json({
        students: [
          {
            id: "mock-1",
            name: "Daniel Sarabia",
            year: "Year 12",
            avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=256&h=256",
            preferredSchool: "Bristol University",
            ucatScore: "2640",
            aLevelScore: "AAA",
            booking: {
              title: "UCAT Student",
              date: "Wed, 12th July, 2026 | 5pm",
            },
            goals: "As a Year 12 student aspiring to study Dental Science at the University of Bristol, my goal is to excel academically while gaining practical experience in the field of dentistry. I aim to achieve top grades in my A-levels, particularly in Biology and Chemistry, to meet the university's entry requirements. Additionally, I plan to engage in relevant extracurricular activities, such as volunteering at local dental clinics and participating in workshops, to enhance my understanding of oral health and patient care.",
            whyDentistry: "I aspire to study dentistry because I am deeply passionate about improving people's lives through oral health. The ability to alleviate pain, restore smiles, and enhance confidence in others is incredibly fulfilling. I am drawn to the intricate blend of science and artistry that dentistry offers.",
          }
        ]
      });
    }

    const student = students[0];

    return NextResponse.json({
      students: [
        {
          id: student.id,
          name: student.name || "Student",
          year: "Year 12",
          avatar: student.image || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=256&h=256",
          preferredSchool: "King's College London",
          ucatScore: "2750",
          aLevelScore: "A*AA",
          booking: {
            title: "Interview Prep",
            date: "Pending Schedule",
          },
          goals: "Looking to perfect interview technique and discuss recent dental news.",
          whyDentistry: "Fascinated by the intersection of healthcare and manual dexterity.",
        }
      ]
    });

  } catch (error) {
    console.error("Fetch Student Matches Error:", error);
    return NextResponse.json({ error: "Failed to fetch student matches." }, { status: 500 });
  }
}
