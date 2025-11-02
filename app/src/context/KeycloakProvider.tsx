// src/components/KeycloakProvider.tsx
import { ReactNode, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";

import { initializeKeycloak } from "@/store/slices/keycloak.slice";

interface KeycloakProviderProps {
  children: ReactNode;
}

export const KeycloakProvider = ({ children }: KeycloakProviderProps) => {
  const dispatch = useAppDispatch();
  const { initialized, loading, error } = useAppSelector((state) => state.keycloak);

  useEffect(() => {
    console.log("🚀 Initializing Keycloak...");
    dispatch(initializeKeycloak());
  }, [dispatch]);

  // Show loading screen while Keycloak initializes
  if (!initialized || loading) {
    return <></>;
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
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  // Keycloak initialized successfully
  return <>{children}</>;
};
