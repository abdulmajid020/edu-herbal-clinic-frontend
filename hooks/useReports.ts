import { useState, useEffect, useCallback } from "react";
import { ReportService, MonthlyReport } from "../services/reportService";

export function useReports() {
  const [reports, setReports] = useState<MonthlyReport[]>([]);
  const [latestReport, setLatestReport] = useState<MonthlyReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await ReportService.getReports();
      if (res.success) {
        setReports(res.data);
        setLatestReport(res.data[0] || null);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load monthly reports.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const closeMonth = async () => {
    try {
      const res = await ReportService.closeMonth();
      if (res.success) {
        await fetchReports();
      }
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to generate monthly close.");
      throw err;
    }
  };

  const downloadSingleCsv = (id: number, filename?: string) => {
    return ReportService.downloadSingleCsv(id, filename);
  };

  const downloadAllCsv = (filename?: string) => {
    return ReportService.downloadAllCsv(filename);
  };

  return {
    reports,
    latestReport,
    isLoading,
    error,
    closeMonth,
    downloadSingleCsv,
    downloadAllCsv,
    refetch: fetchReports,
  };
}
