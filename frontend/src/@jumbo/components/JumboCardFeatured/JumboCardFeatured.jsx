import { Div } from "@jumbo/shared";
import { getBackgroundColorStyle } from "@jumbo/utilities/helpers";
import { Card, Stack } from "@mui/material";
import { JumboBackdrop } from "../JumboBackdrop";
import PropTypes from "prop-types";

function JumboCardFeatured({
  direction = "column",
  separator = true,
  separatorSx,
  spacing = 1,
  bgcolor,
  backdrop,
  children,
  sx,
  contentWrapperProps,
  image,
  imageWrapperSx,
  fitToWidth = true,
}) {
  const bgcolorStyle = getBackgroundColorStyle(bgcolor);

  const tickAlign = ["column", "column-reverse"].includes(direction)
    ? { m: "0 auto 16px" }
    : {};

  return (
    <Card sx={{ ...bgcolorStyle, position: "relative", ...sx }}>
      <JumboBackdrop
        color={backdrop?.color}
        opacity={backdrop?.opacity}
        open={!!backdrop}
      />
      <Stack direction={direction} spacing={spacing} {...contentWrapperProps}>
        <Div sx={{ p: 3 }}>
          {separator && (
            <Div
              sx={{
                width: 24,
                height: 4,
                bgcolor: "grey.500",
                borderRadius: 4,
                ...tickAlign,
                ...separatorSx,
              }}
            />
          )}
          {children}
        </Div>
        {image && (
          <Div
            sx={{
              height: 175,
              ...imageWrapperSx,
              position: "relative",
              overflow: "hidden",
              "& > img": {
                ...(fitToWidth && {
                  objectFit: "cover",
                  height: "100%",
                  width: "100%",
                  objectPosition: "center",
                }),
              },
            }}
          >
            {image}
          </Div>
        )}
      </Stack>
    </Card>
  );
}

export { JumboCardFeatured };

JumboCardFeatured.propTypes = {
  direction: PropTypes.oneOf(["column", "row", "column-reverse", "row-reverse"])
    .isRequired,
  separator: PropTypes.bool,
  separatorSx: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  spacing: PropTypes.number,
  fitToWidth: PropTypes.bool,
  bgcolor: PropTypes.arrayOf(PropTypes.string),
  backdrop: PropTypes.shape({ ...JumboBackdrop.propTypes }),
  children: PropTypes.node.isRequired,
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  contentWrapperProps: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  image: PropTypes.node,
  imageWrapperSx: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};
