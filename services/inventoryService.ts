import { apiRequest } from "./apiClient";

export interface InventoryItem {
  id: number;
  productId: number;
  item: string;
  category: string;
  stock: number;
  min: number;
  safetyThreshold: number;
  unit: string;
  isLowStock: boolean;
  updatedAt?: string;
}

export interface RestockParams {
  item: string;
  category?: string;
  stock: number;
  min?: number;
  unit?: string;
}

export class InventoryService {
  public static async getInventory(): Promise<{
    success: boolean;
    data: InventoryItem[];
    lowStockCount: number;
    safetyThreshold: number;
  }> {
    return apiRequest("/inventory");
  }

  public static async getLowStock(): Promise<{ success: boolean; count: number; data: InventoryItem[] }> {
    return apiRequest("/inventory/low-stock");
  }

  public static async restock(params: RestockParams): Promise<{ success: boolean; message: string; data: InventoryItem }> {
    return apiRequest("/inventory/restock", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }
}
