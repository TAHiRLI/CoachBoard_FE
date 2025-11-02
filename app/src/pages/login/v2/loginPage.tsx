import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useNavigate, useSearchParams } from "react-router-dom";

import { initializeKeycloak } from "@/store/slices/keycloak.slice";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const { authenticated, initialized, loading } = useAppSelector((s) => s.keycloak);
  const [manualMode, setManualMode] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // 🔐 Initialize Keycloak when page loads
  useEffect(() => {
    dispatch(initializeKeycloak());
  }, [dispatch]);

  // ✅ Redirect if already logged in
  useEffect(() => {
    if (initialized && authenticated) {
      navigate(redirect, { replace: true });
    }
  }, [initialized, authenticated, redirect]);

  // 🧩 Manual fallback (if Keycloak unreachable)
  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Manual login:", { username, password });
    // Normally: call your backend API or Keycloak token endpoint manually here
  };

  if (loading) return <div style={styles.center}>Checking authentication...</div>;

  if (manualMode) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>CoachBoard Login</h2>
        <form onSubmit={handleManualLogin} style={styles.form}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Login</button>
        </form>
        <button style={styles.linkButton} onClick={() => setManualMode(false)}>
          Back to Keycloak Login
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>CoachBoard Login</h2>
      <p style={{ marginBottom: 20 }}>You’ll be redirected to secure login.</p>
      <button
        style={styles.button}
        onClick={() => dispatch(initializeKeycloak())}
      >
        Continue with Keycloak
      </button>
      <button style={styles.linkButton} onClick={() => setManualMode(true)}>
        Manual Login (Debug)
      </button>
    </div>
  );
};

export default LoginPage;

// 🎨 Simple inline styles (no MUI dependency)
const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "#f5f6fa",
    fontFamily: "Inter, sans-serif",
  },
  title: {
    fontSize: 28,
    fontWeight: 600,
    marginBottom: 20,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: 280,
  },
  input: {
    marginBottom: 12,
    padding: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 14,
  },
  button: {
    padding: "10px 16px",
    borderRadius: 6,
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    fontSize: 15,
    cursor: "pointer",
    marginBottom: 10,
  },
  linkButton: {
    background: "none",
    border: "none",
    color: "#007bff",
    cursor: "pointer",
    textDecoration: "underline",
  },
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontSize: 16,
  },
};