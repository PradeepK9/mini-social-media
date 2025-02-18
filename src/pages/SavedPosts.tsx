import { useState, useEffect } from "react";
import { CircularProgress, Grid, Typography, Box } from "@mui/material";
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
    <Box sx={{ maxWidth: "900px", margin: "auto", mt: 4 }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
        Saved Posts
      </Typography>

      {posts.length > 0 ? (
        <Grid container spacing={2}>
          {posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <PostComponent post={post} user={auth.currentUser} setPosts={setPosts} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" color="text.secondary" textAlign="center">
          No saved posts found.
        </Typography>
      )}
    </Box>
  );
};

export default SavedPosts;
