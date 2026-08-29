import { apiRequest, ApiResponse } from "./apiClient";

export interface Payment {
  id: number;
  orderId?: number | null;
  patientId?: number | null;
  description: string;
  amount: number;
  method: string;
  status: "Paid" | "Pending" | "Refunded";
  recipientName: string;
  recipientNumber: string;
  date: string;
  createdAt?: string;
}

export interface SalesMetrics {
  todayRevenue: number;
  yesterdayRevenue: number;
  weekRevenue: number;
  lastWeekRevenue: number;
  monthRevenue: number;
  consultationsThisMonth: number;
  bestDay: string;
  bestDayAvg: number;
  revenueDelta: string;
}

export class PaymentService {
  public static async getPayments(params?: { status?: string; limit?: number }): Promise<{ success: boolean; count: number; data: Payment[] }> {
    const query = new URLSearchParams();
    if (params?.status) query.append("status", params.status);
    if (params?.limit) query.append("limit", String(params.limit));

    const queryString = query.toString() ? `?${query.toString()}` : "";
    return apiRequest(`/payments${queryString}`);
  }

  public static async createPayment(params: {
    description: string;
    amount: number;
    method: string;
    recipientName: string;
    recipientNumber: string;
  }): Promise<{ success: boolean; data: Payment; message: string }> {
    return apiRequest("/payments", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  public static async getSalesMetrics(): Promise<{ success: boolean } & SalesMetrics> {
    return apiRequest("/sales/metrics");
  }
}
