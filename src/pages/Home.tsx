import { Box, Typography, Button, Grid, Card, CardContent, CardMedia } from "@mui/material";
import { Link } from "react-router-dom";
import { Home as HomeIcon, HowToReg as HowToRegIcon, Comment as CommentIcon } from '@mui/icons-material';

const Home = () => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", color: "text.primary" }}>

      {/* Hero Section */}
      <Box sx={{ textAlign: "center", py: 10, px: { xs: 2, sm: 4, md: 8 } }}>
        <Typography variant="h3" fontWeight="bold">
          Welcome to Mini Social App
        </Typography>
        <Typography variant="h6" sx={{ mt: 2, color: "gray" }}>
          Connect, share, and explore with friends and developers worldwide.
        </Typography>
        <Button component={Link} to="/feeds" variant="contained" color="primary" sx={{ mt: 4 }}>
          Explore Feeds
        </Button>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 10, px: { xs: 2, sm: 4, md: 8 } }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
          Features of Mini Social App
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: "100%" }}>
              <CardMedia
                component="img"
                height="140"
                image="https://images.unsplash.com/photo-1498050108023-c5249f4df085"
                alt="User Profiles"
              />
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  User Profiles
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Create a profile, add a bio, and connect with other developers and users.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: "100%" }}>
              <CardMedia
                component="img"
                height="140"
                image="https://images.unsplash.com/photo-1498050108023-c5249f4df085"
                alt="Interactive Posts"
              />
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  Interactive Posts
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Like, comment, and share posts from your friends or the community.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: "100%" }}>
              <CardMedia
                component="img"
                height="140"
                image="https://images.unsplash.com/photo-1498050108023-c5249f4df085"
                alt="Saved Posts"
              />
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  Save Posts
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Save your favorite posts to revisit later and never miss a moment.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: "100%" }}>
              <CardMedia
                component="img"
                height="140"
                image="https://images.unsplash.com/photo-1498050108023-c5249f4df085"
                alt="Notifications"
              />
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  Notifications
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Stay updated with the latest posts, likes, and comments in real time.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ bgcolor: "background.paper", py: 8, px: { xs: 2, sm: 4, md: 8 } }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
          How It Works
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: "center" }}>
              <HomeIcon sx={{ fontSize: 50, color: "primary.main" }} />
              <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                Create an Account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign up quickly with just an email, and start interacting with posts right away.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: "center" }}>
              <HowToRegIcon sx={{ fontSize: 50, color: "primary.main" }} />
              <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                Interact with Posts
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Like, comment, or save posts that you find interesting from the community.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: "center" }}>
              <CommentIcon sx={{ fontSize: 50, color: "primary.main" }} />
              <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                Stay Updated
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Receive notifications and stay up to date with the latest interactions.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 8, px: { xs: 2, sm: 4, md: 8 }, bgcolor: "background.default" }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
          What Our Users Are Saying
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ textAlign: "center", p: 3, bgcolor: "white", borderRadius: 2, boxShadow: 1 }}>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                "This app has been a game-changer! It's easy to use and allows me to interact with posts I care about."
              </Typography>
              <Typography variant="h6" fontWeight="bold">John Doe</Typography>
              <Typography variant="body2" color="text.secondary">Developer</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ textAlign: "center", p: 3, bgcolor: "white", borderRadius: 2, boxShadow: 1 }}>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                "Love the interface and the features. It’s simple, effective, and I feel connected to my community."
              </Typography>
              <Typography variant="h6" fontWeight="bold">Jane Smith</Typography>
              <Typography variant="body2" color="text.secondary">Designer</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* CTA Section */}
      <Box sx={{ textAlign: "center", py: 10, px: { xs: 2, sm: 4, md: 8 }, bgcolor: "primary.main", color: "white" }}>
        <Typography variant="h4" fontWeight="bold">
          Ready to Join the Community?
        </Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Sign up now and start exploring amazing posts from around the world!
        </Typography>
        <Button component={Link} to="/register" variant="contained" color="secondary" sx={{ mt: 4 }}>
          Sign Up Now
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
