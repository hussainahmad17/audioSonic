import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import React from "react";
import PropTypes from "prop-types";

const JumboIconButton = ({ children, elevation, badge, ...restProps }) => {
  return (
    <IconButton
      sx={{
        width: 40,
        height: 40,
        boxShadow: elevation,
        padding: 1.25,
      }}
      {...restProps}
    >
      {badge ? (
        <Badge
          variant={badge.variant}
          sx={{
            "& .MuiBadge-badge": {
              top: -5,
              right: -5,
              width: 12,
              height: 12,
              borderRadius: "50%",
              border: 2,
              borderColor: "common.white",
              backgroundColor: (theme) => theme.palette.warning.main,
            },
          }}
        >
          {children}
        </Badge>
      ) : (
        children
      )}
    </IconButton>
  );
};

export { JumboIconButton };

JumboIconButton.propTypes = {
  children: PropTypes.node.isRequired,
  elevation: PropTypes.number.isRequired,
  badge: PropTypes.shape({
    // Assuming BadgeProps shape, adjust as per your BadgeProps definition
  }),
};
