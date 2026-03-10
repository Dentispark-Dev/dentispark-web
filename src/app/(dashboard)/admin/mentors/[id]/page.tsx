import { MentorProfileView } from "@/src/features/(dashboard)/admin/components";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function MentorDetailPage({ params }: PageProps) {
    const { id } = await params;
    return (
        <div className="space-y-6">
            <MentorProfileView mentorId={id} />
        </div>
    );
}
