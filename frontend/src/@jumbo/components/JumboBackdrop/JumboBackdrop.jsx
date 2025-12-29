import { Div } from "@jumbo/shared";
import PropTypes from "prop-types";

function JumboBackdrop({
  color = "#000000",
  opacity = 0.7,
  open = true,
  sx,
  children,
}) {
  return open ? (
    <Div
      sx={{
        inset: 0,
        ...sx,
        position: "absolute",
        bgcolor: color,
        opacity: opacity,
      }}
    >
      {children}
    </Div>
  ) : null;
}

export { JumboBackdrop };

JumboBackdrop.propTypes = {
  color: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  opacity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  open: PropTypes.bool,
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  children: PropTypes.node,
};
