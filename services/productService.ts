import { apiRequest } from "./apiClient";

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  imageUrl?: string | null;
  description: string;
  isActive: boolean;
}

export class ProductService {
  public static async getProducts(params?: { category?: string; search?: string }): Promise<{ success: boolean; count: number; data: Product[] }> {
    const query = new URLSearchParams();
    if (params?.category) query.append("category", params.category);
    if (params?.search) query.append("search", params.search);

    const queryString = query.toString() ? `?${query.toString()}` : "";
    return apiRequest(`/products${queryString}`);
  }

  public static async getProductById(id: number): Promise<{ success: boolean; data: Product & { inventory?: any } }> {
    return apiRequest(`/products/${id}`);
  }
}
