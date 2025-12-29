import PropTypes from "prop-types";

import { createTheme } from "@mui/material/styles";
import React from "react";
import { JumboThemeFooterContext } from "./JumboThemeFooterContext";
import { themeConfig } from "../../JumboTheme";

const JumboThemeFooter = ({ children, init }) => {
  //todo: we can setup a default theme for footer here instead of {}
  const [footerTheme, setFooterTheme] = React.useState(init ?? {});

  const themeFooterContextValue = React.useMemo(
    () => ({
      footerTheme: createTheme(footerTheme),
      setFooterTheme: setFooterTheme,
    }),
    [footerTheme, setFooterTheme]
  );

  return (
    <JumboThemeFooterContext.Provider value={themeFooterContextValue}>
      {children}
    </JumboThemeFooterContext.Provider>
  );
};

export { JumboThemeFooter };

JumboThemeFooter.propTypes = {
  children: PropTypes.node.isRequired,
  init: PropTypes.shape({
    footer: themeConfig, // Adjust as per your header initialization shape
  }).isRequired,
};
