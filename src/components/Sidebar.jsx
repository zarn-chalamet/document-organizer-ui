import React from "react";
import { Drawer, List, ListItemButton, ListItemText, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ open, onClose }) {
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
        onClose();
    };

    return (
        <Drawer open={open} onClose={onClose}>
            <List sx={{ width: 250 }}>
                <ListItemButton onClick={() => handleNavigate("/")}>
                    <ListItemText primary="My Categories" />
                </ListItemButton>
                <Divider />
            </List>
        </Drawer>
    );
}