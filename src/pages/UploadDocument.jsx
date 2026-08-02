import React, { useState, useRef } from "react";
import {
    Button, Box, Typography, TextField,
    ToggleButton, ToggleButtonGroup, IconButton, Card, CardContent
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUploadOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFileOutlined";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";
import HomeIcon from "@mui/icons-material/Home";
import FolderIcon from "@mui/icons-material/Folder";

export default function UploadDocument() {
    const { id: categoryId } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [uploadMode, setUploadMode] = useState("single");
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleFileSelect = (selected) => {
        if (uploadMode === "single") {
            const f = selected[0];
            setFile(f);
            if (!title) {
                const name = f.name.replace(/\.[^/.]+$/, "");
                setTitle(name);
            }
        } else {
            setFiles(Array.from(selected));
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files) handleFileSelect(e.dataTransfer.files);
    };

    const handleDragOver = (e) => { e.preventDefault(); setDragActive(true); };
    const handleDragLeave = () => setDragActive(false);
    const removeFile = (index) => setFiles(files.filter((_, i) => i !== index));

    const formatSize = (bytes) => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    const handleSingleUpload = async () => {
        if (!file || !title.trim()) {
            toast.error("Please provide a title and file");
            return;
        }
        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);
        formData.append("description", description);

        setUploading(true);
        try {
            await api.post(`/categories/${categoryId}/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Upload successful");
            setTimeout(() => navigate(`/categories/${categoryId}`), 500);
        } catch (err) {
            console.error(err);
            toast.error("Upload failed");
            setUploading(false);
        }
    };

    const handleBulkUpload = async () => {
        if (files.length === 0) {
            toast.error("Please choose at least one file");
            return;
        }
        const formData = new FormData();
        files.forEach((f) => formData.append("files", f));

        setUploading(true);
        try {
            const res = await api.post(
                `/categories/${categoryId}/upload-multiple`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            toast.success(`Uploaded ${res.data.length} of ${files.length} files`);
            setTimeout(() => navigate(`/categories/${categoryId}`), 700);
        } catch (err) {
            console.error(err);
            toast.error("Bulk upload failed");
            setUploading(false);
        }
    };

    return (
        <Box sx={{
            width: "100%",
            px: { xs: 2, sm: 3, md: 4, lg: 5 },
            py: { xs: 3, md: 4 },
            boxSizing: "border-box",
        }}>
            <PageHeader
                title="Upload Document"
                subtitle="Add a new document to this category"
                backTo={`/categories/${categoryId}`}
                breadcrumbs={[
                    { label: "Dashboard", to: "/", icon: <HomeIcon sx={{ fontSize: 14, mr: 0.5 }} /> },
                    { label: "Category", to: `/categories/${categoryId}`, icon: <FolderIcon sx={{ fontSize: 14, mr: 0.5 }} /> },
                    { label: "Upload" },
                ]}
            />

            <ToggleButtonGroup
                value={uploadMode}
                exclusive
                onChange={(e, v) => v && setUploadMode(v)}
                size="small"
                sx={{ mb: 3 }}
            >
                <ToggleButton value="single" sx={{ px: 2.5 }}>Single File</ToggleButton>
                <ToggleButton value="bulk" sx={{ px: 2.5 }}>Multiple Files</ToggleButton>
            </ToggleButtonGroup>

            <Card>
                <CardContent sx={{ p: { xs: 3, md: 4 }, "&:last-child": { pb: { xs: 3, md: 4 } } }}>
                    {/* Dropzone — theme-aware */}
                    <Box
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onClick={() => fileInputRef.current?.click()}
                        sx={{
                            border: "2px dashed",
                            borderColor: dragActive ? "primary.main" : "divider",
                            borderRadius: 3,
                            p: { xs: 4, md: 5 },
                            textAlign: "center",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            bgcolor: dragActive ? "action.hover" : "background.default",
                            "&:hover": {
                                borderColor: "primary.main",
                                bgcolor: "action.hover",
                            },
                        }}
                    >
                        <Box sx={{
                            width: 64, height: 64, borderRadius: 2.5,
                            background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                            display: "inline-flex",
                            alignItems: "center", justifyContent: "center",
                            mb: 2,
                            boxShadow: "0 8px 24px -6px rgba(139, 92, 246, 0.5)",
                        }}>
                            <CloudUploadIcon sx={{ color: "white", fontSize: 30 }} />
                        </Box>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>
                            {dragActive ? "Drop files here" : "Click to upload or drag and drop"}
                        </Typography>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem" }}
                        >
                            PDF · JPG · PNG · Max 25 MB per file
                        </Typography>

                        <input
                            ref={fileInputRef}
                            type="file"
                            hidden
                            multiple={uploadMode === "bulk"}
                            onChange={(e) => handleFileSelect(e.target.files)}
                        />
                    </Box>

                    {/* Single selected file */}
                    {uploadMode === "single" && file && (
                        <Box sx={{
                            mt: 3, p: 2,
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            bgcolor: "background.default",
                        }}>
                            <Box sx={{
                                width: 40, height: 40, borderRadius: 1.5,
                                background: "linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(124, 58, 237, 0.15))",
                                border: "1px solid rgba(139, 92, 246, 0.35)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                flexShrink: 0,
                            }}>
                                <InsertDriveFileIcon sx={{ color: "#A78BFA", fontSize: 20 }} />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="body2" fontWeight={600} noWrap>
                                    {file.name}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6875rem" }}
                                >
                                    {formatSize(file.size)}
                                </Typography>
                            </Box>
                            <IconButton
                                size="small"
                                onClick={() => setFile(null)}
                                sx={{ "&:hover": { color: "error.main" } }}
                            >
                                <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    )}

                    {/* Bulk file list */}
                    {uploadMode === "bulk" && files.length > 0 && (
                        <Box sx={{ mt: 3 }}>
                            <Typography sx={{
                                display: "block",
                                mb: 1.5,
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: "0.6875rem",
                                fontWeight: 700,
                                letterSpacing: "0.08em",
                                color: "primary.main",
                                textTransform: "uppercase",
                            }}>
                                {String(files.length).padStart(2, "0")} Files Selected
                            </Typography>
                            <Box sx={{
                                maxHeight: 260,
                                overflow: "auto",
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 2,
                                p: 0.5,
                            }}>
                                {files.map((f, i) => (
                                    <Box
                                        key={i}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1.5,
                                            p: 1,
                                            borderRadius: 1,
                                            transition: "background-color 0.15s",
                                            "&:hover": { bgcolor: "action.hover" },
                                        }}
                                    >
                                        <InsertDriveFileIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography
                                                variant="body2"
                                                fontWeight={500}
                                                noWrap
                                                sx={{ fontSize: "0.8125rem" }}
                                            >
                                                {f.name}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                sx={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6875rem" }}
                                            >
                                                {formatSize(f.size)}
                                            </Typography>
                                        </Box>
                                        <IconButton
                                            size="small"
                                            onClick={() => removeFile(i)}
                                            sx={{ "&:hover": { color: "error.main" } }}
                                        >
                                            <DeleteOutlineIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}

                    {/* Single form */}
                    {uploadMode === "single" && (
                        <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2.5 }}>
                            <TextField
                                label="Title"
                                required fullWidth
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <TextField
                                label="Description"
                                fullWidth multiline rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Optional notes about this document"
                            />
                        </Box>
                    )}

                    {/* Bulk hint */}
                    {uploadMode === "bulk" && (
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mt: 2, display: "block", fontSize: "0.75rem" }}
                        >
                            Each file will use its filename as the title. You can edit them individually after upload.
                        </Typography>
                    )}

                    {/* Actions */}
                    <Box sx={{
                        mt: 4,
                        display: "flex",
                        gap: 1.5,
                        flexDirection: { xs: "column-reverse", sm: "row" },
                        justifyContent: { xs: "stretch", sm: "flex-end" },
                    }}>
                        <Button
                            onClick={() => navigate(`/categories/${categoryId}`)}
                            disabled={uploading}
                            color="inherit"
                            fullWidth={false}
                            sx={{ width: { xs: "100%", sm: "auto" } }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={uploadMode === "single" ? handleSingleUpload : handleBulkUpload}
                            disabled={uploading || (uploadMode === "single" ? !file : files.length === 0)}
                            sx={{
                                width: { xs: "100%", sm: "auto" },
                                boxShadow: "0 4px 14px -4px rgba(139, 92, 246, 0.5)",
                            }}
                        >
                            {uploading
                                ? "Uploading..."
                                : uploadMode === "single"
                                    ? "Upload Document"
                                    : `Upload ${files.length || ""} File${files.length !== 1 ? "s" : ""}`}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}