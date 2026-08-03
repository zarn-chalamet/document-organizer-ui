import React, { useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Typography, Box, IconButton
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmberOutlined";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { toast } from "sonner";
import api from "../api/axios";

export default function BulkDeleteModal({ open, onClose, selectedDocIds, onDeleted }) {
    const [deleting, setDeleting] = useState(false);

    const handleClose = () => {
        if (deleting) return;
        onClose();
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await api.post("/documents/bulk-delete", {
                documentIds: selectedDocIds,
            });
            toast.success(`Deleted ${selectedDocIds.length} document${selectedDocIds.length !== 1 ? "s" : ""}`);
            onDeleted();
            handleClose();
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete documents");
        } finally {
            setDeleting(false);
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
                            background: "linear-gradient(135deg, rgba(239, 68, 68, 0.25), rgba(220, 38, 38, 0.15))",
                            border: "1px solid rgba(239, 68, 68, 0.35)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >
                        <WarningAmberIcon sx={{ color: "#EF4444", fontSize: 20 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.3 }}>
                            Delete {selectedDocIds.length} Document{selectedDocIds.length !== 1 ? "s" : ""}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            This action cannot be undone
                        </Typography>
                    </Box>
                    <IconButton size="small" onClick={handleClose} disabled={deleting}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ pt: "16px !important", pb: 2, px: 3 }}>
                <Typography variant="body2" sx={{ mb: 2.5 }}>
                    You're about to delete{" "}
                    <Box component="span" sx={{ fontWeight: 700 }}>
                        {selectedDocIds.length} document{selectedDocIds.length !== 1 ? "s" : ""}
                    </Box>
                    . This is permanent.
                </Typography>

                <Box
                    sx={{
                        bgcolor: "rgba(239, 68, 68, 0.08)",
                        border: "1px solid rgba(239, 68, 68, 0.2)",
                        borderRadius: 2,
                        p: 2,
                    }}
                >
                    <Typography
                        variant="caption"
                        sx={{
                            color: "#EF4444",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            display: "block",
                            mb: 1.25,
                            fontSize: "0.6875rem",
                        }}
                    >
                        ⚠ Permanently deleted:
                    </Typography>
                    <Box component="ul" sx={{
                        pl: 2.5, m: 0,
                        "& li": {
                            fontSize: "0.8125rem",
                            color: "text.secondary",
                            mb: 0.5,
                            "&:last-child": { mb: 0 },
                        },
                    }}>
                        <li>All {selectedDocIds.length} selected documents</li>
                        <li>Files removed from your Google Drive</li>
                        <li>All AI-indexed data and insights</li>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ pt: 2, pb: 3, px: 3, gap: 1 }}>
                <Button onClick={handleClose} disabled={deleting} color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={handleDelete}
                    variant="contained"
                    disabled={deleting}
                    startIcon={<DeleteForeverIcon />}
                    sx={{
                        background: "linear-gradient(135deg, #EF4444, #DC2626)",
                        boxShadow: "0 4px 14px -4px rgba(239, 68, 68, 0.5)",
                        "&:hover": {
                            background: "linear-gradient(135deg, #DC2626, #B91C1C)",
                        },
                    }}
                >
                    {deleting ? "Deleting..." : "Delete All"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}