import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { Avatar, CardActions, CardContent, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import React from "react";
import PropTypes from "prop-types";
import { Div } from "@jumbo/shared/Div";

const CardIconText = ({
  variant = "contained",
  icon,
  title,
  subTitle,
  color = "primary.main",
  onHoverIcon,
  height = 116,
  disableHoverEffect,
  hideArrow,
  ...restProps
}) => {
  const [hover, setHover] = React.useState(false);
  const [avatarVariant, setAvatarVariant] = React.useState("circular");
  React.useEffect(() => {
    if (!disableHoverEffect) {
      setAvatarVariant(hover ? "square" : "circular");
    }
  }, [disableHoverEffect, hover]);

  const avatarProps =
    variant === "contained"
      ? {
          bgcolor: color,
          transition: "all 0.3s ease-in-out",
          color: "common.white",
        }
      : {
          bgcolor: "common.white",
          transition: "all 0.3s ease-in-out",
          border: "1px solid",
          borderColor: color,
          color: color,
        };

  return (
    <Card {...restProps}>
      <CardActions
        disableSpacing
        onMouseOver={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        sx={{
          p: 0,
          alignItems: "stretch",
          position: "relative",
          height: height,
          "&:hover .CardAction-arrow": {
            transform: "translate(-1rem, -50%)",
          },
        }}
      >
        <Div
          sx={{
            display: "flex",
            width: 95,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Avatar
            variant={avatarVariant}
            sx={{
              ...avatarProps,
              ...(hover && !disableHoverEffect
                ? { width: "100%", height: "100%" }
                : { width: 56, height: 56 }),
            }}
          >
            {hover && onHoverIcon ? onHoverIcon : icon}
          </Avatar>
        </Div>
        <CardContent sx={{ p: 2.5, flex: 1, alignSelf: "center" }}>
          {typeof title === "string" ? (
            <Typography variant={"h2"} fontWeight={"500"} mb={0.5}>
              {title}
            </Typography>
          ) : (
            title
          )}

          {typeof subTitle === "string" ? (
            <Typography variant={"h5"} color={"text.primary"}>
              {subTitle}
            </Typography>
          ) : (
            subTitle
          )}
        </CardContent>
        {!hideArrow && (
          <Div
            className="CardAction-arrow"
            sx={{
              right: "0",
              top: "50%",
              color: "primary.main",
              position: "absolute",
              transition: "all 0.3s ease",
              transform: "translate(100%, -50%)",
            }}
          >
            <ArrowForwardOutlinedIcon />
          </Div>
        )}
      </CardActions>
    </Card>
  );
};

export { CardIconText };

CardIconText.propTypes = {
  variant: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  title: PropTypes.node.isRequired,
  subTitle: PropTypes.node.isRequired,
  color: PropTypes.string.isRequired,
  onHoverIcon: PropTypes.node,
  height: PropTypes.number,
  disableHoverEffect: PropTypes.bool.isRequired,
  hideArrow: PropTypes.bool.isRequired,
};
