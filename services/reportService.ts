import { apiRequest, API_BASE_URL, getAuthToken } from "./apiClient";

export interface MonthlyReport {
  id: number;
  month: string;
  year: number;
  totalRevenue: number;
  totalOrders: number;
  totalUnits: number;
  topProduct: string;
  topProductUnits: number;
  topProductRevenue: number;
  lowStockCount: number;
  productsSold: Array<{ name: string; sold: number; revenue: number }>;
  generatedAt: string;
}

export class ReportService {
  public static async closeMonth(): Promise<{ success: boolean; message: string; report: MonthlyReport }> {
    return apiRequest("/reports/monthly-close", {
      method: "POST",
    });
  }

  public static async getReports(): Promise<{ success: boolean; count: number; data: MonthlyReport[] }> {
    return apiRequest("/reports/monthly");
  }

  public static getExportSingleUrl(id: number): string {
    return `${API_BASE_URL}/reports/monthly/${id}/export`;
  }

  public static getExportAllUrl(): string {
    return `${API_BASE_URL}/reports/monthly/export-all`;
  }

  public static async downloadSingleCsv(id: number, filename = "monthly-report.csv"): Promise<void> {
    const token = getAuthToken();
    const response = await fetch(ReportService.getExportSingleUrl(id), {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  public static async downloadAllCsv(filename = "monthly-report-history.csv"): Promise<void> {
    const token = getAuthToken();
    const response = await fetch(ReportService.getExportAllUrl(), {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
}
