import PropTypes from "prop-types";

import { createTheme } from "@mui/material/styles";
import React from "react";
import { JumboThemeHeaderContext } from "./JumboThemeHeaderContext";
import { themeConfig } from "../../JumboTheme";

const JumboThemeHeader = ({ children, init }) => {
  //todo: later we can set a default theme for header here instead of {}
  const [headerTheme, setHeaderTheme] = React.useState(init ?? {});

  const themeHeaderContextValue = React.useMemo(
    () => ({
      headerTheme: createTheme(headerTheme),
      setHeaderTheme: setHeaderTheme,
    }),
    [headerTheme, setHeaderTheme]
  );

  return (
    <JumboThemeHeaderContext.Provider value={themeHeaderContextValue}>
      {children}
    </JumboThemeHeaderContext.Provider>
  );
};

export { JumboThemeHeader };

JumboThemeHeader.propTypes = {
  children: PropTypes.node.isRequired,
  init: PropTypes.shape({
    header: themeConfig, // Adjust as per your header initialization shape
  }).isRequired,
};
