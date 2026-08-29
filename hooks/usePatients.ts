import { useState, useEffect, useCallback } from "react";
import { PatientService, Patient, CreatePatientParams, UpdatePatientParams } from "../services/patientService";

export function usePatients(initialFilter?: { search?: string; status?: string }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [groups, setGroups] = useState<{ active: Patient[]; followUp: Patient[]; pending: Patient[] }>({
    active: [],
    followUp: [],
    pending: [],
  });
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>(initialFilter?.search || "");
  const [statusFilter, setStatusFilter] = useState<string>(initialFilter?.status || "");

  const fetchPatients = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await PatientService.getPatients({ search, status: statusFilter });
      if (res.success) {
        setPatients(res.data);
        if (res.groups) {
          setGroups(res.groups);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to load CRM patients.");
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const selectPatientById = async (id: number) => {
    try {
      const res = await PatientService.getPatientById(id);
      if (res.success) {
        setSelectedPatient(res.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load patient details.");
    }
  };

  const createPatient = async (params: CreatePatientParams) => {
    try {
      const res = await PatientService.createPatient(params);
      if (res.success && res.data) {
        await fetchPatients();
      }
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to create patient.");
      throw err;
    }
  };

  const updatePatient = async (id: number, params: UpdatePatientParams) => {
    try {
      const res = await PatientService.updatePatient(id, params);
      if (res.success) {
        await fetchPatients();
        if (selectedPatient && selectedPatient.id === id) {
          setSelectedPatient(res.data);
        }
      }
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to update patient.");
      throw err;
    }
  };

  const deletePatient = async (id: number) => {
    try {
      const res = await PatientService.deletePatient(id);
      if (res.success) {
        if (selectedPatient && selectedPatient.id === id) {
          setSelectedPatient(null);
        }
        await fetchPatients();
      }
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to delete patient.");
      throw err;
    }
  };

  return {
    patients,
    groups,
    selectedPatient,
    setSelectedPatient,
    isLoading,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    selectPatientById,
    createPatient,
    updatePatient,
    deletePatient,
    refetch: fetchPatients,
  };
}
