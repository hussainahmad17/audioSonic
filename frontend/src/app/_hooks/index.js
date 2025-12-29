import { useMediaQuery } from "@mui/material";

function useSmallScreen() {
  return useMediaQuery("(max-width:620px)");
}

export { useSmallScreen };
