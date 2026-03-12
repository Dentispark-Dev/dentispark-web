import { StudentProfileClientWrapper } from "./client-page";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function StudentDetailPage({ params }: PageProps) {
    const { id } = await params;
    return <StudentProfileClientWrapper id={id} />;
}
