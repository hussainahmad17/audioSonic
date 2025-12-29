import { useTranslation } from "react-i18next";

export function getMenus() {
  const { t } = useTranslation();
  return [
    {
      label: t("sidebar.menu.sample"),
      children: [
        {
          path: "/admin/users",
          label: t("All Users"),
          icon: "sample",
        },
        {
          path: "/admin/categories",
          label: t("Categories"),
          icon: "sample",
        },
        {
          path: "/admin/sub-categories",
          label: t("Sub-Categories"),
          icon: "sample",
        },
        {
          label: t("Free Audio"),
          collapsible: true,
          icon: "sample",
          children: [
            {
              path: "/admin/audio/add",
              label: t("Add"),
            },
            {
              path: "/admin/audio/manage",
              label: t("Manage"),
            },
          ],
        },
        {
          label: t("Paid Audio"),
          collapsible: true,
          icon: "sample",
          children: [
            {
              path: "/admin/paidaudio/add",
              label: t("Add"),
            },
            {
              path: "/admin/paidaudio/manage",
              label: t("Manage"),
            },
          ],
        },
        {
          path: "/admin/changepassword",
          label: t("Change Password"),
          icon: "forgot-password",
        },
        // Reports removed
        {
          path: "/admin/logout",
          label: t("Logout"),
          icon: "login",
        },
      ],
    },
  ];
}
