import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  username: Yup.string().required("Enter your username"),
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string().required("Enter your password"),
});
