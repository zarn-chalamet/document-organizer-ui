import React, { useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Typography, Alert
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import api from "../api/axios";

export default function DeleteCategoryModal({ open, onClose, category, onDeleted }) {
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState(null);

    const handleDelete = async () => {
        setDeleting(true);
        setError(null);

        try {
            await api.delete(`/categories/${category.id}`);
            onDeleted();
            onClose();
        } catch (err) {
            console.error(err);
            setError("Failed to delete category");
        } finally {
            setDeleting(false);
        }
    };

    if (!category) return null;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                <WarningAmberIcon color="warning" sx={{ mr: 1, verticalAlign: "middle" }} />
                Delete Category?
            </DialogTitle>
            <DialogContent>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Typography>
                    Are you sure you want to delete <strong>{category.name}</strong>?
                </Typography>

                <Alert severity="warning" sx={{ mt: 2 }}>
                    This will permanently delete:
                    <ul style={{ marginTop: 8, marginBottom: 0 }}>
                        <li>The category</li>
                        <li>{category.documentCount || 0} document(s) inside</li>
                        <li>The corresponding folder in your Google Drive</li>
                    </ul>
                    This action cannot be undone.
                </Alert>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleDelete}
                    variant="contained"
                    color="error"
                    disabled={deleting}
                >
                    {deleting ? "Deleting..." : "Delete Permanently"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}