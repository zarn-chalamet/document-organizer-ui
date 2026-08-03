import React, { useState, useRef, useEffect } from "react";
import { registerChatOpener } from "./chatBus";
import {
    Box, Typography, TextField, IconButton, Paper, CircularProgress,
    Fab, Slide, Backdrop, Tooltip, Zoom, Badge
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CloseIcon from "@mui/icons-material/Close";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
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

const HIDDEN_ROUTES = ["/login", "/oauth-success"];

// Panel width constants
const MIN_WIDTH = 400;
const MAX_WIDTH = 900;
const DEFAULT_WIDTH = 520;

// ============ SUGGESTIONS (document-aware) ============
const getSuggestions = (docContext) => {
    if (!docContext) return SUGGESTED_PROMPTS;

    const type = (docContext.detectedDocumentType || "").toLowerCase();
    if (type.includes("passport")) {
        return [
            { icon: "📅", text: "When should I renew this passport?" },
            { icon: "✈️", text: "Can I travel with this validity?" },
            { icon: "📋", text: "What do I need for renewal?" },
        ];
    }
    if (type.includes("visa")) {
        return [
            { icon: "⏰", text: "How do I extend this visa?" },
            { icon: "📋", text: "What are the visa conditions?" },
            { icon: "🚨", text: "What happens if it expires?" },
        ];
    }
    if (type.includes("work")) {
        return [
            { icon: "📄", text: "How do I renew this work permit?" },
            { icon: "⚠️", text: "What are the work restrictions?" },
            { icon: "🏢", text: "Can I change employers?" },
        ];
    }
    return [
        { icon: "💡", text: "Explain this document to me" },
        { icon: "📅", text: "What are the important dates?" },
        { icon: "⚠️", text: "What should I be aware of?" },
    ];
};

export default function ChatWidget({ isMobile = false, topbarHeight = 60 }) {
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([WELCOME]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    const [documentContext, setDocumentContext] = useState(null);

    // ============ RESIZE STATE ============
    const [panelWidth, setPanelWidth] = useState(() => {
        const saved = localStorage.getItem("chatPanelWidth");
        const parsed = saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
        return Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, parsed));
    });
    const [isResizing, setIsResizing] = useState(false);

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

    // Keyboard shortcuts
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

    // ============ REGISTER GLOBAL "OPEN WITH DOCUMENT" ============
    useEffect(() => {
        return registerChatOpener((document) => {
            setDocumentContext(document);
            setOpen(true);
            setMessages([
                {
                    role: "assistant",
                    content: `[DOC]Hi! I'm here to help you with **${document.title}**. 📄\n\nAsk me anything about this specific document — I have full context about its details, expiry, and rules.`,
                },
            ]);
        });
    }, []);

    // ============ HANDLE DRAG-TO-RESIZE ============
    useEffect(() => {
        if (!isResizing) return;

        const handleMouseMove = (e) => {
            const newWidth = window.innerWidth - e.clientX;
            const clamped = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth));
            setPanelWidth(clamped);
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            localStorage.setItem("chatPanelWidth", String(panelWidth));
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "ew-resize";
        document.body.style.userSelect = "none";

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        };
    }, [isResizing, panelWidth]);

    // Double-click to reset width
    const handleResetWidth = () => {
        setPanelWidth(DEFAULT_WIDTH);
        localStorage.setItem("chatPanelWidth", String(DEFAULT_WIDTH));
        toast.success("Panel size reset");
    };

    const sendMessage = async (text) => {
        const question = (text || input).trim();
        if (!question || loading) return;

        setMessages((prev) => [...prev, { role: "user", content: question }]);
        setInput("");
        setLoading(true);

        try {
            // Use document-scoped endpoint if in doc context
            const endpoint = documentContext
                ? `/documents/${documentContext.id}/chat`
                : "/chat";

            const res = await api.post(endpoint, { question });
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
        setDocumentContext(null);
        toast.success("Chat cleared");
    };

    const clearDocumentContext = () => {
        setDocumentContext(null);
        setMessages([WELCOME]);
        toast.success("Now chatting about all documents");
    };

    const showSuggestions = messages.length === 1;

    if (hidden) return null;

    return (
        <>
            {/* ============ FAB ============ */}
            <Zoom in={!open}>
                <Tooltip title="AI Assistant  (Ctrl+J)" placement="left">
                    <Badge
                        color="error"
                        variant="dot"
                        invisible={!hasUnread}
                        sx={{
                            position: "fixed",
                            bottom: { xs: 16, sm: 24 },
                            right: { xs: 16, sm: 24 },
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
                        width: {
                            xs: "100%",
                            sm: `${panelWidth}px`,
                        },
                        bgcolor: "background.paper",
                        borderLeft: { xs: "none", sm: "1px solid" },
                        borderColor: "divider",
                        zIndex: 1250,
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: "-8px 0 40px rgba(0, 0, 0, 0.4)",
                        transition: isResizing ? "none" : "width 0.2s ease",
                    }}
                >
                    {/* ============ RESIZE HANDLE ============ */}
                    <Box
                        onMouseDown={(e) => {
                            e.preventDefault();
                            setIsResizing(true);
                        }}
                        onDoubleClick={handleResetWidth}
                        sx={{
                            position: "absolute",
                            left: -3,
                            top: 0,
                            bottom: 0,
                            width: 6,
                            cursor: "ew-resize",
                            display: { xs: "none", sm: "flex" },
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 20,
                            transition: "all 0.15s ease",
                            "&:hover": {
                                "& .resize-bar": {
                                    opacity: 1,
                                    width: 3,
                                },
                                "& .resize-handle-icon": {
                                    opacity: 1,
                                },
                            },
                            ...(isResizing && {
                                "& .resize-bar": {
                                    opacity: 1,
                                    width: 3,
                                    background: "linear-gradient(180deg, transparent 0%, #8B5CF6 30%, #EC4899 70%, transparent 100%)",
                                },
                            }),
                        }}
                    >
                        <Box
                            className="resize-bar"
                            sx={{
                                position: "absolute",
                                left: "50%",
                                top: 0,
                                bottom: 0,
                                width: 2,
                                transform: "translateX(-50%)",
                                background: "linear-gradient(180deg, transparent 0%, rgba(139, 92, 246, 0.6) 30%, rgba(236, 72, 153, 0.6) 70%, transparent 100%)",
                                opacity: 0,
                                transition: "all 0.15s ease",
                                pointerEvents: "none",
                            }}
                        />
                        <Box
                            className="resize-handle-icon"
                            sx={{
                                position: "absolute",
                                left: "50%",
                                top: "50%",
                                transform: "translate(-50%, -50%)",
                                width: 20,
                                height: 32,
                                borderRadius: 1,
                                bgcolor: "background.paper",
                                border: "1px solid",
                                borderColor: "divider",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                opacity: 0,
                                transition: "opacity 0.15s ease",
                                pointerEvents: "none",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                            }}
                        >
                            <DragIndicatorIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                        </Box>
                    </Box>

                    {/* ============ HEADER ============ */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            px: 3,
                            py: 2,
                            borderBottom: "1px solid",
                            borderColor: "divider",
                            flexShrink: 0,
                            background: "linear-gradient(180deg, rgba(139, 92, 246, 0.03) 0%, transparent 100%)",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Box
                                sx={{
                                    position: "relative",
                                    width: 38,
                                    height: 38,
                                    borderRadius: 2,
                                    background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 4px 12px -2px rgba(139, 92, 246, 0.5)",
                                    "&::after": {
                                        content: '""',
                                        position: "absolute",
                                        bottom: -2,
                                        right: -2,
                                        width: 10,
                                        height: 10,
                                        borderRadius: "50%",
                                        bgcolor: "#10B981",
                                        border: "2px solid",
                                        borderColor: "background.paper",
                                        boxShadow: "0 0 8px #10B981",
                                    },
                                }}
                            >
                                <SmartToyIcon sx={{ color: "white", fontSize: 20 }} />
                            </Box>
                            <Box>
                                <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                                    AI Assistant
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mt: 0.25 }}>
                                    <Box
                                        sx={{
                                            width: 5,
                                            height: 5,
                                            borderRadius: "50%",
                                            bgcolor: "#10B981",
                                            boxShadow: "0 0 6px #10B981",
                                        }}
                                    />
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
                                        Online · Powered by Groq
                                    </Typography>
                                </Box>
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

                    {/* ============ DOCUMENT CONTEXT PILL ============ */}
                    {documentContext && (
                        <Box
                            sx={{
                                px: 3,
                                py: 1.5,
                                borderBottom: "1px solid",
                                borderColor: "divider",
                                bgcolor: "rgba(139, 92, 246, 0.06)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 1,
                                animation: "slideDown 0.3s ease",
                                "@keyframes slideDown": {
                                    "0%": { opacity: 0, transform: "translateY(-8px)" },
                                    "100%": { opacity: 1, transform: "translateY(0)" },
                                },
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0, flex: 1 }}>
                                <Box
                                    sx={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: "50%",
                                        bgcolor: "primary.main",
                                        boxShadow: "0 0 6px rgba(139, 92, 246, 0.6)",
                                        flexShrink: 0,
                                    }}
                                />
                                <Typography
                                    sx={{
                                        fontFamily: "'JetBrains Mono', monospace",
                                        fontSize: "0.6875rem",
                                        fontWeight: 700,
                                        letterSpacing: "0.08em",
                                        color: "primary.main",
                                        textTransform: "uppercase",
                                        flexShrink: 0,
                                    }}
                                >
                                    Discussing:
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontSize: "0.8125rem",
                                        fontWeight: 600,
                                        color: "text.primary",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {documentContext.title}
                                </Typography>
                            </Box>
                            <Tooltip title="Clear document context">
                                <IconButton
                                    size="small"
                                    onClick={clearDocumentContext}
                                    sx={{
                                        width: 22,
                                        height: 22,
                                        color: "text.secondary",
                                        "&:hover": { color: "primary.main" },
                                    }}
                                >
                                    <CloseIcon sx={{ fontSize: 14 }} />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}

                    {/* ============ MESSAGES AREA ============ */}
                    <Box
                        sx={{
                            flex: 1,
                            overflowY: "auto",
                            px: 3,
                            py: 3,
                            position: "relative",
                            "&::-webkit-scrollbar": { width: 6 },
                            "&::-webkit-scrollbar-track": { background: "transparent" },
                            "&::-webkit-scrollbar-thumb": {
                                bgcolor: "rgba(139, 92, 246, 0.3)",
                                borderRadius: 3,
                                "&:hover": { bgcolor: "rgba(139, 92, 246, 0.5)" },
                            },
                            "&::before": {
                                content: '""',
                                position: "sticky",
                                top: 0,
                                display: "block",
                                width: "100%",
                                height: 40,
                                marginTop: -3,
                                marginBottom: -1,
                                background: "linear-gradient(180deg, rgba(139, 92, 246, 0.06) 0%, transparent 100%)",
                                pointerEvents: "none",
                                zIndex: 1,
                            },
                        }}
                    >
                        {messages.map((msg, i) => (
                            <ChatMessage key={i} message={msg} />
                        ))}

                        {/* ============ LOADING INDICATOR ============ */}
                        {loading && (
                            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 2.5 }}>
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
                                        px: 2.5,
                                        py: 1.75,
                                        bgcolor: "background.default",
                                        border: "1px solid",
                                        borderColor: "divider",
                                        borderRadius: "16px 16px 16px 4px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 0.75,
                                    }}
                                >
                                    {[0, 1, 2].map((i) => (
                                        <Box
                                            key={i}
                                            sx={{
                                                width: 6,
                                                height: 6,
                                                borderRadius: "50%",
                                                background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
                                                animation: "typingDot 1.4s ease-in-out infinite",
                                                animationDelay: `${i * 0.15}s`,
                                                "@keyframes typingDot": {
                                                    "0%, 60%, 100%": { transform: "translateY(0)", opacity: 0.4 },
                                                    "30%": { transform: "translateY(-6px)", opacity: 1 },
                                                },
                                            }}
                                        />
                                    ))}
                                </Paper>
                            </Box>
                        )}

                        {/* ============ SUGGESTED PROMPTS ============ */}
                        {showSuggestions && !loading && (
                            <Box sx={{ mt: 3 }}>
                                <Typography
                                    sx={{
                                        display: "block",
                                        mb: 1.75,
                                        ml: 0.5,
                                        fontFamily: "'JetBrains Mono', monospace",
                                        fontSize: "0.6875rem",
                                        fontWeight: 700,
                                        letterSpacing: "0.1em",
                                        color: "primary.main",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    ✨ Try asking
                                </Typography>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                    {getSuggestions(documentContext).map((prompt, i) => (
                                        <Paper
                                            key={i}
                                            onClick={() => sendMessage(prompt.text)}
                                            elevation={0}
                                            sx={{
                                                p: 1.75,
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1.5,
                                                border: "1px solid",
                                                borderColor: "divider",
                                                borderRadius: 2,
                                                cursor: "pointer",
                                                bgcolor: "background.default",
                                                transition: "all 0.2s ease",
                                                animation: `slideIn 0.4s ease ${i * 0.08}s backwards`,
                                                "@keyframes slideIn": {
                                                    "0%": { opacity: 0, transform: "translateY(8px)" },
                                                    "100%": { opacity: 1, transform: "translateY(0)" },
                                                },
                                                "&:hover": {
                                                    borderColor: "primary.main",
                                                    bgcolor: "rgba(139, 92, 246, 0.05)",
                                                    transform: "translateX(4px)",
                                                    boxShadow: "0 4px 12px -4px rgba(139, 92, 246, 0.2)",
                                                },
                                            }}
                                        >
                                            <Typography sx={{ fontSize: "1.125rem", flexShrink: 0 }}>
                                                {prompt.icon}
                                            </Typography>
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

                    {/* ============ INPUT AREA ============ */}
                    <Box
                        sx={{
                            px: 3,
                            pb: 2.5,
                            pt: 1.5,
                            flexShrink: 0,
                            borderTop: "1px solid",
                            borderColor: "divider",
                            background: "linear-gradient(0deg, rgba(139, 92, 246, 0.03) 0%, transparent 100%)",
                        }}
                    >
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
                                transition: "all 0.2s ease",
                                bgcolor: "background.default",
                                "&:focus-within": {
                                    borderColor: "primary.main",
                                    boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.15), 0 4px 12px -2px rgba(139, 92, 246, 0.15)",
                                },
                            }}
                        >
                            <TextField
                                inputRef={inputRef}
                                fullWidth
                                multiline
                                maxRows={6}
                                placeholder={documentContext ? `Ask about ${documentContext.title}...` : "Ask about your documents..."}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                variant="standard"
                                InputProps={{ disableUnderline: true }}
                                sx={{
                                    px: 1.5,
                                    py: 0.75,
                                    "& textarea": { fontSize: "0.9375rem", lineHeight: 1.5 },
                                }}
                            />
                            <IconButton
                                onClick={() => sendMessage()}
                                disabled={!input.trim() || loading}
                                sx={{
                                    background: input.trim()
                                        ? "linear-gradient(135deg, #8B5CF6, #7C3AED)"
                                        : "transparent",
                                    color: "white",
                                    width: 36,
                                    height: 36,
                                    transition: "all 0.15s ease",
                                    flexShrink: 0,
                                    "&:hover": {
                                        background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
                                        boxShadow: "0 0 15px rgba(139, 92, 246, 0.5)",
                                        transform: "scale(1.05)",
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

                        {/* Footer hints */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                mt: 1.25,
                                px: 0.5,
                            }}
                        >
                            <Typography
                                sx={{
                                    color: "text.disabled",
                                    fontSize: "0.6875rem",
                                    fontFamily: "'JetBrains Mono', monospace",
                                }}
                            >
                                <Box
                                    component="kbd"
                                    sx={{
                                        px: 0.5,
                                        py: 0.25,
                                        borderRadius: 0.5,
                                        bgcolor: "action.hover",
                                        border: "1px solid",
                                        borderColor: "divider",
                                        fontSize: "0.6875rem",
                                        mr: 0.5,
                                    }}
                                >
                                    Enter
                                </Box>
                                to send
                            </Typography>
                            <Typography
                                sx={{
                                    color: "text.disabled",
                                    fontSize: "0.6875rem",
                                    fontFamily: "'JetBrains Mono', monospace",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 5,
                                        height: 5,
                                        borderRadius: "50%",
                                        bgcolor: "#10B981",
                                    }}
                                />
                                Private & secure
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Slide>
        </>
    );
}