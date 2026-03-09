import { StudentProfileView } from "@/src/features/(dashboard)/admin/components";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function StudentDetailPage({ params }: PageProps) {
    const { id } = await params;
    return (
        <div className="space-y-6">
            <StudentProfileView studentId={id} />
        </div>
    );
}
