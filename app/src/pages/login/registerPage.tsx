import * as yup from "yup";

import { Alert, Box, Button, CircularProgress, Container, TextField, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
// registerPage.tsx
import React, { useState } from "react";

import { ROUTES } from "@/router/routes";
import { useFormik } from "formik";

// Define the user type
type User = {
  id: string;
  fullname: string;
  username: string;
  email: string;
  roles: string[];
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
};

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Initial auth state
  const [_, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
  });

  const validationSchema = yup.object({
    fullname: yup.string().required("Full name is required"),
    username: yup.string().required("Username is required")
      .min(3, "Username must be at least 3 characters")
      .matches(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscore"),
    email: yup.string().email("Enter a valid email").required("Email is required"),
    password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const formik = useFormik<{ 
    fullname: string; 
    username: string; 
    email: string; 
    password: string; 
    confirmPassword: string 
  }>({
    initialValues: { 
      fullname: "", 
      username: "", 
      email: "", 
      password: "", 
      confirmPassword: "" 
    },
    validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      setError(null);
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      // Simulate API delay
      setTimeout(() => {
        try {
          // Create a user object matching the required structure
          const newUser: User = {
            id: "user-" + Math.random().toString(36).substring(2),
            fullname: values.fullname,
            username: values.username,
            email: values.email,
            roles: ["user"],
          };
          
          // Update auth state with new user (for demo purposes)
          setAuthState({
            user: newUser,
            isAuthenticated: false, // Not authenticated until login
            loading: false,
            error: null
          });
          
          console.log("User registered:", {
            fullname: values.fullname,
            username: values.username,
            email: values.email,
            // Don't log password for security
          });
          
          // Show success message
          setSuccess(true);
          
          // Redirect to login page after brief delay 
          // (no redirect URL parameter as specified)
          setTimeout(() => {
            navigate(ROUTES.LOGIN);
          }, 1500);
        } catch (err) {
          setError("Registration failed. Please try again.");
          setAuthState(prev => ({
            ...prev,
            loading: false,
            error: "Registration failed. Please try again."
          }));
        } finally {
          setLoading(false);
        }
      }, 700); // Add slight delay to simulate API call
    },
  });

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h5">Register</Typography>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
            Registration successful! Redirecting to login...
          </Alert>
        )}
        
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Full Name"
            variant="outlined"
            {...formik.getFieldProps("fullname")}
            error={formik.touched.fullname && Boolean(formik.errors.fullname)}
            helperText={formik.touched.fullname && formik.errors.fullname}
            disabled={loading || success}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            variant="outlined"
            {...formik.getFieldProps("username")}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
            disabled={loading || success}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            variant="outlined"
            {...formik.getFieldProps("email")}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            disabled={loading || success}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            variant="outlined"
            {...formik.getFieldProps("password")}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            disabled={loading || success}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Confirm Password"
            type="password"
            variant="outlined"
            {...formik.getFieldProps("confirmPassword")}
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            disabled={loading || success}
          />
          <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }}
            disabled={loading || success}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
          </Button>
          <Typography sx={{ mt: 2 }}>
            Already have an account?{" "}
            <Link to={ROUTES.LOGIN} style={{ textDecoration: "none", color: "#1976d2" }}>
              Login
            </Link>
          </Typography>
        </form>
      </Box>
    </Container>
  );
};

export default RegisterPage;