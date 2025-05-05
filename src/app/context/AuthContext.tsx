"use client";

import jwt from "jsonwebtoken";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";

type AuthContextType = {
  isAuthenticated: boolean;
  login: (token: string) => void;
  check_dashboard: (token: string) => { role?: string } | null;
  check_auth: () => void;
  logout: () => void;
  authToken: string | null;
  authEmail: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [authEmail, setAuthEmail] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const check_auth = () => {
    if (!authEmail && !isAuthenticated) {
      router.replace("/Auth");
    }
  };
  
  // Redirect if unauthenticated and no email
  useEffect(() => {
  check_auth();
  }, [ authEmail, isAuthenticated ]);
  
  // Restore session on load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("authToken");
      const email = sessionStorage.getItem("email");

      setAuthToken(token);
      setAuthEmail(email);
      setIsAuthenticated(!!token);

      if (token) {
        console.log("Decoded JWT:", jwt.decode(token));
      }
    }
  }, []);


  const check_dashboard = (token: string) => {
    try {
      return jwt.decode(token) as { role?: string } | null;
    } catch (err) {
      console.error("Failed to decode token:", err);
      return null;
    }
  };

  const login = (token: string) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("authToken", token);
      const decodedToken = jwt.decode(token) as {
        role?: string;
        email?: string;
      } | null;
      
      if (decodedToken?.email) {
        localStorage.setItem("email", decodedToken?.email); // Store in localStorage as well
        sessionStorage.setItem("email", decodedToken.email);
        setAuthEmail(decodedToken.email);
      }

      setAuthToken(token);
      setIsAuthenticated(true);
      router.push("/"); // Redirect to the dashboard or home page
    }
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("email");
      localStorage.removeItem("email"); // Clear email from localStorage as well
      setAuthToken(null);
      setAuthEmail(null);
      setIsAuthenticated(false);
      router.push("/Auth");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        authToken,
        check_dashboard,
        authEmail,
        check_auth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
