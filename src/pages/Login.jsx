import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, Container } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import FolderIcon from "@mui/icons-material/Folder";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ShieldIcon from "@mui/icons-material/Shield";
import BoltIcon from "@mui/icons-material/Bolt";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Logo from "../components/Logo";

export default function Login() {
    const navigate = useNavigate();
    
    // Redirect to dashboard if already logged in with valid token
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                const now = Math.floor(Date.now() / 1000);
                if (payload.exp > now) {
                    navigate("/", { replace: true });
                } else {
                    // Expired — clean up
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("email");
                }
            } catch (err) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("email");
                console.error("Invalid JWT format:", err);
            }
        }
    }, [navigate]);

    const handleLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
    };

    const features = [
        {
            icon: <FolderIcon />,
            title: "Your Own Google Drive",
            description: "Files stay in your Drive. We never store your documents.",
        },
        {
            icon: <AutoAwesomeIcon />,
            title: "AI-Powered Scanning",
            description: "Automatically extract expiry dates and document details.",
        },
        {
            icon: <ShieldIcon />,
            title: "PDPA Compliant",
            description: "Privacy-first design. You control your data.",
        },
        {
            icon: <BoltIcon />,
            title: "Instant Search",
            description: "Semantic AI search across all your documents.",
        },
    ];

    return (
        <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: "background.default" }}>
            {/* ============ LEFT — SIGN IN ============ */}
            <Box
                sx={{
                    flex: { xs: 1, md: "0 0 45%" },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 4,
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Subtle glow on mobile (visible when right side is hidden) */}
                <Box
                    sx={{
                        position: "absolute",
                        top: "20%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 500,
                        height: 500,
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)",
                        filter: "blur(60px)",
                        pointerEvents: "none",
                        display: { xs: "block", md: "none" },
                    }}
                />

                <Container
                    maxWidth="xs"
                    sx={{
                        position: "relative",
                        animation: "fadeInLeft 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
                        "@keyframes fadeInLeft": {
                            "0%": { opacity: 0, transform: "translateY(20px)" },
                            "100%": { opacity: 1, transform: "translateY(0)" },
                        },
                    }}
                >
                    {/* Logo */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.75, mb: 6 }}>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 2.5,
                                background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 8px 24px -6px rgba(139, 92, 246, 0.5)",
                            }}
                        >
                            <Box
                                component="img"
                                src="/favicon.svg"
                                alt="Organizer"
                                sx={{ width: 26, height: 26, filter: "brightness(0) invert(1)" }}
                            />
                        </Box>
                        <Box>
                            <Typography
                                variant="h6"
                                fontWeight={700}
                                letterSpacing="-0.02em"
                                sx={{ lineHeight: 1.1 }}
                            >
                                Organizer
                            </Typography>
                            <Typography
                                sx={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: "0.6875rem",
                                    color: "text.secondary",
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                }}
                            >
                                AI Documents
                            </Typography>
                        </Box>
                    </Box>

                    {/* Status tag — matches OAuth page style */}
                    <Box
                        sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 2.5,
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 10,
                            bgcolor: "rgba(139, 92, 246, 0.12)",
                            border: "1px solid rgba(139, 92, 246, 0.25)",
                        }}
                    >
                        <Box
                            sx={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                bgcolor: "#10B981",
                                boxShadow: "0 0 8px #10B981",
                                animation: "pulseDot 2s ease-in-out infinite",
                                "@keyframes pulseDot": {
                                    "0%, 100%": { opacity: 1 },
                                    "50%": { opacity: 0.5 },
                                },
                            }}
                        />
                        <Typography
                            sx={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: "0.6875rem",
                                fontWeight: 700,
                                letterSpacing: "0.1em",
                                color: "primary.main",
                                textTransform: "uppercase",
                            }}
                        >
                            Ready to sign in
                        </Typography>
                    </Box>

                    <Typography
                        variant="h3"
                        fontWeight={700}
                        letterSpacing="-0.03em"
                        sx={{ mb: 1.5, fontSize: { xs: "2rem", sm: "2.5rem" } }}
                    >
                        Welcome back
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: "0.9375rem" }}>
                        Sign in to manage your documents securely with AI-powered organization.
                    </Typography>

                    {/* Google sign-in button — enhanced */}
                    <Button
                        variant="contained"
                        startIcon={<GoogleIcon />}
                        endIcon={
                            <ArrowForwardIcon
                                className="arrow"
                                sx={{ fontSize: 18, transition: "transform 0.2s ease" }}
                            />
                        }
                        fullWidth
                        size="large"
                        onClick={handleLogin}
                        sx={{
                            py: 1.75,
                            fontSize: "0.9375rem",
                            fontWeight: 600,
                            boxShadow: "0 4px 20px -4px rgba(139, 92, 246, 0.5)",
                            transition: "all 0.2s ease",
                            "&:hover": {
                                boxShadow: "0 6px 24px -4px rgba(139, 92, 246, 0.7)",
                                transform: "translateY(-1px)",
                                "& .arrow": { transform: "translateX(3px)" },
                            },
                        }}
                    >
                        Continue with Google
                    </Button>

                    {/* Divider with mono label */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 3 }}>
                        <Box sx={{ flex: 1, height: "1px", bgcolor: "divider" }} />
                        <Typography
                            sx={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: "0.6875rem",
                                color: "text.disabled",
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                            }}
                        >
                            Secure OAuth 2.0
                        </Typography>
                        <Box sx={{ flex: 1, height: "1px", bgcolor: "divider" }} />
                    </Box>

                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                            display: "block",
                            textAlign: "center",
                            fontSize: "0.75rem",
                            lineHeight: 1.6,
                        }}
                    >
                        By continuing, you agree to our{" "}
                        <Box
                            component="span"
                            sx={{
                                color: "primary.main",
                                cursor: "pointer",
                                fontWeight: 500,
                                "&:hover": { textDecoration: "underline" },
                            }}
                        >
                            Terms
                        </Box>{" "}
                        and{" "}
                        <Box
                            component="span"
                            sx={{
                                color: "primary.main",
                                cursor: "pointer",
                                fontWeight: 500,
                                "&:hover": { textDecoration: "underline" },
                            }}
                        >
                            Privacy Policy
                        </Box>
                        .
                    </Typography>
                </Container>
            </Box>

            {/* ============ RIGHT — HERO ============ */}
            <Box
                sx={{
                    flex: 1,
                    display: { xs: "none", md: "flex" },
                    alignItems: "center",
                    justifyContent: "center",
                    background: "radial-gradient(ellipse at top, #1a0b2e 0%, #0A0A0B 60%)",
                    p: 6,
                    position: "relative",
                    overflow: "hidden",
                    borderLeft: "1px solid",
                    borderColor: "divider",
                }}
            >
                {/* Grid overlay */}
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage:
                            "linear-gradient(rgba(139, 92, 246, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.05) 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                        maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
                    }}
                />

                {/* Animated glow orbs */}
                <Box
                    sx={{
                        position: "absolute",
                        top: "10%",
                        right: "10%",
                        width: 350,
                        height: 350,
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)",
                        filter: "blur(50px)",
                        animation: "float 10s ease-in-out infinite",
                        "@keyframes float": {
                            "0%, 100%": { transform: "translate(0, 0)" },
                            "50%": { transform: "translate(-20px, 30px)" },
                        },
                    }}
                />
                <Box
                    sx={{
                        position: "absolute",
                        bottom: "10%",
                        left: "5%",
                        width: 280,
                        height: 280,
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%)",
                        filter: "blur(50px)",
                        animation: "float2 12s ease-in-out infinite",
                        "@keyframes float2": {
                            "0%, 100%": { transform: "translate(0, 0)" },
                            "50%": { transform: "translate(30px, -20px)" },
                        },
                    }}
                />

                <Box
                    sx={{
                        position: "relative",
                        zIndex: 1,
                        maxWidth: 480,
                        animation: "fadeInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s backwards",
                        "@keyframes fadeInRight": {
                            "0%": { opacity: 0, transform: "translateY(20px)" },
                            "100%": { opacity: 1, transform: "translateY(0)" },
                        },
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            letterSpacing: "0.15em",
                            color: "#8B5CF6",
                            mb: 2,
                        }}
                    >
                        SECURE · PRIVATE · INTELLIGENT
                    </Typography>
                    <Typography
                        variant="h3"
                        fontWeight={700}
                        letterSpacing="-0.03em"
                        sx={{
                            color: "white",
                            mb: 2,
                            fontSize: "2.25rem",
                            lineHeight: 1.15,
                            background: "linear-gradient(135deg, #ffffff 0%, #C4B5FD 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        Never lose track of an important document again.
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ color: "rgba(255,255,255,0.7)", mb: 5, fontSize: "1rem", lineHeight: 1.6 }}
                    >
                        Built for expats and travelers managing documents across multiple countries.
                    </Typography>

                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                        {features.map((feature, i) => (
                            <Box
                                key={i}
                                sx={{
                                    p: 2.5,
                                    borderRadius: 2,
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    background: "rgba(255,255,255,0.03)",
                                    backdropFilter: "blur(10px)",
                                    transition: "all 0.25s ease",
                                    cursor: "default",
                                    animation: `featureIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.4 + i * 0.1}s backwards`,
                                    "@keyframes featureIn": {
                                        "0%": { opacity: 0, transform: "translateY(15px)" },
                                        "100%": { opacity: 1, transform: "translateY(0)" },
                                    },
                                    "&:hover": {
                                        borderColor: "rgba(139, 92, 246, 0.4)",
                                        background: "rgba(139, 92, 246, 0.05)",
                                        transform: "translateY(-2px)",
                                        "& .feature-icon-box": {
                                            bgcolor: "rgba(139, 92, 246, 0.25)",
                                            borderColor: "rgba(139, 92, 246, 0.5)",
                                        },
                                    },
                                }}
                            >
                                <Box
                                    className="feature-icon-box"
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 1.5,
                                        bgcolor: "rgba(139, 92, 246, 0.15)",
                                        border: "1px solid rgba(139, 92, 246, 0.25)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        mb: 1.5,
                                        transition: "all 0.25s ease",
                                    }}
                                >
                                    {React.cloneElement(feature.icon, {
                                        sx: { color: "#A78BFA", fontSize: 16 },
                                    })}
                                </Box>
                                <Typography
                                    variant="body2"
                                    fontWeight={600}
                                    sx={{ color: "white", mb: 0.5, fontSize: "0.8125rem" }}
                                >
                                    {feature.title}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: "rgba(255,255,255,0.6)",
                                        fontSize: "0.75rem",
                                        lineHeight: 1.5,
                                        display: "block",
                                    }}
                                >
                                    {feature.description}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                    {/* Bottom mono tag */}
                    <Typography
                        sx={{
                            mt: 5,
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "0.6875rem",
                            color: "rgba(255,255,255,0.35)",
                            letterSpacing: "0.1em",
                            animation: "fadeIn 0.6s ease 1s backwards",
                            "@keyframes fadeIn": {
                                "0%": { opacity: 0 },
                                "100%": { opacity: 1 },
                            },
                        }}
                    >
                        TRUSTED BY DIGITAL NOMADS WORLDWIDE
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}