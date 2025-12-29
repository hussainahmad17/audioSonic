import React from "react";

const defaultContext = {
  open: false,
  showDialog: () => {},
  hideDialog: () => {},
};
const JumboDialogContext = React.createContext(defaultContext);

export default JumboDialogContext;
