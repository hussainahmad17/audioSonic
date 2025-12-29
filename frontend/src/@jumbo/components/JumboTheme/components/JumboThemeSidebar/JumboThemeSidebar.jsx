import PropTypes from "prop-types";

import { createTheme } from "@mui/material/styles";
import React from "react";
import { JumboThemeSidebarContext } from "./JumboThemeSidebarContext";
import { themeConfig } from "../../JumboTheme";

const JumboThemeSidebar = ({ children, init }) => {
  //todo: we can setup a default theme for sidebar here instead of {}
  const [sidebarTheme, setSidebarTheme] = React.useState(init ?? {});

  const themeSidebarContextValue = React.useMemo(
    () => ({
      sidebarTheme: createTheme(sidebarTheme),
      setSidebarTheme: setSidebarTheme,
    }),
    [sidebarTheme, setSidebarTheme]
  );

  return (
    <JumboThemeSidebarContext.Provider value={themeSidebarContextValue}>
      {children}
    </JumboThemeSidebarContext.Provider>
  );
};

export { JumboThemeSidebar };

JumboThemeSidebar.propTypes = {
  children: PropTypes.node.isRequired,
  init: PropTypes.shape({
    sidebar: themeConfig, // Adjust as per your header initialization shape
  }).isRequired,
};
