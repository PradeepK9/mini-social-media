import { db, auth } from "./firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, where, orderBy, arrayUnion, arrayRemove } from "firebase/firestore";
import { CommentType } from "../types/comment"; // Import CommentType for proper typing

/** 🔹 Fetch all comments for a post (root-level comments only) */
export const getComments = async (postId: string, parentId: string | null = null): Promise<CommentType[]> => {
  let q;

  if (parentId === null) {
    q = query(
      collection(db, "comments"),
      where("postId", "==", postId),
      where("parentId", "==", null), // Fetch only root-level comments
      orderBy("createdAt", "asc") // Order comments by time
    );
  } else {
    q = query(
      collection(db, "comments"),
      where("postId", "==", postId),
      where("parentId", "==", parentId), // Fetch replies for a specific comment
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
    parentId, // If null, it means it's a root comment
    userId: user.uid,
    username: user.displayName || "Anonymous", // Get username from Firebase Auth
    text,
    likes: [],
    createdAt: new Date(),
  });
};

/** 🔹 Delete a comment (Only if the user is the owner) */
export const deleteComment = async (commentId: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const commentRef = doc(db, "comments", commentId);
  await deleteDoc(commentRef);
};

/** 🔹 Like or Unlike a comment */
export const toggleLikeComment = async (commentId: string, userId: string) => {
  const commentRef = doc(db, "comments", commentId);
  const commentSnapshot = await getDocs(query(collection(db, "comments"), where("id", "==", commentId)));

  if (!commentSnapshot.empty) {
    const commentData = commentSnapshot.docs[0].data();
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
