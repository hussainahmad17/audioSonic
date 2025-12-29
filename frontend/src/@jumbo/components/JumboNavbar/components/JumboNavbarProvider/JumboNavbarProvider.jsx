import { useJumboTheme } from "@jumbo/components/JumboTheme/hooks";
import { List } from "@mui/material";
import { JumboNavIdentifier } from "..";
import { JumboNavbarContext } from "./JumboNavbarContext";
import { isNavSection } from "@jumbo/utilities/helpers";
import PropTypes from "prop-types";

function JumboNavbarProvider({
  items,
  mini = false,
  open = true,
  groupBehaviour = "collapsible",
  theme,
}) {
  const miniAndClosed = !!mini && !open;
  const { theme: jumboTheme } = useJumboTheme();
  const contextValue = {
    items,
    miniAndClosed,
    theme: theme || jumboTheme,
    groupBehaviour,
    mini,
    open,
  };
  let isFirstSection = true;
  return (
    <JumboNavbarContext.Provider value={contextValue}>
      <List
        disablePadding
        sx={{
          mr: miniAndClosed ? 0 : 2,
          pb: 2,
        }}
      >
        {items.map((item, index) => {
          if (isNavSection(item) && isFirstSection === true) {
            isFirstSection = false;
            return (
              <JumboNavIdentifier
                item={item}
                key={index}
                isFirstSection={true}
              />
            );
          }
          return <JumboNavIdentifier item={item} key={index} />;
        })}
      </List>
    </JumboNavbarContext.Provider>
  );
}

export { JumboNavbarProvider };

const NavbarItemPropType = PropTypes.shape({
  label: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  icon: PropTypes.string,
  target: PropTypes.string,
});

const NavbarGroupPropType = PropTypes.shape({
  label: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.object, NavbarItemPropType])
  ).isRequired,
  collapsible: PropTypes.bool,
  icon: PropTypes.string,
});

const NavbarSectionPropType = PropTypes.shape({
  label: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(
    PropTypes.oneOfType([NavbarGroupPropType, NavbarItemPropType])
  ).isRequired,
});

const MenuItemPropType = PropTypes.oneOfType([
  NavbarSectionPropType,
  NavbarGroupPropType,
  NavbarItemPropType,
]);

JumboNavbarProvider.propTypes = {
  items: PropTypes.arrayOf(MenuItemPropType).isRequired,
  mini: PropTypes.bool,
  open: PropTypes.bool,
  theme: PropTypes.object,
  groupBehaviour: PropTypes.oneOf(["collapsible", "popover"]),
};
