import React, { useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, MenuItem, Box, Typography, IconButton
} from "@mui/material";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolderOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "sonner";
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

    const handleClose = () => {
        if (saving) return;
        setName("");
        setType("PASSPORT");
        setCustomType("");
        onClose();
    };

    const handleCreate = async () => {
        if (!name.trim()) { toast.error("Name is required"); return; }
        if (type === "CUSTOM" && !customType.trim()) {
            toast.error("Custom type name is required"); return;
        }

        setSaving(true);
        try {
            await api.post("/categories", {
                name: name.trim(),
                type,
                customType: type === "CUSTOM" ? customType.trim() : null,
            });
            toast.success("Category created");
            onCreated();
            handleClose();
        } catch (err) {
            console.error(err);
            toast.error("Failed to create category");
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
            slotProps={{
                paper: { sx: { borderRadius: 3 } },
            }}
        >
            {/* HEADER: extra top padding for breathing room */}
            <DialogTitle sx={{ pt: 3, pb: 2, px: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                        sx={{
                            width: 40, height: 40, borderRadius: 2,
                            background: "linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(124, 58, 237, 0.15))",
                            border: "1px solid rgba(139, 92, 246, 0.35)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >
                        <CreateNewFolderIcon sx={{ color: "#A78BFA", fontSize: 20 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.3 }}>
                            Create Category
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Organize your documents by type
                        </Typography>
                    </Box>
                    <IconButton size="small" onClick={handleClose} disabled={saving}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
            </DialogTitle>

            {/* CONTENT: symmetric top/bottom padding */}
            <DialogContent sx={{ pt: "16px !important", pb: 2, px: 3 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                    <TextField
                        label="Category Name"
                        required fullWidth autoFocus
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Thailand Work Visa"
                    />
                    <TextField
                        label="Type" select required fullWidth
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        {CATEGORY_TYPES.map((t) => (
                            <MenuItem key={t} value={t}>
                                {t.replace(/_/g, " ")}
                            </MenuItem>
                        ))}
                    </TextField>
                    {type === "CUSTOM" && (
                        <TextField
                            label="Custom Type Name"
                            required fullWidth
                            value={customType}
                            onChange={(e) => setCustomType(e.target.value)}
                            placeholder="e.g. Pet Registration"
                        />
                    )}
                </Box>
            </DialogContent>

            {/* ACTIONS: extra bottom padding to match header */}
            <DialogActions sx={{ pt: 2, pb: 3, px: 3, gap: 1 }}>
                <Button onClick={handleClose} disabled={saving} color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={handleCreate}
                    variant="contained"
                    disabled={saving || !name.trim()}
                    sx={{ boxShadow: "0 4px 14px -4px rgba(139, 92, 246, 0.5)" }}
                >
                    {saving ? "Creating..." : "Create Category"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}