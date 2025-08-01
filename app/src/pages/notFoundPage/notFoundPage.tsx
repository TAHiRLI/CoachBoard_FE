import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/router/routes";

const NotFoundPage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen">
            <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
            <p className="mb-6">The page you are looking for may not be available or may have been moved.</p>
            <Link
                to={ROUTES.BASE}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Return to Home Page
            </Link>
        </div>
    );
};

export default NotFoundPage;