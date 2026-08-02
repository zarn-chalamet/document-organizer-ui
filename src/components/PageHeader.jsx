import React from "react";
import { Box, Typography, IconButton, Breadcrumbs, Link } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";

/**
 * PageHeader — unified header for all pages.
 *
 * Props:
 * - title: page title (large text)
 * - subtitle: secondary text under title
 * - backTo: optional back-button target route
 * - breadcrumbs: [{ label, to? }] — last item is current (no link)
 * - action: React node (usually a Button) rendered top-right
 */
export default function PageHeader({
    title,
    subtitle,
    backTo,
    breadcrumbs = [],
    action,
    titleAdornment,
}) {
    const navigate = useNavigate();

    return (
        <Box sx={{ mb: 4 }}>
            {/* Breadcrumbs row */}
            {breadcrumbs.length > 0 && (
                <Breadcrumbs
                    separator={<ChevronRightIcon sx={{ fontSize: 14, color: "text.disabled" }} />}
                    sx={{
                        mb: 1.5,
                        "& .MuiBreadcrumbs-ol": { alignItems: "center" },
                        "& .MuiBreadcrumbs-li": { display: "flex", alignItems: "center" },
                    }}
                >
                    {breadcrumbs.map((crumb, i) => {
                        const isLast = i === breadcrumbs.length - 1;
                        if (isLast || !crumb.to) {
                            return (
                                <Typography
                                    key={i}
                                    sx={{
                                        fontSize: "0.8125rem",
                                        fontWeight: 500,
                                        color: isLast ? "text.primary" : "text.secondary",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 0.5,
                                        maxWidth: 240,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {crumb.icon}
                                    {crumb.label}
                                </Typography>
                            );
                        }
                        return (
                            <Link
                                key={i}
                                component="button"
                                onClick={() => navigate(crumb.to)}
                                underline="hover"
                                sx={{
                                    fontSize: "0.8125rem",
                                    fontWeight: 500,
                                    color: "text.secondary",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    border: "none",
                                    background: "none",
                                    cursor: "pointer",
                                    fontFamily: "inherit",
                                    padding: 0,
                                    transition: "color 0.15s",
                                    "&:hover": { color: "primary.main" },
                                }}
                            >
                                {crumb.icon}
                                {crumb.label}
                            </Link>
                        );
                    })}
                </Breadcrumbs>
            )}

            {/* Title row */}
            <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: { xs: "stretch", sm: "flex-start" },
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
            }}>
                {/* Left: back button + title */}
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, minWidth: 0, flex: 1 }}>
                    {backTo && (
                        <IconButton
                            onClick={() => navigate(backTo)}
                            size="small"
                            sx={{
                                mt: 0.5,
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 1.5,
                                width: 34, height: 34,
                                flexShrink: 0,
                                "&:hover": {
                                    borderColor: "primary.main",
                                    bgcolor: "action.hover",
                                    color: "primary.main",
                                },
                            }}
                        >
                            <ArrowBackIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                    )}
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                            <Typography
                                variant="h4"
                                fontWeight={700}
                                letterSpacing="-0.02em"
                                sx={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {title}
                            </Typography>
                            {titleAdornment}
                        </Box>
                        {subtitle && (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    mt: 0.5,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                </Box>

                {/* Right: action button */}
                {action && (
                    <Box sx={{
                        flexShrink: 0,
                        width: { xs: "100%", sm: "auto" },
                        "& > *": {
                            width: { xs: "100%", sm: "auto" },
                        },
                    }}>
                        {action}
                    </Box>
                )}
            </Box>
        </Box>
    );
}

// Export a helper icon for consistent home breadcrumb
export const DashboardBreadcrumbIcon = () => (
    <HomeIcon sx={{ fontSize: 14, mr: 0.25 }} />
);