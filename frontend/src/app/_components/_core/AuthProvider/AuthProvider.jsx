import React from "react";
import { AuthContext } from "./AuthContext";
import { apiClient } from "@app/backendServices/ApiCalls";

export const iAuthService = async (email, password) => {
  const { data } = await apiClient.post("/auth/login", { email, password });
  return {
    user: data.user,
    msg: data.message,
  };
};

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [User, setUser] = React.useState(null);

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const { user, msg } = await iAuthService(email, password);
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      return { user, msg };
    } catch (err) {
      console.error("Login failed:", err);
      setIsAuthenticated(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
  };

  React.useEffect(() => {
    const checkAuthentication = async () => {
      setLoading(true);
      try {
        const { data } = await apiClient.post("/auth/verify", {});
        if (data?.status === "success") {
          setUser(data.user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuthentication();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        login,
        logout,
        User,
        setUser,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
