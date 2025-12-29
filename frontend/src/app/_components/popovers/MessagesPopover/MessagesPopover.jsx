import { Div } from "@jumbo/shared";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import React from "react";

import { useJumboTheme } from "@jumbo/components/JumboTheme/hooks";
import { Button, CardActions, Divider, ThemeProvider } from "@mui/material";
import {
  MessagesHeader,
  MessagesList,
  MessagesTriggerButton,
  SearchMessages,
  SettingHeader,
  SettingsList,
} from "./components";
import { JumboDdPopover } from "@jumbo/components/JumboDdPopover";

const MessagesPopover = () => {
  const [showSettings, setShowSettings] = React.useState(false);
  const { theme } = useJumboTheme();

  const toggleSettingWindow = React.useCallback(() => {
    setShowSettings((showSettings) => !showSettings);
  }, [setShowSettings]);

  return (
    <ThemeProvider theme={theme}>
      <JumboDdPopover triggerButton={<MessagesTriggerButton />}>
        {showSettings ? (
          <Div sx={{ width: 360, maxWidth: "100%" }}>
            <SettingHeader backClickCallback={toggleSettingWindow} />
            <SettingsList />
          </Div>
        ) : (
          <Div sx={{ width: 360, maxWidth: "100%" }}>
            <MessagesHeader settingMenuCallback={toggleSettingWindow} />
            <Div sx={{ m: 2, mt: 0 }}>
              <SearchMessages />
            </Div>
            <MessagesList />
            <Divider />
            <CardActions sx={{ justifyContent: "center" }}>
              <Button
                sx={{
                  textTransform: "none",
                  fontWeight: "normal",
                  "&:hover": { bgcolor: "transparent" },
                }}
                size={"small"}
                variant="text"
                endIcon={<ArrowForwardIcon />}
                disableRipple
              >
                View All
              </Button>
            </CardActions>
          </Div>
        )}
      </JumboDdPopover>
    </ThemeProvider>
  );
};

export { MessagesPopover };
