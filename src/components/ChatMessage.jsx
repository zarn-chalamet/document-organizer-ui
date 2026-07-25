import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";

export default function ChatMessage({ message }) {
    const isUser = message.role === "user";

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: isUser ? "flex-end" : "flex-start",
                alignItems: "flex-start",
                gap: 1.5,
                mb: 2.5,
            }}
        >
            {!isUser && (
                <Box
                    sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        boxShadow: "0 0 15px rgba(139, 92, 246, 0.3)",
                    }}
                >
                    <SmartToyIcon sx={{ fontSize: 16, color: "white" }} />
                </Box>
            )}

            <Paper
                elevation={0}
                sx={{
                    px: 2,
                    py: 1.5,
                    maxWidth: "75%",
                    background: isUser
                        ? "linear-gradient(135deg, #8B5CF6, #7C3AED)"
                        : "background.paper",
                    color: isUser ? "white" : "text.primary",
                    borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    border: isUser ? "none" : "1px solid",
                    borderColor: isUser ? "transparent" : "divider",
                    boxShadow: isUser ? "0 0 20px rgba(139, 92, 246, 0.2)" : "none",
                }}
            >
                <Typography
                    variant="body2"
                    sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}
                >
                    {message.content}
                </Typography>
            </Paper>

            {isUser && (
                <Box
                    sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        bgcolor: "background.paper",
                        border: "1px solid",
                        borderColor: "divider",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    <PersonIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                </Box>
            )}
        </Box>
    );
}