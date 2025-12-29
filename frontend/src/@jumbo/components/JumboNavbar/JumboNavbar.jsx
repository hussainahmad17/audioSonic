import { JumboNavbarProvider } from "./components";
import PropTypes from "prop-types";

function JumboNavbar(
  props = { items: [], groupBehaviour: "collapsible", mini: false, open: true }
) {
  return <JumboNavbarProvider {...props} />;
}

export { JumboNavbar };

JumboNavbar.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        children: PropTypes.array.isRequired,
      }),
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        path: PropTypes.string.isRequired,
        icon: PropTypes.string,
        target: PropTypes.string,
      }),
    ])
  ),
  groupBehaviour: PropTypes.oneOf(["collapsible", "popover"]),
  mini: PropTypes.bool,
  open: PropTypes.bool,
  theme: PropTypes.object, // you can add a more detailed shape if needed
};
