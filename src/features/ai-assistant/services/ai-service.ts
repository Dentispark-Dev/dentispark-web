export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIResponse {
  content: string;
  category?: string;
}

class AIService {
  async sendMessage(messages: AIMessage[]): Promise<AIResponse> {
    try {
      const response = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response from AI Assistant");
      }

      const data = await response.json();
      return { content: data.content, category: "general" };
    } catch (error) {
      console.error("AIService Error:", error);
      return { 
        content: "I'm currently experiencing some interference. Please try asking your question again in a moment.", 
        category: "error" 
      };
    }
  }
}

export const aiService = new AIService();
