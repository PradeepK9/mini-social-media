import { useState, useEffect } from "react";
import PostComponent from "../components/Post";
import { getUserPosts } from "../services/postService";
import { Post } from "../types/post";
import { auth } from "../services/firebase";
import { Box, Typography, Container, Grid } from "@mui/material";

const MyPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const user = auth.currentUser; // Get the logged-in user

  useEffect(() => {
    const fetchPosts = async () => {
      if (!user) return;
      const fetchedPosts = await getUserPosts(user.uid);
      setPosts(fetchedPosts);
    };

    fetchPosts();
  }, [user]);

  if (!user)
    return (
      <Typography variant="h6" textAlign="center" mt={4} color="text.secondary">
        Please log in to see your posts.
      </Typography>
    );

  if (posts.length === 0)
    return (
      <Typography variant="h6" textAlign="center" mt={4} color="text.secondary">
        No posts found.
      </Typography>
    );

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" textAlign="center" fontWeight="bold" mb={3}>
          My Posts
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {posts.map((post) => (
            <Grid item xs={12} sm={8} md={6} lg={5} key={post.id}> 
              <PostComponent post={post} user={user} setPosts={setPosts} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default MyPosts;
