import React, { useState, useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Box, Typography, IconButton
} from "@mui/material";
import EditIcon from "@mui/icons-material/EditOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "sonner";
import api from "../api/axios";

export default function EditDocumentModal({ open, onClose, document, onUpdated }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (document) {
            setTitle(document.title || "");
            setDescription(document.description || "");
            // Fix: slice ISO datetime to just the date portion (YYYY-MM-DD)
            setExpiryDate(document.expiryDate ? document.expiryDate.slice(0, 10) : "");
        }
    }, [document]);

    const handleClose = () => {
        if (saving) return;
        onClose();
    };

    const handleSave = async () => {
        if (!title.trim()) { toast.error("Title is required"); return; }

        setSaving(true);
        try {
            await api.patch(`/documents/${document.id}`, {
                title: title.trim(),
                description: description.trim(),
                expiryDate: expiryDate || null,
            });
            onUpdated();
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("Failed to update document");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            slotProps={{ paper: { sx: { borderRadius: 3 } } }}
        >
            <DialogTitle sx={{ pt: 3, pb: 2, px: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box sx={{
                        width: 40, height: 40, borderRadius: 2,
                        background: "linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(124, 58, 237, 0.15))",
                        border: "1px solid rgba(139, 92, 246, 0.35)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                    }}>
                        <EditIcon sx={{ color: "#A78BFA", fontSize: 20 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.3 }}>
                            Edit Document
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Update document details
                        </Typography>
                    </Box>
                    <IconButton size="small" onClick={handleClose} disabled={saving}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ pt: "16px !important", pb: 2, px: 3 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                    <TextField
                        label="Title" required fullWidth autoFocus
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextField
                        label="Description" fullWidth multiline rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Add notes about this document"
                    />
                    <TextField
                        label="Expiry Date" type="date" fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        helperText="Leave empty for AI to auto-extract"
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{ pt: 2, pb: 3, px: 3, gap: 1 }}>
                <Button onClick={handleClose} disabled={saving} color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    disabled={saving || !title.trim()}
                    sx={{ boxShadow: "0 4px 14px -4px rgba(139, 92, 246, 0.5)" }}
                >
                    {saving ? "Saving..." : "Save Changes"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}