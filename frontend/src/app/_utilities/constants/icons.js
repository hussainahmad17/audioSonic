import {
  FacebookOutlined,
  Instagram,
  LinkedIn,
  Mail,
  MessageOutlined,
  NotificationsActiveRounded,
  Refresh,
  Settings,
  TaskAltOutlined,
  Twitter,
  YouTube,
} from "@mui/icons-material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LoginIcon from "@mui/icons-material/Login";
import PasswordOutlinedIcon from "@mui/icons-material/PasswordOutlined";
const APP_ICONS = [
  {
    name: "sample",
    Component: EditOutlinedIcon,
    props: { sx: { fontSize: 20 } },
  },
  {
    name: "profile-3",
    Component: AccountCircleOutlinedIcon,
    props: { sx: { fontSize: 20 } },
  },
  { name: "login", Component: LoginIcon, props: { sx: { fontSize: 20 } } },
  {
    name: "forgot-password",
    Component: PasswordOutlinedIcon,
    props: { sx: { fontSize: 20 } },
  },
];

export { APP_ICONS };
