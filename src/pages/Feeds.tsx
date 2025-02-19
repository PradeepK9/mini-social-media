import { useState, useEffect } from "react";
import { CircularProgress, Grid, Typography, Box, Container } from "@mui/material";
import PostComponent from "../components/Post";
import { getAllPosts } from "../services/postService";
import { Post } from "../types/post";
import { auth } from "../services/firebase";
import CreatePost from "../components/CreatePost";

const Feeds = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(auth.currentUser);

  const fetchPosts = async () => {
    setLoading(true);
    const fetchedPosts = await getAllPosts();
    setPosts(fetchedPosts);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();

    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
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
          Feeds
        </Typography>

        <CreatePost onPostAdded={fetchPosts} />

        {posts.length > 0 ? (
          <Grid container spacing={4} justifyContent="center">
            {posts.map((post) => (
              <Grid item xs={12} sm={6} md={4} key={post.id}>
                <PostComponent post={post} user={user} setPosts={setPosts} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" color="text.secondary" textAlign="center" mt={2}>
            No posts found.
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Feeds;
