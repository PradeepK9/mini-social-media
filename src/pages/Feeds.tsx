import { useState, useEffect, useRef, useCallback } from "react";
import {
  CircularProgress,
  Grid,
  Typography,
  Box,
  Container,
  Paper,
  Button,
} from "@mui/material";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import PostComponent from "../components/Post";
import { getAllPosts } from "../services/postService";
import { Post } from "../types/post";
import { auth } from "../services/firebase";
import CreatePost from "../components/CreatePost";
import { Link } from "react-router-dom";

const Feeds = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [user, setUser] = useState(auth.currentUser);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loadingMore || !hasMore) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMorePosts();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loadingMore, hasMore]
  );

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { posts, lastVisible } = await getAllPosts();
      setPosts(posts);
      setLastDoc(lastVisible);
      setHasMore(lastVisible !== null);
      setLoading(false);
    };

    fetchPosts();

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const loadMorePosts = async () => {
    if (!hasMore) return;

    setLoadingMore(true);

    const lastVisibleDoc = lastDoc ?? undefined;
    const { posts: newPosts, lastVisible } = await getAllPosts(lastVisibleDoc);

    if (newPosts.length === 0) {
      setHasMore(false);
    }

    setPosts((prev) => [...prev, ...newPosts]);
    setLastDoc(lastVisible);
    setLoadingMore(false);
  };

  // Handle new post addition
  const handleNewPost = async () => {
    setLoading(true);
    const { posts, lastVisible } = await getAllPosts();
    setPosts(posts);
    setLastDoc(lastVisible);
    setHasMore(lastVisible !== null);
    setLoading(false);
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4, textAlign: "center" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Feeds
        </Typography>

        {/* Show Create Post only if the user is logged in */}
        {user ? (
          <CreatePost onPostAdded={handleNewPost} />
        ) : (
          <Paper
            elevation={3}
            sx={{ p: 3, mt: 2, textAlign: "center", backgroundColor: "#f9f9f9" }}
          >
            <Typography variant="h6" color="text.primary" gutterBottom>
              Want to share your thoughts?
            </Typography>
            <Typography variant="body1" color="text.secondary">
              You need to <strong>log in</strong> to create a post.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/login"
              sx={{ mt: 2 }}
            >
              Login
            </Button>
          </Paper>
        )}

        {posts.length > 0 ? (
          <Grid container spacing={3} justifyContent="center" sx={{ mt: 3 }}>
            {posts.map((post, index) => (
              <Grid item xs={12} key={post.id} ref={index === posts.length - 1 ? lastPostRef : null}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    backgroundColor: "#f5f5f5",
                    borderRadius: "8px",
                    mb: 2,
                    textAlign: "left",
                  }}
                >
                  <PostComponent post={post} user={user} setPosts={setPosts} />
                </Paper>
              </Grid>

            ))}
          </Grid>
        ) : (
          <Typography variant="body1" color="text.secondary" textAlign="center" mt={2}>
            No posts found.
          </Typography>
        )}

        {loadingMore && (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress size={30} />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Feeds;
