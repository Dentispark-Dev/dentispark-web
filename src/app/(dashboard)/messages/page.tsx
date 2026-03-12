"use client";

import React from "react";
import { MentorSidebar } from "@/src/features/chat/components/mentor-sidebar";
import { ChatWindow } from "@/src/features/chat/components/chat-window";

export default function MessagesPage() {
  return (
    <div className="fixed inset-x-0 bottom-0 top-18 lg:left-[300px] bg-white flex overflow-hidden">
      <div className="w-[350px] flex-shrink-0 hidden xl:block">
        <MentorSidebar />
      </div>
      <ChatWindow />
    </div>
  );
}
