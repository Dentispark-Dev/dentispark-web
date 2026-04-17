"use client";

import { use } from "react";
import { CourseEditView } from "@/src/features/(dashboard)/admin/components/course-edit-view";

interface CoursePageProps {
    params: Promise<{ id: string }>;
}

export default function AdminCourseDetailPage({ params }: CoursePageProps) {
    const { id } = use(params);
    
    return <CourseEditView courseId={id} />;
}
