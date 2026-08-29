import { useState, useEffect, useCallback } from "react";
import { AppointmentService, Appointment, Doctor, BookAppointmentParams } from "../services/appointmentService";

export function useAppointments(params?: { date?: string; status?: string }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctors = useCallback(async () => {
    try {
      const res = await AppointmentService.getDoctors();
      if (res.success) {
        setDoctors(res.data);
      }
    } catch (err: any) {
      console.error("Failed to load doctors", err);
    }
  }, []);

  const fetchAppointments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [allRes, todayRes] = await Promise.all([
        AppointmentService.getAppointments(params),
        AppointmentService.getTodayAppointments(),
      ]);

      if (allRes.success) setAppointments(allRes.data);
      if (todayRes.success) setTodayAppointments(todayRes.data);
    } catch (err: any) {
      setError(err.message || "Failed to load appointments.");
    } finally {
      setIsLoading(false);
    }
  }, [params?.date, params?.status]);

  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
  }, [fetchDoctors, fetchAppointments]);

  const bookAppointment = async (bookingData: BookAppointmentParams) => {
    try {
      const res = await AppointmentService.bookAppointment(bookingData);
      if (res.success) {
        await fetchAppointments();
      }
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to book appointment.");
      throw err;
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await AppointmentService.updateStatus(id, status);
      if (res.success) {
        await fetchAppointments();
      }
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to update appointment status.");
      throw err;
    }
  };

  const cancelAppointment = async (id: number) => {
    try {
      const res = await AppointmentService.cancelAppointment(id);
      if (res.success) {
        await fetchAppointments();
      }
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to cancel appointment.");
      throw err;
    }
  };

  return {
    appointments,
    todayAppointments,
    doctors,
    isLoading,
    error,
    bookAppointment,
    updateStatus,
    cancelAppointment,
    refetch: fetchAppointments,
  };
}
