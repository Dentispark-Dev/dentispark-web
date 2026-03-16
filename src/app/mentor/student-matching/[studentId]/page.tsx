"use client";

import { StudentAIProfile } from "@/src/features/(mentor-dashboard)/student-matching/components/student-ai-profile";
import { useParams } from "next/navigation";

export default function StudentDetailRoute() {
    const params = useParams();
    const studentId = params.studentId as string;
    
    return <StudentAIProfile studentId={studentId} />;
}
