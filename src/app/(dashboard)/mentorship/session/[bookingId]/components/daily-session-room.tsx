"use client";

import { useEffect, useRef, useState } from "react";
import DailyIframe, { DailyCall } from "@daily-co/daily-js";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface DailySessionRoomProps {
  meetingLink: string;
  bookingId: string;
}

export function DailySessionRoom({ meetingLink, bookingId }: DailySessionRoomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [callObject, setCallObject] = useState<DailyCall | null>(null);
  const [status, setStatus] = useState<"loading" | "active" | "left" | "error">("loading");

  useEffect(() => {
    if (!containerRef.current) return;

    // Destroy existing instance to prevent duplicates
    if (callObject) {
      callObject.destroy();
    }

    // Initialize DailyIframe
    const callFrame = DailyIframe.createFrame(containerRef.current, {
      iframeStyle: {
        width: "100%",
        height: "100%",
        border: "none",
        backgroundColor: "#000",
      },
      showLeaveButton: true,
      showFullscreenButton: true,
    });

    const handleLeft = () => setStatus("left");
    const handleError = (e: any) => {
      console.error("Daily Client Error:", e);
      setStatus("error");
    };
    const handleJoined = () => setStatus("active");

    callFrame
      .on("left-meeting", handleLeft)
      .on("error", handleError)
      .on("joined-meeting", handleJoined);

    setCallObject(callFrame);

    callFrame.join({ url: meetingLink });

    return () => {
      callFrame.off("left-meeting", handleLeft);
      callFrame.off("error", handleError);
      callFrame.off("joined-meeting", handleJoined);
      callFrame.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingLink]);

  return (
    <div className="flex flex-col h-full w-full bg-black relative">
      <div className="absolute top-4 left-4 z-50 flex items-center gap-4">
        <Button 
            variant="ghost" 
            onClick={() => {
                if (callObject) callObject.leave();
                router.back();
            }}
            className="text-white hover:bg-white/10 rounded-full h-10 w-10 p-0 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        {status === "active" && (
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-white text-xs font-bold font-jakarta tracking-widest uppercase">Safe Room Connection</span>
            </div>
        )}
      </div>

      {status === "loading" && (
        <div className="absolute inset-0 z-40 bg-black flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 text-white animate-spin" />
          <p className="text-white font-jakarta text-sm uppercase tracking-widest font-bold">Establishing WebRTC Protocol...</p>
        </div>
      )}

      {status === "left" && (
        <div className="absolute inset-0 z-40 bg-gray-50 flex flex-col items-center justify-center gap-4 p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 font-jakarta">You've left the session</h2>
            <p className="text-gray-500 font-jakarta max-w-sm">Thank you for participating! The session logs and recordings (if applicable) are being finalized.</p>
            <Button onClick={() => router.push("/mentorship")} className="mt-4 bg-primary-600 hover:bg-primary-700 text-white font-bold tracking-widest uppercase rounded-xl">
                Return to Directory
            </Button>
        </div>
      )}

      {status === "error" && (
        <div className="absolute inset-0 z-40 bg-rose-50 flex flex-col items-center justify-center gap-4 p-6 text-center">
            <h2 className="text-2xl font-bold text-rose-900 font-jakarta">Connection Dropped</h2>
            <p className="text-rose-600 font-jakarta max-w-sm">We couldn't connect securely to the video server. This may be due to a strict corporate firewall or a dropped socket.</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="mt-4 border-rose-200 text-rose-700 hover:bg-rose-100 font-bold tracking-widest uppercase rounded-xl">
                Re-initialize
            </Button>
        </div>
      )}

      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
