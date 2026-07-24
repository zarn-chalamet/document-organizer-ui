import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

const SIDEBAR_OPEN = 260;
const SIDEBAR_COLLAPSED = 72;

export default function Layout({ children }) {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(() => {
        return localStorage.getItem("sidebar_collapsed") === "true";
    });

    useEffect(() => {
        localStorage.setItem("sidebar_collapsed", collapsed);
    }, [collapsed]);

    const hideSidebar = location.pathname === "/login" || location.pathname === "/oauth-success";

    if (hideSidebar) return <>{children}</>;

    const width = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_OPEN;

    return (
        <>
            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} width={width} />
            <Box
                component="main"
                sx={{
                    marginLeft: `${width}px`,
                    minHeight: "100vh",
                    width: `calc(100vw - ${width}px)`,
                    bgcolor: "background.default",
                    transition: "margin-left 0.2s ease, width 0.2s ease",
                }}
            >
                {children}
            </Box>
        </>
    );
}