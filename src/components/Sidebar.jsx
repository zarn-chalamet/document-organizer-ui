import React from "react";
import {
    Box, Typography, ListItemButton, ListItemIcon, ListItemText,
    IconButton, Tooltip, Avatar, Divider
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/SpaceDashboard";
import ChatIcon from "@mui/icons-material/AutoAwesome";
import LogoutIcon from "@mui/icons-material/Logout";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardIcon from "@mui/icons-material/KeyboardCommandKey";
import { useThemeMode } from "../theme/useThemeMode";
import ThemeToggle from "./ThemeToggle";

const NAV_SECTIONS = [
    {
        heading: "MAIN",
        items: [
            { label: "Dashboard", path: "/", icon: <DashboardIcon /> }
        ],
    },
];

export default function Sidebar({ collapsed, onToggle, width }) {
    const navigate = useNavigate();
    const location = useLocation();
    const email = localStorage.getItem("email");
    const { mode } = useThemeMode();
    const isDark = mode === "dark";

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("email");
        navigate("/login");
    };

    const isActive = (path) => (path === "/" ? location.pathname === "/" : location.pathname.startsWith(path));

    const openPalette = () => {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
    };

    return (
        <Box
            sx={{
                width,
                position: "fixed",
                top: 0,
                left: 0,
                height: "100vh",
                bgcolor: "background.paper",
                borderRight: "1px solid",
                borderColor: "divider",
                display: "flex",
                flexDirection: "column",
                transition: "width 0.2s ease",
                zIndex: 1200,
            }}
        >
            {/* Logo */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: collapsed ? "center" : "space-between",
                    px: collapsed ? 0 : 2.5,
                    py: 2.5,
                    minHeight: 68,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                }}
            >
                {!collapsed && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box
                            sx={{
                                width: 32,
                                height: 32,
                                borderRadius: 2,
                                background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 0 20px rgba(139, 92, 246, 0.4)",
                            }}
                        >
                            <Typography
                                sx={{
                                    color: "white",
                                    fontSize: "0.875rem",
                                    fontWeight: 700,
                                    fontFamily: "'JetBrains Mono', monospace",
                                }}
                            >
                                D
                            </Typography>
                        </Box>
                        <Typography variant="subtitle1" fontWeight={600} sx={{ fontSize: "0.9375rem" }}>
                            Organizer
                        </Typography>
                    </Box>
                )}
                <IconButton onClick={onToggle} size="small">
                    {collapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
                </IconButton>
            </Box>

            {/* Command palette trigger */}
            {!collapsed && (
                <Box sx={{ px: 1.5, pt: 2 }}>
                    <Box
                        onClick={openPalette}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            px: 1.5,
                            py: 1,
                            borderRadius: 2,
                            border: "1px solid",
                            borderColor: "divider",
                            cursor: "pointer",
                            transition: "all 0.15s",
                            "&:hover": {
                                borderColor: isDark ? "#3F3F46" : "#D4D4D8",
                                background: isDark ? "#1A1A1D" : "#F4F4F5",
                            },
                        }}
                    >
                        <Typography variant="caption" color="text.secondary" fontWeight={500}>
                            Search
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.25,
                                px: 0.5,
                                py: 0.25,
                                borderRadius: 1,
                                bgcolor: isDark ? "grey.900" : "grey.100",
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: "0.6875rem",
                                color: "text.secondary",
                            }}
                        >
                            <KeyboardIcon sx={{ fontSize: 11 }} /> K
                        </Box>
                    </Box>
                </Box>
            )}

            {/* Nav */}
            <Box sx={{ flex: 1, pt: 2, overflowY: "auto" }}>
                {NAV_SECTIONS.map((section) => (
                    <Box key={section.heading} sx={{ mb: 2 }}>
                        {!collapsed && (
                            <Typography
                                sx={{
                                    px: 3,
                                    mb: 0.5,
                                    fontSize: "0.6875rem",
                                    fontWeight: 600,
                                    letterSpacing: "0.05em",
                                    color: "text.disabled",
                                    fontFamily: "'JetBrains Mono', monospace",
                                }}
                            >
                                {section.heading}
                            </Typography>
                        )}
                        <Box sx={{ px: 1.5 }}>
                            {section.items.map((item) => (
                                <Tooltip key={item.path} title={collapsed ? item.label : ""} placement="right">
                                    <ListItemButton
                                        onClick={() => navigate(item.path)}
                                        sx={{
                                            borderRadius: 2,
                                            mb: 0.5,
                                            px: collapsed ? 0 : 1.5,
                                            py: 1,
                                            justifyContent: collapsed ? "center" : "flex-start",
                                            bgcolor: isActive(item.path)
                                                ? isDark
                                                    ? "rgba(139, 92, 246, 0.15)"
                                                    : "#F5F3FF"
                                                : "transparent",
                                            color: isActive(item.path)
                                                ? "#A78BFA"
                                                : "text.secondary",
                                            border: isActive(item.path)
                                                ? "1px solid rgba(139, 92, 246, 0.3)"
                                                : "1px solid transparent",
                                            "&:hover": {
                                                bgcolor: isActive(item.path)
                                                    ? isDark
                                                        ? "rgba(139, 92, 246, 0.2)"
                                                        : "#EDE9FE"
                                                    : isDark
                                                        ? "#1A1A1D"
                                                        : "#F4F4F5",
                                            },
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                mr: collapsed ? 0 : 2,
                                                color: "inherit",
                                                justifyContent: "center",
                                                "& .MuiSvgIcon-root": { fontSize: 18 },
                                            }}
                                        >
                                            {item.icon}
                                        </ListItemIcon>
                                        {!collapsed && (
                                            <ListItemText
                                                primary={item.label}
                                                primaryTypographyProps={{
                                                    fontSize: "0.875rem",
                                                    fontWeight: isActive(item.path) ? 600 : 500,
                                                }}
                                            />
                                        )}
                                    </ListItemButton>
                                </Tooltip>
                            ))}
                        </Box>
                    </Box>
                ))}
            </Box>

            <Divider />

            {/* Theme toggle */}
            <Box sx={{ px: collapsed ? 0 : 2, py: 1.5, display: "flex", justifyContent: "center" }}>
                <ThemeToggle collapsed={collapsed} />
            </Box>

            <Divider />

            {/* User */}
            <Box sx={{ p: collapsed ? 1 : 2 }}>
                {!collapsed && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1, px: 1 }}>
                        <Avatar
                            sx={{
                                width: 32,
                                height: 32,
                                background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
                                fontSize: "0.875rem",
                                fontWeight: 600,
                            }}
                        >
                            {email?.[0]?.toUpperCase() || "U"}
                        </Avatar>
                        <Box sx={{ overflow: "hidden", flex: 1 }}>
                            <Typography variant="body2" fontWeight={500} noWrap sx={{ fontSize: "0.8125rem" }}>
                                {email?.split("@")[0]}
                            </Typography>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                noWrap
                                sx={{ fontSize: "0.6875rem", display: "block" }}
                            >
                                {email}
                            </Typography>
                        </Box>
                    </Box>
                )}
                <Tooltip title={collapsed ? "Logout" : ""} placement="right">
                    <ListItemButton
                        onClick={handleLogout}
                        sx={{
                            borderRadius: 2,
                            px: collapsed ? 0 : 1.5,
                            py: 1,
                            justifyContent: collapsed ? "center" : "flex-start",
                            color: "text.secondary",
                            "&:hover": {
                                bgcolor: isDark ? "rgba(239, 68, 68, 0.1)" : "#FEE2E2",
                                color: "#EF4444",
                            },
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: collapsed ? 0 : 2,
                                color: "inherit",
                                justifyContent: "center",
                                "& .MuiSvgIcon-root": { fontSize: 18 },
                            }}
                        >
                            <LogoutIcon />
                        </ListItemIcon>
                        {!collapsed && (
                            <ListItemText
                                primary="Logout"
                                primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: 500 }}
                            />
                        )}
                    </ListItemButton>
                </Tooltip>
            </Box>
        </Box>
    );
}