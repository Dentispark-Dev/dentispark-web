import { UniversityEditView } from "@/src/features/(dashboard)/admin/components";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function UniversityEditPage({ params }: PageProps) {
    const { id } = await params;
    return (
        <div className="space-y-6">
            <UniversityEditView universityId={id} />
        </div>
    );
}
