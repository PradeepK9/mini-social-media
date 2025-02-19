import { db, auth } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  arrayUnion,
  arrayRemove,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { CommentType } from "../types/comment"; // Import CommentType for proper typing

/** 🔹 Fetch all comments for a post (root-level comments only) */
export const getComments = async (postId: string, parentId: string | null = null): Promise<CommentType[]> => {
  let q;

  if (parentId === null) {
    q = query(
      collection(db, "comments"),
      where("postId", "==", postId),
      where("parentId", "==", null),
      orderBy("createdAt", "asc")
    );
  } else {
    q = query(
      collection(db, "comments"),
      where("postId", "==", postId),
      where("parentId", "==", parentId),
      orderBy("createdAt", "asc")
    );
  }

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as CommentType[];
};

/** 🔹 Add a new comment (or reply to a comment) */
export const addComment = async (postId: string, text: string, parentId: string | null = null) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  await addDoc(collection(db, "comments"), {
    postId,
    parentId,
    userId: user.uid,
    username: user.displayName || "Anonymous",
    text,
    likes: [],
    createdAt: Timestamp.now(), // Use Firestore Timestamp
  });
};

/** 🔹 Delete a comment (Only if the user is the owner) */
export const deleteComment = async (commentId: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  // Check if the comment has replies
  const repliesQuery = query(collection(db, "comments"), where("parentId", "==", commentId));
  const repliesSnapshot = await getDocs(repliesQuery);

  // Delete all replies first
  const deletePromises = repliesSnapshot.docs.map((replyDoc) => deleteDoc(doc(db, "comments", replyDoc.id)));
  await Promise.all(deletePromises);

  // Now delete the comment itself
  const commentRef = doc(db, "comments", commentId);
  await deleteDoc(commentRef);
};

/** 🔹 Like or Unlike a comment */
export const toggleLikeComment = async (commentId: string, userId: string) => {
  const commentRef = doc(db, "comments", commentId);
  const commentSnapshot = await getDoc(commentRef); // Use getDoc

  if (commentSnapshot.exists()) {
    const commentData = commentSnapshot.data();
    const likesArray = commentData.likes || [];

    if (likesArray.includes(userId)) {
      await updateDoc(commentRef, {
        likes: arrayRemove(userId), // Unlike the comment
      });
    } else {
      await updateDoc(commentRef, {
        likes: arrayUnion(userId), // Like the comment
      });
    }
  }
};
