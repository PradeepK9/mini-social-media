// import { useState } from "react";
// import { auth } from "../services/firebase";
// import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import { useNavigate } from "react-router-dom";
// import { useForm, Controller } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { 
//   Container, TextField, Button, Typography, Box, Paper 
// } from "@mui/material";
// import GoogleIcon from "@mui/icons-material/Google";

// // Validation Schema using Yup
// const loginSchema = yup.object().shape({
//   email: yup.string().email("Invalid email").required("Email is required"),
//   password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
// });

// const Login = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

//   // React Hook Form setup
//   const { control, handleSubmit, formState: { errors } } = useForm({
//     resolver: yupResolver(loginSchema),
//   });

//   // Handle Email/Password Login
//   const handleLogin = async (data: { email: string; password: string }) => {
//     try {
//       setLoading(true);
//       await signInWithEmailAndPassword(auth, data.email, data.password);
//       navigate("/");
//     } catch (error) {
//       console.error("Login failed", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle Google Login
//   const handleGoogleLogin = async () => {
//     try {
//       const provider = new GoogleAuthProvider();
//       await signInWithPopup(auth, provider);
//       navigate("/");
//     } catch (error) {
//       console.error("Google login failed", error);
//     }
//   };

//   return (
//     <Container component="main" maxWidth="xs">
//       <Paper elevation={3} sx={{ padding: 4, textAlign: "center", mt: 8 }}>
//         <Typography variant="h4" gutterBottom>
//           Sign In
//         </Typography>
        
//         <Box component="form" sx={{ mt: 2 }} onSubmit={handleSubmit(handleLogin)}>
//           {/* Email Field */}
//           <Controller
//             name="email"
//             control={control}
//             defaultValue=""
//             render={({ field }) => (
//               <TextField
//                 {...field}
//                 fullWidth
//                 label="Email"
//                 type="email"
//                 variant="outlined"
//                 margin="normal"
//                 error={!!errors.email}
//                 helperText={errors.email?.message}
//               />
//             )}
//           />

//           {/* Password Field */}
//           <Controller
//             name="password"
//             control={control}
//             defaultValue=""
//             render={({ field }) => (
//               <TextField
//                 {...field}
//                 fullWidth
//                 label="Password"
//                 type="password"
//                 variant="outlined"
//                 margin="normal"
//                 error={!!errors.password}
//                 helperText={errors.password?.message}
//               />
//             )}
//           />
          
//           {/* Sign In Button */}
//           <Button 
//             fullWidth 
//             variant="contained" 
//             color="primary" 
//             sx={{ mt: 2 }} 
//             type="submit"
//             disabled={loading}
//           >
//             {loading ? "Signing In..." : "Sign In"}
//           </Button>

//           {/* Google Sign In Button */}
//           <Button 
//             fullWidth 
//             variant="outlined" 
//             color="secondary" 
//             startIcon={<GoogleIcon />} 
//             sx={{ mt: 2 }} 
//             onClick={handleGoogleLogin}
//           >
//             Sign In with Google
//           </Button>
//         </Box>
//       </Paper>
//     </Container>
//   );
// };

// export default Login;


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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('user2 ', user);

      localStorage.setItem("username", user.displayName || "User"); // Store username

      console.log("===> ", localStorage.getItem("username") || "");

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
      <Paper elevation={3} sx={{ padding: 4, textAlign: "center", mt: 8 }}>
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
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleLogin} disabled={loading}>
            {loading ? "Logging in..." : "Sign In"}
          </Button>

          <Button fullWidth variant="outlined" color="secondary" startIcon={<GoogleIcon />} sx={{ mt: 2 }} onClick={handleGoogleLogin}>
            Sign In with Google
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;

