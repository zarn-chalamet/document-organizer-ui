import React, { useState } from "react";
import {
    Box, Typography, Avatar, Menu, MenuItem, Divider, ListItemIcon
} from "@mui/material";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useNavigate } from "react-router-dom";
import TermsPrivacyModal from "./TermsPrivacyModal";
import DeleteAccountModal from "./DeleteAccountModal";

/**
 * AccountMenu — user avatar dropdown in the sidebar.
 * Contains: Privacy Policy, Logout, Delete Account.
 */
export default function AccountMenu({ collapsed = false }) {
    const [anchor, setAnchor] = useState(null);
    const [privacyOpen, setPrivacyOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const navigate = useNavigate();

    const email = localStorage.getItem("email");
    const displayName = email?.split("@")[0] || "User";

    const openMenu = (e) => setAnchor(e.currentTarget);
    const closeMenu = () => setAnchor(null);

    const handlePrivacy = () => {
        closeMenu();
        setPrivacyOpen(true);
    };

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("email");
        navigate("/login");
    };

    const handleDelete = () => {
        closeMenu();
        setDeleteOpen(true);
    };

    // ============ TRIGGER (avatar row) ============
    const Trigger = (
        <Box
            onClick={openMenu}
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: collapsed ? 0 : 1,
                py: 1,
                borderRadius: 2,
                cursor: "pointer",
                transition: "background-color 0.15s",
                justifyContent: collapsed ? "center" : "flex-start",
                "&:hover": {
                    bgcolor: "action.hover",
                },
            }}
        >
            <Avatar
                sx={{
                    width: 32,
                    height: 32,
                    background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    flexShrink: 0,
                }}
            >
                {email?.[0]?.toUpperCase() || "U"}
            </Avatar>
            {!collapsed && (
                <Box sx={{ overflow: "hidden", flex: 1, minWidth: 0 }}>
                    <Typography
                        variant="body2"
                        fontWeight={500}
                        noWrap
                        sx={{ fontSize: "0.8125rem" }}
                    >
                        {displayName}
                    </Typography>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                        sx={{ fontSize: "0.6875rem", display: "block" }}
                    >
                        {email}
                    </Typography>
                </Box>
            )}
        </Box>
    );

    return (
        <>
            {Trigger}

            <Menu
                anchorEl={anchor}
                open={Boolean(anchor)}
                onClose={closeMenu}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "bottom", horizontal: "left" }}
                slotProps={{
                    paper: {
                        sx: {
                            minWidth: 240,
                            mb: 1,
                            border: "1px solid",
                            borderColor: "divider",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                        },
                    },
                }}
            >
                {/* Header: user info */}
                <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
                    <Typography variant="body2" fontWeight={600} noWrap sx={{ fontSize: "0.8125rem" }}>
                        {displayName}
                    </Typography>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                        sx={{ fontSize: "0.75rem", display: "block" }}
                    >
                        {email}
                    </Typography>
                </Box>

                {/* Privacy Policy */}
                <MenuItem onClick={handlePrivacy} sx={{ fontSize: "0.875rem", py: 1, mt: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: "32px !important" }}>
                        <ShieldOutlinedIcon fontSize="small" />
                    </ListItemIcon>
                    Privacy Policy
                </MenuItem>

                {/* Logout */}
                <MenuItem onClick={handleLogout} sx={{ fontSize: "0.875rem", py: 1 }}>
                    <ListItemIcon sx={{ minWidth: "32px !important" }}>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>

                <Divider sx={{ my: 0.5 }} />

                {/* Danger: Delete Account */}
                <MenuItem
                    onClick={handleDelete}
                    sx={{
                        fontSize: "0.875rem",
                        py: 1,
                        color: "error.main",
                        "&:hover": {
                            bgcolor: (theme) =>
                                theme.palette.mode === "dark"
                                    ? "rgba(239, 68, 68, 0.1)"
                                    : "#FEE2E2",
                        },
                    }}
                >
                    <ListItemIcon sx={{ minWidth: "32px !important", color: "inherit" }}>
                        <DeleteForeverIcon fontSize="small" />
                    </ListItemIcon>
                    Delete Account
                </MenuItem>
            </Menu>

            {/* Modals */}
            <TermsPrivacyModal
                open={privacyOpen}
                onClose={() => setPrivacyOpen(false)}
                initialTab={1}
            />
            <DeleteAccountModal
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
            />
        </>
    );
}