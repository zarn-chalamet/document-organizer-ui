import React, { useState, useRef, useEffect } from "react";
import {
    Box, Typography, TextField, IconButton, Paper, CircularProgress, Container
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { toast } from "sonner";
import ChatMessage from "../components/ChatMessage";
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

export default function Chat() {
    const [messages, setMessages] = useState([WELCOME]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

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

    return (
        <Box sx={{ width: "100%", maxWidth: 900, mx: "auto", height: "100vh", px: { xs: 2, sm: 3 }, py: 3, boxSizing: "border-box" }}>
            <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                {/* Header */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        pb: 2,
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        mb: 3,
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 2,
                                background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 0 20px rgba(139, 92, 246, 0.4)",
                            }}
                        >
                            <AutoAwesomeIcon sx={{ color: "white", fontSize: 20 }} />
                        </Box>
                        <Box>
                            <Typography variant="h6" fontWeight={700}>
                                AI Assistant
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: "text.secondary",
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: "0.6875rem",
                                }}
                            >
                                POWERED BY GROQ · YOUR DATA STAYS PRIVATE
                            </Typography>
                        </Box>
                    </Box>
                    {messages.length > 1 && (
                        <IconButton onClick={clearChat} size="small" title="Clear chat">
                            <RestartAltIcon fontSize="small" />
                        </IconButton>
                    )}
                </Box>

                {/* Messages */}
                <Box sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
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
                                <AutoAwesomeIcon sx={{ fontSize: 16, color: "white" }} />
                            </Box>
                            <Paper
                                elevation={0}
                                sx={{
                                    px: 2,
                                    py: 1.5,
                                    bgcolor: "background.paper",
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
                                variant="caption"
                                sx={{
                                    display: "block",
                                    mb: 1.5,
                                    ml: 0.5,
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: "0.6875rem",
                                    fontWeight: 600,
                                    letterSpacing: "0.1em",
                                    color: "primary.main",
                                }}
                            >
                                SUGGESTED QUESTIONS
                            </Typography>
                            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
                                {SUGGESTED_PROMPTS.map((prompt, i) => (
                                    <Paper
                                        key={i}
                                        onClick={() => sendMessage(prompt.text)}
                                        sx={{
                                            p: 2,
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
                                                transform: "translateY(-1px)",
                                                boxShadow: "0 0 20px rgba(139, 92, 246, 0.15)",
                                            },
                                        }}
                                    >
                                        <Typography sx={{ fontSize: "1.125rem" }}>{prompt.icon}</Typography>
                                        <Typography variant="body2" fontWeight={500}>
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
                <Paper
                    elevation={0}
                    sx={{
                        mt: 2,
                        p: 1,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 3,
                        display: "flex",
                        alignItems: "flex-end",
                        gap: 1,
                        transition: "all 0.15s",
                        "&:focus-within": {
                            borderColor: "primary.main",
                            boxShadow: "0 0 20px rgba(139, 92, 246, 0.15)",
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
                        sx={{ px: 1.5, py: 0.5, "& textarea": { fontSize: "0.9375rem" } }}
                    />
                    <IconButton
                        onClick={() => sendMessage()}
                        disabled={!input.trim() || loading}
                        sx={{
                            background: input.trim() ? "linear-gradient(135deg, #8B5CF6, #7C3AED)" : "transparent",
                            color: "white",
                            width: 36,
                            height: 36,
                            transition: "all 0.15s",
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
                        <SendIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                </Paper>
            </Box>
        </Box>
    );
}