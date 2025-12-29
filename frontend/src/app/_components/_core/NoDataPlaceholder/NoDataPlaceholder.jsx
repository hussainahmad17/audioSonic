import { ASSET_IMAGES } from "@app/_utilities/constants/paths";
import { Div } from "@jumbo/shared";
import { Typography } from "@mui/material";
import React from "react";

const NoDataPlaceholder = ({ children }) => {
  if (children) return children;

  return (
    <Div sx={{ textAlign: "center", p: 3, m: "auto" }}>
      <img
        alt={"Not Found"}
        src={`${ASSET_IMAGES}/pages/not_found.svg`}
        width={300}
        height={300}
        style={{ verticalAlign: "middle" }}
      />
      <Typography variant={"h3"} color={"text.secondary"} mt={2}>
        No data available
      </Typography>
    </Div>
  );
};

export { NoDataPlaceholder };
