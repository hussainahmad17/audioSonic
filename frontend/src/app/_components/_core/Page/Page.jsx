import React from "react";

const Page = ({ Component, hoc }) => {
  if (hoc) {
    const WrappedComponent = hoc(Component);
    return <WrappedComponent />;
  }
  return <Component />;
};

export { Page };
