import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import {
  login as loginRequest,
  logout as clearStoredSession,
  register as registerRequest,
  restoreSession,
} from "../services/authService";
import { setUnauthorizedHandler } from "../services/api";
import type {
  AuthSession,
  AuthUser,
  LoginCredentials,
  SignupCredentials,
} from "../types/auth";
import { colors } from "../components/theme";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isRestoring: boolean;
  restoreError: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Could not restore the saved session.";
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const logoutRequest = useRef<Promise<void> | null>(null);

  const handleUnauthorized = useCallback(async () => {
    setSession(null);
    await clearStoredSession();
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(handleUnauthorized);
    return () => setUnauthorizedHandler(undefined);
  }, [handleUnauthorized]);

  useEffect(() => {
    let active = true;

    restoreSession()
      .then((restoredSession) => {
        if (active) {
          setSession(restoredSession);
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setRestoreError(getErrorMessage(error));
        }
      })
      .finally(() => {
        if (active) {
          setIsRestoring(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const nextSession = await loginRequest(credentials);
    setSession(nextSession);
    setRestoreError(null);
  }, []);

  const register = useCallback(async (credentials: SignupCredentials) => {
    const nextSession = await registerRequest(credentials);
    setSession(nextSession);
    setRestoreError(null);
  }, []);

  const logout = useCallback(() => {
    if (logoutRequest.current) {
      return logoutRequest.current;
    }

    const request = clearStoredSession().then(() => {
      setSession(null);
      setRestoreError(null);
    });
    logoutRequest.current = request;

    const clearLogoutRequest = () => {
      if (logoutRequest.current === request) {
        logoutRequest.current = null;
      }
    };
    void request.then(clearLogoutRequest, clearLogoutRequest);

    return request;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      isAuthenticated: session !== null,
      isRestoring,
      restoreError,
      login,
      register,
      logout,
    }),
    [isRestoring, login, logout, register, restoreError, session]
  );

  if (isRestoring) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.blue} size="large" />
      </View>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}

const styles = StyleSheet.create({
  loading: {
    alignItems: "center",
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "center",
  },
});
