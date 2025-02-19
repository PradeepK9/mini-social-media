import { useState } from "react";
import { Card, CardMedia, CardContent, Typography, IconButton, Box, TextField, Button } from "@mui/material";
import { Favorite, FavoriteBorder, Bookmark, BookmarkBorder, Comment, Delete } from "@mui/icons-material";
import { Post } from "../types/post";
import { toggleLikePost, savePost, addComment, deletePost } from "../services/postService";
import { User } from "firebase/auth"; // Import User type from Firebase

// Define props type
interface PostProps {
  post: Post;
  user: User | null;
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

const PostComponent = ({ post, user, setPosts }: PostProps) => {
  const [liked, setLiked] = useState(user ? post.likes.includes(user.uid) : false);
  const [saved, setSaved] = useState(user ? post.saves?.includes(user.uid) : false);
  const [commentText, setCommentText] = useState("");

  const handleLike = async () => {
    if (!user) return;
    await toggleLikePost(post.id, user.uid);
    setLiked(!liked);
  };

  const handleSave = async () => {
    if (!user) return;
    await savePost(post.id);
    setSaved(!saved);
  };

  const handleDelete = async () => {
    if (!user || user.uid !== post.userId) return;
    await deletePost(post.id);
    setPosts((prev) => prev.filter((p) => p.id !== post.id));
  };

  const handleAddComment = async () => {
    if (!user || commentText.trim() === "") return;
    await addComment(post.id, user.uid, commentText);
    setCommentText(""); 
  };

  return (
    <Card sx={{
      maxWidth: { xs: 345, md: 600 },
      margin: "auto",
    }}>
      <CardMedia component="img" height="200" image={post.imageUrl} alt="Post image" />
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold">{post.username}</Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton onClick={handleLike} disabled={!user}>
            {liked ? <Favorite color="error" /> : <FavoriteBorder />}
          </IconButton>
          <Typography variant="body2">{post.likes.length}</Typography>

          <IconButton disabled={!user}>
            <Comment />
          </IconButton>
          <Typography variant="body2">{post.comments?.length || 0}</Typography>

          <IconButton onClick={handleSave} disabled={!user}>
            {saved ? <Bookmark color="primary" /> : <BookmarkBorder />}
          </IconButton>

          {user?.uid === post.userId && (
            <IconButton onClick={handleDelete}>
              <Delete color="error" />
            </IconButton>
          )}
        </Box>

        {user && (
          <Box mt={2}>
            <TextField
              label="Add a comment..."
              variant="outlined"
              size="small"
              fullWidth
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <Button variant="contained" sx={{ mt: 1 }} onClick={handleAddComment}>
              Comment
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PostComponent;
