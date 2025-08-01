import React, { ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Cookies from "universal-cookie";
import { ROUTES } from "@/router/routes";
import { logout } from "@/store/slices/auth.slice";
import { useDispatch } from "react-redux";

const cookies = new Cookies();

interface PrivateRouteProps {
  redirectUrl?: string; // Made callbackUrl optional
  roles?: string[]; // Made roles optional
  children: ReactNode; // Directly specify children as ReactNode
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ redirectUrl, roles, children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Track authentication state
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch(); 
  
  
  useEffect(() => {
    let user = cookies.get("user");

    if (!user?.token) {
      // User is not authenticated
      setIsAuthenticated(false);

      // Capture current location for redirection
      const currentPath = location.pathname + location.search;
      const redirectPath = redirectUrl || currentPath;

      // Redirect to login with the redirect parameter in URL (not state)
      navigate(`${ROUTES.LOGIN}?redirect=${encodeURIComponent(redirectPath)}`);
      return;
    }

    // User is authenticated, now check roles if specified
    if (roles && roles.length > 0) {
      const userRoles = user.roles || [];
      const hasRequiredRole = roles.some(role => userRoles.includes(role));
      
      if (!hasRequiredRole) {
        // User lacks required roles
        alert(`You are not authorized. Only users with the following roles can view this page: ${roles.join(', ')}`);

        // Redirect to login with the redirect parameter
        navigate(`${ROUTES.LOGIN}`);

        dispatch(logout())
        return;
      }
    }

    // User is authenticated and has required roles (if specified)
    setIsAuthenticated(true);
  }, [redirectUrl, roles, navigate, location]);

  if (isAuthenticated === null) {
    // Show a loading spinner or blank state while checking authentication
    return <></>;
  }

  // Render children if authenticated
  return isAuthenticated ? <>{children}</> : null;
};

export default PrivateRoute;