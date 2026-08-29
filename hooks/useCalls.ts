import { useState, useEffect, useCallback } from "react";
import { CallService, CallLog, CallStats } from "../services/callService";

export function useCalls(params?: { search?: string; type?: string; status?: string }) {
  const [calls, setCalls] = useState<CallLog[]>([]);
  const [stats, setStats] = useState<CallStats>({ incoming: 0, missed: 0, returned: 0 });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCalls = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await CallService.getCalls(params);
      if (res.success) {
        setCalls(res.data);
        if (res.stats) setStats(res.stats);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load call logs.");
    } finally {
      setIsLoading(false);
    }
  }, [params?.search, params?.type, params?.status]);

  useEffect(() => {
    fetchCalls();
  }, [fetchCalls]);

  const logCall = async (logData: { patientName: string; phone: string; mode?: string; attemptedAt?: string }) => {
    try {
      const res = await CallService.logCall(logData);
      if (res.success) {
        await fetchCalls();
      }
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to log call.");
      throw err;
    }
  };

  const updateNote = async (id: number, note: string) => {
    try {
      const res = await CallService.updateNote(id, note);
      if (res.success) {
        await fetchCalls();
      }
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to update note.");
      throw err;
    }
  };

  const toggleStatus = async (id: number) => {
    try {
      const res = await CallService.toggleStatus(id);
      if (res.success) {
        await fetchCalls();
      }
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to toggle status.");
      throw err;
    }
  };

  const markQrScan = async (id: number) => {
    try {
      const res = await CallService.markQrScan(id);
      if (res.success) {
        await fetchCalls();
      }
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to mark QR scanned.");
      throw err;
    }
  };

  return {
    calls,
    stats,
    isLoading,
    error,
    logCall,
    updateNote,
    toggleStatus,
    markQrScan,
    refetch: fetchCalls,
  };
}
