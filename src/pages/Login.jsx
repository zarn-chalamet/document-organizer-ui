import React from "react";
import { Box, Button, Typography, Container } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import FolderIcon from "@mui/icons-material/Folder";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ShieldIcon from "@mui/icons-material/Shield";
import BoltIcon from "@mui/icons-material/Bolt";

export default function Login() {
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
            {/* Left */}
            <Box
                sx={{
                    flex: { xs: 1, md: "0 0 45%" },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 4,
                }}
            >
                <Container maxWidth="xs">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 6 }}>
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 2.5,
                                background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 0 30px rgba(139, 92, 246, 0.4)",
                            }}
                        >
                            <Typography
                                sx={{
                                    color: "white",
                                    fontSize: "1.125rem",
                                    fontWeight: 700,
                                    fontFamily: "'JetBrains Mono', monospace",
                                }}
                            >
                                D
                            </Typography>
                        </Box>
                        <Typography variant="h6" fontWeight={700}>
                            Organizer
                        </Typography>
                    </Box>

                    <Typography variant="h3" fontWeight={700} letterSpacing="-0.03em" gutterBottom>
                        Welcome back
                    </Typography>
                    <Typography variant="body1" color="text.secondary" mb={4}>
                        Sign in to manage your documents securely.
                    </Typography>

                    <Button
                        variant="contained"
                        startIcon={<GoogleIcon />}
                        fullWidth
                        size="large"
                        onClick={handleLogin}
                        sx={{ py: 1.5, fontSize: "0.9375rem", fontWeight: 500 }}
                    >
                        Continue with Google
                    </Button>

                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mt: 3, textAlign: "center" }}
                    >
                        By continuing, you agree to our Terms and Privacy Policy.
                    </Typography>
                </Container>
            </Box>

            {/* Right */}
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
                    }}
                />
                {/* Glow orbs */}
                <Box
                    sx={{
                        position: "absolute",
                        top: "10%",
                        right: "10%",
                        width: 300,
                        height: 300,
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
                        filter: "blur(40px)",
                    }}
                />
                <Box
                    sx={{
                        position: "absolute",
                        bottom: "10%",
                        left: "5%",
                        width: 250,
                        height: 250,
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%)",
                        filter: "blur(40px)",
                    }}
                />

                <Box sx={{ position: "relative", zIndex: 1, maxWidth: 480 }}>
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
                        sx={{ color: "white", mb: 2, fontSize: "2.25rem", lineHeight: 1.15 }}
                    >
                        Never lose track of an important document again.
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ color: "rgba(255,255,255,0.7)", mb: 5, fontSize: "1rem" }}
                    >
                        Built for expats and travelers managing documents across multiple countries.
                    </Typography>

                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2.5 }}>
                        {features.map((feature, i) => (
                            <Box
                                key={i}
                                sx={{
                                    p: 2.5,
                                    borderRadius: 2,
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    background: "rgba(255,255,255,0.03)",
                                    backdropFilter: "blur(10px)",
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 1.5,
                                        bgcolor: "rgba(139, 92, 246, 0.15)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        mb: 1.5,
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
                                    sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem" }}
                                >
                                    {feature.description}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}