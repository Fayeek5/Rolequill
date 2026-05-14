import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getCurrentUser,
  loginWithEmail,
  loginWithGoogleDemo,
  loginWithPhone,
  requestPhoneOtp,
  signOut,
  signUpWithEmail,
} from "../services/authService";
import type { AuthUser } from "../types";
import { AuthContext, type AuthContextValue } from "./authContextValue";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getCurrentUser());

  const refreshUser = () => {
    setUser(getCurrentUser());
  };

  useEffect(() => {
    window.addEventListener("rolequill:auth", refreshUser);
    window.addEventListener("storage", refreshUser);

    return () => {
      window.removeEventListener("rolequill:auth", refreshUser);
      window.removeEventListener("storage", refreshUser);
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      refreshUser,
      signUpWithEmail,
      loginWithEmail,
      requestPhoneOtp,
      loginWithPhone,
      loginWithGoogleDemo,
      signOut,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
