import { Collapse } from "@mui/material";
import { SubMenus } from "..";

function SubMenusCollapsible({ items, open, miniAndClosed }) {
  return (
    <Collapse component={"li"} in={open} timeout="auto" unmountOnExit>
      <SubMenus items={items} miniAndClosed={miniAndClosed} />
    </Collapse>
  );
}

export { SubMenusCollapsible };
