import { List } from "@mui/material";
import { JumboNavIdentifier } from "../../..";

function SubMenus({ items }) {
  return (
    <List disablePadding>
      {items.map((child, index) => {
        const eventKey = new Date().valueOf();
        return (
          <JumboNavIdentifier
            item={child}
            key={`${eventKey}${index}`}
            isNested={true}
          />
        );
      })}
    </List>
  );
}

export { SubMenus };
