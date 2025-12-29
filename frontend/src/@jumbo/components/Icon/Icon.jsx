import { APP_ICONS } from "@app/_utilities/constants/icons";
import PropTypes from "prop-types";
import React from "react";

function Icon({ name, ...props }) {
  if (!name) return "";

  const appIcon = APP_ICONS.find((icon) => {
    return icon.name === name;
  });

  if (!appIcon) {
    return name ?? "";
  }

  const { Component } = appIcon;

  return <Component {...props} />;
}
export { Icon };

Icon.propTypes = {
  name: PropTypes.string,
};
