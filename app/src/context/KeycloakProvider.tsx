// src/components/KeycloakProvider.tsx
import { ReactNode, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";

import { Button } from "@mui/material";
import { initializeKeycloak } from "@/store/slices/keycloak.slice";

interface KeycloakProviderProps {
  children: ReactNode;
}

export const KeycloakProvider = ({ children }: KeycloakProviderProps) => {
  const dispatch = useAppDispatch();
  const { initialized, loading, error } = useAppSelector((state) => state.keycloak);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Prevent double initialization
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    console.log("🚀 Initializing Keycloak...");
    dispatch(initializeKeycloak());
  }, [dispatch]);

  // Show loading screen while Keycloak initializes
  if (!initialized || loading) {
    return <div className="w-screen h-screen flex justify-center items-center"><div>Loading authentication...</div></div>;
  }

  // Show error screen if initialization failed
  if (error) {
    return (
      <div
        className="w-screen h-screen"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <h3>Authentication Error</h3>
        <p>{error}</p>
        <Button variant="contained" onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  // Keycloak initialized successfully
  return <>{children}</>;
};
