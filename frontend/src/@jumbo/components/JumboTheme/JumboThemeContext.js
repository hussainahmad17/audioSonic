import { createTheme } from "@mui/material";
import { enUS } from "@mui/material/locale";
import React from "react";

const defaultContextValue = {
  theme: createTheme(),
  muiLocale: enUS,
  setTheme: () => null,
  setMuiLocale: () => null,
};

const JumboThemeContext = React.createContext(defaultContextValue);

export { JumboThemeContext };
