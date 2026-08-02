import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Logo from "../components/Logo";


const parseAuthParams = () => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    return {
        token: params.get("token"),
        email: params.get("email") || "",
    };
};

export default function OAuthSuccess() {
    const navigate = useNavigate();
    const hasRun = useRef(false);

    
    const [authData] = useState(parseAuthParams);
    const [status, setStatus] = useState("loading"); // loading | success | error

    const { token, email } = authData;

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        if (token) {
            localStorage.setItem("accessToken", token);
            localStorage.setItem("email", email);
            navigate("/app", { replace: true });
        } else if (window.location.pathname === "/oauth-success") {
            navigate("/login", { replace: true });
        }
    }, [navigate, token, email]);

    const isSuccess = status === "success";
    const isError = status === "error";
    const isLoading = status === "loading";
    const accentColor = isError ? "#EF4444" : "#8B5CF6";

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "background.default",
                position: "relative",
                overflow: "hidden",
                px: 2,
                backgroundImage: `
                    linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(139, 92, 246, 0.03) 1px, transparent 1px)
                `,
                backgroundSize: "48px 48px",
            }}
        >
            {/* ============ AMBIENT GLOW BLOBS ============ */}
            <Box
                sx={{
                    position: "absolute",
                    top: "15%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 600,
                    height: 600,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${accentColor}22 0%, transparent 70%)`,
                    filter: "blur(70px)",
                    pointerEvents: "none",
                    transition: "background 0.6s ease",
                    animation: "pulse 4s ease-in-out infinite",
                    "@keyframes pulse": {
                        "0%, 100%": { opacity: 0.6 },
                        "50%": { opacity: 1 },
                    },
                }}
            />
            <Box
                sx={{
                    position: "absolute",
                    bottom: "5%",
                    right: "10%",
                    width: 350,
                    height: 350,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${accentColor}18 0%, transparent 70%)`,
                    filter: "blur(60px)",
                    pointerEvents: "none",
                    animation: "float 8s ease-in-out infinite",
                    "@keyframes float": {
                        "0%, 100%": { transform: "translate(0, 0)" },
                        "50%": { transform: "translate(-20px, -30px)" },
                    },
                }}
            />
            <Box
                sx={{
                    position: "absolute",
                    top: "10%",
                    left: "8%",
                    width: 280,
                    height: 280,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${accentColor}15 0%, transparent 70%)`,
                    filter: "blur(50px)",
                    pointerEvents: "none",
                    animation: "float2 10s ease-in-out infinite",
                    "@keyframes float2": {
                        "0%, 100%": { transform: "translate(0, 0)" },
                        "50%": { transform: "translate(30px, 20px)" },
                    },
                }}
            />

            {/* ============ LOGO — TOP CENTER ============ */}
            <Box
                sx={{
                    position: "absolute",
                    top: 32,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 2,
                    animation: "fadeInLogo 0.6s ease 0.1s backwards",
                    "@keyframes fadeInLogo": {
                        "0%": { opacity: 0, transform: "translateX(-50%) translateY(-10px)" },
                        "100%": { opacity: 1, transform: "translateX(-50%) translateY(0)" },
                    },
                }}
            >
                <Logo />
            </Box>

            {/* ============ MAIN CONTENT ============ */}
            <Box
                sx={{
                    position: "relative",
                    zIndex: 1,
                    textAlign: "center",
                    maxWidth: 440,
                    width: "100%",
                    animation: "fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s backwards",
                    "@keyframes fadeInUp": {
                        "0%": { opacity: 0, transform: "translateY(20px)" },
                        "100%": { opacity: 1, transform: "translateY(0)" },
                    },
                }}
            >
                {/* Status tag */}
                <Box
                    key={status}
                    sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 3,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 10,
                        bgcolor: `${accentColor}15`,
                        border: `1px solid ${accentColor}30`,
                        animation: "fadeInScale 0.4s ease-out",
                        "@keyframes fadeInScale": {
                            "0%": { opacity: 0, transform: "scale(0.9)" },
                            "100%": { opacity: 1, transform: "scale(1)" },
                        },
                    }}
                >
                    <Box
                        sx={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            bgcolor: accentColor,
                            boxShadow: `0 0 10px ${accentColor}`,
                            animation: isLoading ? "blink 1.2s ease-in-out infinite" : "none",
                            "@keyframes blink": {
                                "0%, 100%": { opacity: 1 },
                                "50%": { opacity: 0.3 },
                            },
                        }}
                    />
                    <Typography
                        sx={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "0.6875rem",
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            color: accentColor,
                            textTransform: "uppercase",
                        }}
                    >
                        {isSuccess ? "Authenticated" : isError ? "Failed" : "Verifying"}
                    </Typography>
                </Box>

                {/* ============ ANIMATED ICON ============ */}
                <Box
                    sx={{
                        position: "relative",
                        width: 96,
                        height: 96,
                        mx: "auto",
                        mb: 4,
                    }}
                >
                    {isLoading && (
                        <Box
                            sx={{
                                position: "absolute",
                                inset: -8,
                                borderRadius: "50%",
                                border: "2px solid transparent",
                                borderTopColor: accentColor,
                                borderRightColor: `${accentColor}80`,
                                animation: "spin 1.5s linear infinite",
                                "@keyframes spin": {
                                    "0%": { transform: "rotate(0deg)" },
                                    "100%": { transform: "rotate(360deg)" },
                                },
                            }}
                        />
                    )}

                    {(isSuccess || isError) && (
                        <>
                            <Box
                                sx={{
                                    position: "absolute",
                                    inset: 0,
                                    borderRadius: 3,
                                    border: `2px solid ${accentColor}`,
                                    animation: "ripple 1.5s ease-out infinite",
                                    "@keyframes ripple": {
                                        "0%": { transform: "scale(1)", opacity: 0.6 },
                                        "100%": { transform: "scale(1.4)", opacity: 0 },
                                    },
                                }}
                            />
                            <Box
                                sx={{
                                    position: "absolute",
                                    inset: 0,
                                    borderRadius: 3,
                                    border: `2px solid ${accentColor}`,
                                    animation: "ripple 1.5s ease-out 0.5s infinite",
                                }}
                            />
                        </>
                    )}

                    <Box
                        sx={{
                            width: "100%",
                            height: "100%",
                            borderRadius: 3,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: isSuccess || isError
                                ? `linear-gradient(135deg, ${accentColor}30, ${accentColor}15)`
                                : "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                            border: `1px solid ${accentColor}50`,
                            boxShadow: `
                                0 12px 32px -8px ${accentColor}60,
                                inset 0 1px 0 rgba(255, 255, 255, 0.1)
                            `,
                            transition: "all 0.4s ease",
                            animation: (isSuccess || isError) ? "bounceIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)" : "none",
                            "@keyframes bounceIn": {
                                "0%": { transform: "scale(0.3)", opacity: 0 },
                                "60%": { transform: "scale(1.1)", opacity: 1 },
                                "100%": { transform: "scale(1)", opacity: 1 },
                            },
                        }}
                    >
                        {isLoading && (
                            <CircularProgress size={36} thickness={4} sx={{ color: "#fff" }} />
                        )}
                        {isSuccess && (
                            <CheckCircleOutlineIcon
                                sx={{
                                    fontSize: 52,
                                    color: accentColor,
                                    filter: `drop-shadow(0 0 12px ${accentColor})`,
                                }}
                            />
                        )}
                        {isError && (
                            <ErrorOutlineIcon
                                sx={{
                                    fontSize: 52,
                                    color: accentColor,
                                    filter: `drop-shadow(0 0 12px ${accentColor})`,
                                }}
                            />
                        )}
                    </Box>
                </Box>

                {/* ============ HEADLINE ============ */}
                <Typography
                    key={`title-${status}`}
                    variant="h4"
                    fontWeight={700}
                    letterSpacing="-0.02em"
                    sx={{
                        mb: 1.5,
                        fontSize: { xs: "1.75rem", sm: "2rem" },
                        animation: "slideUp 0.5s ease-out",
                        "@keyframes slideUp": {
                            "0%": { opacity: 0, transform: "translateY(10px)" },
                            "100%": { opacity: 1, transform: "translateY(0)" },
                        },
                    }}
                >
                    {isSuccess ? "Welcome back" : isError ? "Something went wrong" : "Signing you in"}
                </Typography>

                {/* ============ SUBLINE ============ */}
                <Typography
                    key={`sub-${status}`}
                    variant="body1"
                    color="text.secondary"
                    sx={{
                        mb: 4,
                        fontSize: "0.9375rem",
                        animation: "slideUp 0.5s ease-out 0.1s backwards",
                    }}
                >
                    {isSuccess
                        ? "Taking you to your dashboard"
                        : isError
                        ? "Redirecting you back to sign in"
                        : "Verifying your credentials"}
                </Typography>

                {/* ============ EMAIL PILL ============ */}
                {isSuccess && email && (
                    <Box
                        sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 1.25,
                            px: 2.5,
                            py: 1.25,
                            borderRadius: 10,
                            bgcolor: "background.paper",
                            border: "1px solid",
                            borderColor: "divider",
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "0.8125rem",
                            color: "text.primary",
                            mb: 4,
                            boxShadow: "0 4px 12px -4px rgba(0, 0, 0, 0.2)",
                            animation: "slideUp 0.5s ease-out 0.2s backwards",
                        }}
                    >
                        <Box
                            sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                bgcolor: "#10B981",
                                boxShadow: "0 0 10px #10B981",
                                animation: "pulse-dot 2s ease-in-out infinite",
                                "@keyframes pulse-dot": {
                                    "0%, 100%": { opacity: 1, transform: "scale(1)" },
                                    "50%": { opacity: 0.6, transform: "scale(1.2)" },
                                },
                            }}
                        />
                        {email}
                    </Box>
                )}

                {/* ============ SHIMMER PROGRESS BAR ============ */}
                <Box
                    sx={{
                        width: "100%",
                        maxWidth: 280,
                        mx: "auto",
                        height: 3,
                        borderRadius: 2,
                        bgcolor: "action.hover",
                        overflow: "hidden",
                        position: "relative",
                    }}
                >
                    <Box
                        sx={{
                            height: "100%",
                            borderRadius: 2,
                            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
                            animation: "shimmer 1.8s ease-in-out infinite",
                            "@keyframes shimmer": {
                                "0%": { transform: "translateX(-100%)", width: "50%" },
                                "100%": { transform: "translateX(300%)", width: "50%" },
                            },
                        }}
                    />
                </Box>
            </Box>

            {/* ============ FOOTER TAG ============ */}
            <Typography
                sx={{
                    position: "absolute",
                    bottom: 24,
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.6875rem",
                    color: "text.disabled",
                    letterSpacing: "0.1em",
                    animation: "fadeInFooter 0.6s ease 0.4s backwards",
                    "@keyframes fadeInFooter": {
                        "0%": { opacity: 0 },
                        "100%": { opacity: 1 },
                    },
                }}
            >
                SECURED BY GOOGLE OAUTH 2.0
            </Typography>
        </Box>
    );
}