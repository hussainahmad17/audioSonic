import { Div } from "@jumbo/shared";
import { Button, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Div
      sx={{
        py: 2,
        px: { lg: 6, xs: 4 },
        borderTop: 2,
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Div
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant={"body1"} color={"text.primary"}>
          Copyright Company Name © 2025
        </Typography>
        {/* <Div sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="h5"
            sx={{
              display: { xs: "none", sm: "block" },
              mb: 0,
              mr: 2,
              color: "primary.main",
            }}
          >
            $24 Only
          </Typography>
          <Button variant="contained">Buy Now</Button>
        </Div> */}
      </Div>
    </Div>
  );
};

export { Footer };
