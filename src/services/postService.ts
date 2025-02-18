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
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  getDoc,
  orderBy
} from "firebase/firestore";
import { Post } from "../types/post";

/** Fetch all posts */
export const getAllPosts = async (): Promise<Post[]> => {
  const querySnapshot = await getDocs(collection(db, "posts"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Post[];
};

/** Fetch posts created by a specific user */
export const getUserPosts = async (userId: string): Promise<Post[]> => {
  const q = query(collection(db, "posts"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Post[];
};

/** Fetch saved posts for the logged-in user */
export const getSavedPosts = async (): Promise<Post[]> => {
  const user = auth.currentUser;
  if (!user) return [];

  const q = query(collection(db, "posts"), where("saves", "array-contains", user.uid));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Post[];
};

/** Add a new post */
export const addPost = async (imageUrl: string) => {
  const user = auth.currentUser;
  if (!user) return;

  const newPost: Omit<Post, "id"> = {
    userId: user.uid,
    username: user.displayName || "Anonymous", // ✅ Ensure username is saved
    imageUrl,
    likes: [],
    saves: [],
    comments: [], // ✅ Initialize with an empty array since it's an array of objects
    createdAt: serverTimestamp(), // ✅ Firestore timestamp
  };

  await addDoc(collection(db, "posts"), newPost);
};

/** Delete a post */
export const deletePost = async (postId: string) => {
  const user = auth.currentUser;
  if (!user) return;

  const postRef = doc(db, "posts", postId);
  await deleteDoc(postRef);
};

/** Like or Unlike a post */
export const toggleLikePost = async (postId: string, userId: string) => {
  const postRef = doc(db, "posts", postId);
  const postSnap = await getDoc(postRef);

  if (!postSnap.exists()) return;

  const postData = postSnap.data();
  const likes = postData.likes || [];

  if (likes.includes(userId)) {
    await updateDoc(postRef, {
      likes: arrayRemove(userId),
    });
  } else {
    await updateDoc(postRef, {
      likes: arrayUnion(userId),
    });
  }
};

/** Save or Unsave a post */
export const savePost = async (postId: string) => {
  const user = auth.currentUser;
  if (!user) return;

  const postRef = doc(db, "posts", postId);
  const postSnap = await getDoc(postRef);

  if (!postSnap.exists()) return;

  const postData = postSnap.data();
  const savedUsers = postData.saves || [];

  if (savedUsers.includes(user.uid)) {
    await updateDoc(postRef, {
      saves: arrayRemove(user.uid),
    });
  } else {
    await updateDoc(postRef, {
      saves: arrayUnion(user.uid),
    });
  }
};

/** Add a comment (supports nested replies) */
export const addComment = async (postId: string, userId: string, text: string, parentId: string | null = null) => {
  await addDoc(collection(db, "comments"), {
    postId,
    userId,
    text,
    parentId,
    createdAt: new Date(),
  });
};

/** Fetch comments (supports nested replies) */
export const getComments = async (postId: string, parentId: string | null = null) => {
  const q = query(
    collection(db, "comments"),
    where("postId", "==", postId),
    where("parentId", "==", parentId || null),
    orderBy("createdAt")
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
