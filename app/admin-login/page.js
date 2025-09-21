"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Paper,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  AdminPanelSettings,
  Lock,
} from "@mui/icons-material";
import AppTheme from "../components/AppTheme";
import AppAppBar from "../components/AppAppBar";
import Footer from "../components/Footer";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [adminData, setAdminData] = useState({
    username: "",
    password: "",
  });

  const { adminLogin } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    setAdminData({
      ...adminData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!adminData.username || !adminData.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    const result = await adminLogin(adminData.username, adminData.password);

    if (result.success) {
      setSuccess("Admin login successful! Redirecting to dashboard...");
      setTimeout(() => {
        router.push("/admin");
      }, 1000);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <AppTheme>
      <AppAppBar />
      <Container maxWidth="sm" sx={{ my: 8 }}>
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <AdminPanelSettings sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
              <Typography variant="h4" component="h1" gutterBottom>
                Admin Login
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Access the admin dashboard
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            {/* Default Admin Credentials Info */}
            <Paper sx={{ p: 2, mb: 3, backgroundColor: "#f5f5f5" }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Default Admin Credentials:</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Username: <code>admin</code>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Password: <code>admin</code>
              </Typography>
            </Paper>

            <Box component="form" onSubmit={handleAdminLogin}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={adminData.username}
                onChange={handleChange}
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AdminPanelSettings />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={adminData.password}
                onChange={handleChange}
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mt: 3, mb: 2 }}
              >
                {loading ? "Signing In..." : "Admin Login"}
              </Button>
            </Box>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Link href="/login" style={{ textDecoration: "none" }}>
                <Button variant="text" color="primary">
                  Regular User Login
                </Button>
              </Link>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Link href="/" style={{ textDecoration: "none" }}>
                <Button variant="text" color="primary">
                  Back to Home
                </Button>
              </Link>
            </Box>
          </CardContent>
        </Card>
      </Container>
      <Footer />
    </AppTheme>
  );
}
