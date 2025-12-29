import LoadingButton from "@mui/lab/LoadingButton";
import {
  JumboCheckbox,
  JumboForm,
  JumboInput,
  JumboOutlinedInput,
} from "@jumbo/vendors/react-hook-form";
import { validationSchema } from "../validation";
import { IconButton, InputAdornment, Stack, Typography } from "@mui/material";
import { Link } from "@jumbo/shared";
import React from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useNotify from "@app/_components/Notification/useNotify";

const LoginForm = () => {
  const { t } = useTranslation();
  const notify = useNotify();
  const { loading, login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = React.useState(false);

  async function handleLogin(data) {
    try {
      const response = await login({
        email: data.email, 
        password: data.password, 
      });
      if (response) {
        notify(response.msg, "success");
        if (response.user.isAdmin) {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      notify(error.message || "Login failed", "error");
    }
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <JumboForm validationSchema={validationSchema} onSubmit={handleLogin}>
      <Stack spacing={3} mb={3}>
        <JumboInput
          fullWidth
          fieldName="email"
          label={t("login.email")}
          type="email"
          defaultValue=""
        />

        <JumboOutlinedInput
          fullWidth
          fieldName="password"
          label={t("login.password")}
          type={showPassword ? "text" : "password"}
          margin="none"
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          sx={{ bgcolor: (theme) => theme.palette.background.paper }}
          defaultValue=""
        />

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <JumboCheckbox
            fieldName="rememberMe"
            label={t("login.rememberMe")}
            defaultChecked
          />
          <Typography textAlign="right" variant="body1">
            <Link underline="none" to="/auth/forgot_password">
              {t("login.forgotPassword")}
            </Link>
          </Typography>
        </Stack>

        <LoadingButton
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          loading={loading}
        >
          {t("login.loggedIn")}
        </LoadingButton>
      </Stack>
    </JumboForm>
  );
};

export { LoginForm };
