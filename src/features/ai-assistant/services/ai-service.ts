export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIResponse {
  content: string;
  category?: string;
}

class AIService {
  private systemPrompt = `You are Denti-Buddy, a premium AI admissions assistant for DentiSpark. 
  Your goal is to help students get into dental school with expert, encouraging, and highly specific advice.
  Focus on:
  - UCAT/MMI strategies
  - Personal statements for Dentistry
  - UK Dental school requirements (Oxford, King's, QMUL, etc.)
  - Clinical knowledge and ethical scenarios
  Be professional, concise, and use a friendly "mentor" tone.`;

  private mockResponses: Record<string, string> = {
    "mmi": "MMI (Multiple Mini Interviews) are all about consistency. The three pillars are: 1. Ethical scenarios (autonomy, non-maleficence), 2. Clinical knowledge (current NHS issues), and 3. Personal motivation. Focus on structure using the STARR technique!",
    "ucat": "The UCAT is a test of speed and strategy. For Abstract Reasoning, look for simple patterns first (number of sides, symmetry). For Verbal Reasoning, trust the text only—never use outside knowledge!",
    "personal statement": "Your personal statement should be 80% reflection and 20% description. Don't just list work experience; explain what you *learned* about the manual dexterity and emotional resilience required by dentists.",
    "default": "That's a great question! Preparation is the key to success in dental admissions. What specific area of the application are you most focused on right now: UCAT, MMI, or your Personal Statement?"
  };

  async sendMessage(messages: AIMessage[]): Promise<AIResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content.toLowerCase() || "";
    
    let content = this.mockResponses.default;
    let category = "general";

    if (lastUserMessage.includes("mmi") || lastUserMessage.includes("interview")) {
      content = this.mockResponses.mmi;
      category = "mmi";
    } else if (lastUserMessage.includes("ucat") || lastUserMessage.includes("aptitude")) {
      content = this.mockResponses.ucat;
      category = "ucat";
    } else if (lastUserMessage.includes("statement") || lastUserMessage.includes("ps")) {
      content = this.mockResponses["personal statement"];
      category = "ps";
    }

    return { content, category };
  }
}

export const aiService = new AIService();
