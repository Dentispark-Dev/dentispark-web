import { ConversationParticipant } from "@/src/connection/api-types";
import { cn } from "@/src/lib/utils";
import { format } from "date-fns";
import { User } from "lucide-react";

interface ConversationListProps {
  conversations: ConversationParticipant[];
  selectedId?: string;
  onSelect: (conversation: ConversationParticipant) => void;
  isLoading: boolean;
}

export function ConversationList({ 
  conversations, 
  selectedId, 
  onSelect, 
  isLoading 
}: ConversationListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 w-full animate-pulse bg-gray-100 rounded-xl" />
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400 p-8 text-center">
        <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center mb-4">
          <User className="h-6 w-6" />
        </div>
        <p className="text-sm">No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-y-auto h-full">
      {conversations.map((participant) => {
        const isSelected = selectedId === participant.conversationId;
        const lastMessageAt = participant.conversation.lastMessageAt;
        
        return (
          <button
            key={participant.id}
            onClick={() => onSelect(participant)}
            className={cn(
              "flex items-center gap-3 p-4 border-b border-gray-50 transition-colors text-left w-full",
              isSelected ? "bg-primary-50" : "hover:bg-gray-50"
            )}
          >
            <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold flex-shrink-0 text-sm">
              {participant.participantName.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-sm font-semibold text-gray-900 truncate">
                  {participant.participantName}
                </h4>
                {lastMessageAt && (
                  <span className="text-[10px] text-gray-400">
                    {format(new Date(lastMessageAt), "HH:mm")}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 truncate">
                {participant.conversation.lastMessage || "No messages yet"}
              </p>
            </div>
            {participant.unreadCount > 0 && (
              <div className="h-5 w-5 rounded-full bg-primary-600 text-white text-[10px] flex items-center justify-center font-bold">
                {participant.unreadCount}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
