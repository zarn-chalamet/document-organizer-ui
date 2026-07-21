import React, { useState } from "react";
import {
    Button, TextField, Container, Box, Typography, Alert,
    IconButton, ToggleButton, ToggleButtonGroup, List, ListItem, ListItemText
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import api from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";

export default function UploadDocument() {
    const { id: categoryId } = useParams();
    const navigate = useNavigate();

    const [mode, setMode] = useState("single"); // "single" or "bulk"

    // Single upload state
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    // Bulk upload state
    const [files, setFiles] = useState([]);

    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSingleUpload = async () => {
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

    const handleBulkUpload = async () => {
        if (files.length === 0) {
            setMessage({ type: "error", text: "Please choose at least one file" });
            return;
        }

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
        }

        setUploading(true);
        setMessage(null);

        try {
            const res = await api.post(`/categories/${categoryId}/upload-multiple`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setMessage({
                type: "success",
                text: `Uploaded ${res.data.length} of ${files.length} files!`
            });
            setTimeout(() => navigate(`/categories/${categoryId}`), 1000);
        } catch (err) {
            console.error(err);
            setMessage({ type: "error", text: "Bulk upload failed." });
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

                <Typography variant="h4" gutterBottom>Upload Document</Typography>

                <ToggleButtonGroup
                    value={mode}
                    exclusive
                    onChange={(e, v) => { if (v) { setMode(v); setMessage(null); } }}
                    size="small"
                    sx={{ mb: 2 }}
                >
                    <ToggleButton value="single">Single File</ToggleButton>
                    <ToggleButton value="bulk">Multiple Files</ToggleButton>
                </ToggleButtonGroup>

                {message && <Alert severity={message.type} sx={{ mt: 2 }}>{message.text}</Alert>}

                {mode === "single" ? (
                    <>
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

                        <Button variant="outlined" component="label" fullWidth sx={{ mt: 2 }}>
                            {file ? file.name : "Choose File *"}
                            <input
                                type="file"
                                hidden
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                        </Button>

                        <Button
                            variant="contained"
                            fullWidth
                            sx={{ mt: 2 }}
                            onClick={handleSingleUpload}
                            disabled={uploading}
                        >
                            {uploading ? "Uploading..." : "Upload Document"}
                        </Button>
                    </>
                ) : (
                    <>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Each file will use its filename as the title. You can edit them later.
                        </Typography>

                        <Button variant="outlined" component="label" fullWidth sx={{ mt: 1 }}>
                            {files.length > 0 ? `${files.length} file(s) selected` : "Choose Files *"}
                            <input
                                type="file"
                                hidden
                                multiple
                                onChange={(e) => setFiles(Array.from(e.target.files))}
                            />
                        </Button>

                        {files.length > 0 && (
                            <List dense sx={{ mt: 1, maxHeight: 200, overflow: "auto", border: "1px solid #eee", borderRadius: 1 }}>
                                {files.map((f, i) => (
                                    <ListItem key={i}>
                                        <ListItemText primary={f.name} />
                                    </ListItem>
                                ))}
                            </List>
                        )}

                        <Button
                            variant="contained"
                            fullWidth
                            sx={{ mt: 2 }}
                            onClick={handleBulkUpload}
                            disabled={uploading}
                        >
                            {uploading ? "Uploading..." : `Upload ${files.length || ""} File(s)`}
                        </Button>
                    </>
                )}
            </Box>
        </Container>
    );
}