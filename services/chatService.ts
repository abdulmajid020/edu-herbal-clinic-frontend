import { apiRequest } from "./apiClient";

export interface ChatMessage {
  id?: number;
  phone: string;
  patientName?: string | null;
  role: "user" | "bot";
  sender: "patient" | "edubot" | "staff";
  text: string;
  handoverRequested?: boolean;
  handoverHandled?: boolean;
  handoverClosed?: boolean;
  createdAt: string;
}

export interface AdminChatConversation {
  key: string;
  name: string;
  phone: string;
  messages: ChatMessage[];
  handoverActive: boolean;
  handoverPending: boolean;
  latestMessage: string;
}

export class ChatService {
  public static async authenticate(name: string, phone: string): Promise<{
    success: boolean;
    phone: string;
    patientName: string;
    messages: ChatMessage[];
  }> {
    return apiRequest("/chat/auth", {
      method: "POST",
      body: JSON.stringify({ name, phone }),
    });
  }

  public static async getMessages(phone: string): Promise<{ success: boolean; count: number; data: ChatMessage[] }> {
    return apiRequest(`/chat/messages?phone=${encodeURIComponent(phone)}`);
  }

  public static async sendMessage(params: {
    phone: string;
    patientName: string;
    text: string;
  }): Promise<{
    success: boolean;
    userMessage: ChatMessage;
    botMessage: ChatMessage;
    handoverTriggered: boolean;
    reply: string;
  }> {
    return apiRequest("/chat/send", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  public static async getAdminConversations(): Promise<{ success: boolean; conversations: AdminChatConversation[] }> {
    return apiRequest("/chat/admin/conversations");
  }

  public static async adminReply(params: {
    phone: string;
    patientName: string;
    text: string;
  }): Promise<{ success: boolean; data: ChatMessage; message: string }> {
    return apiRequest("/chat/admin/reply", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  public static async closeHandover(phone: string): Promise<{ success: boolean; message: string }> {
    return apiRequest("/chat/admin/handover/close", {
      method: "PUT",
      body: JSON.stringify({ phone }),
    });
  }

  public static async deleteConversation(phone: string): Promise<{ success: boolean; message: string }> {
    return apiRequest(`/chat/admin/conversation/${encodeURIComponent(phone)}`, {
      method: "DELETE",
    });
  }
}
