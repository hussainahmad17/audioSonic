import { Popover } from "@mui/material";
import { SubMenus } from "..";

function SubMenusPopover({ items, anchorEl, onClose, miniAndClosed }) {
  const open = Boolean(anchorEl);

  return (
    <Popover
      id="mouse-over-popover"
      sx={{
        pointerEvents: "none",
      }}
      open={open}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      onClose={onClose}
      disableRestoreFocus
    >
      <SubMenus items={items} miniAndClosed={miniAndClosed} />
    </Popover>
  );
}

export { SubMenusPopover };
