import React, { useState, useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, MenuItem, Alert
} from "@mui/material";
import api from "../api/axios";

const CATEGORY_TYPES = [
    "PASSPORT", "VISA", "WORK_PERMIT", "ID_CARD", "DRIVER_LICENSE",
    "INSURANCE", "MEDICAL", "EDUCATION", "BANK", "PROPERTY", "VEHICLE", "CUSTOM"
];

export default function EditCategoryModal({ open, onClose, category, onUpdated }) {
    const [name, setName] = useState("");
    const [type, setType] = useState("PASSPORT");
    const [customType, setCustomType] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (category) {
            setName(category.name || "");
            setType(category.type || "PASSPORT");
            setCustomType(category.customType || "");
        }
    }, [category]);

    const handleUpdate = async () => {
        if (!name.trim()) {
            setError("Name is required");
            return;
        }
        if (type === "CUSTOM" && !customType.trim()) {
            setError("Custom type name is required");
            return;
        }

        setSaving(true);
        setError(null);

        try {
            await api.put(`/categories/${category.id}`, {
                name: name.trim(),
                type,
                customType: type === "CUSTOM" ? customType.trim() : null
            });
            onUpdated();
            onClose();
        } catch (err) {
            console.error(err);
            setError("Failed to update category");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit Category</DialogTitle>
            <DialogContent>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <TextField
                    label="Category Name *"
                    fullWidth
                    margin="normal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <TextField
                    label="Type *"
                    fullWidth
                    select
                    margin="normal"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                >
                    {CATEGORY_TYPES.map((t) => (
                        <MenuItem key={t} value={t}>{t.replace("_", " ")}</MenuItem>
                    ))}
                </TextField>

                {type === "CUSTOM" && (
                    <TextField
                        label="Custom Type Name *"
                        fullWidth
                        margin="normal"
                        value={customType}
                        onChange={(e) => setCustomType(e.target.value)}
                    />
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleUpdate} variant="contained" disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}