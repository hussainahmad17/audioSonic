import { createTheme } from "@mui/material";
import React from "react";

const defaultContextValue = {
  sidebarTheme: createTheme({}),
  setSidebarTheme: () => null,
};

const JumboThemeSidebarContext = React.createContext(defaultContextValue);

export { JumboThemeSidebarContext };
