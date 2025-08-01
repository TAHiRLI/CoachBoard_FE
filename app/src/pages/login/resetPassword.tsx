import * as React from "react";
import * as yup from "yup";

import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { FC, useEffect } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import LangSelect from "../../components/langSelect/langSelect";
import Swal from "sweetalert2";
import { TUser } from "../../lib/types/authTypes";
import { apiClient } from "../../API/apiClient";
import dayjs from "dayjs";
import { loginSuccess } from "../../store/slices/auth.slice";
import { useColorMode } from "../../context/colorMode.context";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface IResetPasswordFormValues {
    username: string;
    password: string;
    token: string;
    remember: boolean;
}

interface Props {
    username?: string | null;
    token?: string;
}

interface ApiResponse {
    token?: string;
}

const ResetPassword: FC<Props> = ({ token: propToken, username: propUsername }) => {
    // URL'den token ve username almak
    const [searchParams] = useSearchParams();
    const urlToken = searchParams.get('token');
    const urlUsername = searchParams.get('username');
    
    // Props ile gelen veya URL'den alınan değerleri kullan
    const initialToken = propToken || urlToken || '';
    const initialUsername = propUsername || urlUsername || '';
    
    const [currentToken, setCurrentToken] = React.useState(initialToken);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { colorMode } = useColorMode();

    // Sayfa yüklendiğinde light mode'a geçiş
    useEffect(() => {
        colorMode.setColorMode("light");
    }, []);

    //========================
    // Form validation
    //========================
    const validationSchema = yup.object().shape({
        username: yup.string().required(t("requiredField")),
        password: yup
            .string()
            .required(t("requiredField"))
            .min(3, t("messages:passwordMin"))
    });

    //========================
    // Formik hook - destructure edilmiş
    //========================
    const {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting: formikSubmitting,
    } = useFormik<IResetPasswordFormValues>({
        initialValues: { 
            username: initialUsername, 
            password: "", 
            token: currentToken, 
            remember: false 
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setFieldError, setSubmitting }) => {
            if (!currentToken) {
                Swal.fire({
                    icon: 'error',
                    title: t("messages:error"),
                    text: t("messages:tokenMissing") || "Token is missing. Please use the reset link from your email."
                });
                setSubmitting(false);
                return;
            }

            setIsSubmitting(true);
            try {
                const res = await apiClient.post("api/auth/ResetPassword", { ...values, token: currentToken }, {
                    validateStatus: () => true, // Prevent Axios from throwing errors
                });

                if (res.status === 601) {
                    // Type checking the response data
                    const responseData = res.data as ApiResponse;
                    if (responseData.token) {
                        setCurrentToken(responseData.token);
                    }
                    setFieldError("password", t("messages:useDifferentPassword"));
                } else if (res.status === 200) {
                    // Properly type the response data
                    const userData = res.data as TUser & { expiresIn: string };
                    const user: TUser = {
                        ...userData
                    };

                    // Parse the expiration date properly
                    const expirationDate = typeof userData.expiresIn === 'string'
                        ? dayjs(userData.expiresIn).toDate()
                        : userData.expiresIn;

                    // Dispatch the loginSuccess action with the user data and expiration
                    dispatch(loginSuccess({
                        ...user,
                        expiresAt: expirationDate
                    }));

                    // Show success message
                    Swal.fire({
                        icon: 'success',
                        title: t("messages:passwordResetSuccess"),
                        text: t("messages:passwordResetSuccessMessage")
                    });

                    // Redirect user or perform next steps
                    // window.location.href = "/login"; // Uncomment if you want to redirect
                } else if (res.status === 498) {
                    Swal.fire({
                        icon: 'error',
                        title: t("messages:tokenExpired"),
                        text: t("messages:tokenExpiredMessage")
                    });
                } else {
                    setFieldError("username", t("messages:resetPasswordError"));
                    setFieldError("password", t("messages:resetPasswordError"));

                    Swal.fire({
                        icon: 'error',
                        title: t("messages:error"),
                        text: t("messages:generalErrorMessage")
                    });
                }
            } catch (err) {
                // Proper error handling
                console.error("Password reset error:", err);
                Swal.fire({
                    icon: 'error',
                    title: t("messages:error"),
                    text: t("messages:networkErrorMessage")
                });
            } finally {
                setSubmitting(false);
                setIsSubmitting(false);
            }
        }
    });

    //========================
    // Handle password show/hide
    //========================
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    // Token yoksa ve form submit edilmemişse uyarı göster
    React.useEffect(() => {
        if (!currentToken && !isSubmitting) {
            console.warn("Reset password token is missing");
        }
    }, [currentToken, isSubmitting]);

    return (
        <div className="loginPage flex justify-center items-center text-black">
            <div className="container md:px-[60px] absolute z-10">
                <div className="content grid sm:grid-cols-2 h-max rounded-lg overflow-hidden border bg-white">
                    <div className="content_info p-6 py-14 relative">
                        <div className="content_info_salut text-center">
                            <h4 className="text-2xl font-semibold mt-5">
                                {t("static:wellcomeTo")} <span>{t("app:name")}</span>
                            </h4>
                            <small>
                                <span>{t("static:createdBy")} </span>
                                <a href="https://www.google.az" target="_blank" rel="noreferrer">
                                    example
                                </a>
                            </small>
                        </div>
                    </div>

                    <div className="login_form xl:p-14 p-6 pb-20 relative flex flex-col">
                        <h2>{t("static:resetPassword")}</h2>
                        <p className="text-sm my-3">{t("static:resetPasswordMessage")}</p>

                        <form onSubmit={handleSubmit} className="flex flex-col grow gap-5 justify-evenly">
                            <TextField
                                id="username"
                                label={t("user:username")}
                                required
                                variant="outlined"
                                type="text"
                                name="username"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.username}
                                error={!!touched.username && !!errors.username}
                                helperText={touched.username && errors.username}
                                disabled={isSubmitting || formikSubmitting}
                            />

                            <TextField
                                fullWidth
                                type={showPassword ? "text" : "password"}
                                label={t("user:newPassword")}
                                id="password"
                                name="password"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.password}
                                error={!!touched.password && !!errors.password}
                                helperText={touched.password && errors.password}
                                required
                                disabled={isSubmitting || formikSubmitting}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                                disabled={isSubmitting || formikSubmitting}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button
                                variant="contained"
                                type="submit"
                                disabled={isSubmitting || formikSubmitting}
                            >
                                {isSubmitting || formikSubmitting ? t("static:submitting") : t("static:submit")}
                            </Button>
                        </form>

                        <div className="absolute bottom-2 xl:left-12 left-4">
                            <LangSelect />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;