import React from "react";

export const AppContext = React.createContext({
  customizerVisibility: true,
  setCustomizerVisibility: () => {},
});
