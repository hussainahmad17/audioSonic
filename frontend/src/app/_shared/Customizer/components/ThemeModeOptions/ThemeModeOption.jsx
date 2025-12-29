import React from "react";
import { Button, ButtonGroup, Typography } from "@mui/material";
import { JumboCard } from "@jumbo/components";
import { Div } from "@jumbo/shared";
import {
  useJumboFooterTheme,
  useJumboHeaderTheme,
  useJumboSidebarTheme,
  useJumboTheme,
} from "@jumbo/components/JumboTheme/hooks";
import { mainTheme as mainThemeDark } from "@app/_themes/main/dark";
import { headerTheme as headerThemeDark } from "@app/_themes/header/dark";
import { sidebarTheme as sidebarThemeDark } from "@app/_themes/sidebar/dark";
import { footerTheme as footerThemeDark } from "@app/_themes/footer/dark";
import { mainTheme as mainThemeDefault } from "@app/_themes/main/default";
import { headerTheme as headerThemeDefault } from "@app/_themes/header/default";
import { sidebarTheme as sidebarThemeDefault } from "@app/_themes/sidebar/default";
import { footerTheme as footerThemeDefault } from "@app/_themes/footer/default";
import { mainTheme as mainThemeSemiDark } from "@app/_themes/main/semi-dark";
import { headerTheme as headerThemeSemiDark } from "@app/_themes/header/semi-dark";
import { sidebarTheme as sidebarThemeSemiDark } from "@app/_themes/sidebar/semi-dark";
import { footerTheme as footerThemeSemiDark } from "@app/_themes/footer/semi-dark";
import { useJumboLayout } from "@jumbo/components/JumboLayout/hooks";

const ThemeModeOption = () => {
  const { theme, setTheme } = useJumboTheme();
  const { setSidebarTheme } = useJumboSidebarTheme();
  const { setHeaderTheme } = useJumboHeaderTheme();
  const { setFooterTheme } = useJumboFooterTheme();
  const { headerOptions, setHeaderOptions } = useJumboLayout();

  const handleModeChange = React.useCallback(
    (type) => {
      switch (type) {
        case "light":
          setTheme({ type: "light", ...mainThemeDefault });
          setHeaderTheme({ ...theme, ...headerThemeDefault });
          setSidebarTheme({ ...theme, ...sidebarThemeDefault });
          setFooterTheme({ ...theme, ...footerThemeDefault });
          setHeaderOptions({
            ...headerOptions,
            sx: { ...headerOptions.sx, boxShadow: "none" },
          });
          return;
        case "semi-dark":
          setTheme({ type: "semi-dark", ...mainThemeSemiDark });
          setHeaderTheme({ ...theme, ...headerThemeSemiDark });
          setSidebarTheme({ ...theme, ...sidebarThemeSemiDark });
          setFooterTheme({ ...theme, ...footerThemeSemiDark });
          setHeaderOptions({
            ...headerOptions,
            sx: { ...headerOptions.sx, boxShadow: 23 },
          });
          return;
        case "dark":
          setTheme({ type: "dark", ...mainThemeDark });
          setHeaderTheme({ ...theme, ...headerThemeDark });
          setSidebarTheme({ ...theme, ...sidebarThemeDark });
          setFooterTheme({ ...theme, ...footerThemeDark });
          setHeaderOptions({
            ...headerOptions,
            sx: { ...headerOptions.sx, boxShadow: 23 },
          });
          return;
      }
    },
    [theme, setTheme, setFooterTheme, setHeaderTheme, setSidebarTheme]
  );
  return (
    <JumboCard
      title={
        <Typography variant={"h5"} mb={0}>
          Theme
        </Typography>
      }
      headerSx={{
        borderBottom: 1,
        borderColor: "divider",
      }}
      contentWrapper
    >
      <Div sx={{ color: (theme) => theme.palette.text.secondary }}>
        <ButtonGroup
          variant="outlined"
          aria-label="Basic button group"
          size="small"
        >
          <Button
            onClick={() => handleModeChange("light")}
            color={theme.type === "light" ? "primary" : "inherit"}
          >
            Lite
          </Button>
          <Button
            onClick={() => handleModeChange("semi-dark")}
            color={theme.type === "semi-dark" ? "primary" : "inherit"}
          >
            Semi Dark
          </Button>
          <Button
            onClick={() => handleModeChange("dark")}
            color={theme.type === "dark" ? "primary" : "inherit"}
          >
            Dark
          </Button>
        </ButtonGroup>
      </Div>
    </JumboCard>
  );
};

export { ThemeModeOption };
