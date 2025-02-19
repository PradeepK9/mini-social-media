import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
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
  orderBy,
  limit,
  startAfter
} from "firebase/firestore";
import { Post } from "../types/post";


const POSTS_PER_PAGE = 6;

/** Fetch posts with pagination */
export const getAllPosts = async (lastDoc?: QueryDocumentSnapshot<DocumentData> | null) => {
  try {
    let postsQuery;

    if (lastDoc) {
      // If we have lastDoc, start after it
      postsQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"), startAfter(lastDoc), limit(POSTS_PER_PAGE));
    } else {
      // First-time load (no lastDoc)
      postsQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(POSTS_PER_PAGE));
    }

    const querySnapshot = await getDocs(postsQuery);

    if (querySnapshot.empty) {
      return { posts: [], lastVisible: null };
    }

    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    const posts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Post[];

    return { posts, lastVisible };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { posts: [], lastVisible: null };
  }
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
    username: user.displayName || "Anonymous",
    imageUrl,
    likes: [],
    saves: [],
    comments: [],
    createdAt: serverTimestamp(),
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
