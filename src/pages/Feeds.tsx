import { useState, useEffect } from "react";
import { CircularProgress, Grid, Typography, Box } from "@mui/material";
import PostComponent from "../components/Post";
import { getAllPosts } from "../services/postService";
import { Post } from "../types/post";
import { auth } from "../services/firebase"; // Import Firebase auth
import CreatePost from "../components/CreatePost";

const Feeds = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(auth.currentUser); // Track logged-in user

  useEffect(() => {
    const fetchPosts = async () => {
      const fetchedPosts = await getAllPosts();
      setPosts(fetchedPosts);
      setLoading(false);
    };

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
    <Box sx={{ maxWidth: "900px", margin: "auto", mt: 4}}>
      <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
        Feeds
      </Typography>

      <CreatePost />

      {posts.length > 0 ? (
        <Grid container spacing={2}>
          {posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <PostComponent post={post} user={user} setPosts={setPosts} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" color="text.secondary" textAlign="center">
          No posts found.
        </Typography>
      )}
    </Box>
  );
};

export default Feeds;
