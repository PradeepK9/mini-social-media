import { useState, useEffect } from "react";
import PostComponent from "../components/Post";
import { getUserPosts } from "../services/postService";
import { Post } from "../types/post";
import { auth } from "../services/firebase";
import {
  Box,
  Typography,
  Container,
  Grid,
  CircularProgress,
  Paper,
} from "@mui/material";

const MyPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser; // Get the logged-in user

  useEffect(() => {
    const fetchPosts = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      const fetchedPosts = await getUserPosts(user.uid);
      setPosts(fetchedPosts);
      setLoading(false);
    };

    fetchPosts();
  }, [user]);

  if (!user)
    return (
      <Typography variant="h6" textAlign="center" mt={4} color="text.secondary">
        Please log in to see your posts.
      </Typography>
    );

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" textAlign="center" fontWeight="bold" mb={3}>
          My Posts
        </Typography>

        {posts.length === 0 ? (
          <Typography variant="h6" textAlign="center" mt={4} color="text.secondary">
            No posts found.
          </Typography>
        ) : (
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
                  <PostComponent post={post} user={user} setPosts={setPosts} />
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default MyPosts;
