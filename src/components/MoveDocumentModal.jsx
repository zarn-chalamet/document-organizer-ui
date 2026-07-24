import React, { useState, useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, MenuItem, Box, Typography, IconButton
} from "@mui/material";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMoveOutlined";
import CloseIcon from "@mui/icons-material/Close";
import FolderIcon from "@mui/icons-material/Folder";
import { toast } from "sonner";
import api from "../api/axios";

export default function MoveDocumentModal({ open, onClose, document, onMoved }) {
    const [categories, setCategories] = useState([]);
    const [targetCategoryId, setTargetCategoryId] = useState("");
    const [moving, setMoving] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(false);

    useEffect(() => {
        if (open) {
            setLoadingCategories(true);
            api.get("/categories")
                .then((res) => setCategories(res.data))
                .catch((err) => {
                    console.error(err);
                    toast.error("Failed to load categories");
                })
                .finally(() => setLoadingCategories(false));
        }
    }, [open]);

    const handleClose = () => {
        if (moving) return;
        setTargetCategoryId("");
        onClose();
    };

    const handleMove = async () => {
        if (!targetCategoryId) { toast.error("Please select a category"); return; }

        setMoving(true);
        try {
            await api.patch(`/documents/${document.id}/move`, { targetCategoryId });
            onMoved(targetCategoryId);
            handleClose();
        } catch (err) {
            console.error(err);
            toast.error("Failed to move document");
        } finally {
            setMoving(false);
        }
    };

    const availableCategories = categories.filter((c) => c.id !== document?.categoryId);
    const currentCategory = categories.find((c) => c.id === document?.categoryId);

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
                        <DriveFileMoveIcon sx={{ color: "#A78BFA", fontSize: 20 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.3 }}>
                            Move Document
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Choose a destination category
                        </Typography>
                    </Box>
                    <IconButton size="small" onClick={handleClose} disabled={moving}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ pt: "16px !important", pb: 2, px: 3 }}>
                {currentCategory && (
                    <Box sx={{
                        mb: 2.5, p: 1.5,
                        bgcolor: "action.hover",
                        borderRadius: 2,
                        display: "flex", alignItems: "center", gap: 1.5,
                    }}>
                        <FolderIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                        <Box>
                            <Typography variant="caption" color="text.secondary" sx={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: "0.6875rem",
                                fontWeight: 600,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                display: "block",
                            }}>
                                Currently in
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>{currentCategory.name}</Typography>
                        </Box>
                    </Box>
                )}

                <TextField
                    label="Destination Category"
                    fullWidth select
                    value={targetCategoryId}
                    onChange={(e) => setTargetCategoryId(e.target.value)}
                    disabled={loadingCategories}
                    helperText={
                        availableCategories.length === 0 && !loadingCategories
                            ? "You need at least one other category to move this document"
                            : " "
                    }
                >
                    {loadingCategories ? (
                        <MenuItem disabled>Loading categories...</MenuItem>
                    ) : availableCategories.length === 0 ? (
                        <MenuItem disabled>No other categories available</MenuItem>
                    ) : (
                        availableCategories.map((c) => (
                            <MenuItem key={c.id} value={c.id}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                                    <FolderIcon sx={{ fontSize: 16, color: "primary.main" }} />
                                    {c.name}
                                </Box>
                            </MenuItem>
                        ))
                    )}
                </TextField>
            </DialogContent>

            <DialogActions sx={{ pt: 2, pb: 3, px: 3, gap: 1 }}>
                <Button onClick={handleClose} disabled={moving} color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={handleMove}
                    variant="contained"
                    disabled={moving || !targetCategoryId || availableCategories.length === 0}
                    sx={{ boxShadow: "0 4px 14px -4px rgba(139, 92, 246, 0.5)" }}
                >
                    {moving ? "Moving..." : "Move Document"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}