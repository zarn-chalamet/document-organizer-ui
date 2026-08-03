import React, { useEffect, useState } from "react";
import {
    Typography, Button, Box, Card, CardContent,
    Chip, Skeleton, Divider, Collapse, IconButton
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
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DownloadIcon from "@mui/icons-material/FileDownloadOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TuneIcon from "@mui/icons-material/Tune";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import AiVerificationBanner from "../components/AiVerificationBanner";
import InsightsPanel from "../components/InsightsPanel";
import ActionButton from "../components/ActionButton";
import { openChatWithDocument } from "../components/chatBus";
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
    const [mobileActionsOpen, setMobileActionsOpen] = useState(false);

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
                    gridTemplateColumns: { xs: "1fr", lg: "1fr 340px" },
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

    const showVerificationBanner =
        doc.extractedExpiryDate &&
        doc.expiryDate &&
        !doc.userVerifiedExpiry &&
        doc.scanStatus === "DONE";

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

    // ============ REUSABLE ACTIONS CONTENT ============
    const ActionsContent = () => (
        <>
            {/* HERO: DISCUSS WITH AI */}
            <Card
                sx={{
                    overflow: "hidden",
                    position: "relative",
                    background: "linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(236, 72, 153, 0.08) 100%)",
                    border: "1px solid",
                    borderColor: "rgba(139, 92, 246, 0.3)",
                    "&:hover": {
                        borderColor: "rgba(139, 92, 246, 0.5)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 16px 40px -12px rgba(139, 92, 246, 0.35)",
                    },
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: -40, right: -40,
                        width: 160, height: 160,
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 70%)",
                        filter: "blur(30px)",
                        pointerEvents: "none",
                    }}
                />
                <CardContent sx={{ p: 2.5, position: "relative", "&:last-child": { pb: 2.5 } }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                        <Box
                            sx={{
                                width: 36, height: 36, borderRadius: 2,
                                background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: "0 4px 12px -2px rgba(139, 92, 246, 0.5)",
                            }}
                        >
                            <ChatBubbleOutlineIcon sx={{ color: "white", fontSize: 18 }} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                                Ask AI About This
                            </Typography>
                            <Typography sx={{
                                fontSize: "0.6875rem",
                                color: "text.secondary",
                                fontFamily: "'JetBrains Mono', monospace",
                                letterSpacing: "0.05em",
                            }}>
                                Get instant answers
                            </Typography>
                        </Box>
                    </Box>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mb: 2, fontSize: "0.75rem", lineHeight: 1.5 }}
                    >
                        Ask questions about renewal, rules, or requirements for this specific document.
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<ChatBubbleOutlineIcon />}
                        onClick={() => {
                            openChatWithDocument(doc);
                            setMobileActionsOpen(false);
                        }}
                        fullWidth
                        sx={{
                            background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
                            boxShadow: "0 4px 14px -4px rgba(139, 92, 246, 0.5)",
                            py: 1.1,
                            "&:hover": {
                                background: "linear-gradient(135deg, #7C3AED, #DB2777)",
                                boxShadow: "0 6px 20px -4px rgba(139, 92, 246, 0.7)",
                            },
                        }}
                    >
                        Start Conversation
                    </Button>
                </CardContent>
            </Card>

            {/* FILE ACTIONS */}
            <Card>
                <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                    <Typography sx={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.625rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        color: "text.secondary",
                        mb: 1.5,
                        textTransform: "uppercase",
                        display: "flex", alignItems: "center", gap: 0.75,
                    }}>
                        <DescriptionIcon sx={{ fontSize: 12 }} />
                        File
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                        <ActionButton
                            icon={<OpenInNewIcon />}
                            label="Open in Drive"
                            hint="View original file"
                            component="a"
                            href={doc.driveFileLink}
                            target="_blank"
                        />
                        <ActionButton
                            icon={<DownloadIcon />}
                            label="Download"
                            hint="Save to your device"
                            component="a"
                            href={`https://drive.google.com/uc?export=download&id=${doc.driveFileId}`}
                            target="_blank"
                        />
                    </Box>
                </CardContent>
            </Card>

            {/* MANAGE */}
            <Card>
                <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                    <Typography sx={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.625rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        color: "text.secondary",
                        mb: 1.5,
                        textTransform: "uppercase",
                        display: "flex", alignItems: "center", gap: 0.75,
                    }}>
                        <EditIcon sx={{ fontSize: 12 }} />
                        Manage
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                        <ActionButton
                            icon={<EditIcon />}
                            label="Edit Details"
                            hint="Change title, expiry, etc."
                            onClick={() => {
                                setEditOpen(true);
                                setMobileActionsOpen(false);
                            }}
                        />
                        <ActionButton
                            icon={<DriveFileMoveIcon />}
                            label="Move to Category"
                            hint="Change organization"
                            onClick={() => {
                                setMoveOpen(true);
                                setMobileActionsOpen(false);
                            }}
                        />
                    </Box>
                </CardContent>
            </Card>

            {/* DANGER ZONE */}
            <Card
                sx={{
                    borderColor: "rgba(239, 68, 68, 0.2)",
                    "&:hover": { borderColor: "rgba(239, 68, 68, 0.4)" },
                }}
            >
                <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                    <Typography sx={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.625rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        color: "#EF4444",
                        mb: 1.5,
                        textTransform: "uppercase",
                        display: "flex", alignItems: "center", gap: 0.75,
                    }}>
                        <DeleteOutlineIcon sx={{ fontSize: 12 }} />
                        Danger Zone
                    </Typography>
                    <ActionButton
                        icon={<DeleteOutlineIcon />}
                        label={deleting ? "Deleting..." : "Delete Document"}
                        hint="This cannot be undone"
                        onClick={() => {
                            setDeleteOpen(true);
                            setMobileActionsOpen(false);
                        }}
                        disabled={deleting}
                        variant="danger"
                    />
                </CardContent>
            </Card>
        </>
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
                titleAdornment={doc.scanStatus && <StatusBadge status={doc.scanStatus} />}
            />

            {/* AI Verification Banner */}
            {showVerificationBanner && (
                <AiVerificationBanner
                    document={doc}
                    onVerified={loadDocument}
                    onEdit={() => setEditOpen(true)}
                />
            )}

            {/* ============ COLLAPSIBLE ACTIONS (MOBILE ONLY) ============ */}
            <Box sx={{ display: { xs: "block", lg: "none" }, mb: 2 }}>
                {/* Toggle Button */}
                <Box
                    onClick={() => setMobileActionsOpen(!mobileActionsOpen)}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: 2,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: mobileActionsOpen ? "primary.main" : "divider",
                        bgcolor: mobileActionsOpen ? "rgba(139, 92, 246, 0.05)" : "background.paper",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        "&:hover": {
                            borderColor: "primary.main",
                            bgcolor: "rgba(139, 92, 246, 0.05)",
                        },
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box
                            sx={{
                                width: 32,
                                height: 32,
                                borderRadius: 1.5,
                                background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 2px 8px -2px rgba(139, 92, 246, 0.5)",
                            }}
                        >
                            <TuneIcon sx={{ color: "white", fontSize: 16 }} />
                        </Box>
                        <Box>
                            <Typography
                                variant="body2"
                                fontWeight={700}
                                sx={{ fontSize: "0.875rem", lineHeight: 1.2 }}
                            >
                                Actions
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: "0.6875rem",
                                    color: "text.secondary",
                                    fontFamily: "'JetBrains Mono', monospace",
                                    letterSpacing: "0.05em",
                                }}
                            >
                                {mobileActionsOpen ? "Tap to collapse" : "Chat, Edit, Delete & more"}
                            </Typography>
                        </Box>
                    </Box>
                    <IconButton
                        size="small"
                        sx={{
                            transform: mobileActionsOpen ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.25s ease",
                            color: mobileActionsOpen ? "primary.main" : "text.secondary",
                        }}
                    >
                        <ExpandMoreIcon />
                    </IconButton>
                </Box>

                {/* Collapsible Content */}
                <Collapse in={mobileActionsOpen} timeout={300}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
                        <ActionsContent />
                    </Box>
                </Collapse>
            </Box>

            {/* ============ MAIN GRID (Desktop full, Mobile Details only) ============ */}
            <Box sx={{
                display: "grid",
                gap: { xs: 2, lg: 3 },
                gridTemplateColumns: { xs: "1fr", lg: "1fr 340px" },
                alignItems: "start",
            }}>
                {/* LEFT: Details + Insights (always visible) */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

                    {/* Document Details Card */}
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
                                            {doc.userVerifiedExpiry && (
                                                <Chip
                                                    icon={<CheckCircleOutlineIcon sx={{ fontSize: "14px !important" }} />}
                                                    label="Verified"
                                                    size="small"
                                                    sx={{
                                                        bgcolor: "rgba(16, 185, 129, 0.15)",
                                                        color: "#10B981",
                                                        border: "1px solid rgba(16, 185, 129, 0.35)",
                                                        fontWeight: 600,
                                                        fontSize: "0.6875rem",
                                                        height: 22,
                                                        fontFamily: "'JetBrains Mono', monospace",
                                                        "& .MuiChip-icon": { color: "#10B981", ml: 0.5 },
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    ) : doc.scanStatus === "DONE" ? (
                                        <Typography
                                            variant="body2"
                                            sx={{ color: "#F59E0B", fontStyle: "italic", fontSize: "0.875rem" }}
                                        >
                                            AI couldn't detect date — please set manually
                                        </Typography>
                                    ) : (
                                        <Typography
                                            variant="body2"
                                            color="text.disabled"
                                            fontStyle="italic"
                                            sx={{ fontSize: "0.875rem" }}
                                        >
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

                    {/* AI Insights Panel */}
                    <InsightsPanel document={doc} onRefresh={loadDocument} />
                </Box>

                {/* RIGHT: Actions Sidebar (Desktop only) */}
                <Box sx={{
                    display: { xs: "none", lg: "flex" },
                    flexDirection: "column",
                    gap: 2,
                    position: "sticky",
                    top: 16,
                }}>
                    <ActionsContent />
                </Box>
            </Box>

            {/* ============ MODALS ============ */}
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