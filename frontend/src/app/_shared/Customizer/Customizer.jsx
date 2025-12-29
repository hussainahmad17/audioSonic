import { useApp } from "@app/_components/AppProvider/_hooks";
import { JumboScrollbar } from "@jumbo/components";
import { Div } from "@jumbo/shared";
import CloseIcon from "@mui/icons-material/Close";
import { Drawer, IconButton, Stack, Typography } from "@mui/material";
import { HeaderOptions } from "./components/HeaderOptions";
import { ThemeModeOption } from "./components/ThemeModeOptions";
import LayoutOptions from "./components/LayoutOptions/LayoutOptions";
import { LocalizationOptions } from "./components/LocalizationOptions";

const Customizer = () => {
  const { customizerVisibility, setCustomizerVisibility } = useApp();
  return (
    <Drawer
      anchor={"right"}
      open={customizerVisibility}
      onClose={() => setCustomizerVisibility(false)}
      sx={{
        zIndex: 1205,

        "& .MuiDrawer-paper": {
          width: 336,
        },
      }}
    >
      <Div
        sx={{
          display: "flex",
          minWidth: 0,
          position: "relative",
          zIndex: 2,
          p: (theme) => theme.spacing(1.5, 3),
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: 25,
        }}
      >
        <Typography variant={"h3"} mb={0}>
          Theme Settings
        </Typography>
        <IconButton
          aria-label="close"
          onClick={() => setCustomizerVisibility(false)}
        >
          <CloseIcon />
        </IconButton>
      </Div>
      <JumboScrollbar autoHide autoHideDuration={200} autoHideTimeout={500}>
        <Stack spacing={3} sx={{ px: 3, py: 2.5 }}>
          <LayoutOptions />
          <ThemeModeOption />
          <HeaderOptions />
          <LocalizationOptions />
        </Stack>
      </JumboScrollbar>
    </Drawer>
  );
};

export { Customizer };
