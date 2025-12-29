import React from "react";
import { AuthContext } from "../AuthContext";

export function useAuth() {
  return React.useContext(AuthContext);
}
