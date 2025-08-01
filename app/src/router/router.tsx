import { AdminPage, ManagerPage, SharedPage } from "@/pages/testPages/testPages";

import ForgotPasswordPage from "@/pages/login/forgotPassword";
import HomePage from "@/pages/home/homePage";
import Layout from "@/components/layout/layout";
import LoginPage from "@/pages/login/loginPage";
import NotFoundPage from "@/pages/notFoundPage/notFoundPage";
import PrivateRoute from "@/components/PrivateRoute/privateRoute";
import { ROUTES } from "./routes";
import RegisterPage from "@/pages/login/registerPage";
import ResetPasswordPage from "@/pages/login/resetPassword";
// router.tsx
import TestRoleButtons from "@/components/testRoleButtons/testRoleButtons";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter(
    [
        {
            path: ROUTES.ADMIN,
            element: (
                <>
                    <TestRoleButtons />
                    <PrivateRoute roles={["admin"]}>
                        <Layout>
                            <AdminPage />
                        </Layout>
                    </PrivateRoute>
                </>
            ),
        },
        {
            path: ROUTES.MANAGER,
            element: (
                <>
                    <TestRoleButtons />
                    <PrivateRoute roles={["manager"]}>
                        <Layout>
                            <ManagerPage />
                        </Layout>
                    </PrivateRoute>
                </>
            ),
        },
        {
            path: ROUTES.SHARED,
            element: (
                <>
                    <TestRoleButtons />
                    <PrivateRoute roles={["admin", "manager"]}>
                        <Layout>
                            <SharedPage />
                        </Layout>
                    </PrivateRoute>
                </>
            ),
        },
        {
            path: ROUTES.LOGIN,
            element: (
                <LoginPage />
            ),
        },
        {
            path: ROUTES.REGISTER,
            element: (
                <RegisterPage />
            ),
        },
        {
            path: ROUTES.FORGOT_PASSWORD,
            element: <ForgotPasswordPage />,
        },
        {
            path: ROUTES.RESET_PASSWORD,
            element: <ResetPasswordPage />,
        },
        {
            path: ROUTES.BASE,
            element: (
                <>
                    <TestRoleButtons />
                    <PrivateRoute redirectUrl={ROUTES.BASE}>
                        <Layout>
                            <HomePage />
                        </Layout>
                    </PrivateRoute>
                </>
            ),
        },
        {
            path: "*",
            element: <NotFoundPage />
        }
    ]
   
);
