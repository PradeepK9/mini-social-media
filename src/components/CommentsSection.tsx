import { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, IconButton, Collapse } from "@mui/material";
import { Reply, ThumbUp, ThumbUpOutlined, ExpandMore, ExpandLess } from "@mui/icons-material";
import { CommentType } from "../types/comment";
import { getComments, addComment, toggleLikeComment } from "../services/commentService";
import { User } from "firebase/auth";

interface CommentSectionProps {
  postId: string;
  parentId?: string | null;
  user: User | null;
}

const CommentSection = ({ postId, parentId = null, user }: CommentSectionProps) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyTexts, setReplyTexts] = useState<{ [key: string]: string }>({});
  const [mainCommentText, setMainCommentText] = useState("");
  const [expandedReplies, setExpandedReplies] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchComments = async () => {
      const fetchedComments = await getComments(postId, parentId);
      setComments(fetchedComments);
    };
    fetchComments();
  }, [postId, parentId]);
  
  const handleAddComment = async (replyTo?: string) => {
    if (!user) return;
    const text = replyTo ? replyTexts[replyTo] : mainCommentText;
    if (!text.trim()) return;
  
    // Add the new comment to Firestore
    await addComment(postId, text, replyTo || parentId);
  
    // Refetch the latest comments from Firestore
    const updatedComments = await getComments(postId, parentId);
    setComments(updatedComments); // Update the state with the latest data
  
    // Reset input fields
    if (replyTo) {
      setReplyTexts((prev) => ({ ...prev, [replyTo]: "" }));
      setReplyingTo(null);
    } else {
      setMainCommentText("");
    }
  };
  


  /** Handle like toggle */
  const handleLike = async (commentId: string) => {
    if (!user) return;
    await toggleLikeComment(commentId, user.uid);

    // Update UI immediately
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              likes: comment.likes.includes(user.uid)
                ? comment.likes.filter((id) => id !== user.uid)
                : [...comment.likes, user.uid],
            }
          : comment
      )
    );
  };

  /** Toggle replies visibility */
  const toggleReplies = (commentId: string) => {
    setExpandedReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  return (
    <Box>
      {comments.map((comment) => (
        <Box key={comment.id} ml={parentId ? 4 : 0} mt={2}>
          <Typography variant="body2">
            <strong>{comment.username}</strong>: {comment.text}
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton onClick={() => handleLike(comment.id)}>
              {comment.likes.includes(user?.uid || "") ? <ThumbUp /> : <ThumbUpOutlined />}
            </IconButton>
            <Typography variant="caption">{comment.likes.length}</Typography>

            <IconButton onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}>
              <Reply fontSize="small" />
            </IconButton>

            {/* Collapse/Expand Button */}
            {comment.parentId === null && (
              <IconButton onClick={() => toggleReplies(comment.id)}>
                {expandedReplies[comment.id] ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            )}
          </Box>

          {/* Show reply input only when needed */}
          {replyingTo === comment.id && (
            <Box mt={1}>
              <TextField
                label="Reply..."
                variant="outlined"
                size="small"
                fullWidth
                value={replyTexts[comment.id] || ""}
                onChange={(e) => setReplyTexts((prev) => ({ ...prev, [comment.id]: e.target.value }))}
              />
              <Button variant="contained" sx={{ mt: 1 }} onClick={() => handleAddComment(comment.id)}>
                Reply
              </Button>
            </Box>
          )}

          {/* Nested replies collapse */}
          <Collapse in={expandedReplies[comment.id] || parentId !== null}>
            <CommentSection postId={postId} parentId={comment.id} user={user} />
          </Collapse>
        </Box>
      ))}

      {/* Main comment input (only at top level and when not replying) */}
      {user && parentId === null && !replyingTo && (
        <Box mt={2}>
          <TextField
            label="Add a comment..."
            variant="outlined"
            size="small"
            fullWidth
            value={mainCommentText}
            onChange={(e) => setMainCommentText(e.target.value)}
          />
          <Button variant="contained" sx={{ mt: 1 }} onClick={() => handleAddComment()}>
            Comment
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CommentSection;
