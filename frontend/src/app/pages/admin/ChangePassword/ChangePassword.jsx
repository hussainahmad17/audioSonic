import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { API_BASE_URL } from "@app/backendServices/ApiCalls";

const ChangePassword = () => {
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Show/Hide password state
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleTogglePassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // ✅ Simplified Yup validation schema
  const validationSchema = Yup.object({
    currentPassword: Yup.string().required("Current password is required"),
    newPassword: Yup.string().required("New password is required"),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Please confirm your new password"),
  });

  // ✅ Formik setup
  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setServerError("");
      setSuccessMessage("");
      setLoading(true);
      try {
        const response = await axios.put(
          `${API_BASE_URL}/auth/change-password`,
          {
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
            confirmNewPassword: values.confirmNewPassword,
          },
          { withCredentials: true }
        );

        if (response.data.success) {
          setSuccessMessage(response.data.message);
          formik.resetForm();
        }
      } catch (error) {
        setServerError(
          error.response?.data?.message || "Something went wrong. Try again."
        );
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 5,
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "#fff",
      }}
    >
      <Typography variant="h5" textAlign="center" mb={2}>
        Change Password
      </Typography>

      {serverError && <Alert severity="error">{serverError}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}

      <form onSubmit={formik.handleSubmit}>
        {/* Current Password */}
        <TextField
          fullWidth
          margin="normal"
          label="Current Password"
          type={showPassword.current ? "text" : "password"}
          {...formik.getFieldProps("currentPassword")}
          error={
            formik.touched.currentPassword && Boolean(formik.errors.currentPassword)
          }
          helperText={
            formik.touched.currentPassword && formik.errors.currentPassword
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => handleTogglePassword("current")}
                  edge="end"
                >
                  {showPassword.current ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* New Password */}
        <TextField
          fullWidth
          margin="normal"
          label="New Password"
          type={showPassword.new ? "text" : "password"}
          {...formik.getFieldProps("newPassword")}
          error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
          helperText={formik.touched.newPassword && formik.errors.newPassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => handleTogglePassword("new")}
                  edge="end"
                >
                  {showPassword.new ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Confirm New Password */}
        <TextField
          fullWidth
          margin="normal"
          label="Confirm New Password"
          type={showPassword.confirm ? "text" : "password"}
          {...formik.getFieldProps("confirmNewPassword")}
          error={
            formik.touched.confirmNewPassword &&
            Boolean(formik.errors.confirmNewPassword)
          }
          helperText={
            formik.touched.confirmNewPassword && formik.errors.confirmNewPassword
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => handleTogglePassword("confirm")}
                  edge="end"
                >
                  {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Change Password"}
        </Button>
      </form>
    </Box>
  );
};

export default ChangePassword;
