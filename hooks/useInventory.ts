import { useState, useEffect, useCallback } from "react";
import { InventoryService, InventoryItem, RestockParams } from "../services/inventoryService";

export function useInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [lowStockCount, setLowStockCount] = useState<number>(0);
  const [safetyThreshold, setSafetyThreshold] = useState<number>(35);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await InventoryService.getInventory();
      if (res.success) {
        setInventory(res.data);
        setLowStockCount(res.lowStockCount);
        setSafetyThreshold(res.safetyThreshold);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load inventory stock levels.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const restock = async (params: RestockParams) => {
    try {
      const res = await InventoryService.restock(params);
      if (res.success) {
        await fetchInventory();
      }
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to restock item.");
      throw err;
    }
  };

  return {
    inventory,
    lowStockCount,
    safetyThreshold,
    isLoading,
    error,
    restock,
    refetch: fetchInventory,
  };
}
