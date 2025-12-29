import { JumboScrollbar } from "@jumbo/components/JumboScrollbar";
import { useJumboSidebarTheme } from "@jumbo/components/JumboTheme/hooks";
import { Div } from "@jumbo/shared";
import React, { Suspense } from "react";
import { SidebarHeader, SidebarSkeleton } from "./components";
import { JumboNavbar } from "@jumbo/components";
import { useJumboLayout } from "@jumbo/components/JumboLayout/hooks";
import { SIDEBAR_STYLES, SIDEBAR_VIEWS } from "@jumbo/utilities/constants";
import PropTypes from "prop-types";

function Sidebar({ menus }) {
  const { sidebarTheme } = useJumboSidebarTheme();
  const { sidebarOptions } = useJumboLayout();
  return (
    <React.Fragment>
      {sidebarOptions?.style !== SIDEBAR_STYLES.CLIPPED_UNDER_HEADER && (
        <SidebarHeader />
      )}
      <JumboScrollbar>
        <Suspense
          fallback={
            <Div
              sx={{
                display: "flex",
                minWidth: 0,
                alignItems: "center",
                alignContent: "center",
                px: 3,
              }}
            >
              <SidebarSkeleton />
            </Div>
          }
        >
          {/* <SidebarSkeleton /> */}
          <JumboNavbar
            items={menus}
            theme={sidebarTheme}
            mini={sidebarOptions.view === SIDEBAR_VIEWS.MINI}
            open={sidebarOptions.open}
          />
        </Suspense>
      </JumboScrollbar>
    </React.Fragment>
  );
}

export { Sidebar };

Sidebar.propTypes = {
  menus: PropTypes.array,
};
