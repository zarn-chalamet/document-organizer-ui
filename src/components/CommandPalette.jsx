import React, { useState, useEffect } from "react";
import { Dialog, Box, TextField, Typography, InputAdornment } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import DashboardIcon from "@mui/icons-material/SpaceDashboard";
import ChatIcon from "@mui/icons-material/AutoAwesome";
import AddIcon from "@mui/icons-material/Add";
import KeyboardIcon from "@mui/icons-material/KeyboardCommandKey";
import api from "../api/axios";

export default function CommandPalette() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const handler = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setOpen(true);
            }
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, []);

    useEffect(() => {
        if (open && localStorage.getItem("accessToken")) {
            api.get("/categories").then((res) => setCategories(res.data)).catch(() => { });
        }
    }, [open]);

        const staticActions = [
        { icon: <DashboardIcon />, label: "Go to Dashboard", action: () => navigate("/") },
        {
            icon: <ChatIcon />,
            label: "Open AI Assistant",
            action: () => {
                // Trigger the ChatWidget by dispatching Ctrl+J
                document.dispatchEvent(
                    new KeyboardEvent("keydown", { key: "j", metaKey: true })
                );
            },
        },
    ];

    const filterQuery = query.toLowerCase();
    const filteredActions = staticActions.filter((a) => a.label.toLowerCase().includes(filterQuery));
    const filteredCategories = categories.filter((c) => c.name.toLowerCase().includes(filterQuery));

    const handleClose = () => {
        setOpen(false);
        setQuery("");
    };

    const runAction = (action) => {
        action();
        handleClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        position: "absolute",
                        top: 100,
                        m: 0,
                        borderRadius: 3,
                    },
                },
            }}
        >
            <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
                <TextField
                    fullWidth
                    autoFocus
                    placeholder="Search or type a command..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    variant="standard"
                    InputProps={{
                        disableUnderline: true,
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ "& input": { fontSize: "0.9375rem", py: 0.5 } }}
                />
            </Box>

            <Box sx={{ maxHeight: 400, overflowY: "auto", p: 1 }}>
                {filteredActions.length > 0 && (
                    <>
                        <Typography
                            variant="caption"
                            sx={{
                                px: 2, py: 1, display: "block",
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: "0.6875rem",
                                fontWeight: 600,
                                letterSpacing: "0.05em",
                                color: "text.disabled",
                            }}
                        >
                            ACTIONS
                        </Typography>
                        {filteredActions.map((a, i) => (
                            <Box
                                key={i}
                                onClick={() => runAction(a.action)}
                                sx={{
                                    display: "flex", alignItems: "center", gap: 1.5,
                                    px: 2, py: 1.25, borderRadius: 2, cursor: "pointer",
                                    "&:hover": { bgcolor: "action.hover" },
                                }}
                            >
                                {React.cloneElement(a.icon, { sx: { fontSize: 18, color: "text.secondary" } })}
                                <Typography variant="body2" fontWeight={500}>
                                    {a.label}
                                </Typography>
                            </Box>
                        ))}
                    </>
                )}

                {filteredCategories.length > 0 && (
                    <>
                        <Typography
                            variant="caption"
                            sx={{
                                px: 2, py: 1, display: "block", mt: 1,
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: "0.6875rem",
                                fontWeight: 600,
                                letterSpacing: "0.05em",
                                color: "text.disabled",
                            }}
                        >
                            CATEGORIES
                        </Typography>
                        {filteredCategories.map((c) => (
                            <Box
                                key={c.id}
                                onClick={() => runAction(() => navigate(`/categories/${c.id}`))}
                                sx={{
                                    display: "flex", alignItems: "center", gap: 1.5,
                                    px: 2, py: 1.25, borderRadius: 2, cursor: "pointer",
                                    "&:hover": { bgcolor: "action.hover" },
                                }}
                            >
                                <AddIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                                <Typography variant="body2" fontWeight={500}>{c.name}</Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ ml: "auto" }}>
                                    {c.documentCount} docs
                                </Typography>
                            </Box>
                        ))}
                    </>
                )}

                {filteredActions.length === 0 && filteredCategories.length === 0 && (
                    <Box sx={{ p: 4, textAlign: "center" }}>
                        <Typography variant="body2" color="text.secondary">
                            No results found
                        </Typography>
                    </Box>
                )}
            </Box>

            <Box
                sx={{
                    px: 2, py: 1.5,
                    borderTop: "1px solid", borderColor: "divider",
                    display: "flex", justifyContent: "space-between",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.6875rem", color: "text.disabled",
                }}
            >
                <Box sx={{ display: "flex", gap: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <KeyboardIcon sx={{ fontSize: 11 }} /> K
                        <span>open</span>
                    </Box>
                    <Box>ESC close</Box>
                </Box>
                <Box>↵ select</Box>
            </Box>
        </Dialog>
    );
}