import { createTheme } from "@mui/material";
import React from "react";

const defaultContextValue = {
  footerTheme: createTheme({}),
  setFooterTheme: () => null,
};

const JumboThemeFooterContext = React.createContext(defaultContextValue);

export { JumboThemeFooterContext };
