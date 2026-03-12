"use client";

import { MessagingDashboard } from "@/src/features/messaging/components/MessagingDashboard";
import { useAuth } from "@/src/providers/auth-provider";
import { Loader2 } from "lucide-react";

export default function MessagesPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Conversations</h1>
        <p className="text-sm text-gray-500 text-muted-foreground">
          Chat with your mentors and mentees
        </p>
      </div>

      <MessagingDashboard currentUserEmail={user.emailAddress} />
    </div>
  );
}
