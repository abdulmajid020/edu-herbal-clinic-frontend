import { useState, useEffect, useCallback } from "react";
import { ChatService, ChatMessage, AdminChatConversation } from "../services/chatService";

export function useChat(patientDetails?: { name: string; phone: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [adminConversations, setAdminConversations] = useState<AdminChatConversation[]>([]);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>(patientDetails?.phone || "");
  const [patientName, setPatientName] = useState<string>(patientDetails?.name || "");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [handoverActive, setHandoverActive] = useState<boolean>(false);

  const authenticate = async (name: string, phoneNumber: string) => {
    try {
      setIsLoading(true);
      const res = await ChatService.authenticate(name, phoneNumber);
      if (res.success) {
        setIsVerified(true);
        setPhone(res.phone);
        setPatientName(res.patientName);
        setMessages(res.messages || []);
      }
      return res;
    } catch (err: any) {
      console.error("Chat authentication error", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = useCallback(async () => {
    if (!phone) return;
    try {
      const res = await ChatService.getMessages(phone);
      if (res.success) {
        setMessages(res.data);
      }
    } catch (err) {
      console.error("Failed to load chat messages", err);
    }
  }, [phone]);

  const fetchAdminConversations = useCallback(async () => {
    try {
      const res = await ChatService.getAdminConversations();
      if (res.success) {
        setAdminConversations(res.conversations);
      }
    } catch (err) {
      console.error("Failed to load admin chat conversations", err);
    }
  }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim() || !phone) return;
    try {
      setIsSending(true);
      const res = await ChatService.sendMessage({
        phone,
        patientName,
        text,
      });

      if (res.success) {
        setMessages((prev) => [...prev, res.userMessage, res.botMessage]);
        if (res.handoverTriggered) {
          setHandoverActive(true);
        }
      }
      return res;
    } catch (err) {
      console.error("Failed to send message", err);
      throw err;
    } finally {
      setIsSending(false);
    }
  };

  const adminReply = async (targetPhone: string, targetName: string, replyText: string) => {
    try {
      const res = await ChatService.adminReply({
        phone: targetPhone,
        patientName: targetName,
        text: replyText,
      });
      if (res.success) {
        await fetchAdminConversations();
      }
      return res;
    } catch (err) {
      console.error("Failed to send admin reply", err);
      throw err;
    }
  };

  const closeHandover = async (targetPhone: string) => {
    try {
      const res = await ChatService.closeHandover(targetPhone);
      if (res.success) {
        await fetchAdminConversations();
      }
      return res;
    } catch (err) {
      console.error("Failed to close handover", err);
      throw err;
    }
  };

  const deleteConversation = async (targetPhone: string) => {
    try {
      const res = await ChatService.deleteConversation(targetPhone);
      if (res.success) {
        await fetchAdminConversations();
      }
      return res;
    } catch (err) {
      console.error("Failed to delete conversation", err);
      throw err;
    }
  };

  useEffect(() => {
    if (phone) {
      fetchMessages();
    }
  }, [phone, fetchMessages]);

  return {
    messages,
    adminConversations,
    isVerified,
    phone,
    patientName,
    isLoading,
    isSending,
    handoverActive,
    authenticate,
    sendMessage,
    adminReply,
    closeHandover,
    deleteConversation,
    fetchAdminConversations,
    refetchMessages: fetchMessages,
  };
}
