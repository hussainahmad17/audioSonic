import { JumboBackdrop } from "@jumbo/components";
import { Div } from "@jumbo/shared";
import { getMarginStyle } from "@jumbo/utilities/helpers";
import PropTypes from "prop-types";

const JumboOverlay = ({
  opacity = 0.7,
  margin,
  show = true,
  color = "#000000",
  children,
  sx,
  hAlign,
  vAlign,
}) => {
  return (
    <Div
      sx={{
        ...getMarginStyle(margin),
        zIndex: 3,
        position: "absolute",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: hAlign ? hAlign : "stretch",
        justifyContent: vAlign ? vAlign : "stretch",
        ...sx,
      }}
    >
      <JumboBackdrop color={color} opacity={opacity} open={show} />
      <Div sx={{ zIndex: 2, position: "relative" }}>{children}</Div>
    </Div>
  );
};

export { JumboOverlay };

JumboOverlay.propTypes = {
  opacity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  margin: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    ),
  ]),
  show: PropTypes.bool,
  color: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  children: PropTypes.node.isRequired,
  sx: PropTypes.object.isRequired,
  hAlign: PropTypes.string,
  vAlign: PropTypes.string,
};
