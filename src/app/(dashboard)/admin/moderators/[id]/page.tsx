import { AdminProfileView } from "@/src/features/(dashboard)/admin/components";

export default function ModeratorDetailPage({ params }: { params: { id: string } }) {
    return (
        <AdminProfileView adminEmail={params.id} />
    );
}
