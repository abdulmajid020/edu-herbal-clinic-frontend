import { useState, useEffect, useCallback } from "react";
import { StaffService, StaffMember } from "../services/staffService";

export function useStaff(initialStatus?: string) {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [counts, setCounts] = useState<{ present: number; leave: number; remote: number }>({
    present: 0,
    leave: 0,
    remote: 0,
  });
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus || "");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStaff = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await StaffService.getStaffList(statusFilter);
      if (res.success) {
        setStaff(res.data);
        if (res.counts) setCounts(res.counts);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load staff list.");
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const updateStatus = async (id: number, params: { status?: string; schedule?: string }) => {
    try {
      const res = await StaffService.updateStatus(id, params);
      if (res.success) {
        await fetchStaff();
      }
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to update staff status.");
      throw err;
    }
  };

  const postAnnouncement = async (title: string, message: string) => {
    try {
      return await StaffService.postAnnouncement({ title, message });
    } catch (err: any) {
      setError(err.message || "Failed to post announcement.");
      throw err;
    }
  };

  return {
    staff,
    counts,
    statusFilter,
    setStatusFilter,
    isLoading,
    error,
    updateStatus,
    postAnnouncement,
    refetch: fetchStaff,
  };
}
