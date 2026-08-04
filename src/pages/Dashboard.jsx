import React, { useEffect, useState } from "react";
import {
    Box, Typography, Card, CardContent, CardActionArea,
    Button, IconButton, Menu, MenuItem, Skeleton
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FolderIcon from "@mui/icons-material/Folder";
import DescriptionIcon from "@mui/icons-material/Description";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../api/axios";
import EmptyState from "../components/EmptyState";
import NeedsAttentionPanel from "../components/NeedsAttentionPanel";
import CreateCategoryModal from "../components/CreateCategoryModal";
import EditCategoryModal from "../components/EditCategoryModal";
import DeleteCategoryModal from "../components/DeleteCategoryModal";

// ============ HELPERS ============
const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
};

const getDisplayName = (email) => {
    if (!email) return "there";
    const prefix = email.split("@")[0];
    const cleaned = prefix.replace(/\d+$/g, "");
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};

// ============ COMPACT STAT CARD ============
const StatCard = ({ icon, label, value, color, onClick }) => (
    <Card
        onClick={onClick}
        sx={{
            cursor: onClick ? "pointer" : "default",
            transition: "all 0.15s ease",
            "&:hover": onClick ? {
                borderColor: color,
                transform: "translateY(-1px)",
            } : {},
        }}
    >
        <CardContent
            sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
                "&:last-child": { pb: 2 },
            }}
        >
            <Box
                sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    bgcolor: `${color}18`,
                    border: `1px solid ${color}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}
            >
                {React.cloneElement(icon, { sx: { color, fontSize: 20 } })}
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                    sx={{
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        fontSize: "0.6875rem",
                        fontWeight: 600,
                        color: "text.secondary",
                        mb: 0.25,
                    }}
                >
                    {label}
                </Typography>
                <Typography
                    sx={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "1.5rem",
                        fontWeight: 700,
                        lineHeight: 1,
                        letterSpacing: "-0.02em",
                    }}
                >
                    {String(value).padStart(2, "0")}
                </Typography>
            </Box>
        </CardContent>
    </Card>
);

// ============ CATEGORY CARD ============
const CategoryCard = ({ cat, onMenu, navigate }) => (
    <Card
        sx={{
            height: "100%",
            position: "relative",
            transition: "all 0.15s ease",
            "&:hover": {
                borderColor: "primary.main",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 24px -8px rgba(139, 92, 246, 0.4)",
            },
        }}
    >
        <CardActionArea onClick={() => navigate(`/categories/${cat.id}`)} sx={{ height: "100%" }}>
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                <Box
                    sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2,
                        boxShadow: "0 4px 12px -2px rgba(139, 92, 246, 0.4)",
                    }}
                >
                    <FolderIcon sx={{ color: "#fff", fontSize: 22 }} />
                </Box>

                <Typography variant="subtitle1" fontWeight={700} noWrap sx={{ mb: 0.25 }}>
                    {cat.name}
                </Typography>
                <Typography
                    variant="caption"
                    sx={{
                        color: "text.secondary",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        fontSize: "0.6875rem",
                        fontWeight: 600,
                    }}
                >
                    {(cat.type === "CUSTOM" ? cat.customType : cat.type) || "GENERAL"}
                </Typography>

                <Box
                    sx={{
                        mt: 2,
                        pt: 2,
                        borderTop: "1px solid",
                        borderColor: "divider",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Typography
                        variant="caption"
                        sx={{
                            color: "text.secondary",
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "0.75rem",
                        }}
                    >
                        {String(cat.documentCount || 0).padStart(2, "0")}{" "}
                        {cat.documentCount === 1 ? "doc" : "docs"}
                    </Typography>
                    <ArrowForwardIcon sx={{ fontSize: 16, color: "text.disabled" }} />
                </Box>
            </CardContent>
        </CardActionArea>

        <IconButton
            size="small"
            onClick={(e) => onMenu(e, cat)}
            onMouseDown={(e) => e.stopPropagation()}
            sx={{
                position: "absolute",
                top: 12,
                right: 12,
                zIndex: 2,
                bgcolor: "background.paper",
                "&:hover": { bgcolor: "action.hover" },
            }}
        >
            <MoreVertIcon fontSize="small" />
        </IconButton>
    </Card>
);

// ============ MAIN DASHBOARD ============
export default function Dashboard() {
    const [categories, setCategories] = useState([]);
    const [summary, setSummary] = useState(null);
    const [priorityDocs, setPriorityDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [menuCategory, setMenuCategory] = useState(null);

    const navigate = useNavigate();
    const email = localStorage.getItem("email");
    const displayName = getDisplayName(email);

    const loadData = async () => {
        setLoading(true);
        try {
            const [catRes, sumRes, priorityRes] = await Promise.all([
                api.get("/categories"),
                api.get("/dashboard/summary"),
                api.get("/dashboard/priority-documents"),
            ]);
            setCategories(catRes.data);
            setSummary(sumRes.data);
            setPriorityDocs(priorityRes.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load dashboard");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const openMenu = (e, category) => {
        e.stopPropagation();
        e.preventDefault();
        setMenuAnchor(e.currentTarget);
        setMenuCategory(category);
    };
    const closeMenu = () => {
        setMenuAnchor(null);
        setMenuCategory(null);
    };
    const handleEdit = () => {
        setSelectedCategory(menuCategory);
        setEditOpen(true);
        closeMenu();
    };
    const handleDelete = () => {
        setSelectedCategory(menuCategory);
        setDeleteOpen(true);
        closeMenu();
    };

    return (
        <Box
            sx={{
                width: "100%",
                minHeight: "100vh",
                px: { xs: 2, sm: 3, md: 4, lg: 5 },
                py: { xs: 3, md: 4 },
                boxSizing: "border-box",
            }}
        >
            {/* ============ HEADER ============ */}
            <Box
                sx={{
                    mb: { xs: 3, md: 4 },
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: { xs: "stretch", sm: "flex-start" },
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                }}
            >
                <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                        sx={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "0.6875rem",
                            fontWeight: 600,
                            letterSpacing: "0.1em",
                            color: "primary.main",
                            mb: 1,
                            textTransform: "uppercase",
                        }}
                    >
                        {new Date().toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                        })}
                    </Typography>
                    <Typography
                        variant="h4"
                        fontWeight={700}
                        letterSpacing="-0.02em"
                        sx={{ fontSize: { xs: "1.5rem", sm: "1.875rem" } }}
                    >
                        {getGreeting()}, {displayName}
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setCreateOpen(true)}
                    sx={{
                        boxShadow: "0 4px 14px -4px rgba(139, 92, 246, 0.5)",
                        width: { xs: "100%", sm: "auto" },
                        flexShrink: 0,
                    }}
                >
                    New Category
                </Button>
            </Box>

            {/* ============ NEEDS ATTENTION (HERO SECTION) ============ */}
            <Box sx={{ mb: { xs: 3, md: 4 } }}>
                {loading ? (
                    <Skeleton variant="rounded" height={140} sx={{ borderRadius: 3 }} />
                ) : (
                    <NeedsAttentionPanel
                        priorityDocs={priorityDocs}
                        totalDocuments={summary?.totalDocuments || 0}
                    />
                )}
            </Box>

            {/* ============ COMPACT STATS ROW ============ */}
            <Box
                sx={{
                    display: "grid",
                    gap: 2,
                    mb: { xs: 3, md: 4 },
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(3, 1fr)",
                    },
                }}
            >
                {loading || !summary ? (
                    [1, 2, 3].map((i) => (
                        <Skeleton key={i} variant="rounded" height={72} sx={{ borderRadius: 3 }} />
                    ))
                ) : (
                    <>
                        <StatCard
                            icon={<FolderIcon />}
                            label="Categories"
                            value={summary.totalCategories}
                            color="#8B5CF6"
                        />
                        <StatCard
                            icon={<DescriptionIcon />}
                            label="Documents"
                            value={summary.totalDocuments}
                            color="#3B82F6"
                        />
                        <StatCard
                            icon={<WarningAmberIcon />}
                            label="Needs Action"
                            value={summary.expiringSoonCount + (summary.expiredCount || 0)}
                            color="#F59E0B"
                        />
                    </>
                )}
            </Box>

            {/* ============ CATEGORIES SECTION ============ */}
            <Box>
                <Box sx={{ mb: 2.5 }}>
                    <Typography variant="h6" fontWeight={700}>
                        Your Categories
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {categories.length}{" "}
                        {categories.length === 1 ? "category" : "categories"}
                    </Typography>
                </Box>

                {loading ? (
                    <Box
                        sx={{
                            display: "grid",
                            gap: 2,
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "repeat(2, 1fr)",
                                md: "repeat(3, 1fr)",
                                xl: "repeat(4, 1fr)",
                            },
                        }}
                    >
                        {[1, 2, 3].map((i) => (
                            <Skeleton
                                key={i}
                                variant="rounded"
                                height={170}
                                sx={{ borderRadius: 3 }}
                            />
                        ))}
                    </Box>
                ) : categories.length === 0 ? (
                    <EmptyState
                        icon={<FolderIcon />}
                        title="No categories yet"
                        description="Create your first category to start organizing documents by type — passports, visas, insurance, and more."
                        actionLabel="Create Category"
                        onAction={() => setCreateOpen(true)}
                    />
                ) : (
                    <Box
                        sx={{
                            display: "grid",
                            gap: 2,
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "repeat(2, 1fr)",
                                md: "repeat(3, 1fr)",
                                xl: "repeat(4, 1fr)",
                            },
                        }}
                    >
                        {categories.map((cat) => (
                            <CategoryCard
                                key={cat.id}
                                cat={cat}
                                onMenu={openMenu}
                                navigate={navigate}
                            />
                        ))}
                    </Box>
                )}
            </Box>

            {/* ============ MENU ============ */}
            <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={closeMenu}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                slotProps={{
                    paper: {
                        sx: {
                            mt: 0.5,
                            minWidth: 160,
                            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                            border: "1px solid",
                            borderColor: "divider",
                        },
                    },
                }}
            >
                <MenuItem onClick={handleEdit} sx={{ fontSize: "0.875rem", py: 1 }}>
                    <EditIcon fontSize="small" sx={{ mr: 1.5 }} /> Edit
                </MenuItem>
                <MenuItem
                    onClick={handleDelete}
                    sx={{ fontSize: "0.875rem", py: 1, color: "error.main" }}
                >
                    <DeleteOutlineIcon fontSize="small" sx={{ mr: 1.5 }} /> Delete
                </MenuItem>
            </Menu>

            {/* ============ MODALS ============ */}
            <CreateCategoryModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onCreated={loadData}
            />
            <EditCategoryModal
                open={editOpen}
                onClose={() => setEditOpen(false)}
                category={selectedCategory}
                onUpdated={loadData}
            />
            <DeleteCategoryModal
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                category={selectedCategory}
                onDeleted={loadData}
            />
        </Box>
    );
}