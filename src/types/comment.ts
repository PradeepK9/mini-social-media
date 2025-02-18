export interface CommentType {
  id: string;
  postId: string;
  parentId: string | null; // If null, it's a root comment; otherwise, it's a reply
  userId: string;
  username: string;
  text: string;
  likes: string[]; // Array of user IDs who liked the comment
  createdAt: Date;
}
