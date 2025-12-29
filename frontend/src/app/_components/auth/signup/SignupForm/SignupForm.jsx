import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Stack,
  TextField,
  Button,
  CircularProgress,
  InputAdornment,
  IconButton,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Navigate } from "react-router-dom";
import { postRequest } from "@app/backendServices/ApiCalls";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import useNotify from "@app/_components/Notification/useNotify";

// ✅ Yup validation schema
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated, setUser } = useAuth();
  const notify = useNotify();
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      setLoading(true);
      const { name, email, password } = values;

      postRequest(
        "/auth/register",
        { name, email, password },
        (response) => {
          console.log("Signup response:", response);
          toast.success(response.data?.message || "Signup successful");
          navigate("/auth/login");
          setLoading(false);
          setSubmitting(false);
        },
        (error) => {
          console.error("Signup error response:", error);
          toast.error(
            error.response?.data?.message ||
            error.message ||
            "Signup failed. Please try again."
          );
          setLoading(false);
          setSubmitting(false);
        }
      );
    },

  });

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={2}>
          {/* Name */}
          <TextField
            label="Name"
            name="name"
            fullWidth
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />

          {/* Email */}
          <TextField
            label="Email"
            name="email"
            fullWidth
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          {/* Password */}
          <TextField
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            fullWidth
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />


          {/* Submit */}
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={formik.isSubmitting || loading}
            sx={{ bgcolor: "primary.main" }}
          >
            {loading ? <CircularProgress size={24} /> : "Sign Up"}
          </Button>
        </Stack>
      </form>
      <ToastContainer />
    </Box>
  );
};

export default SignupPage;
