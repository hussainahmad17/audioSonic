import React from "react";
import { AuthContext } from "./AuthContext";
import { apiClient, postRequest } from "@app/backendServices/ApiCalls";

export const iAuthService = async (email, password) => {
  const { data } = await apiClient.post("/auth/login", { email, password });

  return {
    token: data.token,
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
      const { token, user,msg } = await iAuthService(email, password);

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      return { token, user,msg };
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
      const token = localStorage.getItem("token");

      if (token) {
        setLoading(true);

        postRequest(
          "/auth/verify",
          {token},
          (response) => {
            console.log("🚀 ~ checkAuthentication ~ response:", response)
            setLoading(false);
            if (response?.data?.status === "success") {
              setUser(response?.data?.user);
              setIsAuthenticated(true);
            } else {
              logout();
            }
          },
          (error) => {
            setLoading(false);
            logout();
            console.error("Token verification failed:", error?.response?.data);
          }
        );
      } else {
        setIsAuthenticated(false);
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
