import { Span } from "@jumbo/shared";
import Popover from "@mui/material/Popover";
import React from "react";
import PropTypes from "prop-types";

const JumboDdPopover = ({ triggerButton, children, sx }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isOpen = Boolean(anchorEl);

  const handleClick = React.useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = React.useCallback(() => {
    setAnchorEl(null);
  }, []);

  return (
    <>
      <Span onClick={handleClick} sx={sx}>
        {triggerButton}
      </Span>
      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        sx={{
          mt: 2,
          mr: 6,
        }}
      >
        {children}
      </Popover>
    </>
  );
};

export { JumboDdPopover };

JumboDdPopover.propTypes = {
  children: PropTypes.node.isRequired,
  triggerButton: PropTypes.node.isRequired,
  sx: PropTypes.object, // Assuming sx is an object (you can adjust the type as needed)
};
