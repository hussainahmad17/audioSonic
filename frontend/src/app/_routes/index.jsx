import Login1 from "@app/pages/auth/login1";
import { createBrowserRouter } from "react-router-dom";
import SamplePage from "@app/pages";
import { StretchedLayout } from "@app/_layouts/StretchedLayout";
import { SoloLayout } from "@app/_layouts/SoloLayout";
import withAuth from "@app/_hoc/withAuth";
import { Page, NotFound404 } from "@app/_components/_core";
import Landingpage from "@app/pages/user/landingpage/Landingpage";
import Signup1 from "@app/pages/auth/signup1";
import ForgotPassword from "@app/pages/auth/forgot-password";
import AllUsers from "@app/pages/admin/AllUsers/AllUsers";
import Categories from "@app/pages/admin/Categories/Categories";
import Logout from "@app/pages/admin/logout";
import AddAudio from "@app/pages/admin/Audios/AddAudio";
import ManageAudio from "@app/pages/admin/Audios/ManageAudio";
import AddPaidAudio from "@app/pages/admin/PaidAudios/AddPaidAudios";
import ChangePassword from "@app/pages/admin/ChangePassword/ChangePassword";
import SubCategories from "@app/pages/admin/sub-categories/Sub-Categories";
import ManagePaidAudio from "@app/pages/admin/PaidAudios/ManagePaidAudios";
import Success from "@app/pages/user/success";
import SuccessPage from "@app/pages/user/CustomAudioSuccess/CustomAudioSuccess";
// Reports removed from dashboard

const routes = [
  {
    path: "/admin/",
    element: <StretchedLayout />,
    children: [
      {
        path: "users",
        element: <Page Component={AllUsers} hoc={withAuth} />,
      },
      {
        path: "categories",
        element: <Page Component={Categories} hoc={withAuth} />,
      },
      {
        path: "sub-categories",
        element: <Page Component={SubCategories} hoc={withAuth} />,
      },
      {
        path: "logout",
        element: <Page Component={Logout} hoc={withAuth} />,
      },
      {
        path: "audio/add",
        element: <Page Component={AddAudio} hoc={withAuth} />,
      },
      {
        path: "audio/manage",
        element: <Page Component={ManageAudio} hoc={withAuth} />,
      },
      {
        path: "paidaudio/add",
        element: <Page Component={AddPaidAudio} hoc={withAuth} />,
      },
      {
        path: "paidaudio/manage",
        element: <Page Component={ManagePaidAudio} hoc={withAuth} />,
      },
      {
        path: "changepassword",
        element: <Page Component={ChangePassword} hoc={withAuth} />,
      },
      // reports routes removed
    ],
  },
  {
    path: "/auth/",
    element: <SoloLayout />,
    children: [
      {
        path: "login",
        element: <Login1 />,
      },
      {
        path: "signup",
        element: <Signup1 />,
      },
      {
        path: "forgot_password",
        element: <ForgotPassword />,
      },
    ],
  },
  {
    path: "/",
    element: <SoloLayout />,
    children: [
      {
        path: "",
        element: <Landingpage />,
      },
      {
        path: "success",
        element: <Success />,
      },
      {
        path: "custome_audio_payment_success",
        element: <SuccessPage />,
      }
    ],
  },
  {
    path: "*",
    element: <NotFound404 />,
  },
];

export const router = createBrowserRouter(routes);
