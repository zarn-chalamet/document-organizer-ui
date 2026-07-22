import React, { useState, useRef, useEffect } from "react";
import {
    Box,
    Typography,
    TextField,
    IconButton,
    Paper,
    CircularProgress,
    Alert,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import ChatMessage from "../components/ChatMessage";
import api from "../api/axios";

const WELCOME_MESSAGE = {
    role: "assistant",
    content:
        "Hi! I'm your document assistant. Ask me anything about your documents — expiry dates, document types, or specific details.\n\nExample questions:\n• When does my passport expire?\n• What visas do I have?\n• Show me my work permit details.",
};

export default function Chat() {
    const [messages, setMessages] = useState([WELCOME_MESSAGE]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const bottomRef = useRef(null);

    // Auto scroll to bottom on new message
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        const question = input.trim();
        if (!question || loading) return;

        // Add user message
        setMessages((prev) => [...prev, { role: "user", content: question }]);
        setInput("");
        setLoading(true);
        setError(null);

        try {
            const response = await api.post("/chat", { question });
            const answer = response.data.answer;

            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: answer },
            ]);
        } catch (err) {
            console.error("Chat error:", err);
            setError("Failed to get a response. Make sure the AI service is running.");
            // Remove the user message if request failed
            setMessages((prev) => prev.slice(0, -1));
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "calc(100vh - 64px)", // subtract navbar height
                maxWidth: 800,
                mx: "auto",
                px: 2,
            }}
        >
            {/* Header */}
            <Box sx={{ py: 2, borderBottom: 1, borderColor: "divider" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <SmartToyIcon color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                        Document Assistant
                    </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                    Ask questions about your documents. Powered by local semantic
                    search + Groq AI.
                </Typography>
            </Box>

            {/* Messages area */}
            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    py: 2,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {messages.map((msg, index) => (
                    <ChatMessage key={index} message={msg} />
                ))}

                {/* Loading indicator */}
                {loading && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                        <Box
                            sx={{
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                bgcolor: "primary.main",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <SmartToyIcon sx={{ fontSize: 18, color: "white" }} />
                        </Box>
                        <Paper
                            elevation={0}
                            sx={{
                                px: 2,
                                py: 1.5,
                                bgcolor: "grey.100",
                                borderRadius: "18px 18px 18px 4px",
                            }}
                        >
                            <CircularProgress size={16} />
                        </Paper>
                    </Box>
                )}

                {/* Error */}
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <div ref={bottomRef} />
            </Box>

            {/* Input area */}
            <Paper
                elevation={2}
                sx={{
                    p: 1.5,
                    mb: 2,
                    borderRadius: 3,
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 1,
                }}
            >
                <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    placeholder="Ask about your documents..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    variant="standard"
                    InputProps={{ disableUnderline: true }}
                    sx={{ px: 1 }}
                />
                <IconButton
                    color="primary"
                    onClick={sendMessage}
                    disabled={!input.trim() || loading}
                    sx={{
                        bgcolor: "primary.main",
                        color: "white",
                        "&:hover": { bgcolor: "primary.dark" },
                        "&:disabled": { bgcolor: "grey.300", color: "grey.500" },
                    }}
                >
                    <SendIcon fontSize="small" />
                </IconButton>
            </Paper>
        </Box>
    );
}