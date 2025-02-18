import { useState, useEffect } from "react";
import PostComponent from "../components/Post";
import { getUserPosts } from "../services/postService";
import { Post } from "../types/post";
import { auth } from "../services/firebase";

const MyPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const user = auth.currentUser; // Get the logged-in user

  useEffect(() => {
    const fetchPosts = async () => {
      if (!user) return;
      const fetchedPosts = await getUserPosts(user.uid);
      setPosts(fetchedPosts);
    };

    fetchPosts();
  }, [user]);

  if (!user) return <p>Please log in to see your posts.</p>;
  if (posts.length === 0) return <p>No posts found.</p>;

  return (
    <div>
      <h2>My Posts</h2>
      {posts.map((post) => (
        <PostComponent key={post.id} post={post} user={user} setPosts={setPosts} />
      ))}
    </div>
  );
};

export default MyPosts;
