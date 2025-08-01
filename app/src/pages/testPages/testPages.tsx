import React from "react";

export const AdminPage: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Page</h1>
      <p>This page can only be viewed by admin users.</p>
    </div>
  );
};

export const ManagerPage: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Manager Page</h1>
      <p>This page can only be viewed by administrator users.</p>
    </div>
  );
};

export const SharedPage: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Shared Page</h1>
      <p>This page can be viewed by both admin and manager users.</p>
    </div>
  );
};