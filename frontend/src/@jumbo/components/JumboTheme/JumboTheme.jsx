import { ThemeProvider, createTheme } from "@mui/material";
import { enUS } from "@mui/material/locale";
import React from "react";
import PropTypes from "prop-types";

import {
  JumboThemeFooter,
  JumboThemeHeader,
  JumboThemeSidebar,
} from "./components";

import { JumboThemeContext } from "./JumboThemeContext";

export const themeConfig = PropTypes.shape({
  type: PropTypes.oneOf(["light", "semi-dark", "dark"]),
  sidebar: PropTypes.shape({
    bgimage: PropTypes.string,
    overlay: PropTypes.shape({
      bgcolor: PropTypes.string,
      bgimage: PropTypes.string,
      opacity: PropTypes.number,
    }),
  }),
  jumboComponents: PropTypes.shape({
    JumboNavbar: PropTypes.shape({
      nav: PropTypes.shape({
        action: PropTypes.shape({
          active: PropTypes.string,
          hover: PropTypes.string,
        }),
        background: PropTypes.shape({
          active: PropTypes.string,
          hover: PropTypes.string,
        }),
        tick: PropTypes.shape({
          active: PropTypes.string,
          hover: PropTypes.string,
        }),
      }),
    }),
  }),
});

function JumboTheme({ children, init }) {
  const [theme, setTheme] = React.useState(createTheme(init.main));
  const [muiLocale, setMuiLocale] = React.useState(enUS);

  const updateTheme = React.useCallback(
    (options) => {
      setTheme(createTheme({ ...theme, ...options }, muiLocale));
    },
    [theme, muiLocale]
  );

  const themeContextValue = React.useMemo(
    () => ({
      theme,
      muiLocale,
      setTheme: updateTheme,
      setMuiLocale,
    }),
    [theme, muiLocale, updateTheme]
  );
  return (
    <JumboThemeContext.Provider value={themeContextValue}>
      <ThemeProvider theme={theme}>
        <JumboThemeHeader init={init.header}>
          <JumboThemeSidebar init={init.sidebar}>
            <JumboThemeFooter init={init.footer}>{children}</JumboThemeFooter>
          </JumboThemeSidebar>
        </JumboThemeHeader>
      </ThemeProvider>
    </JumboThemeContext.Provider>
  );
}

JumboTheme.propTypes = {
  children: PropTypes.node.isRequired,
  init: PropTypes.shape({
    main: themeConfig.isRequired,
    header: themeConfig, // Adjust as per your header initialization shape
    sidebar: themeConfig, // Adjust as per your sidebar initialization shape
    footer: themeConfig, // Adjust as per your footer initialization shape
  }).isRequired,
};
export { JumboTheme };
