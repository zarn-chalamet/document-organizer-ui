import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function OAuthSuccess() {
    const navigate = useNavigate();
    const hasRun = useRef(false);

    useEffect(() => {
        // Prevent double execution (React StrictMode fires effects twice in dev)
        if (hasRun.current) return;
        hasRun.current = true;

        console.log("=== OAuthSuccess page loaded ===");
        console.log("Full URL:", window.location.href);
        console.log("Hash:", window.location.hash);

        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);

        const token = params.get("token");
        const email = params.get("email");

        if (token) {
            localStorage.setItem("accessToken", token);
            localStorage.setItem("email", email);
            console.log("Token saved. Redirecting to /");
            // Use replace to remove /oauth-success from history
            navigate("/", { replace: true });
        } else {
            // Only redirect to login if we're actually on oauth-success page
            if (window.location.pathname === "/oauth-success") {
                console.log("No token found. Redirecting to /login");
                navigate("/login", { replace: true });
            }
        }
    }, [navigate]);

    return (
        <div style={{ padding: "40px", textAlign: "center" }}>
            <h2>Logging you in...</h2>
        </div>
    );
}

export default OAuthSuccess;