import React from "react";
import { Chip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/HourglassEmpty";
import ErrorIcon from "@mui/icons-material/ErrorOutline";
import AutorenewIcon from "@mui/icons-material/Autorenew";

const CONFIG = {
    DONE: { label: "Scanned", icon: <CheckCircleIcon sx={{ fontSize: 12 }} />, color: "#10B981" },
    PROCESSING: { label: "Scanning", icon: <AutorenewIcon sx={{ fontSize: 12 }} />, color: "#3B82F6", spinning: true },
    PENDING: { label: "Pending", icon: <PendingIcon sx={{ fontSize: 12 }} />, color: "#F59E0B" },
    FAILED: { label: "Failed", icon: <ErrorIcon sx={{ fontSize: 12 }} />, color: "#EF4444" },
};

export default function StatusBadge({ status }) {
    const config = CONFIG[status] || CONFIG.PENDING;

    return (
        <Chip
            icon={config.icon}
            label={config.label}
            size="small"
            sx={{
                bgcolor: `${config.color}20`,
                color: config.color,
                border: `1px solid ${config.color}40`,
                fontWeight: 600,
                fontSize: "0.6875rem",
                height: 22,
                fontFamily: "'JetBrains Mono', monospace",
                "& .MuiChip-icon": {
                    color: config.color,
                    ml: 0.75,
                    ...(config.spinning && {
                        animation: "spin 2s linear infinite",
                    }),
                },
                "& .MuiChip-label": { px: 1 },
                "@keyframes spin": {
                    "0%": { transform: "rotate(0deg)" },
                    "100%": { transform: "rotate(360deg)" },
                },
            }}
        />
    );
}