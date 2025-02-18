import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "../services/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

const ProtectedRoute = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (loggedInUser) => {
      setUser(loggedInUser);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  if (loading) return <p>Loading...</p>;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
