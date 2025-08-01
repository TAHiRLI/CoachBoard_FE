import * as yup from "yup";

import { Button, TextField } from "@mui/material";
import { FC, useEffect, useMemo } from "react";
import { Formik } from "formik";
import LangSelect from "../../components/langSelect/langSelect";
import Swal from "sweetalert2";
import { authService } from "@/API/Services/auth.service";
import { useColorMode } from "../../context/colorMode.context";
import { useTranslation } from "react-i18next";

const ForgotPasswordPage: FC = () => {
  //========================  
  // Hooks and context
  //========================
  const { t } = useTranslation();
  const { colorMode } = useColorMode();

  //========================
  // Form validation
  //========================
  const validationSchema = useMemo(() => {
    return yup.object().shape({
      username: yup.string().required(t("messages:requiredField")),
    });
  }, [t]);

  useEffect(() => {
    colorMode.setColorMode("light");
  }, []);

  //========================
  // Handle Form submit
  //========================
  const handleFormSubmit = async (
    values: { username: string },
    { setFieldError }: { setFieldError: (field: string, message: string) => void }
  ) => {
    try {
      // Call reset password endpoint using authService
      let res = await authService.getresetPasswordUrl(values.username);
      
      // Check response and show success message
      if (res.status === 204) {
        Swal.fire({
          icon: "success", 
          title: t("static:success"), 
          text: "Email Verification sent to your mail"
        });
      } else {
        // Handle unsuccessful response
        setFieldError("username", t("messages:incorrectUsername"));
      }
    } catch (err: any) {
      // Handle error case
      setFieldError("username", t("messages:incorrectUsername"));
    }
  };

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
            <p className="text-sm my-3">{t("static:wellcome")}</p>

            <Formik
              initialValues={{ username: "" }}
              onSubmit={handleFormSubmit}
              validationSchema={validationSchema}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
              }) => (
                <form onSubmit={handleSubmit} className="flex flex-col grow gap-5 justify-evenly">
                  <TextField
                    id="outlined-basic"
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
                  />

                  <Button variant="contained" type="submit" disabled={isSubmitting}>
                    {t("static:submit")}
                  </Button>
                </form>
              )}
            </Formik>

            <div className="absolute bottom-2 xl:left-12 left-4">
              <LangSelect />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;