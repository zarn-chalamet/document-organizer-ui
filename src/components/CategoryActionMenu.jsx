import React, { useState } from "react";
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Divider, Tooltip } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/EditOutlined";
import DownloadIcon from "@mui/icons-material/FileDownloadOutlined";
import LinkIcon from "@mui/icons-material/InsertLinkOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { toast } from "sonner";

/**
 * CategoryActionMenu — dropdown menu for category-level actions.
 * Used in the CategoryDetail page header.
 */
export default function CategoryActionMenu({
    category,
    onRename,
    onDownloadZip,
    onDelete,
    disabled = false,
}) {
    const [anchor, setAnchor] = useState(null);

    const copyDriveLink = () => {
        if (!category?.driveFolderId) {
            toast.error("No Drive folder linked");
            return;
        }
        const url = `https://drive.google.com/drive/folders/${category.driveFolderId}`;
        navigator.clipboard.writeText(url);
        toast.success("Drive link copied to clipboard");
        setAnchor(null);
    };

    return (
        <>
            <Tooltip title="More options">
                <IconButton
                    onClick={(e) => setAnchor(e.currentTarget)}
                    disabled={disabled}
                    size="small"
                    sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 1.5,
                        color: "text.secondary",
                        transition: "all 0.15s ease",
                        "&:hover": {
                            bgcolor: "action.hover",
                            color: "primary.main",
                        },
                    }}
                >
                    <MoreVertIcon sx={{ fontSize: 18 }} />
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={anchor}
                open={Boolean(anchor)}
                onClose={() => setAnchor(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                slotProps={{
                    paper: {
                        sx: {
                            mt: 0.5,
                            minWidth: 220,
                            border: "1px solid",
                            borderColor: "divider",
                        },
                    },
                }}
            >
                <MenuItem onClick={() => { onRename(); setAnchor(null); }}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                        primary="Rename Category"
                        primaryTypographyProps={{ fontSize: "0.875rem" }}
                    />
                </MenuItem>

                <MenuItem onClick={() => { onDownloadZip(); setAnchor(null); }}>
                    <ListItemIcon>
                        <DownloadIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                        primary="Download All as ZIP"
                        secondary="Backup all documents"
                        primaryTypographyProps={{ fontSize: "0.875rem" }}
                        secondaryTypographyProps={{ fontSize: "0.6875rem" }}
                    />
                </MenuItem>

                <MenuItem onClick={copyDriveLink}>
                    <ListItemIcon>
                        <LinkIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                        primary="Copy Drive Link"
                        primaryTypographyProps={{ fontSize: "0.875rem" }}
                    />
                </MenuItem>

                <Divider sx={{ my: 0.5 }} />

                <MenuItem
                    onClick={() => { onDelete(); setAnchor(null); }}
                    sx={{ color: "error.main" }}
                >
                    <ListItemIcon>
                        <DeleteOutlineIcon fontSize="small" sx={{ color: "error.main" }} />
                    </ListItemIcon>
                    <ListItemText
                        primary="Delete Category"
                        primaryTypographyProps={{ fontSize: "0.875rem" }}
                    />
                </MenuItem>
            </Menu>
        </>
    );
}