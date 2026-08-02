import React, { useEffect } from "react";
import { Box, Button, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ShieldIcon from "@mui/icons-material/Shield";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import GitHubIcon from "@mui/icons-material/GitHub";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import BoltIcon from "@mui/icons-material/Bolt";
import LanguageIcon from "@mui/icons-material/Language";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import Logo from "../components/Logo";
import documetOrganizerScreenshot from "../assets/document-organizer-dashboard.png";

// ============ SECTION LABEL ============
const SectionLabel = ({ children, color = "primary.main" }) => (
    <Box
        sx={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.15em",
            color,
            textTransform: "uppercase",
            mb: 2.5,
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            px: 1.75,
            py: 0.6,
            borderRadius: 10,
            bgcolor: color === "primary.main" ? "rgba(139, 92, 246, 0.1)" : "rgba(16, 185, 129, 0.1)",
            border: "1px solid",
            borderColor: color === "primary.main" ? "rgba(139, 92, 246, 0.25)" : "rgba(16, 185, 129, 0.25)",
        }}
    >
        <Box
            sx={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                bgcolor: color,
                boxShadow: "0 0 8px currentColor",
            }}
        />
        {children}
    </Box>
);

// ============ SECTION HEADING ============
const SectionHeading = ({ children }) => (
    <Typography
        variant="h2"
        sx={{
            fontSize: { xs: "2rem", md: "2.75rem" },
            fontWeight: 700,
            letterSpacing: "-0.025em",
            lineHeight: 1.15,
            mb: 2.5,
        }}
    >
        {children}
    </Typography>
);

// ============ SECTION LEAD ============
const SectionLead = ({ children }) => (
    <Typography
        component="div"
        color="text.secondary"
        sx={{
            fontSize: { xs: "1rem", md: "1.125rem" },
            lineHeight: 1.65,
            maxWidth: 640,
        }}
    >
        {children}
    </Typography>
);

// ============ TECH CHOICE CARD ============
const TechChoiceCard = ({ name, role, why, whyPrivacy, color = "#8B5CF6" }) => (
    <Box
        sx={{
            p: { xs: 3, md: 3.5 },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            height: "100%",
            transition: "all 0.25s ease",
            position: "relative",
            overflow: "hidden",
            "&:hover": {
                borderColor: `${color}80`,
                transform: "translateY(-3px)",
                boxShadow: `0 16px 40px -12px ${color}30`,
            },
        }}
    >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <Box
                sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: color,
                    boxShadow: `0 0 12px ${color}`,
                }}
            />
            <Typography
                sx={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    color: "text.disabled",
                    textTransform: "uppercase",
                }}
            >
                {role}
            </Typography>
        </Box>

        <Typography
            variant="h6"
            fontWeight={700}
            sx={{ mb: 2, fontSize: "1.25rem", letterSpacing: "-0.01em" }}
        >
            {name}
        </Typography>

        <Typography
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.65, mb: 2.5, fontSize: "0.875rem" }}
        >
            {why}
        </Typography>

        <Box
            sx={{
                pt: 2,
                borderTop: "1px dashed",
                borderColor: "divider",
                display: "flex",
                gap: 1,
                alignItems: "flex-start",
            }}
        >
            <ShieldIcon sx={{ fontSize: 14, color: "#10B981", mt: 0.25, flexShrink: 0 }} />
            <Typography
                sx={{
                    fontSize: "0.8125rem",
                    color: "text.secondary",
                    lineHeight: 1.55,
                    fontStyle: "italic",
                }}
            >
                {whyPrivacy}
            </Typography>
        </Box>
    </Box>
);

// ============ FEATURE ROW (alternating) ============
const FeatureRow = ({ label, title, description, icon, reverse = false }) => (
    <Box
        sx={{
            display: "grid",
            gap: { xs: 4, md: 8 },
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            alignItems: "center",
            py: { xs: 6, md: 10 },
        }}
    >
        <Box sx={{ order: { xs: 1, md: reverse ? 2 : 1 } }}>
            <SectionLabel>{label}</SectionLabel>
            <Typography
                variant="h3"
                sx={{
                    fontSize: { xs: "1.5rem", md: "2rem" },
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.2,
                    mb: 2,
                }}
            >
                {title}
            </Typography>
            <Typography
                color="text.secondary"
                sx={{ fontSize: "1rem", lineHeight: 1.7 }}
            >
                {description}
            </Typography>
        </Box>
        <Box
            sx={{
                order: { xs: 2, md: reverse ? 1 : 2 },
                aspectRatio: "4/3",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Ambient glow */}
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    background: "radial-gradient(circle at center, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
                    filter: "blur(30px)",
                }}
            />
            <Box
                sx={{
                    position: "relative",
                    width: 100,
                    height: 100,
                    borderRadius: 3,
                    background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 20px 40px -8px rgba(139, 92, 246, 0.5)",
                }}
            >
                {React.cloneElement(icon, { sx: { color: "white", fontSize: 48 } })}
            </Box>
        </Box>
    </Box>
);

