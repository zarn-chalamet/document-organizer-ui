import React from "react";
import { Box, Typography } from "@mui/material";

/**
 * Logo — Organizer brand mark (Stacked Spark).
 *
 * Props:
 *  - variant: "icon" (default) | "full"       → icon only OR icon + wordmark
 *  - size: number (default 32)                → icon size in pixels
 *  - wordmark: string (default "Organizer")   → text next to icon in "full" variant
 *  - glow: boolean (default false)            → soft drop-shadow glow around icon
 *  - flat: boolean (default false)            → flat version (better for tiny sizes < 24px)
 *
 * Usage:
 *  <Logo />                              // 32px isometric icon
 *  <Logo size={40} glow />               // 40px with glow
 *  <Logo variant="full" size={36} glow /> // hero / login page
 *  <Logo size={20} flat />               // small contexts
 */
export default function Logo({
    variant = "icon",
    size = 32,
    wordmark = "Organizer",
    glow = false,
    flat = false,
}) {
    // Unique gradient IDs (avoid conflicts when multiple Logos render)
    const layerGradId = React.useId();
    const layer2GradId = React.useId();
    const layer3GradId = React.useId();
    const sparkGradId = React.useId();
    const sparkGlowId = React.useId();

    const iconSvg = (
        <svg
            width={size}
            height={size}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
                display: "block",
                filter: glow ? "drop-shadow(0 0 14px rgba(139, 92, 246, 0.55))" : "none",
                transition: "filter 0.25s ease",
            }}
        >
            <defs>
                {/* Layer gradients - front to back with depth variation */}
                <linearGradient id={layerGradId} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#C4B5FD" />
                    <stop offset="50%" stopColor="#A78BFA" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>

                <linearGradient id={layer2GradId} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#A78BFA" />
                    <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>

                <linearGradient id={layer3GradId} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#6D28D9" />
                </linearGradient>

                {/* Spark gradient - pink/violet fusion */}
                <radialGradient id={sparkGradId} cx="0.5" cy="0.5" r="0.5" gradientUnits="objectBoundingBox">
                    <stop offset="0%" stopColor="#FDF4FF" />
                    <stop offset="40%" stopColor="#F0ABFC" />
                    <stop offset="100%" stopColor="#EC4899" />
                </radialGradient>

                {/* Spark glow */}
                <radialGradient id={sparkGlowId} cx="0.5" cy="0.5" r="0.5" gradientUnits="objectBoundingBox">
                    <stop offset="0%" stopColor="#F0ABFC" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
                </radialGradient>
            </defs>

            {flat ? (
                // ============ FLAT VERSION (for tiny sizes) ============
                <>
                    {/* Back layer */}
                    <rect x="6" y="26" width="28" height="5" rx="2.5" fill={`url(#${layer3GradId})`} opacity="0.5" />
                    {/* Middle layer */}
                    <rect x="6" y="18" width="28" height="5" rx="2.5" fill={`url(#${layer2GradId})`} opacity="0.75" />
                    {/* Front layer */}
                    <rect x="6" y="10" width="28" height="5" rx="2.5" fill={`url(#${layerGradId})`} />
                    {/* Spark glow bg */}
                    <circle cx="38" cy="8" r="7" fill={`url(#${sparkGlowId})`} />
                    {/* Spark */}
                    <path
                        d="M38 2 L39.2 6 L43 7 L39.2 8 L38 12 L36.8 8 L33 7 L36.8 6 Z"
                        fill={`url(#${sparkGradId})`}
                    />
                </>
            ) : (
                // ============ ISOMETRIC VERSION (hero/normal use) ============
                <>
                    {/* Back layer (deepest, most tilted) */}
                    <g transform="translate(0, 4)">
                        <path
                            d="M8 28 L26 22 L40 26 L22 32 Z"
                            fill={`url(#${layer3GradId})`}
                            opacity="0.55"
                        />
                        {/* Subtle edge highlight */}
                        <path
                            d="M8 28 L26 22 L40 26"
                            stroke="#A78BFA"
                            strokeWidth="0.5"
                            strokeOpacity="0.4"
                            fill="none"
                        />
                    </g>

                    {/* Middle layer */}
                    <g transform="translate(0, -2)">
                        <path
                            d="M8 28 L26 22 L40 26 L22 32 Z"
                            fill={`url(#${layer2GradId})`}
                            opacity="0.8"
                        />
                        <path
                            d="M8 28 L26 22 L40 26"
                            stroke="#C4B5FD"
                            strokeWidth="0.5"
                            strokeOpacity="0.5"
                            fill="none"
                        />
                    </g>

                    {/* Front layer (top, most visible) */}
                    <g transform="translate(0, -8)">
                        <path
                            d="M8 28 L26 22 L40 26 L22 32 Z"
                            fill={`url(#${layerGradId})`}
                        />
                        {/* Top edge highlight for depth */}
                        <path
                            d="M8 28 L26 22 L40 26"
                            stroke="#DDD6FE"
                            strokeWidth="0.6"
                            strokeOpacity="0.7"
                            fill="none"
                        />
                    </g>

                    {/* Spark glow halo */}
                    <circle cx="40" cy="10" r="9" fill={`url(#${sparkGlowId})`} />

                    {/* AI Spark (4-point star with subtle rotation) */}
                    <g transform="translate(40, 10) rotate(15)">
                        <path
                            d="M0 -7 L1.5 -1.5 L7 0 L1.5 1.5 L0 7 L-1.5 1.5 L-7 0 L-1.5 -1.5 Z"
                            fill={`url(#${sparkGradId})`}
                        />
                        {/* Inner bright core */}
                        <circle cx="0" cy="0" r="1.5" fill="#FDF4FF" opacity="0.9" />
                    </g>
                </>
            )}
        </svg>
    );

    // Icon-only variant
    if (variant === "icon") {
        return (
            <Box
                sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {iconSvg}
            </Box>
        );
    }

    // Full variant: icon + wordmark
    return (
        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1.25 }}>
            {iconSvg}
            <Typography
                sx={{
                    fontSize: size * 0.5,
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    color: "text.primary",
                    lineHeight: 1,
                    background: "linear-gradient(135deg, currentColor 60%, #A78BFA 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                }}
            >
                {wordmark}
            </Typography>
        </Box>
    );
}