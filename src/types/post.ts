import { Timestamp, FieldValue  } from "firebase/firestore";

export interface Post {
    id: string;
    imageUrl: string;
    username: string;
    userId: string;
    likes: string[]; // Array of user IDs
    saves?: string[]; // Array of user IDs who saved the post
    comments?: {
      userId: string;
      text: string;
      createdAt: string;
      replies?: { userId: string; text: string; createdAt: string }[];
    }[];
    createdAt: string | FieldValue | Timestamp;
  }
  