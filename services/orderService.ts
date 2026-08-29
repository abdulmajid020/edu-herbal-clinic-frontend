import { apiRequest } from "./apiClient";

export interface CartCheckoutItem {
  productId?: number;
  name?: string;
  quantity: number;
  price?: number;
}

export interface CheckoutParams {
  items: CartCheckoutItem[];
  paymentMethod: "Mobile Money" | "Telecel Cash" | string;
  recipientName: string;
  recipientNumber: string;
}

export interface Order {
  id: number;
  patientId?: number | null;
  description: string;
  amount: number;
  method: string;
  status: string;
  recipientName: string;
  recipientNumber: string;
  date: string;
  items: Array<{ productId?: number; name: string; quantity: number; price: number; subtotal: number }>;
  createdAt?: string;
}

export interface TopSellingProduct {
  name: string;
  sold: number;
  revenue: number;
}

export class OrderService {
  public static async checkout(params: CheckoutParams): Promise<{
    success: boolean;
    message: string;
    order: Order;
    payment: any;
  }> {
    return apiRequest("/orders/checkout", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  public static async getOrders(): Promise<{ success: boolean; count: number; data: Order[] }> {
    return apiRequest("/orders");
  }

  public static async getTopSelling(): Promise<{ success: boolean; data: TopSellingProduct[] }> {
    return apiRequest("/sales/top-selling");
  }
}
