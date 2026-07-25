import React, { useEffect, useState } from "react";
import {
    Typography, Button, Box, Card, CardContent,
    Chip, Skeleton, Divider
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/EditOutlined";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMoveOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DescriptionIcon from "@mui/icons-material/Description";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CategoryIcon from "@mui/icons-material/Category";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import DashboardIcon from "@mui/icons-material/SpaceDashboard";
import FolderIcon from "@mui/icons-material/Folder";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import EditDocumentModal from "../components/EditDocumentModal";
import MoveDocumentModal from "../components/MoveDocumentModal";
import DeleteDocumentModal from "../components/DeleteDocumentModal";

export default function DocumentDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [doc, setDoc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [moveOpen, setMoveOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const loadDocument = async () => {
        try {
            const res = await api.get(`/documents/${id}`);
            setDoc(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Could not load document");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadDocument(); }, [id]);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await api.delete(`/documents/${id}`);
            toast.success("Document deleted");
            navigate(`/categories/${doc.categoryId}`);
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete");
            setDeleting(false);
        }
    };

    const getExpiryInfo = (expiryDate) => {
        if (!expiryDate) return null;
        const today = new Date();
        const expiry = new Date(expiryDate);
        const days = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

        if (days < 0) return { text: "Expired", color: "#EF4444" };
        if (days <= 30) return { text: `${days} days left`, color: "#F59E0B" };
        return { text: "Valid", color: "#10B981" };
    };

    // SAME container padding as CategoryDetail & Dashboard
    const PageContainer = ({ children }) => (
        <Box sx={{
            width: "100%",
            px: { xs: 2, sm: 3, md: 4, lg: 5 },
            py: { xs: 3, md: 4 },
            boxSizing: "border-box",
        }}>
            {children}
        </Box>
    );

    if (loading) {
        return (
            <PageContainer>
                <Skeleton variant="text" width={300} height={20} />
                <Skeleton variant="text" width={400} height={44} sx={{ mt: 1 }} />
                <Skeleton variant="text" width={300} height={20} sx={{ mt: 0.5, mb: 4 }} />
                <Box sx={{
                    display: "grid",
                    gap: 3,
                    gridTemplateColumns: { xs: "1fr", md: "1fr 380px" },
                }}>
                    <Skeleton variant="rounded" height={340} sx={{ borderRadius: 3 }} />
                    <Skeleton variant="rounded" height={340} sx={{ borderRadius: 3 }} />
                </Box>
            </PageContainer>
        );
    }

    if (!doc) {
        return (
            <PageContainer>
                <Typography color="error">Document not found</Typography>
            </PageContainer>
        );
    }

    const expiryInfo = getExpiryInfo(doc.expiryDate);

    const MetadataRow = ({ icon, label, value, mono }) => (
        <Box sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 2,
            py: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
            "&:last-child": { borderBottom: "none" },
        }}>
            <Box sx={{
                width: 32, height: 32, borderRadius: 1.5,
                bgcolor: "action.hover",
                border: "1px solid", borderColor: "divider",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
            }}>
                {React.cloneElement(icon, { sx: { fontSize: 16, color: "text.secondary" } })}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{
                    color: "text.secondary",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    display: "block",
                    mb: 0.5,
                    textTransform: "uppercase",
                }}>
                    {label}
                </Typography>
                <Box sx={{
                    wordBreak: "break-word",
                    fontFamily: mono ? "'JetBrains Mono', monospace" : "inherit",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                }}>
                    {value}
                </Box>
            </Box>
        </Box>
    );

    return (
        <PageContainer>
            <PageHeader
                title={doc.title}
                subtitle={doc.description || "No description"}
                backTo={`/categories/${doc.categoryId}`}
                breadcrumbs={[
                    { label: "Dashboard", to: "/", icon: <DashboardIcon sx={{ fontSize: 14, mr: 0.5 }} /> },
                    {
                        label: doc.categoryName || "Category",
                        to: `/categories/${doc.categoryId}`,
                        icon: <FolderIcon sx={{ fontSize: 14, mr: 0.5 }} />,
                    },
                    { label: doc.title },
                ]}
                // Status badge inline with title (below breadcrumb, next to title)
                titleAdornment={doc.scanStatus && <StatusBadge status={doc.scanStatus} />}
                // Only the primary action in the top-right corner
                action={
                    <Button
                        variant="contained"
                        startIcon={<OpenInNewIcon />}
                        href={doc.driveFileLink}
                        target="_blank"
                        size="large"
                        sx={{
                            boxShadow: "0 4px 14px -4px rgba(139, 92, 246, 0.5)",
                            px: 2.5,
                        }}
                    >
                        Open in Drive
                    </Button>
                }
            />

            <Box sx={{
                display: "grid",
                gap: 3,
                gridTemplateColumns: { xs: "1fr", md: "1fr 380px" },
                alignItems: "start",
            }}>
                {/* Left: Details */}
                <Card>
                    <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
                        <Typography sx={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "0.6875rem",
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            color: "primary.main",
                            mb: 1,
                            textTransform: "uppercase",
                        }}>
                            Document Details
                        </Typography>
                        <Divider sx={{ mb: 0.5 }} />

                        <MetadataRow
                            icon={<DescriptionIcon />}
                            label="File Type"
                            value={doc.fileType || "Unknown"}
                            mono
                        />
                        <MetadataRow
                            icon={<CalendarTodayIcon />}
                            label="Expiry Date"
                            value={
                                doc.expiryDate ? (
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                                        <Box component="span" sx={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                            {new Date(doc.expiryDate).toLocaleDateString("en-US", {
                                                month: "long", day: "numeric", year: "numeric",
                                            })}
                                        </Box>
                                        {expiryInfo && (
                                            <Chip
                                                label={expiryInfo.text}
                                                size="small"
                                                sx={{
                                                    bgcolor: `${expiryInfo.color}20`,
                                                    color: expiryInfo.color,
                                                    border: `1px solid ${expiryInfo.color}40`,
                                                    fontWeight: 600,
                                                    fontSize: "0.6875rem",
                                                    height: 22,
                                                    fontFamily: "'JetBrains Mono', monospace",
                                                }}
                                            />
                                        )}
                                    </Box>
                                ) : (
                                    <Typography variant="body2" color="text.disabled" fontStyle="italic" sx={{ fontSize: "0.875rem" }}>
                                        Not set — AI will extract this
                                    </Typography>
                                )
                            }
                        />
                        {doc.detectedDocumentType && (
                            <MetadataRow
                                icon={<CategoryIcon />}
                                label="Detected Type"
                                value={doc.detectedDocumentType}
                            />
                        )}
                        <MetadataRow
                            icon={<FingerprintIcon />}
                            label="Document ID"
                            value={`#${String(doc.id).padStart(6, "0")}`}
                            mono
                        />
                    </CardContent>
                </Card>

                {/* Right: Actions */}
                <Card>
                    <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
                        <Typography sx={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "0.6875rem",
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            color: "primary.main",
                            mb: 2.5,
                            textTransform: "uppercase",
                        }}>
                            Actions
                        </Typography>

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
                            <Button
                                variant="outlined"
                                startIcon={<EditIcon />}
                                onClick={() => setEditOpen(true)}
                                fullWidth
                            >
                                Edit Details
                            </Button>

                            <Button
                                variant="outlined"
                                startIcon={<DriveFileMoveIcon />}
                                onClick={() => setMoveOpen(true)}
                                fullWidth
                            >
                                Move to Category
                            </Button>

                            <Divider sx={{ my: 1.25 }} />

                            <Button
                                variant="outlined"
                                startIcon={<DeleteOutlineIcon />}
                                onClick={() => setDeleteOpen(true)}
                                disabled={deleting}
                                fullWidth
                                sx={{
                                    borderColor: "rgba(239, 68, 68, 0.35)",
                                    color: "#EF4444",
                                    "&:hover": {
                                        borderColor: "#EF4444",
                                        background: "rgba(239, 68, 68, 0.1)",
                                    },
                                }}
                            >
                                {deleting ? "Deleting..." : "Delete Document"}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            <EditDocumentModal
                open={editOpen}
                onClose={() => setEditOpen(false)}
                document={doc}
                onUpdated={() => { loadDocument(); toast.success("Document updated"); }}
            />

            <MoveDocumentModal
                open={moveOpen}
                onClose={() => setMoveOpen(false)}
                document={doc}
                onMoved={(newCategoryId) => { toast.success("Document moved"); navigate(`/categories/${newCategoryId}`); }}
            />

            <DeleteDocumentModal
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                document={doc}
                onConfirm={handleDelete}
                deleting={deleting}
            />
        </PageContainer>
    );
}