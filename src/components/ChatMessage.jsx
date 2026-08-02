import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

// ============ PARSE AI RESPONSE CATEGORY ============
function parseAiResponse(text) {
    if (!text) return { category: "DOC", cleanText: "" };

    if (text.startsWith("[DOC]")) {
        return { category: "DOC", cleanText: text.replace("[DOC]", "").trim() };
    }
    if (text.startsWith("[NOTFOUND]")) {
        return { category: "NOTFOUND", cleanText: text.replace("[NOTFOUND]", "").trim() };
    }
    if (text.startsWith("[GENERAL]")) {
        return { category: "GENERAL", cleanText: text.replace("[GENERAL]", "").trim() };
    }
    // Fallback if no tag (backwards compatible)
    return { category: "DOC", cleanText: text };
}

// ============ RESPONSE BADGE ============
function ResponseBadge({ category }) {
    if (category === "DOC") return null; // No badge for document answers

    const config = {
        NOTFOUND: {
            label: "Not in your documents",
            icon: SearchOffIcon,
            color: "#F59E0B",
            bgColor: "rgba(245, 158, 11, 0.15)",
            borderColor: "rgba(245, 158, 11, 0.3)",
        },
        GENERAL: {
            label: "General knowledge",
            icon: InfoOutlinedIcon,
            color: "#3B82F6",
            bgColor: "rgba(59, 130, 246, 0.15)",
            borderColor: "rgba(59, 130, 246, 0.3)",
        },
    };

    const c = config[category];
    if (!c) return null;
    const Icon = c.icon;

    return (
        <Box
            sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                px: 1.25,
                py: 0.4,
                borderRadius: 10,
                bgcolor: c.bgColor,
                border: `1px solid ${c.borderColor}`,
                mb: 1,
            }}
        >
            <Icon sx={{ fontSize: 12, color: c.color }} />
            <Typography
                sx={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.625rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    color: c.color,
                    textTransform: "uppercase",
                    lineHeight: 1,
                }}
            >
                {c.label}
            </Typography>
        </Box>
    );
}

// ============ VERIFY WARNING (for GENERAL answers) ============
function VerifyWarning() {
    return (
        <Box
            sx={{
                mt: 1.25,
                p: 1.25,
                borderRadius: 1.5,
                bgcolor: "rgba(245, 158, 11, 0.06)",
                border: "1px solid rgba(245, 158, 11, 0.2)",
                display: "flex",
                gap: 1,
                alignItems: "flex-start",
            }}
        >
            <WarningAmberIcon sx={{ fontSize: 14, color: "#F59E0B", mt: 0.25, flexShrink: 0 }} />
            <Typography
                sx={{
                    color: "text.secondary",
                    fontSize: "0.7rem",
                    lineHeight: 1.5,
                }}
            >
                General info — always verify with official sources for important decisions.
            </Typography>
        </Box>
    );
}

// ============ MAIN COMPONENT ============
export default function ChatMessage({ message }) {
    const isUser = message.role === "user";

    // Parse AI response for category tags
    const { category, cleanText } = isUser
        ? { category: null, cleanText: message.content }
        : parseAiResponse(message.content);

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
                    px: 2.25,
                    py: 1.75,
                    maxWidth: { xs: "80%", sm: 520 },
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
                {/* Category badge (only for AI messages with NOTFOUND or GENERAL) */}
                {!isUser && <ResponseBadge category={category} />}

                <Typography
                    variant="body2"
                    sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}
                >
                    {cleanText}
                </Typography>

                {/* Verify warning (only for GENERAL knowledge answers) */}
                {!isUser && category === "GENERAL" && <VerifyWarning />}
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