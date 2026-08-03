import React from "react";
import { Box, Typography, Button, IconButton, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/FileDownloadOutlined";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMoveOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

/**
 * BulkActionsBar — appears when documents are selected.
 * Slides down from the top of the document grid.
 */
export default function BulkActionsBar({
    selectedCount,
    totalCount,
    onDownloadZip,
    onMove,
    onDelete,
    onSelectAll,
    onClear,
    processing = false,
}) {
    if (selectedCount === 0) return null;

    const allSelected = selectedCount === totalCount;

    return (
        <Box
            sx={{
                mb: 2,
                p: 1.5,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "rgba(139, 92, 246, 0.4)",
                background: "linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(236, 72, 153, 0.06) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                flexWrap: "wrap",
                position: "relative",
                overflow: "hidden",
                animation: "slideDown 0.25s ease",
                "@keyframes slideDown": {
                    "0%": { opacity: 0, transform: "translateY(-8px)" },
                    "100%": { opacity: 1, transform: "translateY(0)" },
                },
            }}
        >
            {/* Ambient glow */}
            <Box
                sx={{
                    position: "absolute",
                    top: -30,
                    left: -30,
                    width: 150,
                    height: 150,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)",
                    filter: "blur(30px)",
                    pointerEvents: "none",
                }}
            />

            {/* Left: selection info */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, position: "relative" }}>
                <Box
                    sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 1.5,
                        background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 8px -2px rgba(139, 92, 246, 0.5)",
                    }}
                >
                    <CheckCircleIcon sx={{ color: "white", fontSize: 16 }} />
                </Box>
                <Box>
                    <Typography
                        variant="body2"
                        fontWeight={700}
                        sx={{ fontSize: "0.875rem", lineHeight: 1.2 }}
                    >
                        {selectedCount} selected
                    </Typography>
                    <Typography
                        onClick={onSelectAll}
                        sx={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "0.625rem",
                            fontWeight: 600,
                            letterSpacing: "0.05em",
                            color: "primary.main",
                            textTransform: "uppercase",
                            cursor: "pointer",
                            "&:hover": { textDecoration: "underline" },
                        }}
                    >
                        {allSelected ? "Deselect all" : `Select all ${totalCount}`}
                    </Typography>
                </Box>
            </Box>

            {/* Right: action buttons */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, position: "relative" }}>
                <Button
                    variant="contained"
                    size="small"
                    startIcon={<DownloadIcon sx={{ fontSize: 16 }} />}
                    onClick={onDownloadZip}
                    disabled={processing}
                    sx={{
                        background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                        boxShadow: "0 2px 8px -2px rgba(139, 92, 246, 0.5)",
                        fontSize: "0.8125rem",
                        px: 2,
                        "&:hover": {
                            background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
                        },
                    }}
                >
                    Download ZIP
                </Button>

                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<DriveFileMoveIcon sx={{ fontSize: 16 }} />}
                    onClick={onMove}
                    disabled={processing}
                    sx={{
                        fontSize: "0.8125rem",
                        px: 2,
                        display: { xs: "none", sm: "inline-flex" },
                    }}
                >
                    Move
                </Button>

                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<DeleteOutlineIcon sx={{ fontSize: 16 }} />}
                    onClick={onDelete}
                    disabled={processing}
                    sx={{
                        fontSize: "0.8125rem",
                        px: 2,
                        borderColor: "rgba(239, 68, 68, 0.35)",
                        color: "#EF4444",
                        "&:hover": {
                            borderColor: "#EF4444",
                            bgcolor: "rgba(239, 68, 68, 0.08)",
                        },
                    }}
                >
                    Delete
                </Button>

                <Tooltip title="Clear selection">
                    <IconButton
                        onClick={onClear}
                        size="small"
                        sx={{
                            width: 32,
                            height: 32,
                            "&:hover": { color: "text.primary" },
                        }}
                    >
                        <CloseIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
}