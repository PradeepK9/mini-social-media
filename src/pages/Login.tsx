import { useState } from "react";
import { auth } from "../services/firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Container, TextField, Button, Typography, Box, Paper
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "Email is required!";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email!";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required!";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters!";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      localStorage.setItem("username", user.displayName || "User"); // Store username

      toast.success(`Welcome back, ${user.displayName || "User"}!`);
      navigate("/");
    } catch (error) {
      toast.error("Login failed! Check your credentials.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      localStorage.setItem("username", user.displayName || "User"); // Store username

      toast.success(`Logged in as ${user.displayName || "User"}!`);
      navigate("/");
    } catch (error) {
      toast.error("Google login failed!");
      console.error(error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, textAlign: "center", mt: 8, mb: 8 }}>
        <Typography variant="h4" gutterBottom>Login</Typography>

        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Sign In"}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            startIcon={<GoogleIcon />}
            sx={{ mt: 2 }}
            onClick={handleGoogleLogin}
          >
            Sign In with Google
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
