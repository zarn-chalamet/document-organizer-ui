import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import UploadIcon from "@mui/icons-material/CloudUploadOutlined";
import FolderIcon from "@mui/icons-material/CreateNewFolderOutlined";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import EditIcon from "@mui/icons-material/EditOutlined";
import InboxIcon from "@mui/icons-material/InboxOutlined";
import { formatDistanceToNow } from "date-fns";

const ICONS = {
    upload: <UploadIcon sx={{ fontSize: 16 }} />,
    category: <FolderIcon sx={{ fontSize: 16 }} />,
    ai: <AutoAwesomeIcon sx={{ fontSize: 16 }} />,
    edit: <EditIcon sx={{ fontSize: 16 }} />,
};

const COLORS = {
    upload: "#3B82F6",
    category: "#8B5CF6",
    ai: "#EC4899",
    edit: "#10B981",
};

export default function ActivityFeed({ activities }) {
    if (!activities || activities.length === 0) {
        return (
            <Card>
                <CardContent sx={{
                    p: 4,
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1.5,
                }}>
                    <Box sx={{
                        width: 44, height: 44, borderRadius: "50%",
                        bgcolor: "action.hover",
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <InboxIcon sx={{ fontSize: 22, color: "text.disabled" }} />
                    </Box>
                    <Box>
                        <Typography variant="body2" fontWeight={500}>No activity yet</Typography>
                        <Typography variant="caption" color="text.secondary">
                            Your recent actions will appear here
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                {activities.map((activity, i) => (
                    <Box
                        key={i}
                        sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 1.5,
                            px: 2, py: 1.75,
                            borderBottom: i < activities.length - 1 ? "1px solid" : "none",
                            borderColor: "divider",
                            transition: "background-color 0.15s",
                            "&:hover": { bgcolor: "action.hover" },
                        }}
                    >
                        <Box
                            sx={{
                                width: 32, height: 32, borderRadius: 1.5,
                                bgcolor: `${COLORS[activity.type]}18`,
                                border: `1px solid ${COLORS[activity.type]}30`,
                                color: COLORS[activity.type],
                                display: "flex", alignItems: "center", justifyContent: "center",
                                flexShrink: 0,
                                mt: 0.25,
                            }}
                        >
                            {ICONS[activity.type]}
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                                variant="body2"
                                fontWeight={500}
                                sx={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    lineHeight: 1.4,
                                    mb: 0.25,
                                }}
                            >
                                {activity.text}
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: "text.secondary",
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: "0.6875rem",
                                }}
                            >
                                {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </CardContent>
        </Card>
    );
}