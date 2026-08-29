import { useState, useEffect, useCallback } from "react";
import { ProductService, Product } from "../services/productService";

export function useProducts(initialCategory = "All") {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<string>(initialCategory);
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await ProductService.getProducts({ category, search });
      if (res.success) {
        setProducts(res.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load herbal products catalogue.");
    } finally {
      setIsLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const selectProductById = async (id: number) => {
    try {
      const res = await ProductService.getProductById(id);
      if (res.success) {
        setSelectedProduct(res.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load product details.");
    }
  };

  return {
    products,
    selectedProduct,
    setSelectedProduct,
    category,
    setCategory,
    search,
    setSearch,
    isLoading,
    error,
    selectProductById,
    refetch: fetchProducts,
  };
}
