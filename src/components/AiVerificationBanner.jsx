import React, { useState } from "react";
import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckIcon from "@mui/icons-material/Check";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { toast } from "sonner";
import api from "../api/axios";

export default function AiVerificationBanner({ document, onVerified, onEdit }) {
    const [confirming, setConfirming] = useState(false);

    const handleConfirm = async () => {
        setConfirming(true);
        try {
            await api.patch(`/documents/${document.id}/verify`);
            toast.success("Date confirmed");
            onVerified();
        } catch (err) {
            console.error(err);
            toast.error("Failed to confirm date");
        } finally {
            setConfirming(false);
        }
    };

    const formattedDate = document.expiryDate
        ? new Date(document.expiryDate).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
          })
        : null;

    return (
        <Card
            sx={{
                mb: 3,
                position: "relative",
                overflow: "hidden",
                border: "1px solid",
                borderColor: "rgba(139, 92, 246, 0.35)",
                background: "linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(124, 58, 237, 0.03) 100%)",
                animation: "slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                "@keyframes slideDown": {
                    "0%": { opacity: 0, transform: "translateY(-8px)" },
                    "100%": { opacity: 1, transform: "translateY(0)" },
                },
            }}
        >
            {/* Ambient glow blob */}
            <Box
                sx={{
                    position: "absolute",
                    top: -60,
                    right: -60,
                    width: 200,
                    height: 200,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 70%)",
                    filter: "blur(30px)",
                    pointerEvents: "none",
                }}
            />

            <CardContent sx={{ p: { xs: 2.5, sm: 3 }, position: "relative", "&:last-child": { pb: { xs: 2.5, sm: 3 } } }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: { xs: "flex-start", md: "center" },
                        gap: { xs: 2, md: 2.5 },
                        flexDirection: { xs: "column", md: "row" },
                    }}
                >
                    {/* Icon */}
                    <Box
                        sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 2,
                            background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            boxShadow: "0 8px 20px -6px rgba(139, 92, 246, 0.5)",
                        }}
                    >
                        <AutoAwesomeIcon sx={{ color: "#fff", fontSize: 22 }} />
                    </Box>

                    {/* Text content */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            sx={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: "0.6875rem",
                                fontWeight: 700,
                                letterSpacing: "0.1em",
                                color: "primary.main",
                                textTransform: "uppercase",
                                mb: 0.75,
                            }}
                        >
                            AI Extracted · Please Verify
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{ color: "text.primary", mb: 0.5, lineHeight: 1.55 }}
                        >
                            We detected the expiry date as{" "}
                            <Box
                                component="span"
                                sx={{
                                    fontWeight: 700,
                                    color: "primary.main",
                                    fontFamily: "'JetBrains Mono', monospace",
                                }}
                            >
                                {formattedDate}
                            </Box>
                        </Typography>

                        <Typography
                            variant="caption"
                            sx={{ color: "text.secondary", fontSize: "0.75rem", lineHeight: 1.5 }}
                        >
                            AI can make mistakes with stamps and decorative text. Please confirm or edit.
                        </Typography>
                    </Box>

                    {/* Actions */}
                    <Box
                        sx={{
                            display: "flex",
                            gap: 1,
                            flexShrink: 0,
                            width: { xs: "100%", md: "auto" },
                        }}
                    >
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<EditOutlinedIcon />}
                            onClick={onEdit}
                            disabled={confirming}
                            sx={{
                                flex: { xs: 1, md: "0 0 auto" },
                                borderColor: "rgba(139, 92, 246, 0.35)",
                                color: "text.primary",
                                "&:hover": {
                                    borderColor: "primary.main",
                                    bgcolor: "rgba(139, 92, 246, 0.08)",
                                },
                            }}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<CheckIcon />}
                            onClick={handleConfirm}
                            disabled={confirming}
                            sx={{
                                flex: { xs: 1, md: "0 0 auto" },
                                boxShadow: "0 4px 14px -4px rgba(139, 92, 246, 0.5)",
                            }}
                        >
                            {confirming ? "Confirming..." : "Confirm"}
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}