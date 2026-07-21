import React, { useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, MenuItem, Alert
} from "@mui/material";
import api from "../api/axios";

const CATEGORY_TYPES = [
    "PASSPORT", "VISA", "WORK_PERMIT", "ID_CARD", "DRIVER_LICENSE",
    "INSURANCE", "MEDICAL", "EDUCATION", "BANK", "PROPERTY", "VEHICLE", "CUSTOM"
];

export default function CreateCategoryModal({ open, onClose, onCreated }) {
    const [name, setName] = useState("");
    const [type, setType] = useState("PASSPORT");
    const [customType, setCustomType] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const handleCreate = async () => {
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
            await api.post("/categories", {
                name: name.trim(),
                type,
                customType: type === "CUSTOM" ? customType.trim() : null
            });
            setName("");
            setType("PASSPORT");
            setCustomType("");
            onCreated();
            onClose();
        } catch (err) {
            console.error(err);
            setError("Failed to create category");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Create Category</DialogTitle>
            <DialogContent>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <TextField
                    label="Category Name *"
                    fullWidth
                    margin="normal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Thailand Work Visa"
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
                        placeholder="e.g. Pet Registration"
                    />
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleCreate} variant="contained" disabled={saving}>
                    {saving ? "Creating..." : "Create"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}