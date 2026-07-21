import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Box, IconButton, Alert } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import api from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import EditDocumentModal from "../components/EditDocumentModal";
import MoveDocumentModal from "../components/MoveDocumentModal";

export default function DocumentDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [doc, setDoc] = useState(null);
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [moveOpen, setMoveOpen] = useState(false);

    const loadDocument = async () => {
    try {
            const res = await api.get(`/documents/${id}`);
            setDoc(res.data);
        } catch (err) {
            console.error(err);
            setError("Could not load document");
        }
    };

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const res = await api.get(`/documents/${id}`);
                if (!cancelled) setDoc(res.data);
            } catch (err) {
                console.error(err);
                if (!cancelled) setError("Could not load document");
            }
        })();

        return () => { cancelled = true; };
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this document?")) return;

        setDeleting(true);
        try {
            await api.delete(`/documents/${id}`);
            navigate(`/categories/${doc.categoryId}`);
        } catch (err) {
            console.error(err);
            setError("Failed to delete document");
            setDeleting(false);
        }
    };

    if (error) {
        return <Container><Alert severity="error" sx={{ mt: 10 }}>{error}</Alert></Container>;
    }

    if (!doc) {
        return <Container><Typography mt={10}>Loading...</Typography></Container>;
    }

    return (
        <Container>
            <Box mt={10}>
                <IconButton onClick={() => navigate(`/categories/${doc.categoryId}`)} sx={{ mb: 1 }}>
                    <ArrowBackIcon />
                </IconButton>

                <Typography variant="h4">{doc.title}</Typography>

                {doc.description && <Typography mt={2}>{doc.description}</Typography>}

                <Typography mt={2} color="text.secondary">Type: {doc.fileType}</Typography>

                {doc.expiryDate ? (
                    <Typography mt={1} color="text.secondary">
                        Expires on: {doc.expiryDate}
                    </Typography>
                ) : (
                    <Typography mt={1} color="text.secondary" fontStyle="italic">
                        No expiry date set (AI will extract this later)
                    </Typography>
                )}

                <Box mt={3} display="flex" gap={2} flexWrap="wrap">
                    <Button
                        variant="contained"
                        startIcon={<OpenInNewIcon />}
                        href={doc.driveFileLink}
                        target="_blank"
                    >
                        Open in Drive
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => setEditOpen(true)}
                    >
                        Edit
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<DriveFileMoveIcon />}
                        onClick={() => setMoveOpen(true)}
                    >
                        Move
                    </Button>

                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={handleDelete}
                        disabled={deleting}
                    >
                        {deleting ? "Deleting..." : "Delete"}
                    </Button>
                </Box>
            </Box>

            <EditDocumentModal
                open={editOpen}
                onClose={() => setEditOpen(false)}
                document={doc}
                onUpdated={loadDocument}
            />

            <MoveDocumentModal
                open={moveOpen}
                onClose={() => setMoveOpen(false)}
                document={doc}
                onMoved={(newCategoryId) => navigate(`/categories/${newCategoryId}`)}
            />
        </Container>
    );
}