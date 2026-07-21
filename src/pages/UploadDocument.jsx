import React, { useState } from "react";
import { Button, TextField, Container, Box, Typography, Alert, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import api from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";

export default function UploadDocument() {
    const { id: categoryId } = useParams();
    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleUpload = async () => {
        if (!file || !title) {
            setMessage({ type: "error", text: "Please provide title and file" });
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);
        formData.append("description", description);

        setUploading(true);
        setMessage(null);

        try {
            await api.post(`/categories/${categoryId}/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setMessage({ type: "success", text: "Upload successful!" });
            setTimeout(() => navigate(`/categories/${categoryId}`), 800);
        } catch (err) {
            console.error(err);
            setMessage({ type: "error", text: "Upload failed. Please try again." });
        } finally {
            setUploading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box mt={10}>
                <IconButton onClick={() => navigate(`/categories/${categoryId}`)} sx={{ mb: 1 }}>
                    <ArrowBackIcon />
                </IconButton>

                <Typography variant="h4" gutterBottom>
                    Upload Document
                </Typography>

                {message && (
                    <Alert severity={message.type} sx={{ mt: 2 }}>
                        {message.text}
                    </Alert>
                )}

                <TextField
                    label="Title *"
                    fullWidth
                    margin="normal"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <TextField
                    label="Description"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    {file ? file.name : "Choose File *"}
                    <input
                        type="file"
                        hidden
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={handleUpload}
                    disabled={uploading}
                >
                    {uploading ? "Uploading..." : "Upload Document"}
                </Button>
            </Box>
        </Container>
    );
}