import { useState, useEffect, useRef, useCallback } from "react";
import { CircularProgress, Grid, Typography, Box, Container } from "@mui/material";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import PostComponent from "../components/Post";
import { getAllPosts } from "../services/postService";
import { Post } from "../types/post";
import { auth } from "../services/firebase";
import CreatePost from "../components/CreatePost";

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
    if (!hasMore) return; // Stop if no more posts
  
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
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
          Feeds
        </Typography>

        <CreatePost onPostAdded={handleNewPost} />

        {posts.length > 0 ? (
          <Grid container spacing={4} justifyContent="center">
            {posts.map((post, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={post.id}
                ref={index === posts.length - 1 ? lastPostRef : null}
              >
                <PostComponent post={post} user={user} setPosts={setPosts} />
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
