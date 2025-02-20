import { useState, useEffect } from "react";
import { CircularProgress, Grid, Typography, Box, Paper, Container } from "@mui/material";
import PostComponent from "../components/Post";
import { getSavedPosts } from "../services/postService";
import { Post } from "../types/post";
import { auth } from "../services/firebase";

const SavedPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      const fetchedPosts = await getSavedPosts();
      setPosts(fetchedPosts);
      setLoading(false);
    };

    fetchSavedPosts();
  }, []);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
          Saved Posts
        </Typography>

        {posts.length > 0 ? (
          <Grid container spacing={3} justifyContent="center" sx={{ pb: 6 }}>
            {posts.map((post) => (
              <Grid item xs={12} key={post.id}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    backgroundColor: "#f9f9f9",
                    borderRadius: 2,
                  }}
                >
                  <PostComponent post={post} user={auth.currentUser} setPosts={setPosts} />
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ mt: 3, pb: 6 }}
          >
            No saved posts found.
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default SavedPosts;
