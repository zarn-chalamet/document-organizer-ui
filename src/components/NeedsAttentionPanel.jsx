import React from "react";
import { Box, Typography, Card, CardContent, Chip } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";

/**
 * Convert backend daysUntilExpiry to a display urgency object.
 */
const getUrgency = (daysUntilExpiry) => {
    if (daysUntilExpiry < 0) return { level: "expired", color: "#EF4444" };
    if (daysUntilExpiry <= 7) return { level: "urgent", color: "#EF4444" };
    if (daysUntilExpiry <= 30) return { level: "soon", color: "#F59E0B" };
    return { level: "upcoming", color: "#3B82F6" };
};

const formatUrgencyText = (days) => {
    if (days < 0) {
        const abs = Math.abs(days);
        if (abs === 0) return "Expired today";
        return `Expired ${abs} day${abs > 1 ? "s" : ""} ago`;
    }
    if (days === 0) return "Expires today";
    if (days === 1) return "Expires tomorrow";
    return `Expires in ${days} days`;
};

const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

/**
 * NeedsAttentionPanel — shows documents needing action.
 *
 * @param {Array} priorityDocs - list from /dashboard/priority-documents
 * @param {number} totalDocuments - total doc count (from summary) for empty-state messaging
 */
export default function NeedsAttentionPanel({ priorityDocs = [], totalDocuments = 0 }) {
    const navigate = useNavigate();

    // Show top 4 to keep the panel compact
    const displayDocs = priorityDocs.slice(0, 4);

    // ============ EMPTY STATE: ALL CAUGHT UP ============
    if (displayDocs.length === 0) {
        return (
            <Card
                sx={{
                    position: "relative",
                    overflow: "hidden",
                    background: (theme) =>
                        theme.palette.mode === "dark"
                            ? "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, transparent 60%)"
                            : "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, transparent 60%)",
                    border: "1px solid",
                    borderColor: (theme) =>
                        theme.palette.mode === "dark"
                            ? "rgba(16, 185, 129, 0.2)"
                            : "rgba(16, 185, 129, 0.3)",
                }}
            >
                <CardContent
                    sx={{
                        p: { xs: 3, sm: 3.5 },
                        display: "flex",
                        alignItems: "center",
                        gap: { xs: 2, sm: 3 },
                        flexDirection: { xs: "column", sm: "row" },
                        textAlign: { xs: "center", sm: "left" },
                        "&:last-child": { pb: { xs: 3, sm: 3.5 } },
                    }}
                >
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            bgcolor: "rgba(16, 185, 129, 0.15)",
                            border: "1px solid rgba(16, 185, 129, 0.3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >
                        <CheckCircleOutlineIcon sx={{ color: "#10B981", fontSize: 26 }} />
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.25 }}>
                            You're all caught up
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {totalDocuments === 0
                                ? "Upload documents to start tracking expiry dates."
                                : "Nothing expires in the next 90 days."}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        );
    }

    // ============ ACTIVE STATE: SHOW PRIORITIES ============
    return (
        <Card
            sx={{
                position: "relative",
                overflow: "hidden",
                background: (theme) =>
                    theme.palette.mode === "dark"
                        ? "linear-gradient(135deg, rgba(245, 158, 11, 0.06) 0%, transparent 60%)"
                        : "linear-gradient(135deg, rgba(245, 158, 11, 0.04) 0%, transparent 60%)",
            }}
        >
            <CardContent sx={{ p: { xs: 2, sm: 3 }, "&:last-child": { pb: { xs: 2, sm: 3 } } }}>
                {/* Panel header */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
                    <Box
                        sx={{
                            width: 32,
                            height: 32,
                            borderRadius: 1.5,
                            bgcolor: "rgba(245, 158, 11, 0.15)",
                            border: "1px solid rgba(245, 158, 11, 0.3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >
                        <WarningAmberIcon sx={{ color: "#F59E0B", fontSize: 18 }} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            sx={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: "0.6875rem",
                                fontWeight: 600,
                                letterSpacing: "0.1em",
                                color: "#F59E0B",
                                textTransform: "uppercase",
                            }}
                        >
                            Needs Attention
                        </Typography>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                            {priorityDocs.length}{" "}
                            {priorityDocs.length === 1 ? "document" : "documents"} require action
                        </Typography>
                    </Box>
                </Box>

                {/* Document list */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {displayDocs.map((doc) => {
                        const urgency = getUrgency(doc.daysUntilExpiry);
                        return (
                            <Box
                                key={doc.id}
                                onClick={() => navigate(`/documents/${doc.id}`)}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                    p: 1.5,
                                    borderRadius: 2,
                                    border: "1px solid",
                                    borderColor: "divider",
                                    bgcolor: "background.default",
                                    cursor: "pointer",
                                    transition: "all 0.15s ease",
                                    "&:hover": {
                                        borderColor: urgency.color,
                                        bgcolor: (theme) =>
                                            theme.palette.mode === "dark"
                                                ? "rgba(255, 255, 255, 0.02)"
                                                : "rgba(0, 0, 0, 0.02)",
                                        "& .arrow-icon": {
                                            transform: "translateX(2px)",
                                            color: urgency.color,
                                        },
                                    },
                                }}
                            >
                                {/* Urgency dot */}
                                <Box
                                    sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: "50%",
                                        bgcolor: urgency.color,
                                        flexShrink: 0,
                                        boxShadow: `0 0 8px ${urgency.color}80`,
                                    }}
                                />

                                {/* Doc info */}
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                            mb: 0.25,
                                            flexWrap: { xs: "wrap", sm: "nowrap" },
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            fontWeight={600}
                                            noWrap
                                            sx={{ minWidth: 0 }}
                                        >
                                            {doc.title}
                                        </Typography>
                                        <Chip
                                            label={formatUrgencyText(doc.daysUntilExpiry)}
                                            size="small"
                                            sx={{
                                                height: 20,
                                                fontSize: "0.6875rem",
                                                fontWeight: 600,
                                                fontFamily: "'JetBrains Mono', monospace",
                                                bgcolor: `${urgency.color}20`,
                                                color: urgency.color,
                                                border: `1px solid ${urgency.color}40`,
                                                flexShrink: 0,
                                                "& .MuiChip-label": { px: 0.75 },
                                            }}
                                        />
                                    </Box>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: "text.secondary",
                                            fontSize: "0.75rem",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 0.75,
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        <span>{doc.categoryName}</span>
                                        <span style={{ opacity: 0.4 }}>·</span>
                                        <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                            {formatDate(doc.expiryDate)}
                                        </span>
                                    </Typography>
                                </Box>

                                <ArrowForwardIcon
                                    className="arrow-icon"
                                    sx={{
                                        fontSize: 16,
                                        color: "text.disabled",
                                        transition: "all 0.15s ease",
                                        flexShrink: 0,
                                    }}
                                />
                            </Box>
                        );
                    })}
                </Box>
            </CardContent>
        </Card>
    );
}