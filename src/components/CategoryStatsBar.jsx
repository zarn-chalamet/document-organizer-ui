import React from "react";
import { Box, Typography } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import ScheduleIcon from "@mui/icons-material/Schedule";

/**
 * CategoryStatsBar — inline stats showing category health at a glance.
 * Matches the Dashboard StatCard design language.
 */
export default function CategoryStatsBar({ documents = [] }) {
    // Calculate stats
    const total = documents.length;
    const today = new Date();
    
    const expiring = documents.filter(d => {
        if (!d.expiryDate) return false;
        const days = Math.ceil((new Date(d.expiryDate) - today) / (1000 * 60 * 60 * 24));
        return days >= 0 && days <= 30;
    }).length;

    const expired = documents.filter(d => {
        if (!d.expiryDate) return false;
        return new Date(d.expiryDate) < today;
    }).length;

    // Most recent scanned date
    const recentDates = documents
        .filter(d => d.scannedAt)
        .map(d => new Date(d.scannedAt));
    const mostRecent = recentDates.length > 0
        ? new Date(Math.max(...recentDates))
        : null;

    const formatTimeAgo = (date) => {
        if (!date) return "—";
        const seconds = Math.floor((today - date) / 1000);
        if (seconds < 60) return "just now";
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

    const stats = [
        {
            icon: <FolderIcon />,
            label: "Total",
            value: String(total).padStart(2, "0"),
            color: "#8B5CF6",
            hint: total === 1 ? "document" : "documents",
        },
        {
            icon: <WarningAmberIcon />,
            label: "Expiring",
            value: String(expiring).padStart(2, "0"),
            color: "#F59E0B",
            hint: "next 30 days",
        },
        {
            icon: <EventBusyIcon />,
            label: "Expired",
            value: String(expired).padStart(2, "0"),
            color: "#EF4444",
            hint: "needs action",
        },
        {
            icon: <ScheduleIcon />,
            label: "Last Scan",
            value: formatTimeAgo(mostRecent),
            color: "#3B82F6",
            hint: "recent activity",
            isText: true,
        },
    ];

    return (
        <Box
            sx={{
                display: "grid",
                gap: 2,
                mb: 3,
                gridTemplateColumns: {
                    xs: "repeat(2, 1fr)",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(4, 1fr)",
                },
            }}
        >
            {stats.map((stat, i) => (
                <Box
                    key={i}
                    sx={{
                        position: "relative",
                        overflow: "hidden",
                        p: 2,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        bgcolor: "background.paper",
                        transition: "all 0.2s ease",
                        "&:hover": {
                            borderColor: stat.color,
                            transform: "translateY(-1px)",
                            boxShadow: `0 4px 16px -4px ${stat.color}30`,
                        },
                    }}
                >
                    {/* Ambient glow */}
                    <Box
                        sx={{
                            position: "absolute",
                            top: -20,
                            right: -20,
                            width: 80,
                            height: 80,
                            borderRadius: "50%",
                            background: `radial-gradient(circle, ${stat.color}25 0%, transparent 70%)`,
                            filter: "blur(20px)",
                            pointerEvents: "none",
                        }}
                    />

                    <Box sx={{ position: "relative" }}>
                        {/* Icon + label */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <Box
                                sx={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: 1,
                                    bgcolor: `${stat.color}15`,
                                    border: `1px solid ${stat.color}30`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {React.cloneElement(stat.icon, {
                                    sx: { fontSize: 14, color: stat.color },
                                })}
                            </Box>
                            <Typography
                                sx={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: "0.625rem",
                                    fontWeight: 700,
                                    letterSpacing: "0.08em",
                                    color: "text.secondary",
                                    textTransform: "uppercase",
                                }}
                            >
                                {stat.label}
                            </Typography>
                        </Box>

                        {/* Value */}
                        <Typography
                            sx={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontWeight: 700,
                                fontSize: stat.isText ? "1.125rem" : "1.75rem",
                                lineHeight: 1,
                                letterSpacing: "-0.02em",
                                mb: 0.5,
                                color: "text.primary",
                            }}
                        >
                            {stat.value}
                        </Typography>

                        {/* Hint */}
                        <Typography
                            sx={{
                                fontSize: "0.6875rem",
                                color: "text.disabled",
                                lineHeight: 1.3,
                            }}
                        >
                            {stat.hint}
                        </Typography>
                    </Box>
                </Box>
            ))}
        </Box>
    );
}