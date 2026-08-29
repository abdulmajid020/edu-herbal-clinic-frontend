import { useState, useEffect, useCallback } from "react";
import { AuthService, StaffUser, LoginParams, SignupParams, ResetRequestParams, ResetConfirmParams } from "../services/authService";
import { getAuthToken } from "../services/apiClient";

export function useAuth() {
  const [user, setUser] = useState<StaffUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lockout, setLockout] = useState<boolean>(false);

  const checkAuth = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const res = await AuthService.getMe();
      if (res.success && res.user) {
        setUser(res.user);
        setIsAuthenticated(true);
      }
    } catch {
      AuthService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (params: LoginParams) => {
    setError(null);
    setLockout(false);
    try {
      const res = await AuthService.login(params);
      if (res.user) {
        setUser(res.user);
        setIsAuthenticated(true);
      }
      return res;
    } catch (err: any) {
      const errMsg = err.message || "Failed to log in.";
      setError(errMsg);
      if (errMsg.toLowerCase().includes("locked") || errMsg.toLowerCase().includes("attempts")) {
        setLockout(true);
      }
      throw err;
    }
  };

  const signup = async (params: SignupParams) => {
    setError(null);
    try {
      return await AuthService.signup(params);
    } catch (err: any) {
      setError(err.message || "Failed to register staff account.");
      throw err;
    }
  };

  const resetRequest = async (params: ResetRequestParams) => {
    setError(null);
    try {
      return await AuthService.resetRequest(params);
    } catch (err: any) {
      setError(err.message || "Password reset request failed.");
      throw err;
    }
  };

  const resetConfirm = async (params: ResetConfirmParams) => {
    setError(null);
    try {
      const res = await AuthService.resetConfirm(params);
      setLockout(false);
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to reset password.");
      throw err;
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    lockout,
    login,
    signup,
    resetRequest,
    resetConfirm,
    logout,
    refreshUser: checkAuth,
  };
}
