import React from "react";
import { IconButton, Box, Tooltip } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeIcon from "@mui/icons-material/DarkModeOutlined";
import { useThemeMode } from "../theme/useThemeMode";

export default function ThemeToggle({ collapsed }) {
    const { mode, toggleMode } = useThemeMode();
    const isDark = mode === "dark";

    if (collapsed) {
        return (
            <Tooltip title={isDark ? "Light mode" : "Dark mode"} placement="right">
                <IconButton onClick={toggleMode} size="small">
                    {isDark ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
                </IconButton>
            </Tooltip>
        );
    }

    return (
        <Box
            onClick={toggleMode}
            sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                p: 0.5,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                cursor: "pointer",
                position: "relative",
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: 4,
                    bottom: 4,
                    left: isDark ? "50%" : 4,
                    width: "calc(50% - 4px)",
                    bgcolor: "primary.main",
                    borderRadius: 1.5,
                    transition: "all 0.2s ease",
                    boxShadow: "0 0 12px rgba(139, 92, 246, 0.4)",
                }}
            />
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.5,
                    py: 0.75,
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: !isDark ? "white" : "text.secondary",
                    zIndex: 1,
                    transition: "color 0.2s",
                }}
            >
                <LightModeIcon sx={{ fontSize: 14 }} />
                Light
            </Box>
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.5,
                    py: 0.75,
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: isDark ? "white" : "text.secondary",
                    zIndex: 1,
                    transition: "color 0.2s",
                }}
            >
                <DarkModeIcon sx={{ fontSize: 14 }} />
                Dark
            </Box>
        </Box>
    );
}