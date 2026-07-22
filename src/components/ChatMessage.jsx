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
                gap: 1,
                mb: 2,
            }}
        >
            {/* AI icon on left */}
            {!isUser && (
                <Box
                    sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        mt: 0.5,
                    }}
                >
                    <SmartToyIcon sx={{ fontSize: 18, color: "white" }} />
                </Box>
            )}

            {/* Message bubble */}
            <Paper
                elevation={0}
                sx={{
                    px: 2,
                    py: 1.5,
                    maxWidth: "75%",
                    bgcolor: isUser ? "primary.main" : "grey.100",
                    color: isUser ? "white" : "text.primary",
                    borderRadius: isUser
                        ? "18px 18px 4px 18px"
                        : "18px 18px 18px 4px",
                }}
            >
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                    {message.content}
                </Typography>
            </Paper>

            {/* User icon on right */}
            {isUser && (
                <Box
                    sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        bgcolor: "grey.400",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        mt: 0.5,
                    }}
                >
                    <PersonIcon sx={{ fontSize: 18, color: "white" }} />
                </Box>
            )}
        </Box>
    );
}