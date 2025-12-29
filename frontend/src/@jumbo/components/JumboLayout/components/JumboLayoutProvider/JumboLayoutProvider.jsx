import { useJumboTheme } from "@jumbo/components/JumboTheme/hooks";
import { LAYOUT_ACTIONS, SIDEBAR_VARIANTS } from "@jumbo/utilities/constants";
import { useMediaQuery } from "@mui/system";
import PropTypes from "prop-types";
import React from "react";
import { LayoutOptions } from "../../prop-types";
import { JumboLayoutContext, defaultLayoutOptions } from "./JumboLayoutContext";
import { jumboLayoutReducer } from "./reducer";

function JumboLayoutProvider({ children, layoutConfig, debugOptions }) {
  const [layoutOptions, setLayoutOptions] = React.useReducer(
    jumboLayoutReducer,
    layoutConfig ?? defaultLayoutOptions
  );
  const [prevLayoutOptions, setPrevLayoutOptions] = React.useState(null);
  //handle mobile screen sizes
  const { theme } = useJumboTheme();
  const isBelowLg = useMediaQuery(
    theme.breakpoints.down(layoutOptions.sidebar?.drawerBreakpoint ?? "xl")
  );
  React.useEffect(() => {
    if (!layoutOptions.sidebar?.hide) {
      if (isBelowLg) {
        if (prevLayoutOptions === null)
          setPrevLayoutOptions(layoutOptions.sidebar);
        setLayoutOptions({
          type: LAYOUT_ACTIONS.SET_SIDEBAR_OPTIONS,
          payload: {
            variant: SIDEBAR_VARIANTS.TEMPORARY,
            open: false,
          },
        });
      } else {
        if (prevLayoutOptions) {
          setLayoutOptions({
            type: LAYOUT_ACTIONS.SET_SIDEBAR_OPTIONS,
            payload: prevLayoutOptions,
          });
          setPrevLayoutOptions(null);
        }
      }
    }
  }, [isBelowLg, prevLayoutOptions, layoutOptions.sidebar?.hide]);

  React.useEffect(() => {
    if (layoutConfig)
      setLayoutOptions({
        type: LAYOUT_ACTIONS.SET_OPTIONS,
        payload: layoutConfig,
      });
  }, [layoutConfig]);

  const setHeaderOptions = React.useCallback((options) => {
    setLayoutOptions({
      type: LAYOUT_ACTIONS.SET_HEADER_OPTIONS,
      payload: options,
    });
  }, []);

  const setSidebarOptions = React.useCallback((options) => {
    setLayoutOptions({
      type: LAYOUT_ACTIONS.SET_SIDEBAR_OPTIONS,
      payload: options,
    });
  }, []);

  const setFooterOptions = React.useCallback((options) => {
    setLayoutOptions({
      type: LAYOUT_ACTIONS.SET_FOOTER_OPTIONS,
      payload: options,
    });
  }, []);

  const setRootOptions = React.useCallback((options) => {
    setLayoutOptions({
      type: LAYOUT_ACTIONS.SET_ROOT_OPTIONS,
      payload: options,
    });
  }, []);

  const setContentOptions = React.useCallback((options) => {
    setLayoutOptions({
      type: LAYOUT_ACTIONS.SET_CONTENT_OPTIONS,
      payload: options,
    });
  }, []);

  const setWrapperOptions = React.useCallback((options) => {
    setLayoutOptions({
      type: LAYOUT_ACTIONS.SET_WRAPPER_OPTIONS,
      payload: options,
    });
  }, []);

  const setMainOptions = React.useCallback((options) => {
    setLayoutOptions({
      type: LAYOUT_ACTIONS.SET_MAIN_OPTIONS,
      payload: options,
    });
  }, []);

  const setOptions = React.useCallback((options) => {
    setLayoutOptions({
      type: LAYOUT_ACTIONS.SET_OPTIONS,
      payload: options,
    });
  }, []);

  const setRightSidebarOptions = React.useCallback((options) => {
    setLayoutOptions({
      type: LAYOUT_ACTIONS.SET_RIGHT_SIDEBAR_OPTIONS,
      payload: options,
    });
  }, []);

  const layoutContext = React.useMemo(
    () => ({
      layoutOptions,
      headerOptions: layoutOptions.header,
      sidebarOptions: layoutOptions.sidebar,
      footerOptions: layoutOptions.footer,
      contentOptions: layoutOptions.content,
      rootOptions: layoutOptions.root,
      wrapperOptions: layoutOptions.wrapper,
      mainOptions: layoutOptions.main,
      rightSidebarOptions: layoutOptions.rightSidebar,
      debugOptions,
      setHeaderOptions,
      setSidebarOptions,
      setFooterOptions,
      setContentOptions,
      setRootOptions,
      setRightSidebarOptions,
      setWrapperOptions,
      setMainOptions,
      setOptions,
    }),
    [
      layoutOptions,
      debugOptions,
      setHeaderOptions,
      setFooterOptions,
      setSidebarOptions,
      setContentOptions,
      setRightSidebarOptions,
      setRootOptions,
      setWrapperOptions,
      setMainOptions,
      setOptions,
    ]
  );

  return (
    <JumboLayoutContext.Provider value={layoutContext}>
      {children}
    </JumboLayoutContext.Provider>
  );
}

export { JumboLayoutProvider };

JumboLayoutProvider.propTypes = {
  children: PropTypes.node,
  layoutConfig: PropTypes.shape({ ...LayoutOptions }),
};
