import { apiRequest, ApiResponse } from "./apiClient";

export interface StaffMember {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  dept?: string;
  department: string;
  schedule: string;
  status: "Present" | "Leave" | "Remote";
}

export interface StaffAnnouncement {
  id: number;
  title: string;
  message: string;
  author?: string;
  createdAt: string;
}

export interface CreateStaffParams {
  name: string;
  email?: string;
  phone?: string;
  role: string;
  department?: string;
  schedule?: string;
  status?: "Present" | "Leave" | "Remote";
}

export interface UpdateStaffParams {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  department?: string;
  schedule?: string;
  status?: "Present" | "Leave" | "Remote";
}

export class StaffService {
  public static async getStaffList(status?: string): Promise<{
    success: boolean;
    counts: { present: number; leave: number; remote: number };
    data: StaffMember[];
    announcements?: StaffAnnouncement[];
  }> {
    const query = status ? `?status=${encodeURIComponent(status)}` : "";
    return apiRequest(`/staff${query}`);
  }

  public static async createStaff(params: CreateStaffParams): Promise<{
    success: boolean;
    message: string;
    data: StaffMember;
  }> {
    return apiRequest("/staff", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  public static async updateStaff(id: number, params: UpdateStaffParams): Promise<{
    success: boolean;
    message: string;
    data: StaffMember;
  }> {
    return apiRequest(`/staff/${id}`, {
      method: "PUT",
      body: JSON.stringify(params),
    });
  }

  public static async deleteStaff(id: number): Promise<{
    success: boolean;
    message: string;
  }> {
    return apiRequest(`/staff/${id}`, {
      method: "DELETE",
    });
  }

  public static async updateStatus(id: number, params: { status?: string; schedule?: string }): Promise<{
    success: boolean;
    data: StaffMember;
    message: string;
  }> {
    return apiRequest(`/staff/${id}/status`, {
      method: "PUT",
      body: JSON.stringify(params),
    });
  }

  public static async getAnnouncements(): Promise<{
    success: boolean;
    data: StaffAnnouncement[];
  }> {
    return apiRequest("/staff/announcements");
  }

  public static async postAnnouncement(params: { title: string; message: string; author?: string }): Promise<{
    success: boolean;
    message: string;
    announcement: StaffAnnouncement;
  }> {
    return apiRequest("/staff/announcements", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }
}
