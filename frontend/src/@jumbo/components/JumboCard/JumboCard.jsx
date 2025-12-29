import {
  getBackgroundColorStyle,
  getBackgroundImageStyle,
} from "@jumbo/utilities/helpers";
import { Card, CardContent, CardHeader } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";

function JumboCard({
  avatar,
  title,
  subheader,
  action,
  bgcolor,
  bgimage,
  textColor,
  sx = {},
  children,
  reverse = false,
  contentWrapper = false,
  contentSx = {},
  headerSx = {},
}) {
  const backgroundColorStyle = getBackgroundColorStyle(bgcolor);
  const colorStyle = textColor ? { color: textColor } : {};
  const backgroundImageStyle = getBackgroundImageStyle(bgimage);
  return (
    <Card
      sx={{
        position: "relative",
        ...backgroundColorStyle,
        ...backgroundImageStyle,
        ...colorStyle,
        ...sx,
      }}
    >
      {reverse &&
        (contentWrapper ? (
          <CardContent sx={contentSx}>{children}</CardContent>
        ) : (
          children
        ))}

      {(title || subheader || action) && (
        <CardHeader
          avatar={avatar}
          title={title}
          subheader={subheader}
          action={action}
          sx={headerSx}
        />
      )}

      {!reverse &&
        (contentWrapper ? (
          <CardContent sx={contentSx}>{children}</CardContent>
        ) : (
          children
        ))}
    </Card>
  );
}

export { JumboCard };

JumboCard.propTypes = {
  avatar: PropTypes.node,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  subheader: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  action: PropTypes.node,
  bgcolor: PropTypes.arrayOf(PropTypes.string),
  bgimage: PropTypes.string,
  textColor: PropTypes.string,
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  children: PropTypes.node,
  reverse: PropTypes.bool,
  contentWrapper: PropTypes.bool,
  contentSx: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  headerSx: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};
