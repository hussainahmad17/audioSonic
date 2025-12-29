import React from "react";
import { JumboConfigContext } from "./JumboConfigContext";
import PropTypes from "prop-types";

function JumboConfigProvider({ children, ...props }) {
  return (
    <JumboConfigContext.Provider value={{ ...props }}>
      {children}
    </JumboConfigContext.Provider>
  );
}

export { JumboConfigProvider };

JumboConfigProvider.propTypes = {
  children: PropTypes.node.isRequired,
  LinkComponent: PropTypes.any, // You can replace `any` with a more specific prop type
  translator: PropTypes.func, // Assuming translator is a function
};
