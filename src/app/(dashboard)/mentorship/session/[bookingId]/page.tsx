import { notFound, redirect } from "next/navigation";
import prisma from "@/src/lib/db";
import { DailySessionRoom } from "./components/daily-session-room";

interface SessionPageProps {
  params: Promise<{
    bookingId: string;
  }>;
}

export default async function SessionPage({ params }: SessionPageProps) {
  const { bookingId } = await params;

  // Ideally, we'd check against the authenticated session user
  // (const session = await getServerSession(authOptions))
  // For the MVP context, we will fetch the booking to ensure it exists and has a link
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      student: true,
      mentor: true,
    },
  });

  if (!booking) {
    return notFound();
  }

  if (!booking.meetingLink) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-900 font-jakarta">Meeting Room Pending</h2>
          <p className="mt-2 text-gray-500 font-jakarta">The secure room link has not been generated for this session yet. If payment was just completed, please wait a moment and refresh.</p>
        </div>
      </div>
    );
  }

  if (booking.status === "COMPLETED") {
    return (
        <div className="flex bg-white h-[calc(100vh-80px)] items-center justify-center p-6 border-t border-gray-100">
          <div className="max-w-md text-center space-y-4">
            <div className="p-4 bg-primary-50 rounded-full w-fit mx-auto text-primary-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 font-jakarta">Session Concluded</h2>
            <p className="mt-2 text-gray-500 font-jakarta text-sm">This mentorship session has formally ended. Thank you for using DentiSpark.</p>
          </div>
        </div>
      );
  }

  return (
    <div className="flex flex-col h-[calc(100vh)] bg-black overflow-hidden relative">
      <DailySessionRoom meetingLink={booking.meetingLink} bookingId={booking.id} />
    </div>
  );
}
