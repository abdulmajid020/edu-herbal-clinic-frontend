import { apiRequest, ApiResponse } from "./apiClient";

export interface Patient {
  id: number;
  name: string;
  phone: string;
  email?: string | null;
  condition: string;
  status: "Active" | "Follow-up" | "Pending" | "Discharged";
  assignedDoctorId?: number | null;
  assignedDoctorName?: string | null;
  balance: number;
  lastVisit?: string | null;
  nextAppt?: string | null;
  lastCallAt?: string | null;
  callCount: number;
  lastCallMode?: "Phone" | "WhatsApp" | null;
  products?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePatientParams {
  name: string;
  phone: string;
  condition: string;
  doctorId?: number;
  date?: string;
  time?: string;
}

export interface UpdatePatientParams {
  name?: string;
  condition?: string;
  status?: string;
  balance?: number;
  assignedDoctorId?: number;
  nextAppt?: string;
}

export class PatientService {
  public static async getPatients(params?: { search?: string; status?: string }): Promise<{
    success: boolean;
    count: number;
    data: Patient[];
    groups: {
      active: Patient[];
      followUp: Patient[];
      pending: Patient[];
    };
  }> {
    const query = new URLSearchParams();
    if (params?.search) query.append("search", params.search);
    if (params?.status) query.append("status", params.status);

    const queryString = query.toString() ? `?${query.toString()}` : "";
    return apiRequest(`/patients${queryString}`);
  }

  public static async getPatientById(id: number): Promise<{ success: boolean; data: Patient & { appointments: any[]; callLogs: any[]; payments: any[] } }> {
    return apiRequest(`/patients/${id}`);
  }

  public static async createPatient(params: CreatePatientParams): Promise<{ success: boolean; data: Patient; message: string; sms?: any }> {
    return apiRequest("/patients", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  public static async updatePatient(id: number, params: UpdatePatientParams): Promise<{ success: boolean; data: Patient; message: string }> {
    return apiRequest(`/patients/${id}`, {
      method: "PUT",
      body: JSON.stringify(params),
    });
  }

  public static async deletePatient(id: number): Promise<ApiResponse> {
    return apiRequest(`/patients/${id}`, {
      method: "DELETE",
    });
  }
}
