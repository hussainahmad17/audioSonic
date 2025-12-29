import { isNavGroup, isNavItem, isNavSection } from "@jumbo/utilities/helpers";
import { JumboNavGroup, JumboNavItem } from "..";
import { JumboNavSection } from "../JumboNavSection";

function JumboNavIdentifier({
  item,
  isNested = false,
  isFirstSection = false,
}) {
  if (isNavGroup(item)) {
    return <JumboNavGroup item={item} />;
  } else if (isNavSection(item)) {
    return <JumboNavSection item={item} isFirstSection={isFirstSection} />;
  } else if (isNavItem(item)) {
    return <JumboNavItem item={item} isNested={isNested} />;
  }

  return null;
}

export { JumboNavIdentifier };
