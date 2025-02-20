import { Box, Typography, Button, Grid, Card, CardContent, CardMedia, Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import { Home as HomeIcon, HowToReg as HowToRegIcon, Comment as CommentIcon } from '@mui/icons-material';

const Home = () => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", color: "text.primary" }}>

      {/* Hero Section */}
      <Box
        sx={{
          textAlign: "center",
          py: 12,
          px: { xs: 2, sm: 4, md: 8 },
          background: "linear-gradient(135deg, #6e8efb 0%, #a777e3 100%)",
          color: "white",
        }}
      >
        <Typography variant="h3" fontWeight="bold">
          Welcome to Mini Social App
        </Typography>
        <Typography variant="h6" sx={{ mt: 2, opacity: 0.9 }}>
          Connect, share, and explore with friends and developers worldwide.
        </Typography>
        <Button
          component={Link}
          to="/feeds"
          variant="contained"
          sx={{ mt: 4, px: 4, py: 1.5, fontSize: "1rem", fontWeight: "bold" }}
        >
          Explore Feeds
        </Button>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 12, px: { xs: 2, sm: 4, md: 8 } }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
          Features of Mini Social App
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {[
            { title: "User Profiles", imgUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8VXNlciUyMFByb2ZpbGVzfGVufDB8fDB8fHww", desc: "Create a profile, add a bio, and connect with others." },
            { title: "Interactive Posts", imgUrl: "https://images.unsplash.com/photo-1516381093400-a0fecb601de2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8SW50ZXJhY3RpdmUlMjBQb3N0c3xlbnwwfHwwfHx8MA%3D%3D", desc: "Like, comment, and share posts easily." },
            { title: "Save Posts", imgUrl: "https://plus.unsplash.com/premium_vector-1733526079634-9bf13562e5f2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHNhdmUlMjBwb3N0c3xlbnwwfHwwfHx8MA%3D%3D", desc: "Save posts to revisit later." },
            { title: "Notifications", imgUrl: "https://plus.unsplash.com/premium_vector-1716988352248-db21bc245a2f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Tm90aWZpY2F0aW9uc3xlbnwwfHwwfHx8MA%3D%3D", desc: "Stay updated with latest interactions." },
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: "100%",
                  transition: "transform 0.3s",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={feature.imgUrl}
                  alt={feature.title}
                />
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* How It Works - Step-by-Step Flow */}
      <Box sx={{ bgcolor: "background.paper", py: 8, px: { xs: 2, sm: 4, md: 8 } }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
          How It Works
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {[
            { icon: <HomeIcon />, title: "Create an Account", desc: "Sign up quickly and start exploring." },
            { icon: <HowToRegIcon />, title: "Interact with Posts", desc: "Like, comment, and share with ease." },
            { icon: <CommentIcon />, title: "Stay Updated", desc: "Get notifications for new interactions." },
          ].map((step, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box
                sx={{
                  textAlign: "center",
                  p: 4,
                  bgcolor: "white",
                  borderRadius: 3,
                  boxShadow: 2,
                  position: "relative",
                  transition: "all 0.3s",
                  "&:hover": { boxShadow: 4, transform: "translateY(-5px)" },
                }}
              >
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    mx: "auto",
                    mb: 2,
                    bgcolor: "primary.main",
                    color: "white",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 36,
                  }}
                >
                  {step.icon}
                </Box>
                <Typography variant="h6" fontWeight="bold">{step.title}</Typography>
                <Typography variant="body2" color="text.secondary">{step.desc}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Testimonials */}
      <Box sx={{ py: 8, px: { xs: 2, sm: 4, md: 8 }, bgcolor: "background.default" }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
          What Our Users Are Saying
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {[
            { name: "Pradeep Jaiswal", role: "Sr. Software Engineer", text: "I loved this plateform" },
            { name: "Elon Musk", role: "CEO of Tesla Motors", text: "This app has been a game-changer!" },
            { name: "Mark Zuckerberg", role: "CEO of Facebook", text: "Love the interface and features!" },
          ].map((user, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box
                sx={{
                  textAlign: "center",
                  p: 3,
                  bgcolor: "white",
                  borderRadius: 2,
                  boxShadow: 2,
                  transition: "all 0.3s",
                  "&:hover": { boxShadow: 4 },
                }}
              >
                <Avatar sx={{ width: 60, height: 60, mx: "auto", mb: 2 }} />
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  "{user.text}"
                </Typography>
                <Typography variant="h6" fontWeight="bold">{user.name}</Typography>
                <Typography variant="body2" color="text.secondary">{user.role}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          textAlign: "center",
          py: 10,
          px: { xs: 2, sm: 4, md: 8 },
          bgcolor: "primary.main",
          color: "white",
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Ready to Join the Community?
        </Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Sign up now and start exploring amazing posts!
        </Typography>
        <Button
          component={Link}
          to="/register"
          variant="contained"
          color="secondary"
          sx={{ mt: 4, px: 4, py: 1.5, fontSize: "1rem", fontWeight: "bold" }}
        >
          Sign Up Now
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
