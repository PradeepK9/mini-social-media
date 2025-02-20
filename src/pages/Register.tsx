import { useState } from "react";
import { auth } from "../services/firebase";
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Container, TextField, Button, Typography, Box, Paper
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { toast } from "react-toastify";

// Validation Schema using Yup
const registerSchema = yup.object().shape({
  name: yup.string().min(3, "Name must be at least 3 characters").required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), ""], "Passwords must match")
    .required("Confirm Password is required"),
});

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // React Hook Form setup
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(registerSchema),
  });

  // Handle Registration
  const handleRegister = async (data: { name: string; email: string; password: string }) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // Update user profile with username
      const userdata = await updateProfile(user, { displayName: data.name });

      console.log("userdata => ", userdata);
      console.log("user => ", user);
      console.log("userCredential => ", userCredential);

      // Store username in localStorage
      localStorage.setItem("username", data.name);

      toast.success(`Welcome, ${data.name}!`);
      navigate("/");
    } catch (error) {
      toast.error("Registration failed!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Registration
  const handleGoogleRegister = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Store Google profile name
      localStorage.setItem("username", user.displayName || "User");

      toast.success(`Logged in as ${user.displayName || "User"}!`);
      navigate("/");
    } catch (error) {
      toast.error("Google registration failed!");
      console.error(error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, textAlign: "center", mt: 8, mb: 8 }}>
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>

        <Box component="form" sx={{ mt: 2 }} onSubmit={handleSubmit(handleRegister)}>
          {/* Name Field */}
          <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Name"
                type="text"
                variant="outlined"
                margin="normal"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />

          {/* Email Field */}
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Email"
                type="email"
                variant="outlined"
                margin="normal"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />

          {/* Password Field */}
          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                margin="normal"
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />

          {/* Confirm Password Field */}
          <Controller
            name="confirmPassword"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Confirm Password"
                type="password"
                variant="outlined"
                margin="normal"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
              />
            )}
          />

          {/* Register Button */}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            type="submit"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </Button>

          {/* Google Register Button */}
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            startIcon={<GoogleIcon />}
            sx={{ mt: 2 }}
            onClick={handleGoogleRegister}
          >
            Register with Google
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
