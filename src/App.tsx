
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyPosts from "./pages/MyPosts";
import SavedPosts from "./pages/SavedPosts";
import Feeds from './pages/Feeds';
import Navbar from "./components/Navbar";
import ProtectedRoute from "./routes/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './App.css'

const App = () => {
  return (
    <Router>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/feeds" element={<Feeds />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/my-posts" element={<MyPosts />} />
          <Route path="/saved-posts" element={<SavedPosts />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;

