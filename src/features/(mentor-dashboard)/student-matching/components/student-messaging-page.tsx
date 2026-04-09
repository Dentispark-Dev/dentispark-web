"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@/src/components/ui/breadcrumb";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { useModalStore } from "@/src/store/modal-store";
import { ChatMessage, Message } from "./chat-message";
import { ChatDateSeparator } from "./chat-date-separator";
import { ChatInput } from "./chat-input";
import { RatingReviewModal } from "./rating-review-modal";

interface StudentMessagingPageProps {
  className?: string;
  studentId?: string;
}

// Student data state - transitioning to real-time socket/API data

const INITIAL_MESSAGES: Message[] = [];

export function StudentMessagingPage({
  className,
  studentId = "1",
}: StudentMessagingPageProps) {
  const router = useRouter();
  const { openModal, closeModal } = useModalStore();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);

  const breadcrumbItems = [
    { label: "Student matching", href: "/mentor/student-matching" },
    {
      label: "Student's profile",
      href: `/mentor/student-matching/${studentId}`,
    },
    { label: "Messaging", isActive: true },
  ];

  const handleViewProfile = () => {
    router.push(`/mentor/student-matching/${studentId}`);
  };

  const handleRateStudent = () => {
    openModal({
      modalTitle: "Rating and Review",
      modalTitleClassName: "font-jakarta text-center",
      bodyContent: (
        <RatingReviewModal
          studentName="Student"
          onSubmit={(rating, review) => {
            toast.success("Protocol Protocol Verified", { description: `Advisory review for student ${studentId} has been logged.` });
            closeModal();
          }}
          onCancel={closeModal}
        />
      ),
      action: () => {
        // This won't be called since we're using custom content
      },
      actionTitle: "Submit",
      type: "rate-student",
      size: "md",
      isCustomContent: true,
    });
  };

  const handleSendMessage = (content: string, files?: File[]) => {
    // Send text message
    if (content.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        content,
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        isSent: true,
        type: "text",
        isRead: false,
      };
      setMessages([...messages, newMessage]);
    }

    // Send file messages
    if (files && files.length > 0) {
      const fileMessages: Message[] = files.map((file, index) => ({
        id: `${Date.now()}-${index}`,
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        isSent: true,
        type: "file",
        fileData: {
          name: file.name,
          size: formatFileSize(file.size),
          type: file.type.split("/")[1] || "file",
        },
        isRead: false,
      }));
      setMessages([...messages, ...fileMessages]);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAttachFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("min-h-screen bg-white py-6", className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-12"
      >
        <Breadcrumb items={breadcrumbItems} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="border-greys-300 flex items-center justify-between border-b pb-2"
        >
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-slate-100 shadow-sm bg-slate-50">
              {studentId && (
                <div className="w-full h-full flex items-center justify-center font-extrabold text-slate-400">
                  {studentId.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Protocol Session
              </h1>
              <div className="caption-caps bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-2">
                <div className="bg-emerald-500 h-1.5 w-1.5 rounded-full animate-pulse"></div>
                Secure Channel
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleRateStudent}
              variant="outline"
              className="font-jakarta border-greys-300 text-greys-1000 hover:text-greys-1000 h-10 rounded-lg hover:bg-white"
            >
              Rate student
            </Button>
            <Button
              onClick={handleViewProfile}
              className="bg-primary hover:bg-primary/90 font-jakarta h-10 rounded-lg text-white"
            >
              View profile
            </Button>
          </div>
        </motion.div>

        <div className="flex flex-1 flex-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-greys-50 flex-1 overflow-y-auto p-6"
          >
            <div className="mx-auto max-w-4xl space-y-4">
              <ChatDateSeparator date="19 August" />

              <ChatMessage message={messages[0]} />
              <ChatMessage message={messages[1]} />
              <ChatMessage message={messages[2]} />

              <ChatDateSeparator date="Today 12:12 AM" />

              <ChatMessage message={messages[3]} />
              <ChatMessage message={messages[4]} />
              <ChatMessage message={messages[5]} />
            </div>
          </motion.div>

          <ChatInput
            onSendMessage={handleSendMessage}
            onAttachFile={handleAttachFile}
          />
        </div>
      </motion.div>
    </div>
  );
}
