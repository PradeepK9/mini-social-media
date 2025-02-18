// import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
// import { Link, useNavigate } from "react-router-dom";
// import { auth } from "../services/firebase";
// import { useState, useEffect } from "react";

// const Navbar = () => {
//   const [user, setUser] = useState<unknown>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       setUser(user);
//     });

//     return () => unsubscribe(); // Cleanup listener on unmount
//   }, []);

//   const handleLogout = async () => {
//     await auth.signOut();
//     navigate("/login");
//   };

//   return (
//     <AppBar position="sticky" color="primary">
//       <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
//         {/* Logo / Brand Name */}
//         <Typography 
//           variant="h6" 
//           component={Link} 
//           to="/" 
//           sx={{ textDecoration: "none", color: "white", fontWeight: "bold" }}
//         >
//           My Social App
//         </Typography>

//         {/* Navigation Links */}
//         <Box sx={{ display: "flex", gap: 2 }}>
//           {user ? (
//             <>
//               <Button color="inherit" component={Link} to="/my-posts">
//                 My Posts
//               </Button>
//               <Button color="inherit" component={Link} to="/saved-posts">
//                 Saved Posts
//               </Button>
//               <Button color="inherit" onClick={handleLogout}>
//                 Logout
//               </Button>
//             </>
//           ) : (
//             <>
//               <Button color="inherit" component={Link} to="/login">
//                 Login
//               </Button>
//               <Button color="inherit" component={Link} to="/register">
//                 Register
//               </Button>
//             </>
//           )}
//         </Box>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Navbar;

import { Link, useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppBar, Toolbar, Button, Typography } from "@mui/material";

const Navbar = () => {
  const [user, setUser] = useState(auth.currentUser);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  console.log("Current user => ", auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      console.log('User1 => ', username);
      setUsername(user?.displayName || "");
      // setUsername(localStorage.getItem("username") || "");
    });

    return () => unsubscribe();
  }, [username]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("username");
      setUser(null);
      setUsername("");
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed!");
      console.error(error);
    }
  };
  console.log("user3 => ", user);
  console.log("username3 => ", username);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>Home</Link>
        </Typography>

        {user ? (
          <>
            <Typography variant="body1" sx={{ marginRight: 2 }}>
              {username ? `Hello, ${username}` : "Hello, User"}
            </Typography>
            <Button color="inherit" component={Link} to="/my-posts">My Posts</Button>
            <Button color="inherit" component={Link} to="/saved-posts">Saved Posts</Button>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/register">Register</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

