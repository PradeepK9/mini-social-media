import { useState, useEffect, forwardRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

// Fix for MUI ListItem & react-router-dom Link compatibility
const LinkBehavior = forwardRef<HTMLAnchorElement, { to: string }>((props, ref) => (
  <Link ref={ref} {...props} />
));

const Navbar = () => {
  const [user, setUser] = useState(auth.currentUser);
  const [username, setUsername] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setUsername(user?.displayName || "");
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setUsername("");
      localStorage.removeItem("username");
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed!");
      console.error(error);
    }
  };

  const toggleDrawer = (open: boolean) => () => {
    setMobileOpen(open);
  };

  const navLinks = user
    ? [
        { text: "Home", path: "/" },
        { text: "Feeds", path: "/feeds" },
        { text: "My Posts", path: "/my-posts" },
        { text: "Saved Posts", path: "/saved-posts" },
      ]
    : [
        { text: "Home", path: "/" },
        { text: "Feeds", path: "/feeds" },
        { text: "Login", path: "/login" },
        { text: "Register", path: "/register" },
      ];

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Mobile Menu Button */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ display: { xs: "block", md: "none" } }}
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo */}
        {user || (!user && window.innerWidth > 600) ? (
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              display: { xs: user ? "block" : "none", md: "block" },
            }}
          >
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              Mini Social App
            </Link>
          </Typography>
        ) : null}

        {/* Show username when user is logged in */}
        {user && (
          <Typography variant="body1" sx={{ marginRight: 2 }}>
            {username ? `Hello, ${username}` : "Hello, User"}
          </Typography>
        )}

        {/* Desktop Links */}
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          {navLinks.map((link) => (
            <Button key={link.text} color="inherit" component={Link} to={link.path}>
              {link.text}
            </Button>
          ))}
          {user && (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={mobileOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
          <List>
            {navLinks.map((link) => (
              <ListItem key={link.text} disablePadding>
                <ListItemButton component={LinkBehavior} to={link.path}>
                  <ListItemText primary={link.text} />
                </ListItemButton>
              </ListItem>
            ))}
            {user && (
              <ListItem disablePadding>
                <ListItemButton onClick={handleLogout}>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
