import React, { useState } from "react";
import { Box, Typography, Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import CheckIcon from "@mui/icons-material/Check";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { SORT_OPTIONS } from "./sortOptions";

/**
 * SortDropdown — dropdown for sorting the document list.
 * Matches the toggle button group style.
 */
export default function SortDropdown({ value, onChange }) {
    const [anchor, setAnchor] = useState(null);
    const currentLabel = SORT_OPTIONS.find(o => o.value === value)?.label || "Sort";

    return (
        <>
            <Box
                onClick={(e) => setAnchor(e.currentTarget)}
                sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                    px: 1.75,
                    py: 0.75,
                    borderRadius: 1.5,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    fontFamily: "inherit",
                    "&:hover": {
                        borderColor: "primary.main",
                        bgcolor: "action.hover",
                    },
                }}
            >
                <SortIcon sx={{ fontSize: 15, color: "text.secondary" }} />
                <Typography
                    sx={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "text.secondary",
                        letterSpacing: "0.02em",
                    }}
                >
                    {currentLabel}
                </Typography>
                <KeyboardArrowDownIcon
                    sx={{
                        fontSize: 16,
                        color: "text.disabled",
                        transform: anchor ? "rotate(180deg)" : "rotate(0)",
                        transition: "transform 0.2s ease",
                    }}
                />
            </Box>

            <Menu
                anchorEl={anchor}
                open={Boolean(anchor)}
                onClose={() => setAnchor(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                slotProps={{
                    paper: {
                        sx: {
                            mt: 0.5,
                            minWidth: 200,
                            border: "1px solid",
                            borderColor: "divider",
                        },
                    },
                }}
            >
                {SORT_OPTIONS.map((option) => (
                    <MenuItem
                        key={option.value}
                        selected={value === option.value}
                        onClick={() => {
                            onChange(option.value);
                            setAnchor(null);
                        }}
                        sx={{
                            fontSize: "0.875rem",
                            py: 1,
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: "28px !important" }}>
                            {value === option.value && (
                                <CheckIcon sx={{ fontSize: 16, color: "primary.main" }} />
                            )}
                        </ListItemIcon>
                        <ListItemText primaryTypographyProps={{ fontSize: "0.875rem" }}>
                            {option.label}
                        </ListItemText>
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
}