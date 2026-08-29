import { apiRequest, ApiResponse } from "./apiClient";

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  initials: string;
  slots: string[];
}

export interface Appointment {
  id: number;
  patientName: string;
  phone: string;
  email?: string | null;
  service: string;
  doctorId: number;
  doctorName: string;
  date: string;
  time: string;
  status: "Pending" | "Confirmed" | "Completed" | "Upcoming" | "Cancelled";
  notes?: string | null;
  patientId?: number | null;
  createdAt?: string;
}

export interface BookAppointmentParams {
  service: string;
  doctorId: number;
  fullName: string;
  phone: string;
  email?: string;
  notes?: string;
  date: string;
  time: string;
}

export class AppointmentService {
  public static async getDoctors(): Promise<{ success: boolean; data: Doctor[] }> {
    return apiRequest("/appointments/doctors");
  }

  public static async getAppointments(params?: { date?: string; status?: string; doctorId?: number }): Promise<{ success: boolean; count: number; data: Appointment[] }> {
    const query = new URLSearchParams();
    if (params?.date) query.append("date", params.date);
    if (params?.status) query.append("status", params.status);
    if (params?.doctorId) query.append("doctorId", String(params.doctorId));

    const queryString = query.toString() ? `?${query.toString()}` : "";
    return apiRequest(`/appointments${queryString}`);
  }

  public static async getTodayAppointments(): Promise<{ success: boolean; count: number; data: Appointment[] }> {
    return apiRequest("/appointments/today");
  }

  public static async bookAppointment(params: BookAppointmentParams): Promise<{ success: boolean; data: Appointment; message: string; sms?: any }> {
    return apiRequest("/appointments", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  public static async updateStatus(id: number, status: string): Promise<{ success: boolean; data: Appointment; message: string }> {
    return apiRequest(`/appointments/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }

  public static async cancelAppointment(id: number): Promise<ApiResponse> {
    return apiRequest(`/appointments/${id}`, {
      method: "DELETE",
    });
  }
}
