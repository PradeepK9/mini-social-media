import { useState } from "react";
import { deleteComment, getComments, toggleLikeComment } from "../services/commentService";
import CommentForm from "./CommentForm";
import { CommentType } from "../types/comment";

type CommentItemProps = {
  comment: CommentType;
  postId: string;
  setComments: React.Dispatch<React.SetStateAction<CommentType[]>>;
};

const CommentItem = ({ comment, postId, setComments }: CommentItemProps) => {
  const [replies, setReplies] = useState<CommentType[]>([]);
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [likes, setLikes] = useState(comment.likes.length);

  const handleToggleReplies = async () => {
    if (!showReplies) {
      const fetchedReplies = await getComments(postId, comment.id);
      setReplies(fetchedReplies);
    }
    setShowReplies(!showReplies);
  };

  const handleDelete = async () => {
    await deleteComment(comment.id);
    setComments((prev) => prev.filter((c) => c.id !== comment.id));
  };

  const handleLike = async () => {
    const user = localStorage.getItem("userId"); // Change this to your auth logic
    if (user) {
      await toggleLikeComment(comment.id, user);
      setLikes((prevLikes) => (comment.likes.includes(user) ? prevLikes - 1 : prevLikes + 1));
    }
  };

  return (
    <div style={{ marginLeft: comment.parentId ? "20px" : "0px", borderLeft: "2px solid #ccc", padding: "10px" }}>
      <p><b>{comment.username}:</b> {comment.text}</p>
      <button onClick={handleLike}>Like ({likes})</button>
      <button onClick={() => setShowReplyForm(!showReplyForm)}>Reply</button>
      <button onClick={handleDelete}>Delete</button>
      <button onClick={handleToggleReplies}>{showReplies ? "Hide Replies" : "Show Replies"}</button>

      {showReplyForm && <CommentForm postId={postId} parentId={comment.id} setComments={setReplies} />}
      {showReplies &&
        replies.map((reply) => (
          <CommentItem key={reply.id} comment={reply} postId={postId} setComments={setReplies} />
        ))}
    </div>
  );
};

export default CommentItem;
