import { useState, useEffect, useCallback } from "react";
import { OrderService, Order, TopSellingProduct, CheckoutParams } from "../services/orderService";
import { PaymentService, Payment, SalesMetrics } from "../services/paymentService";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [topSelling, setTopSelling] = useState<TopSellingProduct[]>([]);
  const [metrics, setMetrics] = useState<SalesMetrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSalesData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [ordersRes, paymentsRes, topRes, metricsRes] = await Promise.all([
        OrderService.getOrders(),
        PaymentService.getPayments(),
        OrderService.getTopSelling(),
        PaymentService.getSalesMetrics(),
      ]);

      if (ordersRes.success) setOrders(ordersRes.data);
      if (paymentsRes.success) setPayments(paymentsRes.data);
      if (topRes.success) setTopSelling(topRes.data);
      if (metricsRes.success) setMetrics(metricsRes);
    } catch (err: any) {
      setError(err.message || "Failed to load sales data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSalesData();
  }, [fetchSalesData]);

  const checkout = async (params: CheckoutParams) => {
    try {
      const res = await OrderService.checkout(params);
      if (res.success) {
        await fetchSalesData();
      }
      return res;
    } catch (err: any) {
      setError(err.message || "Checkout failed.");
      throw err;
    }
  };

  return {
    orders,
    payments,
    topSelling,
    metrics,
    isLoading,
    error,
    checkout,
    refetch: fetchSalesData,
  };
}
