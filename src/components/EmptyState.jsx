import React from "react";
import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function EmptyState({
    icon,
    title,
    description,
    actionLabel,
    onAction,
    actionIcon = <AddIcon />,
}) {
    return (
        <Box
            sx={{
                textAlign: "center",
                py: { xs: 6, md: 8 },
                px: 3,
                border: "1.5px dashed",
                borderColor: "divider",
                borderRadius: 3,
                bgcolor: "background.paper",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Subtle background glow */}
            <Box
                sx={{
                    position: "absolute",
                    top: "50%", left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 200, height: 200,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)",
                    filter: "blur(40px)",
                    pointerEvents: "none",
                }}
            />

            <Box sx={{ position: "relative" }}>
                {icon && (
                    <Box
                        sx={{
                            width: 64, height: 64,
                            borderRadius: 2.5,
                            background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                            display: "inline-flex",
                            alignItems: "center", justifyContent: "center",
                            mb: 2.5,
                            boxShadow: "0 8px 24px -6px rgba(139, 92, 246, 0.5)",
                        }}
                    >
                        {React.cloneElement(icon, { sx: { color: "white", fontSize: 30 } })}
                    </Box>
                )}
                <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                    {title}
                </Typography>
                {description && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ maxWidth: 420, mx: "auto", mb: 3, lineHeight: 1.6 }}
                    >
                        {description}
                    </Typography>
                )}
                {actionLabel && onAction && (
                    <Button
                        variant="contained"
                        startIcon={actionIcon}
                        onClick={onAction}
                        sx={{ boxShadow: "0 4px 14px -4px rgba(139, 92, 246, 0.5)" }}
                    >
                        {actionLabel}
                    </Button>
                )}
            </Box>
        </Box>
    );
}