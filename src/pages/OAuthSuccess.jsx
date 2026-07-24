import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function OAuthSuccess() {
    const navigate = useNavigate();
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const token = params.get("token");
        const email = params.get("email");

        if (token) {
            localStorage.setItem("accessToken", token);
            localStorage.setItem("email", email);
            navigate("/", { replace: true });
        } else if (window.location.pathname === "/oauth-success") {
            navigate("/login", { replace: true });
        }
    }, [navigate]);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                bgcolor: "background.default",
            }}
        >
            <CircularProgress size={32} sx={{ color: "primary.main" }} />
            <Typography variant="body2" color="text.secondary">
                Signing you in...
            </Typography>
        </Box>
    );
}