import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/router/routes";

const HomePage: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Ana Sayfa</h1>

      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <Link
            to={ROUTES.ADMIN}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Admin Page
          </Link>
          <span className="text-gray-500">(Only admin can access)</span>
        </div>

        <div className="flex gap-4">
          <Link
            to={ROUTES.MANAGER}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Manager Page
          </Link>
          <span className="text-gray-500">(Only manager can access)</span>
        </div>

        <div className="flex gap-4">
          <Link
            to={ROUTES.SHARED}
            className="px-4 py-2 bg-purple-500 text-white rounded"
          >
            Shared Access Page
          </Link>
          <span className="text-gray-500">(Both admin and manager can access)</span>
        </div>

        <div className="flex gap-4">
          <Link
            to="/not-found"
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
           Missing Page
          </Link>
          <span className="text-gray-500">(shows 404 page)</span>
        </div>
      </div>
    </div>
  );
};

export default HomePage;