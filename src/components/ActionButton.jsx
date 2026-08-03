import React from "react";
import { Box, Typography } from "@mui/material";


export default function ActionButton({
    icon,
    label,
    hint,
    variant = "default",
    onClick,
    disabled = false,
    component = "button",
    href,
    target,
    sx,
    ...rest
}) {
    const isDanger = variant === "danger";
    const isAnchor = component === "a";

    return (
        <Box
            component={component}
            onClick={disabled ? undefined : onClick}
            disabled={component === "button" ? disabled : undefined}
            href={isAnchor ? href : undefined}
            target={isAnchor ? target : undefined}
            rel={isAnchor && target === "_blank" ? "noopener noreferrer" : undefined}
            {...rest}
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                width: "100%",
                p: 1.25,
                borderRadius: 1.5,
                border: "1px solid",
                borderColor: "transparent",
                bgcolor: "transparent",
                cursor: disabled ? "not-allowed" : "pointer",
                textAlign: "left",
                textDecoration: "none",
                color: isDanger ? "#EF4444" : "text.primary",
                fontFamily: "inherit",
                fontSize: "inherit",
                opacity: disabled ? 0.5 : 1,
                transition: "all 0.15s ease",
                "&:hover": !disabled
                    ? {
                          bgcolor: isDanger ? "rgba(239, 68, 68, 0.08)" : "action.hover",
                          borderColor: isDanger ? "rgba(239, 68, 68, 0.3)" : "divider",
                          transform: "translateX(2px)",
                      }
                    : {},
                "&:focus-visible": {
                    outline: "2px solid",
                    outlineColor: isDanger ? "#EF4444" : "primary.main",
                    outlineOffset: 2,
                },
                ...sx,
            }}
        >
            {/* Icon box */}
            <Box
                sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1.5,
                    bgcolor: isDanger ? "rgba(239, 68, 68, 0.12)" : "action.hover",
                    border: "1px solid",
                    borderColor: isDanger ? "rgba(239, 68, 68, 0.25)" : "divider",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}
            >
                {React.cloneElement(icon, {
                    sx: {
                        fontSize: 16,
                        color: isDanger ? "#EF4444" : "text.secondary",
                    },
                })}
            </Box>

            {/* Text content */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                    sx={{
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        color: "inherit",
                        lineHeight: 1.3,
                    }}
                >
                    {label}
                </Typography>
                {hint && (
                    <Typography
                        sx={{
                            fontSize: "0.6875rem",
                            color: isDanger ? "rgba(239, 68, 68, 0.7)" : "text.secondary",
                            lineHeight: 1.3,
                            mt: 0.25,
                        }}
                    >
                        {hint}
                    </Typography>
                )}
            </Box>
        </Box>
    );
}