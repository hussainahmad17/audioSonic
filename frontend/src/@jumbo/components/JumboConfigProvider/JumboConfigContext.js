import { Link } from "react-router-dom";
import React from "react";

const defaultContextValue = {
  LinkComponent: Link,
};

const JumboConfigContext = React.createContext(defaultContextValue);

export { JumboConfigContext };
