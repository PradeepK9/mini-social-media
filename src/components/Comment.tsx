import { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { Reply, Delete } from "@mui/icons-material";
import { CommentType } from "../types/comment"; // Ensure you have this type defined
import { User } from "firebase/auth"; // Firebase User type
import { getComments, deleteComment } from "../services/commentService";

interface CommentProps {
  comment: CommentType;
  postId: string;
  user: User | null;
}

const Comment = ({ comment, postId, user }: CommentProps) => {
  const [replies, setReplies] = useState<CommentType[]>([]); // Fix useState type

  const fetchReplies = async () => {
    const fetchedReplies = await getComments(postId, comment.id);
    setReplies(fetchedReplies); // Fix type error
  };

  const handleDelete = async () => {
    if (!user || user.uid !== comment.userId) return;
    await deleteComment(comment.id);
    setReplies((prev) => prev.filter((reply) => reply.id !== comment.id));
  };
  

  return (
    <Box>
      <Typography variant="body2">{comment.text}</Typography>

      <IconButton onClick={fetchReplies}>
        <Reply />
      </IconButton>

      {user?.uid === comment.userId && (
        <IconButton onClick={handleDelete}>
          <Delete color="error" />
        </IconButton>
      )}

      {replies.map((reply) => (
        <Comment key={reply.id} comment={reply} postId={postId} user={user} />
      ))}
    </Box>
  );
};

export default Comment;