// ============ COMPARISON ROW ============
const ComparisonRow = ({ label, traditional, ours }) => (
    <Box
        sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "180px 1fr 1fr" },
            gap: { xs: 1, sm: 3 },
            py: 2.5,
            borderBottom: "1px solid",
            borderColor: "divider",
            "&:last-child": { borderBottom: "none" },
        }}
    >
        <Typography
            sx={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "text.secondary",
                letterSpacing: "0.02em",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
            }}
        >
            {label}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <CloseIcon sx={{ fontSize: 18, color: "#EF4444", flexShrink: 0 }} />
            <Typography sx={{ fontSize: "0.9375rem", color: "text.secondary" }}>
                {traditional}
            </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <CheckIcon sx={{ fontSize: 18, color: "#10B981", flexShrink: 0 }} />
            <Typography sx={{ fontSize: "0.9375rem", color: "text.primary", fontWeight: 500 }}>
                {ours}
            </Typography>
        </Box>
    </Box>
);

// ============ MAIN LANDING ============
export default function Landing() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                if (payload.exp > Math.floor(Date.now() / 1000)) {
                    navigate("/app", { replace: true });
                }
            } catch {
                localStorage.removeItem("accessToken");
            }
        }
    }, [navigate]);

    const handleSignIn = () => navigate("/login");

    return (
        <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
            {/* ============ NAVBAR ============ */}
            <Box
                component="nav"
                sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 100,
                    bgcolor: "rgba(10, 10, 11, 0.75)",
                    backdropFilter: "blur(16px)",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Container maxWidth="lg">
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            py: 2,
                        }}
                    >
                        <Box
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            sx={{ cursor: "pointer" }}
                        >
                            <Logo variant="full" size={32} glow />
                        </Box>
                        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                            <Button
                                onClick={() =>
                                    document
                                        .getElementById("privacy")
                                        ?.scrollIntoView({ behavior: "smooth" })
                                }
                                sx={{
                                    color: "text.secondary",
                                    display: { xs: "none", md: "inline-flex" },
                                    fontSize: "0.875rem",
                                    "&:hover": { color: "text.primary", bgcolor: "transparent" },
                                }}
                            >
                                Privacy
                            </Button>
                            <Button
                                onClick={() =>
                                    document
                                        .getElementById("tech")
                                        ?.scrollIntoView({ behavior: "smooth" })
                                }
                                sx={{
                                    color: "text.secondary",
                                    display: { xs: "none", md: "inline-flex" },
                                    fontSize: "0.875rem",
                                    "&:hover": { color: "text.primary", bgcolor: "transparent" },
                                }}
                            >
                                Tech Stack
                            </Button>
                            <Button
                                component="a"
                                href="https://github.com/zarn-chalamet/document-organizer"
                                target="_blank"
                                startIcon={<GitHubIcon fontSize="small" />}
                                sx={{
                                    color: "text.secondary",
                                    display: { xs: "none", sm: "inline-flex" },
                                    fontSize: "0.875rem",
                                    "&:hover": { color: "text.primary", bgcolor: "transparent" },
                                }}
                            >
                                GitHub
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleSignIn}
                                sx={{
                                    ml: 1,
                                    boxShadow: "0 4px 14px -4px rgba(139, 92, 246, 0.5)",
                                    px: 2.5,
                                }}
                            >
                                Sign In
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* ============ HERO ============ */}
            <Box
                sx={{
                    position: "relative",
                    overflow: "hidden",
                    pt: { xs: 10, md: 16 },
                    pb: { xs: 8, md: 12 },
                }}
            >
                {/* Glow blobs */}
                <Box
                    sx={{
                        position: "absolute",
                        top: "5%",
                        right: "5%",
                        width: 600,
                        height: 600,
                        borderRadius: "50%",
                        background:
                            "radial-gradient(circle, rgba(139, 92, 246, 0.18) 0%, transparent 70%)",
                        filter: "blur(80px)",
                        pointerEvents: "none",
                    }}
                />
                <Box
                    sx={{
                        position: "absolute",
                        bottom: "-10%",
                        left: "-5%",
                        width: 500,
                        height: 500,
                        borderRadius: "50%",
                        background:
                            "radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)",
                        filter: "blur(80px)",
                        pointerEvents: "none",
                    }}
                />
                {/* Grid overlay */}
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage:
                            "linear-gradient(rgba(139, 92, 246, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.04) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                        maskImage:
                            "radial-gradient(ellipse at center, black 30%, transparent 80%)",
                        pointerEvents: "none",
                    }}
                />

                <Container maxWidth="lg" sx={{ position: "relative" }}>
                    <Box sx={{ textAlign: "center", maxWidth: 880, mx: "auto" }}>
                        <SectionLabel color="#10B981">Privacy-first · PDPA compliant</SectionLabel>

                        <Typography
                            variant="h1"
                            sx={{
                                fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.75rem" },
                                fontWeight: 800,
                                letterSpacing: "-0.035em",
                                lineHeight: 1.02,
                                mb: 3,
                                background:
                                    "linear-gradient(135deg, #ffffff 0%, #C4B5FD 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            Your documents.
                            <br />
                            Your control.
                            <br />
                            <Box
                                component="span"
                                sx={{
                                    background:
                                        "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                }}
                            >
                                Always.
                            </Box>
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{
                                fontSize: { xs: "1.0625rem", md: "1.25rem" },
                                lineHeight: 1.55,
                                maxWidth: 660,
                                mx: "auto",
                                mb: 5,
                            }}
                        >
                            The document organizer that treats your privacy as a foundational
                            principle — not a marketing checkbox. Files stay in{" "}
                            <Box component="span" sx={{ color: "text.primary", fontWeight: 600 }}>
                                your own Google Drive
                            </Box>
                            . We built it that way on purpose.
                        </Typography>

                        <Box
                            sx={{
                                display: "flex",
                                gap: 2,
                                justifyContent: "center",
                                flexDirection: { xs: "column", sm: "row" },
                                mb: 6,
                            }}
                        >
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<GoogleIcon />}
                                endIcon={<ArrowForwardIcon />}
                                onClick={handleSignIn}
                                sx={{
                                    py: 1.75,
                                    px: 4,
                                    fontSize: "1rem",
                                    fontWeight: 600,
                                    boxShadow: "0 8px 24px -6px rgba(139, 92, 246, 0.5)",
                                    "&:hover": {
                                        boxShadow: "0 12px 32px -6px rgba(139, 92, 246, 0.7)",
                                        transform: "translateY(-1px)",
                                    },
                                }}
                            >
                                Get Started Free
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={() =>
                                    document
                                        .getElementById("privacy")
                                        ?.scrollIntoView({ behavior: "smooth" })
                                }
                                sx={{
                                    py: 1.75,
                                    px: 4,
                                    fontSize: "1rem",
                                    fontWeight: 600,
                                    borderColor: "divider",
                                    color: "text.primary",
                                    "&:hover": {
                                        borderColor: "primary.main",
                                        bgcolor: "rgba(139, 92, 246, 0.06)",
                                    },
                                }}
                            >
                                Read Our Approach
                            </Button>
                        </Box>

                        {/* Trust indicators */}
                        <Box
                            sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: { xs: 2, sm: 4 },
                                flexWrap: "wrap",
                                justifyContent: "center",
                                px: 3,
                                py: 1.75,
                                borderRadius: 10,
                                bgcolor: "background.paper",
                                border: "1px solid",
                                borderColor: "divider",
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: "0.75rem",
                                color: "text.secondary",
                                letterSpacing: "0.05em",
                            }}
                        >
                            {[
                                "OPEN SOURCE",
                                "FREE FOREVER",
                                "NO TRACKING",
                                "YOUR DATA · YOUR DRIVE",
                            ].map((item, i) => (
                                <React.Fragment key={i}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                                        <CheckIcon sx={{ fontSize: 14, color: "#10B981" }} />
                                        {item}
                                    </Box>
                                    {i < 3 && (
                                        <Box
                                            sx={{
                                                width: 3,
                                                height: 3,
                                                borderRadius: "50%",
                                                bgcolor: "text.disabled",
                                                display: { xs: "none", sm: "block" },
                                            }}
                                        />
                                    )}
                                </React.Fragment>
                            ))}
                        </Box>
                    </Box>

                    {/* Product Screenshot */}
                    <Box
                        sx={{
                            mt: { xs: 8, md: 12 },
                            position: "relative",
                            maxWidth: 1100,
                            mx: "auto",
                        }}
                    >
                        <Box
                            sx={{
                                position: "absolute",
                                inset: -30,
                                background:
                                    "radial-gradient(ellipse at center, rgba(139, 92, 246, 0.35) 0%, transparent 60%)",
                                filter: "blur(50px)",
                                zIndex: 0,
                            }}
                        />
                        <Box
                            component="img"
                            src={documetOrganizerScreenshot}
                            alt="Document Organizer Dashboard"
                            sx={{
                                position: "relative",
                                width: "100%",
                                height: "auto",
                                borderRadius: 3,
                                border: "1px solid",
                                borderColor: "rgba(139, 92, 246, 0.35)",
                                boxShadow: "0 30px 80px -20px rgba(0,0,0,0.6)",
                                display: "block",
                            }}
                        />
                    </Box>
                </Container>
            </Box>

            {/* ============ THE PROBLEM (Editorial Statement) ============ */}
            <Box
                sx={{
                    py: { xs: 10, md: 16 },
                    borderTop: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ maxWidth: 780 }}>
                        <SectionLabel>The Problem With Existing Apps</SectionLabel>
                        <Typography
                            variant="h2"
                            sx={{
                                fontSize: { xs: "2rem", md: "3rem" },
                                fontWeight: 700,
                                letterSpacing: "-0.025em",
                                lineHeight: 1.15,
                                mb: 4,
                            }}
                        >
                            Most document apps ask you to trust them with your{" "}
                            <Box
                                component="span"
                                sx={{
                                    background:
                                        "linear-gradient(135deg, #EF4444 0%, #F87171 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                }}
                            >
                                passports, visas, and IDs
                            </Box>
                            . Then they store them on their servers.
                        </Typography>
                        <Typography
                            color="text.secondary"
                            sx={{ fontSize: "1.125rem", lineHeight: 1.75, mb: 3 }}
                        >
                            This creates a honeypot. When they get breached (and they do), your
                            most sensitive identity documents leak with them. Even if they don't
                            get hacked — they can read your files, analyze your data, and if
                            they shut down, you might lose access forever.
                        </Typography>
                        <Typography
                            color="text.secondary"
                            sx={{ fontSize: "1.125rem", lineHeight: 1.75 }}
                        >
                            We refused to build another app like that. So we designed one where{" "}
                            <Box component="span" sx={{ color: "text.primary", fontWeight: 600 }}>
                                we technically cannot see your files
                            </Box>{" "}
                            — even if we wanted to.
                        </Typography>
                    </Box>
                </Container>
            </Box>

            {/* ============ COMPARISON TABLE ============ */}
            <Box
                sx={{
                    py: { xs: 8, md: 12 },
                    bgcolor: "background.paper",
                    borderTop: "1px solid",
                    borderColor: "divider",
                    borderBottom: "1px solid",
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ mb: 6, maxWidth: 700 }}>
                        <SectionLabel>How We're Different</SectionLabel>
                        <SectionHeading>A different architecture, on purpose.</SectionHeading>
                        <SectionLead>
                            Every decision below was made to keep you in control. Not because
                            of a policy — because of how the system is built.
                        </SectionLead>
                    </Box>

                    <Box
                        sx={{
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 3,
                            overflow: "hidden",
                            bgcolor: "background.default",
                        }}
                    >
                        {/* Header row */}
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: "1fr", sm: "180px 1fr 1fr" },
                                gap: { xs: 1, sm: 3 },
                                py: 2,
                                px: 3,
                                bgcolor: "background.paper",
                                borderBottom: "1px solid",
                                borderColor: "divider",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: "0.6875rem",
                                    fontWeight: 700,
                                    letterSpacing: "0.1em",
                                    color: "text.disabled",
                                    textTransform: "uppercase",
                                }}
                            >
                                Aspect
                            </Typography>
                            <Typography
                                sx={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: "0.6875rem",
                                    fontWeight: 700,
                                    letterSpacing: "0.1em",
                                    color: "#EF4444",
                                    textTransform: "uppercase",
                                }}
                            >
                                Traditional Apps
                            </Typography>
                            <Typography
                                sx={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: "0.6875rem",
                                    fontWeight: 700,
                                    letterSpacing: "0.1em",
                                    color: "#10B981",
                                    textTransform: "uppercase",
                                }}
                            >
                                Our Approach
                            </Typography>
                        </Box>

                        <Box sx={{ px: 3 }}>
                            <ComparisonRow
                                label="File Storage"
                                traditional="Stored on their servers"
                                ours="Stays in your Google Drive"
                            />
                            <ComparisonRow
                                label="Data Ownership"
                                traditional="They control access"
                                ours="You control access via Google"
                            />
                            <ComparisonRow
                                label="If Service Shuts Down"
                                traditional="Files potentially lost"
                                ours="Files remain safely in your Drive"
                            />
                            <ComparisonRow
                                label="Data Breach Risk"
                                traditional="Central honeypot for hackers"
                                ours="No centralized files to breach"
                            />
                            <ComparisonRow
                                label="AI Data Sharing"
                                traditional="Sends full files to AI providers"
                                ours="Only sends small text snippets"
                            />
                            <ComparisonRow
                                label="Delete Account"
                                traditional="'Deleted' but often archived"
                                ours="Cascade delete — truly gone"
                            />
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* ============ PRIVACY DEEP DIVE ============ */}
            <Box
                id="privacy"
                sx={{
                    py: { xs: 10, md: 16 },
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "20%",
                        right: "-10%",
                        width: 500,
                        height: 500,
                        borderRadius: "50%",
                        background:
                            "radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)",
                        filter: "blur(80px)",
                        pointerEvents: "none",
                    }}
                />

                <Container maxWidth="lg" sx={{ position: "relative" }}>
                    <Box sx={{ mb: 8, maxWidth: 720 }}>
                        <SectionLabel color="#10B981">Privacy Architecture</SectionLabel>
                        <SectionHeading>
                            Four principles we don't compromise on.
                        </SectionHeading>
                        <SectionLead>
                            PDPA compliance isn't a badge we bought — it's baked into every
                            technical decision. Here's exactly what that means.
                        </SectionLead>
                    </Box>

                    <Box
                        sx={{
                            display: "grid",
                            gap: 3,
                            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                        }}
                    >
                        {[
                            {
                                icon: <CloudOffIcon />,
                                title: "Files never touch our servers",
                                description:
                                    "When you upload a document, it streams directly through our backend into your Google Drive. Not saved. Not cached. Not backed up. The file exists in your Drive and nowhere else.",
                            },
                            {
                                icon: <VisibilityOffIcon />,
                                title: "AI sees only what it needs",
                                description:
                                    "OCR runs transiently on Google Vision (same company as your Drive). For chat, we send only small text snippets to Groq — never entire files, never your name, never any identifier.",
                            },
                            {
                                icon: <LockIcon />,
                                title: "Local-first embeddings",
                                description:
                                    "The vectors that power semantic search are generated locally on our server using sentence-transformers. Your document meaning never leaves our infrastructure for third-party analysis.",
                            },
                            {
                                icon: <ShieldIcon />,
                                title: "Cascade delete, no traces",
                                description:
                                    "Delete a document and it's removed from your Drive AND from our database AND from vector indexes. Delete your account and everything is gone. No hidden archives.",
                            },
                        ].map((item, i) => (
                            <Box
                                key={i}
                                sx={{
                                    p: { xs: 3, md: 4 },
                                    borderRadius: 3,
                                    border: "1px solid",
                                    borderColor: "divider",
                                    bgcolor: "background.paper",
                                    transition: "all 0.25s ease",
                                    "&:hover": {
                                        borderColor: "rgba(16, 185, 129, 0.35)",
                                        transform: "translateY(-3px)",
                                        boxShadow: "0 16px 40px -12px rgba(16, 185, 129, 0.15)",
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 2,
                                        background:
                                            "linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(16, 185, 129, 0.1))",
                                        border: "1px solid rgba(16, 185, 129, 0.35)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        mb: 2.5,
                                    }}
                                >
                                    {React.cloneElement(item.icon, {
                                        sx: { color: "#10B981", fontSize: 22 },
                                    })}
                                </Box>
                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                    sx={{ mb: 1.25, fontSize: "1.125rem", letterSpacing: "-0.01em" }}
                                >
                                    {item.title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ lineHeight: 1.7, fontSize: "0.9375rem" }}
                                >
                                    {item.description}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Container>
            </Box>

            {/* ============ TECH STACK — DETAILED ============ */}
            <Box
                id="tech"
                sx={{
                    py: { xs: 10, md: 16 },
                    bgcolor: "background.paper",
                    borderTop: "1px solid",
                    borderColor: "divider",
                    borderBottom: "1px solid",
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ mb: 8, maxWidth: 720 }}>
                        <SectionLabel>The Tech, And Why</SectionLabel>
                        <SectionHeading>Every tool chosen for a reason.</SectionHeading>
                        <SectionLead>
                            We didn't pick the trendiest AI services. We picked the ones that
                            align with our privacy mission. Here's the honest breakdown.
                        </SectionLead>
                    </Box>

                    <Box
                        sx={{
                            display: "grid",
                            gap: 3,
                            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                        }}
                    >
                        <TechChoiceCard
                            role="OCR Engine"
                            name="Google Cloud Vision"
                            color="#4285F4"
                            why="Production-grade text extraction that handles stamped passports, handwritten forms, and multilingual documents (English + Thai). Free tier covers 1,000 requests per month."
                            whyPrivacy="Same trust boundary as Google Drive. Google's data policy explicitly states Vision does not store the images we send — processing is transient."
                        />

                        <TechChoiceCard
                            role="Language Model"
                            name="Groq · Llama 3.1"
                            color="#F55036"
                            why="Fast, capable open-source model running on Groq's inference infrastructure. Handles both metadata extraction from messy OCR and friendly conversational responses in the chat assistant."
                            whyPrivacy="We send only extracted text snippets — never raw files, never your identifiers. Groq doesn't retain conversation data. Open model = no lock-in."
                        />

                        <TechChoiceCard
                            role="Embeddings"
                            name="sentence-transformers"
                            color="#10B981"
                            why="Open-source model (all-MiniLM-L6-v2, 384 dimensions) that generates semantic vectors for search. Small, fast, and battle-tested."
                            whyPrivacy="Runs entirely on our own server. Your document meaning never leaves our infrastructure for third-party analysis or training."
                        />

                        <TechChoiceCard
                            role="File Storage"
                            name="Google Drive API"
                            color="#0F9D58"
                            why="Users already trust Google with their Drive files. We stream uploads through our backend directly into a folder in the user's own Drive."
                            whyPrivacy="This is the whole point. Files never touch our infrastructure — they exist in your Drive under your Google account, with your permissions."
                        />

                        <TechChoiceCard
                            role="Vector Search"
                            name="PostgreSQL + pgvector"
                            color="#336791"
                            why="Rock-solid database with a pgvector extension for cosine similarity search. Powers the semantic search that finds relevant document chunks for the AI chat."
                            whyPrivacy="Self-hosted. Every search query is scoped to your user_id — technically impossible for one user to see another user's document chunks."
                        />

                        <TechChoiceCard
                            role="Backend Framework"
                            name="Spring Boot + FastAPI"
                            color="#8B5CF6"
                            why="Spring Boot 3.5 handles auth, business logic, and the Drive integration. Python FastAPI runs as a sidecar for AI workloads — the right tool for each job."
                            whyPrivacy="Clean separation of concerns. The Python AI sidecar can be swapped, updated, or run locally without touching your core data flow."
                        />
                    </Box>
                </Container>
            </Box>

            {/* ============ FEATURES — ALTERNATING ROWS ============ */}
            <Box sx={{ py: { xs: 4, md: 8 } }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 }, mt: { xs: 4, md: 6 } }}>
                        <SectionLabel>What You Can Do</SectionLabel>
                        <SectionHeading>Features you'll actually use.</SectionHeading>
                    </Box>

                    <FeatureRow
                        label="Smart Extraction"
                        icon={<AutoAwesomeIcon />}
                        title="AI reads your documents so you don't have to."
                        description="Upload a passport photo, a visa PDF, a work permit — even with stamps, handwriting, or awkward lighting. Google Vision extracts the text, then Groq's Llama model intelligently pulls out expiry dates and document types. All you do is confirm."
                    />

                    <FeatureRow
                        reverse
                        label="Conversational AI"
                        icon={<SmartToyIcon />}
                        title="Chat with your documents in plain language."
                        description="'When does my passport expire?' 'What visas do I have?' 'Anything expiring next month?' The assistant uses RAG to find relevant document chunks and gives warm, human answers with natural date formatting."
                    />

                    <FeatureRow
                        label="Expiry Tracking"
                        icon={<NotificationsActiveIcon />}
                        title="Never scramble at the last minute again."
                        description="Automated email reminders at 30, 14, 7, 3, and 1 days before expiry. Renew your visa on time, not on panic. The dashboard shows what's expiring at a glance."
                    />

                    <FeatureRow
                        reverse
                        label="Semantic Search"
                        icon={<BoltIcon />}
                        title="Find documents by meaning, not just keywords."
                        description="Search 'work document from thailand' and find your work permit even if that exact phrase isn't in the file. Powered by local vector embeddings and pgvector cosine similarity."
                    />
                </Container>
            </Box>

            {/* ============ FINAL CTA ============ */}
            <Box
                sx={{
                    py: { xs: 12, md: 16 },
                    position: "relative",
                    overflow: "hidden",
                    borderTop: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 800,
                        height: 500,
                        borderRadius: "50%",
                        background:
                            "radial-gradient(ellipse, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
                        filter: "blur(80px)",
                        pointerEvents: "none",
                    }}
                />
                <Container maxWidth="sm" sx={{ position: "relative", textAlign: "center" }}>
                    <Typography
                        variant="h2"
                        sx={{
                            fontSize: { xs: "2.25rem", md: "3.5rem" },
                            fontWeight: 800,
                            letterSpacing: "-0.03em",
                            lineHeight: 1.1,
                            mb: 3,
                            background:
                                "linear-gradient(135deg, #ffffff 0%, #C4B5FD 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        Take back control of your documents.
                    </Typography>
                    <Typography
                        color="text.secondary"
                        sx={{ fontSize: "1.125rem", mb: 4, lineHeight: 1.6 }}
                    >
                        Sign in with Google. No credit card. No dark patterns. Just a tool
                        that works, built the way it should be.
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<GoogleIcon />}
                        endIcon={<ArrowForwardIcon />}
                        onClick={handleSignIn}
                        sx={{
                            py: 1.85,
                            px: 5,
                            fontSize: "1rem",
                            fontWeight: 600,
                            boxShadow: "0 8px 24px -6px rgba(139, 92, 246, 0.5)",
                            "&:hover": {
                                boxShadow: "0 12px 32px -6px rgba(139, 92, 246, 0.7)",
                                transform: "translateY(-1px)",
                            },
                        }}
                    >
                        Sign In With Google
                    </Button>
                    <Typography
                        sx={{
                            mt: 3.5,
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "0.75rem",
                            color: "text.disabled",
                            letterSpacing: "0.08em",
                        }}
                    >
                        FILES STAY IN YOUR DRIVE · CANCEL ANYTIME · MIT LICENSED
                    </Typography>
                </Container>
            </Box>

            {/* ============ FOOTER ============ */}
            <Box
                component="footer"
                sx={{
                    py: 5,
                    borderTop: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                }}
            >
                <Container maxWidth="lg">
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: { xs: "flex-start", sm: "center" },
                            justifyContent: "space-between",
                            flexDirection: { xs: "column", sm: "row" },
                            gap: 3,
                        }}
                    >
                        <Box>
                            <Logo variant="full" size={26} glow />
                            <Typography
                                sx={{
                                    mt: 1.5,
                                    color: "text.disabled",
                                    fontSize: "0.8125rem",
                                    maxWidth: 320,
                                }}
                            >
                                Privacy-first document management for global citizens.
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                gap: 3,
                                alignItems: "center",
                                flexWrap: "wrap",
                            }}
                        >
                            <Button
                                component="a"
                                href="https://github.com/zarn-chalamet/document-organizer"
                                target="_blank"
                                size="small"
                                startIcon={<GitHubIcon fontSize="small" />}
                                endIcon={<ArrowOutwardIcon sx={{ fontSize: 14 }} />}
                                sx={{
                                    color: "text.secondary",
                                    fontSize: "0.875rem",
                                    "&:hover": { color: "text.primary", bgcolor: "transparent" },
                                }}
                            >
                                Source Code
                            </Button>
                            <Typography
                                sx={{
                                    color: "text.disabled",
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: "0.75rem",
                                    letterSpacing: "0.05em",
                                }}
                            >
                                © {new Date().getFullYear()} · MIT LICENSE
                            </Typography>
                        </Box>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}