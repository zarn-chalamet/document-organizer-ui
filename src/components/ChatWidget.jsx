import React, { useState, useRef, useEffect } from "react";
import {
    Box, Typography, TextField, IconButton, Paper, CircularProgress,
    Fab, Slide, Backdrop, Tooltip, Zoom, Badge
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
import ChatMessage from "./ChatMessage";
import api from "../api/axios";

const WELCOME = {
    role: "assistant",
    content: "Hi! I'm your document assistant. Ask me anything about your documents.",
};

const SUGGESTED_PROMPTS = [
    { icon: "📅", text: "When does my passport expire?" },
    { icon: "🌏", text: "What visas do I have?" },
    { icon: "⚠️", text: "Show me expiring documents" },
    { icon: "📄", text: "Summarize my documents" },
];

// Routes where the chat widget should NOT appear
const HIDDEN_ROUTES = ["/login", "/oauth-success"];

export default function ChatWidget() {
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([WELCOME]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    const hidden = HIDDEN_ROUTES.includes(location.pathname);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, open]);

    // Focus input when panel opens
    useEffect(() => {
        if (open) {
            setHasUnread(false);
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [open]);

    // Keyboard shortcuts: Ctrl/Cmd+J to toggle, Esc to close
    useEffect(() => {
        const handler = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j") {
                e.preventDefault();
                setOpen((o) => !o);
            }
            if (e.key === "Escape" && open) {
                setOpen(false);
            }
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [open]);

    const sendMessage = async (text) => {
        const question = (text || input).trim();
        if (!question || loading) return;

        setMessages((prev) => [...prev, { role: "user", content: question }]);
        setInput("");
        setLoading(true);

        try {
            const res = await api.post("/chat", { question });
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: res.data.answer },
            ]);
            if (!open) setHasUnread(true);
        } catch (err) {
            console.error(err);
            toast.error("Failed to get response");
            setMessages((prev) => prev.slice(0, -1));
        } finally {
            setLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearChat = () => {
        setMessages([WELCOME]);
        toast.success("Chat cleared");
    };

    const showSuggestions = messages.length === 1;

    if (hidden) return null;

    return (
        <>
            {/* ============ FAB (floating button, bottom-right) ============ */}
            <Zoom in={!open}>
                <Tooltip title="AI Assistant  (Ctrl+J)" placement="left">
                    <Badge
                        color="error"
                        variant="dot"
                        invisible={!hasUnread}
                        sx={{
                            position: "fixed",
                            bottom: 24,
                            right: 24,
                            zIndex: 1250,
                            "& .MuiBadge-badge": {
                                top: 8,
                                right: 8,
                                border: "2px solid",
                                borderColor: "background.default",
                            },
                        }}
                    >
                        <Fab
                            onClick={() => setOpen(true)}
                            sx={{
                                width: 56,
                                height: 56,
                                background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
                                boxShadow: "0 8px 24px -4px rgba(139, 92, 246, 0.5)",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                    background: "linear-gradient(135deg, #7C3AED, #DB2777)",
                                    boxShadow: "0 12px 32px -4px rgba(139, 92, 246, 0.7)",
                                    transform: "translateY(-2px)",
                                },
                                "&::before": {
                                    content: '""',
                                    position: "absolute",
                                    inset: -4,
                                    borderRadius: "50%",
                                    background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
                                    opacity: 0.3,
                                    filter: "blur(12px)",
                                    zIndex: -1,
                                    animation: "pulse 2.5s ease-in-out infinite",
                                },
                                "@keyframes pulse": {
                                    "0%, 100%": { opacity: 0.3, transform: "scale(1)" },
                                    "50%": { opacity: 0.6, transform: "scale(1.05)" },
                                },
                            }}
                        >
                            <SmartToyIcon sx={{ color: "white", fontSize: 24 }} />
                        </Fab>
                    </Badge>
                </Tooltip>
            </Zoom>

            {/* ============ BACKDROP ============ */}
            <Backdrop
                open={open}
                onClick={() => setOpen(false)}
                sx={{
                    zIndex: 1240,
                    bgcolor: "rgba(0, 0, 0, 0.4)",
                    backdropFilter: "blur(2px)",
                }}
            />

            {/* ============ SLIDE-IN PANEL ============ */}
            <Slide direction="left" in={open} mountOnEnter unmountOnExit>
                <Box
                    sx={{
                        position: "fixed",
                        top: 0,
                        right: 0,
                        height: "100vh",
                        width: { xs: "100%", sm: 440 },
                        bgcolor: "background.paper",
                        borderLeft: { xs: "none", sm: "1px solid" },
                        borderColor: "divider",
                        zIndex: 1250,
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: "-8px 0 32px rgba(0, 0, 0, 0.3)",
                    }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            px: 2.5,
                            py: 2,
                            borderBottom: "1px solid",
                            borderColor: "divider",
                            flexShrink: 0,
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
                                <SmartToyIcon sx={{ color: "white", fontSize: 18 }} />
                            </Box>
                            <Box>
                                <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                                    AI Assistant
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: "text.secondary",
                                        fontFamily: "'JetBrains Mono', monospace",
                                        fontSize: "0.625rem",
                                        letterSpacing: "0.05em",
                                    }}
                                >
                                    POWERED BY GROQ
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                            {messages.length > 1 && (
                                <Tooltip title="Clear chat">
                                    <IconButton onClick={clearChat} size="small">
                                        <RestartAltIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            )}
                            <Tooltip title="Close  (Esc)">
                                <IconButton onClick={() => setOpen(false)} size="small">
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>

                    {/* Messages */}
                    <Box
                        sx={{
                            flex: 1,
                            overflowY: "auto",
                            px: 2,
                            py: 2.5,
                            "&::-webkit-scrollbar": { width: 6 },
                            "&::-webkit-scrollbar-thumb": {
                                bgcolor: "divider",
                                borderRadius: 3,
                            },
                        }}
                    >
                        {messages.map((msg, i) => (
                            <ChatMessage key={i} message={msg} />
                        ))}

                        {loading && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
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
                                        boxShadow: "0 0 15px rgba(139, 92, 246, 0.4)",
                                    }}
                                >
                                    <SmartToyIcon sx={{ fontSize: 16, color: "white" }} />
                                </Box>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        px: 2, py: 1.5,
                                        bgcolor: "background.default",
                                        border: "1px solid",
                                        borderColor: "divider",
                                        borderRadius: "16px 16px 16px 4px",
                                    }}
                                >
                                    <CircularProgress size={14} sx={{ color: "primary.main" }} />
                                </Paper>
                            </Box>
                        )}

                        {showSuggestions && !loading && (
                            <Box sx={{ mt: 3 }}>
                                <Typography
                                    sx={{
                                        display: "block",
                                        mb: 1.5,
                                        ml: 0.5,
                                        fontFamily: "'JetBrains Mono', monospace",
                                        fontSize: "0.625rem",
                                        fontWeight: 700,
                                        letterSpacing: "0.1em",
                                        color: "primary.main",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Suggested Questions
                                </Typography>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                    {SUGGESTED_PROMPTS.map((prompt, i) => (
                                        <Paper
                                            key={i}
                                            onClick={() => sendMessage(prompt.text)}
                                            sx={{
                                                p: 1.5,
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1.5,
                                                border: "1px solid",
                                                borderColor: "divider",
                                                borderRadius: 2,
                                                cursor: "pointer",
                                                transition: "all 0.15s",
                                                "&:hover": {
                                                    borderColor: "primary.main",
                                                    bgcolor: "action.hover",
                                                    transform: "translateX(2px)",
                                                },
                                            }}
                                        >
                                            <Typography sx={{ fontSize: "1rem" }}>{prompt.icon}</Typography>
                                            <Typography variant="body2" fontWeight={500} sx={{ fontSize: "0.8125rem" }}>
                                                {prompt.text}
                                            </Typography>
                                        </Paper>
                                    ))}
                                </Box>
                            </Box>
                        )}

                        <div ref={bottomRef} />
                    </Box>

                    {/* Input */}
                    <Box sx={{ px: 2, pb: 2, pt: 1, flexShrink: 0 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 0.75,
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 3,
                                display: "flex",
                                alignItems: "flex-end",
                                gap: 0.5,
                                transition: "all 0.15s",
                                bgcolor: "background.default",
                                "&:focus-within": {
                                    borderColor: "primary.main",
                                    boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.15)",
                                },
                            }}
                        >
                            <TextField
                                inputRef={inputRef}
                                fullWidth
                                multiline
                                maxRows={4}
                                placeholder="Ask about your documents..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                variant="standard"
                                InputProps={{ disableUnderline: true }}
                                sx={{
                                    px: 1.25, py: 0.5,
                                    "& textarea": { fontSize: "0.875rem" },
                                }}
                            />
                            <IconButton
                                onClick={() => sendMessage()}
                                disabled={!input.trim() || loading}
                                sx={{
                                    background: input.trim() ? "linear-gradient(135deg, #8B5CF6, #7C3AED)" : "transparent",
                                    color: "white",
                                    width: 34,
                                    height: 34,
                                    transition: "all 0.15s",
                                    flexShrink: 0,
                                    "&:hover": {
                                        background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
                                        boxShadow: "0 0 15px rgba(139, 92, 246, 0.4)",
                                    },
                                    "&:disabled": {
                                        background: "transparent",
                                        color: "text.disabled",
                                    },
                                }}
                            >
                                <SendIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                        </Paper>
                        <Typography
                            variant="caption"
                            sx={{
                                display: "block",
                                textAlign: "center",
                                mt: 1,
                                color: "text.disabled",
                                fontSize: "0.6875rem",
                                fontFamily: "'JetBrains Mono', monospace",
                            }}
                        >
                            Press <Box component="kbd" sx={{
                                px: 0.5, py: 0.25, borderRadius: 0.5,
                                bgcolor: "action.hover", border: "1px solid", borderColor: "divider",
                                fontSize: "0.6875rem",
                            }}>Enter</Box> to send · Your data stays private
                        </Typography>
                    </Box>
                </Box>
            </Slide>
        </>
    );
}