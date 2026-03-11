import { Suspense } from "react";
import { MentorProfileClientWrapper } from "./client-page";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function MentorDetailPage({ params }: PageProps) {
    const { id } = await params;
    return <MentorProfileClientWrapper id={id} />;
}
