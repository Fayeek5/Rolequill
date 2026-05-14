import { createContext, useContext } from "react";
import {
  loginWithEmail,
  loginWithGoogleDemo,
  loginWithPhone,
  requestPhoneOtp,
  signOut,
  signUpWithEmail,
} from "../services/authService";
import type { AuthUser } from "../types";

export type AuthContextValue = {
  user: AuthUser | null;
  refreshUser: () => void;
  signUpWithEmail: typeof signUpWithEmail;
  loginWithEmail: typeof loginWithEmail;
  requestPhoneOtp: typeof requestPhoneOtp;
  loginWithPhone: typeof loginWithPhone;
  loginWithGoogleDemo: typeof loginWithGoogleDemo;
  signOut: typeof signOut;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
