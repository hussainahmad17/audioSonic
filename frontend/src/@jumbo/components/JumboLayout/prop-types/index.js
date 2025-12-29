import {
  LAYOUT_CONTAINER_STYLES,
  LAYOUT_DENSITIES,
  POSITION_TYPES,
  SIDEBAR_ANCHOR_POSITIONS,
  SIDEBAR_SCROLL_TYPES,
  SIDEBAR_STYLES,
  SIDEBAR_VARIANTS,
  SIDEBAR_VIEWS,
} from '@jumbo/utilities/constants';
import PropTypes from 'prop-types';

const SidebarVariantKeys = Object.values(SIDEBAR_VARIANTS);
const SidebarStylesKeys = Object.values(SIDEBAR_STYLES);
const SidebarScrollTypeKeys = Object.values(SIDEBAR_SCROLL_TYPES);
const SidebarAnchorPositionKeys = Object.values(SIDEBAR_ANCHOR_POSITIONS);
const LayoutDensityKeys = Object.values(LAYOUT_DENSITIES);
const LayoutContainerStyleKeys = Object.values(LAYOUT_CONTAINER_STYLES);
const PositionTypeKeys = Object.values(POSITION_TYPES);
const SidebarViewKeys = Object.values(SIDEBAR_VIEWS);

const LayoutHeaderOptions = {
  hide: PropTypes.bool,
  fixed: PropTypes.bool.isRequired,
  height: PropTypes.number,
  sx: PropTypes.object,
  drawerBreakpoint: PropTypes.string,
};
const LayoutSidebarOptions = {
  open: PropTypes.bool,
  hide: PropTypes.bool,
  width: PropTypes.number,
  minWidth: PropTypes.number,
  variant: PropTypes.oneOf(SidebarVariantKeys),
  style: PropTypes.oneOf(SidebarStylesKeys),
  scrollType: PropTypes.oneOf(SidebarScrollTypeKeys),
  view: PropTypes.oneOf(SidebarViewKeys),
  anchor: PropTypes.oneOf(SidebarAnchorPositionKeys),
  drawerBreakpoint: PropTypes.string,
  drawer: PropTypes.bool,
  sx: PropTypes.object,
};

const LayoutFooterOptions = {
  hide: PropTypes.bool.isRequired,
  sx: PropTypes.object,
};

const LayoutRootOptions = {
  sx: PropTypes.object,
};

const LayoutContentOptions = {
  container: PropTypes.bool,
  sx: PropTypes.object,
};

const LayoutOptions = {
  header: PropTypes.shape({ ...LayoutHeaderOptions }).isRequired,
  sidebar: PropTypes.shape({ ...LayoutSidebarOptions }).isRequired,
  footer: PropTypes.shape({ ...LayoutFooterOptions }).isRequired,
  root: PropTypes.shape({ ...LayoutRootOptions }).isRequired,
  content: PropTypes.shape({ ...LayoutContentOptions }).isRequired,
};

const LayoutProps = {
  header: PropTypes.node,
  sidebar: PropTypes.node,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  rightSidebar: PropTypes.node,
};

export { LayoutOptions, LayoutProps };
