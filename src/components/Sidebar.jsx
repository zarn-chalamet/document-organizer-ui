import React from "react";
import {
    Box, Typography, ListItemButton, ListItemIcon, ListItemText,
    IconButton, Tooltip, Avatar, Divider, Drawer
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/SpaceDashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardIcon from "@mui/icons-material/KeyboardCommandKey";
import CloseIcon from "@mui/icons-material/Close";
import { useThemeMode } from "../theme/useThemeMode";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";

const NAV_SECTIONS = [
    {
        heading: "MAIN",
        items: [
            { label: "Dashboard", path: "/app", icon: <DashboardIcon /> },
        ],
    },
];

export default function Sidebar({
    collapsed,
    onToggle,
    width,
    isMobile = false,
    mobileOpen = false,
    onMobileClose = () => {},
}) {
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

    const isActive = (path) => (path === "/app" ? location.pathname === "/app" : location.pathname.startsWith(path));

    const openPalette = () => {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
        if (isMobile) onMobileClose();
    };

    const handleNavClick = (path) => {
        navigate(path);
        if (isMobile) onMobileClose();
    };

    // On mobile, sidebar always renders as "open" (not collapsed)
    const effectiveCollapsed = isMobile ? false : collapsed;

    // ============ SIDEBAR CONTENT (shared by desktop + mobile) ============
    const sidebarContent = (
        <Box
            sx={{
                width: isMobile ? 280 : width,
                height: "100%",
                bgcolor: "background.paper",
                display: "flex",
                flexDirection: "column",
                borderRight: isMobile ? "none" : "1px solid",
                borderColor: "divider",
                transition: "width 0.2s ease",
            }}
        >
            {/* ============ LOGO / HEADER ============ */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: effectiveCollapsed ? "center" : "space-between",
                    px: effectiveCollapsed ? 0 : 2.5,
                    py: 2.5,
                    minHeight: 68,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                }}
            >
                {!effectiveCollapsed ? (
                    <>
                        <Box
                            onClick={() => handleNavClick("/app")}
                            sx={{
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                transition: "opacity 0.15s",
                                "&:hover": { opacity: 0.8 },
                            }}
                        >
                            <Logo variant="full" size={32} glow />
                        </Box>
                        {isMobile ? (
                            <IconButton onClick={onMobileClose} size="small">
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        ) : (
                            <IconButton onClick={onToggle} size="small">
                                <ChevronLeftIcon fontSize="small" />
                            </IconButton>
                        )}
                    </>
                ) : (
                    <IconButton onClick={onToggle} size="small">
                        <ChevronRightIcon fontSize="small" />
                    </IconButton>
                )}
            </Box>

            {/* ============ COMMAND PALETTE TRIGGER (desktop only) ============ */}
            {!effectiveCollapsed && !isMobile && (
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

            {/* ============ NAVIGATION ============ */}
            <Box sx={{ flex: 1, pt: 2, overflowY: "auto" }}>
                {NAV_SECTIONS.map((section) => (
                    <Box key={section.heading} sx={{ mb: 2 }}>
                        {!effectiveCollapsed && (
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
                                <Tooltip
                                    key={item.path}
                                    title={effectiveCollapsed ? item.label : ""}
                                    placement="right"
                                >
                                    <ListItemButton
                                        onClick={() => handleNavClick(item.path)}
                                        sx={{
                                            borderRadius: 2,
                                            mb: 0.5,
                                            px: effectiveCollapsed ? 0 : 1.5,
                                            py: 1,
                                            justifyContent: effectiveCollapsed ? "center" : "flex-start",
                                            bgcolor: isActive(item.path)
                                                ? isDark
                                                    ? "rgba(139, 92, 246, 0.15)"
                                                    : "#F5F3FF"
                                                : "transparent",
                                            color: isActive(item.path) ? "#A78BFA" : "text.secondary",
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
                                                mr: effectiveCollapsed ? 0 : 2,
                                                color: "inherit",
                                                justifyContent: "center",
                                                "& .MuiSvgIcon-root": { fontSize: 18 },
                                            }}
                                        >
                                            {item.icon}
                                        </ListItemIcon>
                                        {!effectiveCollapsed && (
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

            {/* ============ THEME TOGGLE ============ */}
            <Box
                sx={{
                    px: effectiveCollapsed ? 0 : 2,
                    py: 1.5,
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <ThemeToggle collapsed={effectiveCollapsed} />
            </Box>

            <Divider />

            {/* ============ USER + LOGOUT ============ */}
            <Box sx={{ p: effectiveCollapsed ? 1 : 2 }}>
                {!effectiveCollapsed && (
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
                <Tooltip title={effectiveCollapsed ? "Logout" : ""} placement="right">
                    <ListItemButton
                        onClick={handleLogout}
                        sx={{
                            borderRadius: 2,
                            px: effectiveCollapsed ? 0 : 1.5,
                            py: 1,
                            justifyContent: effectiveCollapsed ? "center" : "flex-start",
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
                                mr: effectiveCollapsed ? 0 : 2,
                                color: "inherit",
                                justifyContent: "center",
                                "& .MuiSvgIcon-root": { fontSize: 18 },
                            }}
                        >
                            <LogoutIcon />
                        </ListItemIcon>
                        {!effectiveCollapsed && (
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

    // ============ MOBILE: RENDER AS DRAWER ============
    if (isMobile) {
        return (
            <Drawer
                anchor="left"
                open={mobileOpen}
                onClose={onMobileClose}
                ModalProps={{ keepMounted: true }} // better performance on mobile
                sx={{
                    "& .MuiDrawer-paper": {
                        width: 280,
                        boxSizing: "border-box",
                        border: "none",
                    },
                }}
            >
                {sidebarContent}
            </Drawer>
        );
    }

    // ============ DESKTOP: RENDER AS FIXED SIDEBAR ============
    return (
        <Box
            sx={{
                width,
                position: "fixed",
                top: 0,
                left: 0,
                height: "100vh",
                zIndex: 1200,
            }}
        >
            {sidebarContent}
        </Box>
    );
}