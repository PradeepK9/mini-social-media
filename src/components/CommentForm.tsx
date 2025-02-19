import { useState } from "react";
import { addComment } from "../services/commentService";
import { CommentType } from "../types/comment";

type CommentFormProps = {
  postId: string;
  parentId: string | null;
  setComments: React.Dispatch<React.SetStateAction<CommentType[]>>;
};

const CommentForm = ({ postId, parentId, setComments }: CommentFormProps) => {
  const [text, setText] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    await addComment(postId, text, parentId ?? undefined);

    setText("");

    setComments((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        postId,
        parentId,
        userId: "user123", // Replace with real user ID
        username: "Anonymous", // Replace with real username
        text,
        likes: [],
        createdAt: new Date(),
      },
    ]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a comment..." />
      <button type="submit">Comment</button>
    </form>
  );
};

export default CommentForm;
