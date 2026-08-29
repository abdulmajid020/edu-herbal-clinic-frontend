import { apiRequest } from "./apiClient";

export interface CallLog {
  id: number;
  patientId?: number | null;
  patient: string;
  phone: string;
  time: string;
  type: "incoming" | "missed" | "returned";
  duration: string;
  status: "resolved" | "unresolved";
  note?: string | null;
  createdAt?: string;
}

export interface CallStats {
  incoming: number;
  missed: number;
  returned: number;
}

export class CallService {
  public static async getCalls(params?: { search?: string; type?: string; status?: string }): Promise<{
    success: boolean;
    stats: CallStats;
    count: number;
    data: CallLog[];
  }> {
    const query = new URLSearchParams();
    if (params?.search) query.append("search", params.search);
    if (params?.type) query.append("type", params.type);
    if (params?.status) query.append("status", params.status);

    const queryString = query.toString() ? `?${query.toString()}` : "";
    return apiRequest(`/calls${queryString}`);
  }

  public static async logCall(params: {
    patientName: string;
    phone: string;
    mode?: "Phone" | "WhatsApp" | string;
    attemptedAt?: string;
  }): Promise<{ success: boolean; message: string; data: CallLog }> {
    return apiRequest("/call", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  public static async updateNote(id: number, note: string): Promise<{ success: boolean; data: CallLog; message: string }> {
    return apiRequest(`/calls/${id}/note`, {
      method: "PUT",
      body: JSON.stringify({ note }),
    });
  }

  public static async toggleStatus(id: number): Promise<{ success: boolean; newStatus: "resolved" | "unresolved"; data: CallLog }> {
    return apiRequest(`/calls/${id}/toggle-status`, {
      method: "PUT",
    });
  }

  public static async markQrScan(id: number): Promise<{ success: boolean; data: CallLog; message: string }> {
    return apiRequest(`/calls/${id}/qr-scan`, {
      method: "POST",
    });
  }
}
