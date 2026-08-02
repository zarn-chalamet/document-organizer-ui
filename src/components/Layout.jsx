import React, { useState, useEffect } from "react";
import { Box, IconButton, AppBar, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./Sidebar";
import ChatWidget from "./ChatWidget";
import Logo from "./Logo";

const SIDEBAR_OPEN = 260;
const SIDEBAR_COLLAPSED = 72;
const MOBILE_TOPBAR_HEIGHT = 60;

export default function Layout({ children }) {
    const location = useLocation();
    const navigate = useNavigate(); 
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md")); // < 900px

    const [collapsed, setCollapsed] = useState(() => {
        return localStorage.getItem("sidebar_collapsed") === "true";
    });
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem("sidebar_collapsed", collapsed);
    }, [collapsed]);

    // Close mobile drawer on route change (e.g., browser back/forward navigation)
    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    const hideSidebar =
        location.pathname === "/" ||
        location.pathname === "/login" ||
        location.pathname === "/oauth-success";
    if (hideSidebar) return <>{children}</>;

    const desktopWidth = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_OPEN;

    return (
        <>
            {/* ============ MOBILE TOP BAR ============ */}
            {isMobile && (
                <AppBar
                    position="fixed"
                    elevation={0}
                    sx={{
                        bgcolor: "background.paper",
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        color: "text.primary",
                        zIndex: 1100,
                        height: MOBILE_TOPBAR_HEIGHT,
                    }}
                >
                    <Toolbar sx={{ minHeight: `${MOBILE_TOPBAR_HEIGHT}px !important`, px: 2 }}>
                        <IconButton
                            onClick={() => setMobileOpen(true)}
                            sx={{
                                mr: 1.5,
                                color: "text.primary",
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 1.5,
                                width: 38,
                                height: 38,
                            }}
                        >
                            <MenuIcon fontSize="small" />
                        </IconButton>
                        <Box
                            onClick={() => navigate("/app")}
                            sx={{
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                transition: "opacity 0.15s",
                                "&:hover": { opacity: 0.8 },
                            }}
                        >
                            <Logo variant="full" size={28} glow />
                        </Box>
                    </Toolbar>
                </AppBar>
            )}

            {/* ============ SIDEBAR (fixed on desktop, drawer on mobile) ============ */}
            <Sidebar
                collapsed={collapsed}
                onToggle={() => setCollapsed(!collapsed)}
                width={desktopWidth}
                isMobile={isMobile}
                mobileOpen={mobileOpen}
                onMobileClose={() => setMobileOpen(false)}
            />

            {/* ============ MAIN CONTENT ============ */}
            <Box
                component="main"
                sx={{
                    marginLeft: isMobile ? 0 : `${desktopWidth}px`,
                    marginTop: isMobile ? `${MOBILE_TOPBAR_HEIGHT}px` : 0,
                    minHeight: isMobile
                        ? `calc(100vh - ${MOBILE_TOPBAR_HEIGHT}px)`
                        : "100vh",
                    width: isMobile ? "100%" : `calc(100vw - ${desktopWidth}px)`,
                    bgcolor: "background.default",
                    transition: "margin-left 0.2s ease, width 0.2s ease",
                }}
            >
                {children}
            </Box>

            {/* Floating chat widget */}
            <ChatWidget isMobile={isMobile} topbarHeight={MOBILE_TOPBAR_HEIGHT} />
        </>
    );
}