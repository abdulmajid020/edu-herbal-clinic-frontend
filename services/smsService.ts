import { apiRequest, ApiResponse } from "./apiClient";

export interface SmsBalanceInfo {
  balance: string | number;
  currency?: string;
  sms_count?: number;
  sender_id?: string;
  note?: string;
  [key: string]: any;
}

export interface SendBroadcastParams {
  recipients?: string[];
  message: string;
  targetGroup?: "all_staff" | "all_patients";
  customSender?: string;
}

export class SmsService {
  /**
   * Fetch current SMS balance
   */
  public static async getBalance(): Promise<{
    success: boolean;
    data?: SmsBalanceInfo;
    mocked?: boolean;
    error?: string;
  }> {
    return apiRequest("/sms/balance");
  }

  /**
   * Send a test SMS to any phone number
   */
  public static async sendTestSms(
    phone: string,
    message?: string
  ): Promise<{ success: boolean; message: string; data?: any; error?: string }> {
    return apiRequest("/sms/test", {
      method: "POST",
      body: JSON.stringify({ phone, message }),
    });
  }

  /**
   * Send bulk/broadcast SMS
   */
  public static async sendBroadcast(
    params: SendBroadcastParams
  ): Promise<{
    success: boolean;
    message: string;
    totalRecipients?: number;
    recipientCount?: number;
    error?: string;
  }> {
    return apiRequest("/sms/broadcast", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  /**
   * Trigger appointment reminder SMS for next day / specified date
   */
  public static async sendDailyReminders(targetDate?: string): Promise<{
    success: boolean;
    message: string;
    date: string;
    totalFound: number;
    remindersSent: number;
    remindersFailed: number;
    details?: any[];
  }> {
    return apiRequest("/sms/reminders/send-daily", {
      method: "POST",
      body: JSON.stringify({ targetDate }),
    });
  }
}
