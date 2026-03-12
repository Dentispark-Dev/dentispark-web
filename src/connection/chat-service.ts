import { apiClient as api } from "./api-client";
import { 
  ApiResponse, 
  Conversation, 
  ConversationParticipant, 
  ChatMessage, 
  PaginatedResponse, 
  UpsertPeerConversationRequest, 
  CreateGroupConversationRequest 
} from "./api-types";

export const chatService = {
  getUserConversations: (emailAddress: string) => {
    return api.get<ApiResponse<ConversationParticipant[]>>(`/chats/user/conversations?emailAddress=${encodeURIComponent(emailAddress)}`);
  },

  getConversationMessages: (conversationId: string, page = 0, size = 20) => {
    return api.get<ApiResponse<PaginatedResponse<ChatMessage>>>(`/chats/conversations/messages/${conversationId}?pageNumber=${page}&pageSize=${size}`);
  },

  upsertPeerConversation: (payload: UpsertPeerConversationRequest) => {
    return api.post<ApiResponse<Conversation>>("/chats/peer/upsert", payload);
  },

  createGroupConversation: (payload: CreateGroupConversationRequest) => {
    return api.post<ApiResponse<Conversation>>("/chats/group", payload);
  },

  // Admin monitoring endpoint (assumed path based on patterns)
  getAllConversations: (page = 0, size = 20) => {
    return api.get<ApiResponse<PaginatedResponse<Conversation>>>("/chats/admin/all?pageNumber=" + page + "&pageSize=" + size);
  }
};
