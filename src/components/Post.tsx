import { useState } from "react";
import { Card, CardMedia, CardContent, Typography, IconButton, Box } from "@mui/material";
import { Favorite, FavoriteBorder, Bookmark, BookmarkBorder, Comment, Delete } from "@mui/icons-material";
import { Post } from "../types/post";
import { toggleLikePost, savePost, deletePost } from "../services/postService";
import { User } from "firebase/auth";
import CommentSection from "./CommentsSection"; // Import the CommentSection component

import { toast } from "react-toastify";

interface PostProps {
  post: Post;
  user: User | null;
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

const PostComponent = ({ post, user, setPosts }: PostProps) => {
  const [liked, setLiked] = useState(user ? post.likes.includes(user.uid) : false);
  const [saved, setSaved] = useState(user ? post.saves?.includes(user.uid) : false);
  const [showComments, setShowComments] = useState(false); // Toggle comment section

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
    toast.success("Post deleted successfully!");
  };

  return (
    <Card sx={{ maxWidth: { xs: 345, md: 600 }, margin: "auto" }}>
      <CardMedia component="img" height="200" image={post.imageUrl} alt="Post image" />
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold">{post.username}</Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton onClick={handleLike} disabled={!user}>
            {liked ? <Favorite color="error" /> : <FavoriteBorder />}
          </IconButton>
          <IconButton onClick={() => setShowComments(!showComments)} disabled={!user}>
            <Comment />
          </IconButton>
          <IconButton onClick={handleSave} disabled={!user}>
            {saved ? <Bookmark color="primary" /> : <BookmarkBorder />}
          </IconButton>

          {user?.uid === post.userId && (
            <IconButton onClick={handleDelete}>
              <Delete color="error" />
            </IconButton>
          )}
        </Box>

        {/* Render CommentSection only if showComments is true */}
        {showComments && <CommentSection postId={post.id} user={user} />}
      </CardContent>
    </Card>
  );
};

export default PostComponent;
