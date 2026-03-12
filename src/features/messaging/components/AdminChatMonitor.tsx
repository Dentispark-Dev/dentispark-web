import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { chatService } from "@/src/connection/chat-service";
import { Conversation, ConversationParticipant } from "@/src/connection/api-types";
import { 
  Search, 
  ShieldAlert, 
  Loader2, 
  MessageSquare,
  Eye
} from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { format } from "date-fns";
import { ChatWindow } from "./ChatWindow";

export function AdminChatMonitor() {
  const [searchKey, setSearchKey] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<ConversationParticipant | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-all-conversations"],
    queryFn: () => chatService.getAllConversations(),
  });

  const allConversations = data?.responseData?.content || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-red-500" />
            Chat Monitoring
          </h2>
          <p className="text-sm text-gray-500">Supervise and monitor all active conversations across the platform</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
        {/* Conversation Explorer */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/30">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                className="pl-10 bg-white"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
              </div>
            ) : allConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-400">
                <MessageSquare className="h-12 w-12 mb-4 opacity-10" />
                <p>No conversations found</p>
              </div>
            ) : (
              allConversations.map((conv: any) => (
                <button
                  key={conv.id}
                  onClick={() => {
                    // Mocking a participant object for the ChatWindow
                    setSelectedConversation({
                      id: `monitor-${conv.id}`,
                      conversationId: conv.id,
                      participantEmail: "admin@monitor.dev",
                      participantName: conv.title || "Group Chat",
                      participantType: "MONITOR",
                      unreadCount: 0,
                      conversation: conv
                    });
                  }}
                  className={`w-full p-4 border-b border-gray-50 text-left transition-colors flex items-center justify-between group ${
                    selectedConversation?.conversationId === conv.id ? "bg-red-50" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-semibold truncate text-gray-900 capitalize">
                      {conv.type} - {conv.id.substring(0, 8)}
                    </h4>
                    <p className="text-xs text-gray-500 truncate mt-1">
                      Started: {format(new Date(conv.createdAt), "dd MMM yyyy")}
                    </p>
                  </div>
                  <Eye className="h-4 w-4 text-gray-400 group-hover:text-red-500" />
                </button>
              ))
            )}
          </div>
        </div>

        {/* Live View */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden relative">
          {selectedConversation ? (
            <div className="h-full flex flex-col">
              <div className="absolute top-0 right-0 p-4 z-10">
                <Badge className="bg-red-100 text-red-600 border-none">
                  Monitoring Live
                </Badge>
              </div>
              <ChatWindow 
                selectedConversation={selectedConversation} 
                currentUserEmail="admin-monitor@dentispark.com"
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <ShieldAlert className="h-16 w-16 mb-4 opacity-5 text-red-500" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Conversation to Monitor</h3>
              <p className="max-w-xs text-center text-sm">
                Admins can view and monitor messages for security and quality purposes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
