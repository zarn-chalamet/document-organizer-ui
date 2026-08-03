import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import GridViewIcon from "@mui/icons-material/GridViewOutlined";
import ViewListIcon from "@mui/icons-material/ViewListOutlined";

/**
 * ViewToggle — small icon toggle for grid vs list view.
 * Matches the design system with subtle purple accent when active.
 */
export default function ViewToggle({ value, onChange }) {
    const buttonSx = (isActive) => ({
        width: 34,
        height: 34,
        borderRadius: 1.25,
        color: isActive ? "primary.main" : "text.secondary",
        bgcolor: isActive ? "rgba(139, 92, 246, 0.12)" : "transparent",
        border: "1px solid",
        borderColor: isActive ? "rgba(139, 92, 246, 0.3)" : "transparent",
        transition: "all 0.15s ease",
        "&:hover": {
            bgcolor: isActive ? "rgba(139, 92, 246, 0.18)" : "action.hover",
            color: isActive ? "primary.main" : "text.primary",
        },
    });

    return (
        <Box
            sx={{
                display: "inline-flex",
                gap: 0.5,
                p: 0.5,
                borderRadius: 1.5,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
            }}
        >
            <Tooltip title="Grid view">
                <IconButton
                    size="small"
                    onClick={() => onChange("grid")}
                    sx={buttonSx(value === "grid")}
                >
                    <GridViewIcon sx={{ fontSize: 16 }} />
                </IconButton>
            </Tooltip>
            <Tooltip title="List view">
                <IconButton
                    size="small"
                    onClick={() => onChange("list")}
                    sx={buttonSx(value === "list")}
                >
                    <ViewListIcon sx={{ fontSize: 16 }} />
                </IconButton>
            </Tooltip>
        </Box>
    );
}