import React, { useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "@app/backendServices/ApiCalls";

function Logout() {
  useEffect(() => {
    const doLogout = async () => {
      try {
        await axios.post(`${API_BASE_URL}/auth/logout`, {}, { withCredentials: true });
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
      }
    };

    doLogout();
  }, []);

  return <div></div>;
}

export default Logout;
