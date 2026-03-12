import { useState } from "react";
import { ConversationParticipant } from "@/src/connection/api-types";
import { chatService } from "@/src/connection/chat-service";
import { ConversationList } from "./ConversationList";
import { ChatWindow } from "./ChatWindow";
import { useQuery } from "@tanstack/react-query";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface MessagingDashboardProps {
  currentUserEmail: string;
}

export function MessagingDashboard({ currentUserEmail }: MessagingDashboardProps) {
  const [selectedConversation, setSelectedConversation] = useState<ConversationParticipant | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["conversations", currentUserEmail],
    queryFn: () => chatService.getUserConversations(currentUserEmail),
    enabled: !!currentUserEmail
  });

  if (error) {
    toast.error("Failed to load conversations");
  }

  const conversations = data?.responseData || [];

  return (
    <div className="flex h-[calc(100vh-120px)] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Sidebar - Conversation List */}
      <div className="w-full md:w-80 border-r border-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary-600" />
            Messages
          </h3>
        </div>
        <div className="flex-1 overflow-hidden">
          <ConversationList
            conversations={conversations}
            selectedId={selectedConversation?.conversationId}
            onSelect={setSelectedConversation}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="hidden md:flex flex-1 flex-col">
        {selectedConversation ? (
          <ChatWindow 
            selectedConversation={selectedConversation} 
            currentUserEmail={currentUserEmail}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50/30">
            <div className="h-16 w-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4">
              <MessageSquare className="h-8 w-8 opacity-20" />
            </div>
            <h4 className="text-lg font-medium mb-1">Select a conversation</h4>
            <p className="text-sm">Choose a chat from the left to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}
