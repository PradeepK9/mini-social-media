import { Box, Typography, Container } from "@mui/material";

const Footer = () => {
  return (
    <Box sx={{ bgcolor: "primary.dark", color: "white", py: 3}}>
      <Container maxWidth="lg" sx={{ textAlign: "center" }}>
        <Typography variant="h6" fontWeight="bold">
          Mini Social App
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
          Built for learning purposes and to explore React, Firebase, and MUI.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, fontStyle: "italic" }}>
          Developed by <strong>Pradeep Jaiswal</strong>
        </Typography>
        <Typography variant="caption" sx={{ mt: 2, display: "block", opacity: 0.7 }}>
          © {new Date().getFullYear()} Mini Social App. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
