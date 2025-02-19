import { useState } from "react";
import { addPost } from "../services/postService";
import { Button, TextField, Box, Typography } from "@mui/material";
import { toast } from "react-toastify";

interface CreatePostProps {
    onPostAdded?: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostAdded }) => {
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const handlePostSubmit = async () => {
        if (!imageUrl.trim()) return alert("Image URL is required");

        setLoading(true);
        await addPost(imageUrl);
        setLoading(false);
        setImageUrl("");
        
        toast.success("Post added successfully!");

        if (onPostAdded) {
            onPostAdded();
        }
    };

    return (
        <Box sx={{ maxWidth: 400, margin: "auto", padding: 2, mb: 8 }}>
            <Typography variant="h6">Create a New Post</Typography>
            <TextField
                fullWidth
                label="Image URL"
                variant="outlined"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                sx={{ mt: 2 }}
            />
            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handlePostSubmit}
                sx={{ mt: 2 }}
                disabled={loading}
            >
                {loading ? "Posting..." : "Add Post"}
            </Button>
        </Box>
    );
};

export default CreatePost;
