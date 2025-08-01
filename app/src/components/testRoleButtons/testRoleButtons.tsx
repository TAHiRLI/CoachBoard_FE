// testRoleButtons.tsx
import React from "react";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/router/routes";

const cookies = new Cookies();

interface TestRoleButtonsProps {
    redirectTo?: string;
}

const TestRoleButtons: React.FC<TestRoleButtonsProps> = ({ redirectTo }) => {
    const navigate = useNavigate();

    const setUserRole = (role: string) => {
        const user = cookies.get("user") || {};
        cookies.set("user", { ...user, token: "test-token", roles: [role] });

        if (redirectTo) {
            navigate(redirectTo);
        } else {
            window.location.reload();
        }
    };

    const logout = () => {
        cookies.remove("user", { path: "/" });
        
        localStorage.removeItem("user");
        sessionStorage.removeItem("user");
        
        navigate(ROUTES.LOGIN);
      };

    return (
        <div className="fixed top-4 right-4 flex gap-2 bg-gray-100 p-3 rounded shadow">
            <button
                onClick={() => setUserRole("admin")}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Login as Admin
            </button>
            <button
                onClick={() => setUserRole("manager")}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
                Login as Manager
            </button>
            <button
                onClick={logout}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
               Log out
            </button>
        </div>
    );
};

export default TestRoleButtons;