import React, { useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Typography, Box, IconButton, TextField
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmberOutlined";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { toast } from "sonner";
import api from "../api/axios";

const CONFIRM_TEXT = "DELETE";

export default function DeleteAccountModal({ open, onClose }) {
    const [confirmText, setConfirmText] = useState("");
    const [deleting, setDeleting] = useState(false);

    const canDelete = confirmText === CONFIRM_TEXT;

    const handleClose = () => {
        if (deleting) return;
        setConfirmText("");
        onClose();
    };

    const handleDelete = async () => {
        if (!canDelete) return;
        setDeleting(true);
        try {
            await api.delete("/users/me");
            
            // Clear session
            localStorage.removeItem("accessToken");
            localStorage.removeItem("email");
            
            toast.success("Account deleted successfully");
            
            // Small delay for toast visibility, then redirect
            setTimeout(() => {
                window.location.href = "/login";
            }, 1000);
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete account. Please try again.");
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
                            Delete Your Account
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            This action is permanent and cannot be undone
                        </Typography>
                    </Box>
                    <IconButton size="small" onClick={handleClose} disabled={deleting}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ pt: "16px !important", pb: 2, px: 3 }}>
                <Typography variant="body2" sx={{ mb: 2.5 }}>
                    You're about to permanently delete your Organizer account.
                    Please read carefully what will happen next.
                </Typography>

                {/* WARNING BOX: What gets deleted */}
                <Box
                    sx={{
                        bgcolor: "rgba(239, 68, 68, 0.08)",
                        border: "1px solid rgba(239, 68, 68, 0.2)",
                        borderRadius: 2,
                        p: 2,
                        mb: 2,
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
                    <Box
                        component="ul"
                        sx={{
                            pl: 2.5,
                            m: 0,
                            "& li": {
                                fontSize: "0.8125rem",
                                color: "text.secondary",
                                mb: 0.5,
                                "&:last-child": { mb: 0 },
                            },
                        }}
                    >
                        <li>All your categories and organization</li>
                        <li>All document metadata and AI insights</li>
                        <li>
                            <Box component="span" sx={{ fontWeight: 700, color: "#EF4444" }}>
                                All files in your "Digital Document Organizer" Google Drive folder
                            </Box>
                        </li>
                        <li>All AI-indexed search data and embeddings</li>
                    </Box>
                </Box>

                {/* INFO BOX: What stays */}
                <Box
                    sx={{
                        bgcolor: "rgba(59, 130, 246, 0.08)",
                        border: "1px solid rgba(59, 130, 246, 0.2)",
                        borderRadius: 2,
                        p: 2,
                        mb: 2.5,
                    }}
                >
                    <Typography
                        variant="caption"
                        sx={{
                            color: "#3B82F6",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            display: "block",
                            mb: 1,
                            fontSize: "0.6875rem",
                        }}
                    >
                        ℹ Not affected:
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: "0.8125rem", color: "text.secondary" }}>
                        Your Google account itself remains untouched. You can revoke Organizer's
                        Drive access anytime from your{" "}
                        <Box
                            component="a"
                            href="https://myaccount.google.com/permissions"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                color: "primary.main",
                                textDecoration: "none",
                                fontWeight: 500,
                                "&:hover": { textDecoration: "underline" },
                            }}
                        >
                            Google Account settings
                        </Box>
                        .
                    </Typography>
                </Box>

                {/* TYPE TO CONFIRM */}
                <Typography
                    variant="caption"
                    sx={{
                        display: "block",
                        color: "text.secondary",
                        mb: 1,
                        fontSize: "0.8125rem",
                    }}
                >
                    Type{" "}
                    <Box
                        component="span"
                        sx={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontWeight: 700,
                            color: "#EF4444",
                            bgcolor: "rgba(239, 68, 68, 0.1)",
                            px: 0.75,
                            py: 0.25,
                            borderRadius: 0.75,
                            fontSize: "0.8125rem",
                        }}
                    >
                        {CONFIRM_TEXT}
                    </Box>{" "}
                    to confirm:
                </Typography>
                <TextField
                    fullWidth
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder={`Type ${CONFIRM_TEXT} here`}
                    disabled={deleting}
                    autoFocus
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            fontFamily: "'JetBrains Mono', monospace",
                        },
                    }}
                />
            </DialogContent>

            <DialogActions sx={{ pt: 2, pb: 3, px: 3, gap: 1 }}>
                <Button onClick={handleClose} disabled={deleting} color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={handleDelete}
                    variant="contained"
                    disabled={!canDelete || deleting}
                    startIcon={<DeleteForeverIcon />}
                    sx={{
                        background: canDelete
                            ? "linear-gradient(135deg, #EF4444, #DC2626)"
                            : undefined,
                        boxShadow: canDelete
                            ? "0 4px 14px -4px rgba(239, 68, 68, 0.5)"
                            : undefined,
                        "&:hover": canDelete
                            ? {
                                background: "linear-gradient(135deg, #DC2626, #B91C1C)",
                                boxShadow: "0 6px 20px -4px rgba(239, 68, 68, 0.6)",
                            }
                            : {},
                    }}
                >
                    {deleting ? "Deleting..." : "Delete Account"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}