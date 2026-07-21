import React from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Button,
    Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ onMenuClick }) {
    const navigate = useNavigate();
    const location = useLocation();

    const isLoggedIn = !!localStorage.getItem("accessToken");
    const email = localStorage.getItem("email");

    // Hide navbar on login and oauth-success pages
    if (location.pathname === "/login" || location.pathname === "/oauth-success") {
        return null;
    }

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("email");
        navigate("/login");
    };

    return (
        <AppBar position="fixed">
            <Toolbar>
                {isLoggedIn && (
                    <IconButton color="inherit" edge="start" onClick={onMenuClick}>
                        <MenuIcon />
                    </IconButton>
                )}

                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Document Organizer
                </Typography>

                {isLoggedIn ? (
                    <Box display="flex" alignItems="center" gap={2}>
                        <Typography variant="body2">{email}</Typography>
                        <Button color="inherit" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Box>
                ) : (
                    <Button color="inherit" onClick={() => navigate("/login")}>
                        Login
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
}