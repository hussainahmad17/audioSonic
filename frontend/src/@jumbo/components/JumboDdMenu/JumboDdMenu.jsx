import { MoreHorizOutlined } from "@mui/icons-material";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import React from "react";
import PropTypes from "prop-types";

const JumboDdMenu = ({ icon, menuItems, onClickCallback }) => {
  const [menuEl, setMenuEl] = React.useState(null);
  const openMenu = Boolean(menuEl);

  const handleMenuItemClick = (option) => {
    setMenuEl(null);
    if (typeof onClickCallback === "function") onClickCallback(option);
  };

  return (
    <>
      <IconButton
        sx={{
          color: "inherit",
        }}
        onClick={(event) => {
          setMenuEl(event.currentTarget);
          event.stopPropagation();
        }}
      >
        {icon ? icon : <MoreHorizOutlined />}
      </IconButton>
      <Menu open={openMenu} anchorEl={menuEl} onClose={() => setMenuEl(null)}>
        {menuItems?.map((option, index) => (
          <MenuItem
            key={index}
            selected={option.title === "Refresh"}
            onClick={(e) => {
              handleMenuItemClick(option);
              e.stopPropagation();
            }}
          >
            {option.icon && <ListItemIcon>{option.icon}</ListItemIcon>}

            <ListItemText>{option.title}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export { JumboDdMenu };

JumboDdMenu.propTypes = {
  icon: PropTypes.node,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.node,
      title: PropTypes.node,
      slug: PropTypes.node,
      action: PropTypes.node,
    })
  ),
  onClickCallback: PropTypes.func,
};
