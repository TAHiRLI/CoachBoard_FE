import React, { ReactNode } from "react";

import { useAppSelector } from "@/store/store";

interface PrivateRouteProps {
  children: ReactNode;
  roles?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, roles }) => {
  const { authenticated, initialized, loading, userInfo } = useAppSelector(
    (state) => state.keycloak
  );

  if (!initialized || loading) {
    return (
      <div className="w-full" style={{ padding: 24 }}>
        Loading...
      </div>
    );
  }

  if (!authenticated) {
    // Keycloak login-required already handles redirect
    return null;
  }

  // ✅ Role-based authorization
  if (roles && roles.length > 0) {
    const userRoles =
      userInfo?.realm_access?.roles ||
      userInfo?.resource_access?.["coachboard-front"]?.roles ||
      [];
    const hasRequiredRole = roles.some((role) => userRoles.includes(role));

    if (!hasRequiredRole) {
      return (
        <div className="w-full text-center" style={{ padding: 24 }}>
          Access denied — insufficient permissions.
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default PrivateRoute;