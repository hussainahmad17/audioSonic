import { ContentThemeProvider } from '@app/_components/_core';
import { JumboLayout, JumboLayoutProvider } from '@jumbo/components';
import { SIDEBAR_STYLES, SIDEBAR_VARIANTS } from '@jumbo/utilities/constants';

export function ContentLayout({
  header,
  sidebar,
  headerOptions = {},
  sidebarOptions = {},
  contentOptions = {},
  rightSidebar,
  rightSidebarOptions = {},
  rootOptions = {},
  wrapperOptions = {},
  mainOptions = {},
  children,
}) {
  return (
    <ContentThemeProvider>
      <JumboLayoutProvider
        layoutConfig={{
          header: {
            fixed: false,
            plain: true,
            ...headerOptions,
          },
          sidebar: {
            open: true,
            hide: false,
            variant: SIDEBAR_VARIANTS.PERMANENT,
            style: SIDEBAR_STYLES.CLIPPED_UNDER_HEADER,
            plain: true,
            ...sidebarOptions,
          },
          footer: {
            hide: true,
          },
          root: rootOptions,
          content: contentOptions,
          wrapper: wrapperOptions,
          main: mainOptions,
          rightSidebar: {
            open: true,
            hide: false,
            variant: SIDEBAR_VARIANTS.PERMANENT,
            style: SIDEBAR_STYLES.CLIPPED_UNDER_HEADER,
            plain: true,
            ...rightSidebarOptions,
          },
        }}
      >
        <JumboLayout
          header={header}
          sidebar={sidebar}
          rightSidebar={rightSidebar}
        >
          {children}
        </JumboLayout>
      </JumboLayoutProvider>
    </ContentThemeProvider>
  );
}
