import React from "react";
import { Box, Typography, Chip, Checkbox, IconButton, Tooltip } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import StatusBadge from "./StatusBadge";

const getExpiryChip = (expiryDate) => {
    if (!expiryDate) return null;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const days = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    let color, text;
    if (days < 0) { color = "#EF4444"; text = "Expired"; }
    else if (days <= 30) { color = "#F59E0B"; text = `${days}d left`; }
    else { color = "#10B981"; text = "Valid"; }

    return (
        <Chip
            label={text}
            size="small"
            sx={{
                bgcolor: `${color}20`,
                color,
                border: `1px solid ${color}40`,
                fontWeight: 600,
                fontSize: "0.6875rem",
                height: 22,
                fontFamily: "'JetBrains Mono', monospace",
                "& .MuiChip-label": { px: 1 },
            }}
        />
    );
};

/**
 * DocumentListRow — compact row layout for list view.
 * Alternative to DocumentCard for information-dense browsing.
 */
export default function DocumentListRow({ doc, isSelected, onToggleSelect, onOpen }) {
    return (
        <Box
            sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 2,
                px: 2,
                py: 1.75,
                borderRadius: 2,
                border: "1px solid",
                borderColor: isSelected ? "primary.main" : "divider",
                bgcolor: isSelected ? "rgba(139, 92, 246, 0.05)" : "background.paper",
                cursor: "pointer",
                transition: "all 0.15s ease",
                boxShadow: isSelected
                    ? "0 4px 16px -4px rgba(139, 92, 246, 0.35)"
                    : "none",
                "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: "rgba(139, 92, 246, 0.03)",
                    "& .list-checkbox": { opacity: 1 },
                    "& .list-chevron": { transform: "translateX(2px)", color: "primary.main" },
                },
                ...(isSelected && {
                    "& .list-checkbox": { opacity: 1 },
                }),
            }}
            onClick={onOpen}
        >
            {/* Checkbox */}
            <Checkbox
                className="list-checkbox"
                checked={isSelected}
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleSelect(doc.id, e);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                size="small"
                sx={{
                    p: 0.5,
                    opacity: isSelected ? 1 : 0,
                    transition: "opacity 0.15s ease",
                    color: "text.disabled",
                    "&.Mui-checked": { color: "primary.main" },
                    flexShrink: 0,
                }}
            />

            {/* Icon */}
            <Box
                sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    background: "linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(37, 99, 235, 0.15))",
                    border: "1px solid rgba(59, 130, 246, 0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}
            >
                <DescriptionIcon sx={{ color: "#60A5FA", fontSize: 20 }} />
            </Box>

            {/* Title + description */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.25 }}>
                    <Typography
                        variant="body2"
                        fontWeight={700}
                        noWrap
                        sx={{ fontSize: "0.9375rem" }}
                    >
                        {doc.title}
                    </Typography>
                    {doc.userVerifiedExpiry && (
                        <Tooltip title="Verified by you">
                            <CheckCircleOutlineIcon
                                sx={{ fontSize: 14, color: "#10B981", flexShrink: 0 }}
                            />
                        </Tooltip>
                    )}
                </Box>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    noWrap
                    sx={{ fontSize: "0.75rem", display: "block" }}
                >
                    {doc.description || "No description"}
                </Typography>
            </Box>

            {/* Expiry date (hidden on very small screens) */}
            {doc.expiryDate && (
                <Box
                    sx={{
                        display: { xs: "none", md: "flex" },
                        alignItems: "center",
                        gap: 0.75,
                        flexShrink: 0,
                    }}
                >
                    <CalendarTodayIcon sx={{ fontSize: 13, color: "text.disabled" }} />
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "0.75rem",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {new Date(doc.expiryDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </Typography>
                </Box>
            )}

            {/* Expiry chip */}
            <Box sx={{ flexShrink: 0, display: { xs: "none", sm: "block" } }}>
                {getExpiryChip(doc.expiryDate)}
            </Box>

            {/* Scan status */}
            <Box sx={{ flexShrink: 0, display: { xs: "none", lg: "block" } }}>
                {doc.scanStatus && <StatusBadge status={doc.scanStatus} />}
            </Box>

            {/* Chevron */}
            <ChevronRightIcon
                className="list-chevron"
                sx={{
                    fontSize: 18,
                    color: "text.disabled",
                    flexShrink: 0,
                    transition: "all 0.15s ease",
                }}
            />
        </Box>
    );
}