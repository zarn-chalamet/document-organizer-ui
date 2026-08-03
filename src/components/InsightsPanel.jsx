import React, { useState } from "react";
import {
    Box, Typography, Chip, Divider, Button, IconButton, Tooltip, CircularProgress
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import BoltIcon from "@mui/icons-material/Bolt";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircleOutline";
import ScheduleIcon from "@mui/icons-material/Schedule";
import RefreshIcon from "@mui/icons-material/Refresh";
import EventIcon from "@mui/icons-material/Event";
import { toast } from "sonner";
import api from "../api/axios";

export default function InsightsPanel({ document, onRefresh }) {
    const [regenerating, setRegenerating] = useState(false);

    // Parse insights JSON
    let insights = null;
    try {
        if (document.aiInsights) {
            insights = typeof document.aiInsights === "string"
                ? JSON.parse(document.aiInsights)
                : document.aiInsights;
        }
    } catch (err) {
        console.error("Failed to parse insights:", err);
    }

    const handleRegenerate = async () => {
        setRegenerating(true);
        try {
            await api.post(`/documents/${document.id}/regenerate-insights`);
            toast.success("Insights regenerated ✨");
            if (onRefresh) onRefresh();
        } catch (err) {
            console.error(err);
            toast.error("Failed to regenerate insights");
        } finally {
            setRegenerating(false);
        }
    };

    // Loading state — insights not generated yet
    if (!insights && document.scanStatus === "PROCESSING") {
        return (
            <Box
                sx={{
                    p: 3,
                    borderRadius: 3,
                    border: "1px dashed",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    textAlign: "center",
                }}
            >
                <CircularProgress size={20} sx={{ color: "primary.main", mb: 1.5 }} />
                <Typography variant="body2" color="text.secondary">
                    AI is analyzing your document...
                </Typography>
            </Box>
        );
    }

    // Empty state
    if (!insights || !insights.summary) {
        return (
            <Box
                sx={{
                    p: 3,
                    borderRadius: 3,
                    border: "1px dashed",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    textAlign: "center",
                }}
            >
                <AutoAwesomeIcon sx={{ fontSize: 32, color: "text.disabled", mb: 1 }} />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    No AI insights available yet
                </Typography>
                {document.scanStatus === "DONE" && (
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<AutoAwesomeIcon />}
                        onClick={handleRegenerate}
                        disabled={regenerating}
                    >
                        {regenerating ? "Generating..." : "Generate Insights"}
                    </Button>
                )}
            </Box>
        );
    }

    // Urgency color mapping
    const urgencyColors = {
        urgent: { color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)", border: "rgba(239, 68, 68, 0.3)", label: "URGENT" },
        soon: { color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)", border: "rgba(245, 158, 11, 0.3)", label: "SOON" },
        upcoming: { color: "#3B82F6", bg: "rgba(59, 130, 246, 0.1)", border: "rgba(59, 130, 246, 0.3)", label: "UPCOMING" },
        none: { color: "#10B981", bg: "rgba(16, 185, 129, 0.1)", border: "rgba(16, 185, 129, 0.3)", label: "NO RUSH" },
    };

    const nextAction = insights.next_action;
    const urgency = nextAction?.urgency ? urgencyColors[nextAction.urgency] : null;

    const formatDate = (dateStr) => {
        if (!dateStr) return null;
        try {
            return new Date(dateStr).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
            });
        } catch {
            return dateStr;
        }
    };

    const daysUntil = (dateStr) => {
        if (!dateStr) return null;
        try {
            const days = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
            if (days < 0) return `${Math.abs(days)} days ago`;
            if (days === 0) return "today";
            if (days === 1) return "tomorrow";
            return `in ${days} days`;
        } catch {
            return null;
        }
    };

    return (
        <Box
            sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
                overflow: "hidden",
                position: "relative",
            }}
        >
            {/* Ambient glow */}
            <Box
                sx={{
                    position: "absolute",
                    top: -60,
                    right: -60,
                    width: 200,
                    height: 200,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
                    filter: "blur(50px)",
                    pointerEvents: "none",
                }}
            />

            {/* ============ HEADER ============ */}
            <Box
                sx={{
                    px: 3,
                    py: 2.25,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    background: "linear-gradient(90deg, rgba(139, 92, 246, 0.05) 0%, transparent 100%)",
                    position: "relative",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                        sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 2,
                            background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 12px -2px rgba(139, 92, 246, 0.5)",
                        }}
                    >
                        <AutoAwesomeIcon sx={{ color: "white", fontSize: 18 }} />
                    </Box>
                    <Box>
                        <Typography variant="subtitle2" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                            AI Insights
                        </Typography>
                        <Typography
                            sx={{
                                color: "text.secondary",
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: "0.625rem",
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                fontWeight: 600,
                            }}
                        >
                            Confidence · {insights.confidence?.toUpperCase() || "MEDIUM"}
                        </Typography>
                    </Box>
                </Box>

                <Tooltip title="Regenerate insights">
                    <IconButton
                        size="small"
                        onClick={handleRegenerate}
                        disabled={regenerating}
                        sx={{
                            "&:hover": { color: "primary.main" },
                        }}
                    >
                        {regenerating ? (
                            <CircularProgress size={16} />
                        ) : (
                            <RefreshIcon fontSize="small" />
                        )}
                    </IconButton>
                </Tooltip>
            </Box>

            {/* ============ SUMMARY ============ */}
            <Box sx={{ px: 3, py: 2.5, position: "relative" }}>
                <Typography
                    variant="body2"
                    sx={{
                        color: "text.primary",
                        lineHeight: 1.6,
                        fontSize: "0.9375rem",
                    }}
                >
                    {insights.summary}
                </Typography>
            </Box>

            <Divider />

            {/* ============ NEXT ACTION ============ */}
            {nextAction && nextAction.action && (
                <Box sx={{ px: 3, py: 2.5, position: "relative" }}>
                    <Typography
                        sx={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "0.6875rem",
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            color: "primary.main",
                            textTransform: "uppercase",
                            mb: 1.5,
                            display: "flex",
                            alignItems: "center",
                            gap: 0.75,
                        }}
                    >
                        <BoltIcon sx={{ fontSize: 14 }} />
                        Next Action
                    </Typography>

                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            border: "1px solid",
                            borderColor: urgency?.border || "divider",
                            bgcolor: urgency?.bg || "background.default",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 1 }}>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" fontWeight={700} sx={{ mb: 0.5 }}>
                                    {nextAction.action}
                                </Typography>
                                {nextAction.description && (
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: "text.secondary",
                                            fontSize: "0.75rem",
                                            lineHeight: 1.5,
                                            display: "block",
                                        }}
                                    >
                                        {nextAction.description}
                                    </Typography>
                                )}
                            </Box>
                            {urgency && (
                                <Chip
                                    label={urgency.label}
                                    size="small"
                                    sx={{
                                        bgcolor: urgency.bg,
                                        color: urgency.color,
                                        border: `1px solid ${urgency.border}`,
                                        fontWeight: 700,
                                        fontSize: "0.625rem",
                                        height: 20,
                                        fontFamily: "'JetBrains Mono', monospace",
                                        letterSpacing: "0.05em",
                                    }}
                                />
                            )}
                        </Box>

                        {nextAction.deadline && (
                            <Box
                                sx={{
                                    mt: 1.5,
                                    pt: 1.5,
                                    borderTop: "1px dashed",
                                    borderColor: urgency?.border || "divider",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                <ScheduleIcon sx={{ fontSize: 14, color: urgency?.color || "text.secondary" }} />
                                <Typography
                                    sx={{
                                        fontSize: "0.75rem",
                                        fontFamily: "'JetBrains Mono', monospace",
                                        color: urgency?.color || "text.secondary",
                                        fontWeight: 600,
                                    }}
                                >
                                    {formatDate(nextAction.deadline)}
                                    {daysUntil(nextAction.deadline) && ` · ${daysUntil(nextAction.deadline)}`}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            )}

            {/* ============ KEY RULES ============ */}
            {insights.key_rules && insights.key_rules.length > 0 && (
                <>
                    <Divider />
                    <Box sx={{ px: 3, py: 2.5 }}>
                        <Typography
                            sx={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: "0.6875rem",
                                fontWeight: 700,
                                letterSpacing: "0.1em",
                                color: "text.secondary",
                                textTransform: "uppercase",
                                mb: 1.5,
                                display: "flex",
                                alignItems: "center",
                                gap: 0.75,
                            }}
                        >
                            <CheckCircleIcon sx={{ fontSize: 14 }} />
                            Key Rules
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                            {insights.key_rules.map((rule, i) => (
                                <Box
                                    key={i}
                                    sx={{
                                        display: "flex",
                                        gap: 1.25,
                                        alignItems: "flex-start",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 4,
                                            height: 4,
                                            borderRadius: "50%",
                                            bgcolor: "primary.main",
                                            mt: 0.85,
                                            flexShrink: 0,
                                        }}
                                    />
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontSize: "0.8125rem",
                                            lineHeight: 1.55,
                                            color: "text.secondary",
                                        }}
                                    >
                                        {rule}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </>
            )}

            {/* ============ WARNINGS ============ */}
            {insights.warnings && insights.warnings.length > 0 && (
                <>
                    <Divider />
                    <Box sx={{ px: 3, py: 2.5 }}>
                        <Typography
                            sx={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: "0.6875rem",
                                fontWeight: 700,
                                letterSpacing: "0.1em",
                                color: "#F59E0B",
                                textTransform: "uppercase",
                                mb: 1.5,
                                display: "flex",
                                alignItems: "center",
                                gap: 0.75,
                            }}
                        >
                            <WarningAmberIcon sx={{ fontSize: 14 }} />
                            Warnings
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            {insights.warnings.map((warning, i) => (
                                <Box
                                    key={i}
                                    sx={{
                                        p: 1.5,
                                        borderRadius: 1.5,
                                        bgcolor: "rgba(245, 158, 11, 0.08)",
                                        border: "1px solid rgba(245, 158, 11, 0.2)",
                                        display: "flex",
                                        gap: 1,
                                        alignItems: "flex-start",
                                    }}
                                >
                                    <WarningAmberIcon sx={{ fontSize: 14, color: "#F59E0B", mt: 0.25, flexShrink: 0 }} />
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontSize: "0.8125rem",
                                            lineHeight: 1.5,
                                            color: "text.secondary",
                                        }}
                                    >
                                        {warning}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </>
            )}

            {/* ============ TIMELINE ============ */}
            {insights.timeline && insights.timeline.length > 0 && (
                <>
                    <Divider />
                    <Box sx={{ px: 3, py: 2.5 }}>
                        <Typography
                            sx={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: "0.6875rem",
                                fontWeight: 700,
                                letterSpacing: "0.1em",
                                color: "text.secondary",
                                textTransform: "uppercase",
                                mb: 2,
                                display: "flex",
                                alignItems: "center",
                                gap: 0.75,
                            }}
                        >
                            <EventIcon sx={{ fontSize: 14 }} />
                            Timeline
                        </Typography>
                        <Box sx={{ position: "relative" }}>
                            {/* Vertical line */}
                            <Box
                                sx={{
                                    position: "absolute",
                                    left: 7,
                                    top: 6,
                                    bottom: 6,
                                    width: 2,
                                    background: "linear-gradient(180deg, #8B5CF6 0%, rgba(139, 92, 246, 0.2) 100%)",
                                    borderRadius: 2,
                                }}
                            />
                            {insights.timeline.map((event, i) => (
                                <Box
                                    key={i}
                                    sx={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: 2,
                                        mb: i < insights.timeline.length - 1 ? 2 : 0,
                                        position: "relative",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 16,
                                            height: 16,
                                            borderRadius: "50%",
                                            background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
                                            border: "2px solid",
                                            borderColor: "background.paper",
                                            flexShrink: 0,
                                            zIndex: 1,
                                            mt: 0.5,
                                            boxShadow: "0 0 8px rgba(139, 92, 246, 0.4)",
                                        }}
                                    />
                                    <Box sx={{ flex: 1, pt: 0.25 }}>
                                        <Typography
                                            variant="body2"
                                            fontWeight={600}
                                            sx={{ fontSize: "0.8125rem", mb: 0.25 }}
                                        >
                                            {event.event}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: "0.6875rem",
                                                fontFamily: "'JetBrains Mono', monospace",
                                                color: "text.secondary",
                                                letterSpacing: "0.02em",
                                            }}
                                        >
                                            {formatDate(event.date)}
                                            {daysUntil(event.date) && ` · ${daysUntil(event.date)}`}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </>
            )}

            {/* ============ DISCLAIMER ============ */}
            <Box
                sx={{
                    px: 3,
                    py: 1.5,
                    borderTop: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.default",
                }}
            >
                <Typography
                    variant="caption"
                    sx={{
                        color: "text.disabled",
                        fontSize: "0.6875rem",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        justifyContent: "center",
                    }}
                >
                    ℹ️ AI-generated · Always verify with official sources
                </Typography>
            </Box>
        </Box>
    );
}