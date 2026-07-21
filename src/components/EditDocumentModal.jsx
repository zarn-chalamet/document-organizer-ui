import React, { useState, useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Alert
} from "@mui/material";
import api from "../api/axios";

export default function EditDocumentModal({ open, onClose, document, onUpdated }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (document) {
            setTitle(document.title || "");
            setDescription(document.description || "");
            setExpiryDate(document.expiryDate || "");
        }
    }, [document]);

    const handleSave = async () => {
        if (!title.trim()) {
            setError("Title is required");
            return;
        }

        setSaving(true);
        setError(null);

        try {
            await api.patch(`/documents/${document.id}`, {
                title: title.trim(),
                description: description.trim(),
                expiryDate: expiryDate || null
            });
            onUpdated();
            onClose();
        } catch (err) {
            console.error(err);
            setError("Failed to update document");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit Document</DialogTitle>
            <DialogContent>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

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

                <TextField
                    label="Expiry Date"
                    type="date"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    helperText="Optional — AI will extract this from the document later"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} variant="contained" disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}