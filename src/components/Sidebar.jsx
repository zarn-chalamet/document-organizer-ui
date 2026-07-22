import React from "react";
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FolderIcon from "@mui/icons-material/Folder";
import SmartToyIcon from "@mui/icons-material/SmartToy";

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
                    <ListItemIcon>
                        <FolderIcon />
                    </ListItemIcon>
                    <ListItemText primary="My Categories" />
                </ListItemButton>
                <Divider />
                <ListItemButton onClick={() => handleNavigate("/chat")}>
                    <ListItemIcon>
                        <SmartToyIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="AI Assistant" />
                </ListItemButton>
            </List>
        </Drawer>
    );
}