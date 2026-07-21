import React, { useState, useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, MenuItem, Alert
} from "@mui/material";
import api from "../api/axios";

export default function MoveDocumentModal({ open, onClose, document, onMoved }) {
    const [categories, setCategories] = useState([]);
    const [targetCategoryId, setTargetCategoryId] = useState("");
    const [moving, setMoving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (open) {
            api.get("/categories")
                .then((res) => setCategories(res.data))
                .catch((err) => console.error(err));
        }
    }, [open]);

    const handleMove = async () => {
        if (!targetCategoryId) {
            setError("Please select a category");
            return;
        }

        setMoving(true);
        setError(null);

        try {
            await api.patch(`/documents/${document.id}/move`, {
                targetCategoryId
            });
            onMoved(targetCategoryId);
            onClose();
        } catch (err) {
            console.error(err);
            setError("Failed to move document");
        } finally {
            setMoving(false);
        }
    };

    // Exclude current category from the list
    const availableCategories = categories.filter(
        (c) => c.id !== document?.categoryId
    );

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Move Document</DialogTitle>
            <DialogContent>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <TextField
                    label="Move to Category"
                    fullWidth
                    select
                    margin="normal"
                    value={targetCategoryId}
                    onChange={(e) => setTargetCategoryId(e.target.value)}
                >
                    {availableCategories.length === 0 && (
                        <MenuItem disabled>No other categories available</MenuItem>
                    )}
                    {availableCategories.map((c) => (
                        <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                    ))}
                </TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleMove}
                    variant="contained"
                    disabled={moving || availableCategories.length === 0}
                >
                    {moving ? "Moving..." : "Move"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}