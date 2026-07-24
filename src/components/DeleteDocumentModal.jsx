import React from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Typography, Box, IconButton
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmberOutlined";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export default function DeleteDocumentModal({ open, onClose, document, onConfirm, deleting }) {
    if (!document) return null;

    const handleClose = () => {
        if (deleting) return;
        onClose();
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
                        background: "linear-gradient(135deg, rgba(239, 68, 68, 0.25), rgba(220, 38, 38, 0.15))",
                        border: "1px solid rgba(239, 68, 68, 0.35)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                    }}>
                        <WarningAmberIcon sx={{ color: "#EF4444", fontSize: 20 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.3 }}>
                            Delete Document
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
                    Are you sure you want to delete{" "}
                    <Box component="span" sx={{ fontWeight: 700 }}>"{document.title}"</Box>?
                </Typography>

                <Box sx={{
                    bgcolor: "rgba(239, 68, 68, 0.08)",
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                    borderRadius: 2,
                    p: 2,
                }}>
                    <Typography sx={{
                        color: "#EF4444",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        display: "block",
                        mb: 1.25,
                        fontSize: "0.6875rem",
                    }}>
                        ⚠ Permanently deleted:
                    </Typography>
                    <Box component="ul" sx={{
                        pl: 2.5, m: 0,
                        "& li": { fontSize: "0.8125rem", color: "text.secondary", mb: 0.5, "&:last-child": { mb: 0 } },
                    }}>
                        <li>This document</li>
                        <li>The file from your Google Drive</li>
                        <li>All AI-indexed search data</li>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ pt: 2, pb: 3, px: 3, gap: 1 }}>
                <Button onClick={handleClose} disabled={deleting} color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    disabled={deleting}
                    startIcon={<DeleteForeverIcon />}
                    sx={{
                        background: "linear-gradient(135deg, #EF4444, #DC2626)",
                        boxShadow: "0 4px 14px -4px rgba(239, 68, 68, 0.5)",
                        "&:hover": {
                            background: "linear-gradient(135deg, #DC2626, #B91C1C)",
                            boxShadow: "0 6px 20px -4px rgba(239, 68, 68, 0.6)",
                        },
                    }}
                >
                    {deleting ? "Deleting..." : "Delete Permanently"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}