import { createTheme } from "@mui/material";
import React from "react";

const defaultContextValue = {
  headerTheme: createTheme({}),
  setHeaderTheme: () => null,
};

const JumboThemeHeaderContext = React.createContext(defaultContextValue);

export { JumboThemeHeaderContext };
