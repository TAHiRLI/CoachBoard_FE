import "./login.css";

import * as yup from "yup";

import { AppDispatch, RootState } from "../../store/store";
import { Button, CircularProgress, TextField } from "@mui/material";
import { Formik, FormikHelpers } from "formik";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LoginCredentials, TUser } from "@/lib/types/authTypes";
import { loginFailure, loginStart, loginSuccess } from "@/store/slices/auth.slice";
import { useDispatch, useSelector } from "react-redux";

import LangSelect from "@/components/langSelect/langSelect";
import React from "react";
import { Routes } from "@/router/routes";
import Swal from "sweetalert2";
import { authService } from "@/API/Services/auth.service";
import img from "@/assets/images/Soccer-bro.png";
import { useTranslation } from "react-i18next";

const validationSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

interface ApiError {
  success: boolean;
  message: string;
  data: {
    token: string;
  };
  statusCode: number;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const { loading } = useSelector((state: RootState) => state.auth);
  const redirectPath = new URLSearchParams(location.search).get("redirect") || Routes.Base;
  const { t } = useTranslation();

  const handleFormSubmit = async (values: LoginCredentials, { setFieldError }: FormikHelpers<LoginCredentials>) => {
    dispatch(loginStart());

    try {
      const response = await authService.login(values);

      if (response.status === 200 && response.data) {
        const userData = response.data as TUser;

        // Update Redux state with user data for normal login
        dispatch(loginSuccess(userData));

        // Navigate to redirect path
        navigate(redirectPath);
      } else {
        throw new Error("Login response was not successful");
      }
    } catch (err: any) {
      console.log("Login error:", err);

      // Check if response is 400 and has statusCode 428 in the body
      if (err.response?.status === 400 && err.response?.data?.statusCode === 428) {
        const responseData = err.response.data as ApiError;
        const token = responseData.data?.token || "";

        Swal.fire({
          icon: "error",
          text: "Change your password",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate(
              `${Routes.ResetPassword}?username=${encodeURIComponent(values.username)}&token=${encodeURIComponent(
                token
              )}&redirect=${encodeURIComponent(redirectPath)}`
            );
          }
        });
        return;
      }

      // Update Redux state with error for other error cases
      const errorMessage =
        err.response?.data?.message || (err instanceof Error ? err.message : "Login failed. Please try again.");

      dispatch(loginFailure(errorMessage));

      // Set field error for display
      setFieldError("password", errorMessage);
    }
  };

  return (
    <div className="loginPage w-full h-screen flex justify-center items-center text-black">
      <div className="container md:px-[60px] z-10">
        <div className="content grid sm:grid-cols-2 h-max rounded-lg overflow-hidden border bg-white">
          <div className="content_info p-6 py-14 relative">
            <div className="content_info_image">
              <img src={img} alt="clock" className="w-[50%] m-auto" />
            </div>
            <div className="content_info_salut text-center">
              <h4 className="text-2xl font-semibold mt-5">
                {t("static.wellcomeTo")} <span>{t("app:name")}</span>
              </h4>
              <small>
                <span>Created By </span>
                <a href="https://www.linkedin.com/in/tahirtahirli/" target="_blank" rel="noreferrer">
                  Tahir Tahirli
                </a>
              </small>
            </div>
          </div>

          <div className="login_form xl:p-14 p-6 pb-20 relative flex flex-col">
            <>
              <h2>Login</h2>
              <Formik
                initialValues={{ username: "", password: "" }}
                onSubmit={handleFormSubmit}
                validationSchema={validationSchema}
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                  <form onSubmit={handleSubmit} className="flex flex-col grow gap-5 justify-evenly">
                    <TextField
                      id="outlined-basic"
                      fullWidth
                      margin="normal"
                      label="Username"
                      name="username"
                      variant="outlined"
                      value={values.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.username && Boolean(errors.username)}
                      helperText={touched.username && errors.username}
                      disabled={loading}
                    />
                    <TextField
                      id="password"
                      fullWidth
                      margin="normal"
                      label="Password"
                      name="password"
                      type="password"
                      variant="outlined"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                      disabled={loading}
                    />
                    <Link to={Routes.ForgotPassword}>Forgot Password?</Link>
                    <Button variant="contained" type="submit" disabled={loading || isSubmitting}>
                      {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
                    </Button>
                  </form>
                )}
              </Formik>
            </>
            <div className="absolute bottom-2 xl:left-12 left-4">
              <LangSelect />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
