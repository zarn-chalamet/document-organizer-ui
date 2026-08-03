import React, { useState, useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Box, Typography, IconButton, MenuItem, TextField, CircularProgress
} from "@mui/material";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMoveOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "sonner";
import api from "../api/axios";

export default function BulkMoveModal({ open, onClose, selectedDocIds, currentCategoryId, onMoved }) {
    const [categories, setCategories] = useState([]);
    const [targetId, setTargetId] = useState("");
    const [loading, setLoading] = useState(false);
    const [moving, setMoving] = useState(false);

    useEffect(() => {
        if (open) {
            loadCategories();
        }
    }, [open]);

    const loadCategories = async () => {
        setLoading(true);
        try {
            const res = await api.get("/categories");
            setCategories(res.data.filter(c => c.id !== currentCategoryId));
        } catch (err) {
            console.error(err);
            toast.error("Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (moving) return;
        setTargetId("");
        onClose();
    };

    const handleMove = async () => {
        if (!targetId) {
            toast.error("Please select a target category");
            return;
        }

        setMoving(true);
        try {
            await api.post("/documents/bulk-move", {
                documentIds: selectedDocIds,
                targetCategoryId: targetId,
            });
            toast.success(`Moved ${selectedDocIds.length} document${selectedDocIds.length !== 1 ? "s" : ""}`);
            onMoved(targetId);
            handleClose();
        } catch (err) {
            console.error(err);
            toast.error("Failed to move documents");
        } finally {
            setMoving(false);
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
                    <Box
                        sx={{
                            width: 40, height: 40, borderRadius: 2,
                            background: "linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(124, 58, 237, 0.15))",
                            border: "1px solid rgba(139, 92, 246, 0.35)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >
                        <DriveFileMoveIcon sx={{ color: "#A78BFA", fontSize: 20 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.3 }}>
                            Move Documents
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Moving {selectedDocIds.length} document{selectedDocIds.length !== 1 ? "s" : ""}
                        </Typography>
                    </Box>
                    <IconButton size="small" onClick={handleClose} disabled={moving}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ pt: "16px !important", pb: 2, px: 3 }}>
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                        <CircularProgress size={24} />
                    </Box>
                ) : categories.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 3 }}>
                        No other categories available. Create one first!
                    </Typography>
                ) : (
                    <TextField
                        select
                        label="Move to category"
                        fullWidth
                        value={targetId}
                        onChange={(e) => setTargetId(e.target.value)}
                    >
                        {categories.map((cat) => (
                            <MenuItem key={cat.id} value={cat.id}>
                                {cat.name}
                            </MenuItem>
                        ))}
                    </TextField>
                )}
            </DialogContent>

            <DialogActions sx={{ pt: 2, pb: 3, px: 3, gap: 1 }}>
                <Button onClick={handleClose} disabled={moving} color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={handleMove}
                    variant="contained"
                    disabled={moving || !targetId || categories.length === 0}
                    startIcon={moving ? <CircularProgress size={16} sx={{ color: "white" }} /> : <DriveFileMoveIcon />}
                    sx={{ boxShadow: "0 4px 14px -4px rgba(139, 92, 246, 0.5)" }}
                >
                    {moving ? "Moving..." : "Move Documents"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}