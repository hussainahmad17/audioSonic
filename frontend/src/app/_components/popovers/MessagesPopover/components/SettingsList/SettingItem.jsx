import React from "react";
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
} from "@mui/material";
import PropTypes from "prop-types";

const SettingItem = ({
  icon,
  title,
  subheader,
  onChangeCallback,
  isChecked,
  value,
}) => {
  return (
    <ListItemButton component={"li"} disableRipple>
      <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
      <ListItemText primary={title} secondary={subheader} />
      {onChangeCallback && typeof onChangeCallback === "function" && (
        <Switch
          edge="end"
          onChange={() => onChangeCallback(value)}
          checked={isChecked}
          size={"small"}
        />
      )}
    </ListItemButton>
  );
};

export { SettingItem };

SettingItem.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  subheader: PropTypes.string,
  onChangeCallback: PropTypes.func,
  isChecked: PropTypes.boolean,
  value: PropTypes.string,
};
