import React, { useEffect, useState } from "react";
import {
    Box, Typography, Card, CardContent, CardActionArea,
    Button, IconButton, Menu, MenuItem, Skeleton, Chip
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FolderIcon from "@mui/icons-material/Folder";
import DescriptionIcon from "@mui/icons-material/Description";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../api/axios";
import EmptyState from "../components/EmptyState";
import ActivityFeed from "../components/ActivityFeed";
import CreateCategoryModal from "../components/CreateCategoryModal";
import EditCategoryModal from "../components/EditCategoryModal";
import DeleteCategoryModal from "../components/DeleteCategoryModal";

const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
};

// ============ STAT CARD ============
const StatCard = ({ icon, label, value, color, hint, onClick }) => (
    <Card
        onClick={onClick}
        sx={{
            height: "100%",
            position: "relative",
            overflow: "hidden",
            cursor: onClick ? "pointer" : "default",
            transition: "all 0.2s ease",
            "&:hover": onClick ? {
                borderColor: color,
                transform: "translateY(-2px)",
                boxShadow: `0 8px 24px -8px ${color}40`,
            } : {},
        }}
    >
        {/* Glow blob */}
        <Box
            sx={{
                position: "absolute", top: -40, right: -40,
                width: 160, height: 160, borderRadius: "50%",
                background: `radial-gradient(circle, ${color}30 0%, transparent 70%)`,
                filter: "blur(28px)",
                pointerEvents: "none",
            }}
        />
        <CardContent sx={{ p: 2.5, position: "relative", "&:last-child": { pb: 2.5 } }}>
            {/* Row 1: icon + label */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
                <Box
                    sx={{
                        width: 40, height: 40, borderRadius: 1.5,
                        bgcolor: `${color}20`,
                        border: `1px solid ${color}30`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    {React.cloneElement(icon, { sx: { color, fontSize: 20 } })}
                </Box>
                <Typography
                    sx={{
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "text.secondary",
                    }}
                >
                    {label}
                </Typography>
            </Box>

            {/* Row 2: big number + hint */}
            <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 2 }}>
                <Typography
                    sx={{
                        fontFamily: "'JetBrains Mono', monospace",
                        letterSpacing: "-0.02em",
                        fontSize: "2.25rem",
                        fontWeight: 700,
                        lineHeight: 1,
                    }}
                >
                    {value}
                </Typography>
                {hint && (
                    <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
                        {hint}
                    </Typography>
                )}
            </Box>
        </CardContent>
    </Card>
);

// ============ CATEGORY CARD ============
const CategoryCard = ({ cat, onMenu, navigate }) => (
    <Card sx={{
        height: "100%",
        position: "relative",
        transition: "all 0.2s ease",
        "&:hover": {
            borderColor: "primary.main",
            transform: "translateY(-2px)",
            boxShadow: "0 8px 24px -8px rgba(139, 92, 246, 0.4)",
        },
    }}>
        <CardActionArea onClick={() => navigate(`/categories/${cat.id}`)} sx={{ height: "100%" }}>
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                {/* Top: icon only (menu btn is positioned absolute) */}
                <Box
                    sx={{
                        width: 44, height: 44, borderRadius: 2,
                        background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        mb: 2, boxShadow: "0 4px 12px -2px rgba(139, 92, 246, 0.4)",
                    }}
                >
                    <FolderIcon sx={{ color: "#fff", fontSize: 22 }} />
                </Box>

                {/* Name + type */}
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

                {/* Footer */}
                <Box sx={{
                    mt: 2, pt: 2,
                    borderTop: "1px solid",
                    borderColor: "divider",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}>
                    <Typography
                        variant="caption"
                        sx={{ color: "text.secondary", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem" }}
                    >
                        {String(cat.documentCount || 0).padStart(2, "0")} {cat.documentCount === 1 ? "doc" : "docs"}
                    </Typography>
                    <ArrowForwardIcon sx={{ fontSize: 16, color: "text.disabled" }} />
                </Box>
            </CardContent>
        </CardActionArea>

        {/* Menu btn OUTSIDE ActionArea so it doesn't trigger navigation */}
        <IconButton
            size="small"
            onClick={(e) => onMenu(e, cat)}
            onMouseDown={(e) => e.stopPropagation()}
            sx={{
                position: "absolute", top: 12, right: 12, zIndex: 2,
                bgcolor: "background.paper",
                "&:hover": { bgcolor: "action.hover" },
            }}
        >
            <MoreVertIcon fontSize="small" />
        </IconButton>
    </Card>
);

export default function Dashboard() {
    const [categories, setCategories] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [menuCategory, setMenuCategory] = useState(null);

    const navigate = useNavigate();
    const email = localStorage.getItem("email");
    const userName = email?.split("@")[0] || "User";

    const loadData = async () => {
        setLoading(true);
        try {
            const [catRes, sumRes] = await Promise.all([
                api.get("/categories"),
                api.get("/dashboard/summary"),
            ]);
            setCategories(catRes.data);
            setSummary(sumRes.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load dashboard");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const openMenu = (e, category) => {
        e.stopPropagation();
        e.preventDefault();
        const target = e.currentTarget;
        setMenuAnchor(target);
        setMenuCategory(category);
    };
    const closeMenu = () => { setMenuAnchor(null); setMenuCategory(null); };
    const handleEdit = () => { setSelectedCategory(menuCategory); setEditOpen(true); closeMenu(); };
    const handleDelete = () => { setSelectedCategory(menuCategory); setDeleteOpen(true); closeMenu(); };

    const mockActivities = categories.slice(0, 4).map((cat, i) => ({
        type: i === 0 ? "category" : i === 1 ? "upload" : i === 2 ? "ai" : "edit",
        text: i === 0 ? `Created "${cat.name}"` :
              i === 1 ? `Uploaded document to ${cat.name}` :
              i === 2 ? `AI scanned ${cat.documentCount} documents` :
                        `Edited category ${cat.name}`,
        time: new Date(Date.now() - i * 3600000 * 3).toISOString(),
    }));

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
            <Box sx={{
                mb: 4,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: 2,
            }}>
                <Box>
                    <Typography sx={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        color: "primary.main",
                        mb: 1,
                    }}>
                        {new Date().toLocaleDateString("en-US", {
                            weekday: "long", month: "long", day: "numeric",
                        }).toUpperCase()}
                    </Typography>
                    <Typography variant="h4" fontWeight={700} letterSpacing="-0.02em" sx={{ mb: 0.5 }}>
                        {getGreeting()}, {userName.charAt(0).toUpperCase() + userName.slice(1)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Here's what's happening with your documents today.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setCreateOpen(true)}
                    sx={{ boxShadow: "0 4px 14px -4px rgba(139, 92, 246, 0.5)" }}
                >
                    New Category
                </Button>
            </Box>

            {/* ============ STAT CARDS (CSS Grid — 4 cols desktop, 2 tablet, 1 mobile) ============ */}
            <Box sx={{
                display: "grid",
                gap: 2.5,
                mb: 5,
                gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    lg: "repeat(4, 1fr)",
                },
            }}>
                {loading || !summary ? (
                    [1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} variant="rounded" height={130} sx={{ borderRadius: 3 }} />
                    ))
                ) : (
                    <>
                        <StatCard icon={<FolderIcon />} label="Categories" value={summary.totalCategories} color="#8B5CF6" hint="Total folders" />
                        <StatCard icon={<DescriptionIcon />} label="Documents" value={summary.totalDocuments} color="#3B82F6" hint="All files" />
                        <StatCard icon={<WarningAmberIcon />} label="Expiring" value={summary.expiringSoonCount} color="#F59E0B" hint="Next 30 days" />
                        <StatCard icon={<EventBusyIcon />} label="Expired" value={summary.expiredCount} color="#EF4444" hint="Needs action" />
                    </>
                )}
            </Box>

            {/* ============ MAIN GRID: Categories + Activity Sidebar ============ */}
            <Box sx={{
                display: "grid",
                gap: 3,
                gridTemplateColumns: { xs: "1fr", lg: "1fr 340px" },
                alignItems: "start",
            }}>
                {/* CATEGORIES */}
                <Box sx={{ minWidth: 0 }}>
                    <Box sx={{ mb: 2.5, display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                        <Box>
                            <Typography variant="h6" fontWeight={700}>Categories</Typography>
                            <Typography variant="caption" color="text.secondary">
                                {categories.length} {categories.length === 1 ? "category" : "categories"}
                            </Typography>
                        </Box>
                    </Box>

                    {loading ? (
                        <Box sx={{
                            display: "grid", gap: 2,
                            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
                        }}>
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} variant="rounded" height={170} sx={{ borderRadius: 3 }} />
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
                        <Box sx={{
                            display: "grid", gap: 2,
                            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
                        }}>
                            {categories.map((cat) => (
                                <CategoryCard key={cat.id} cat={cat} onMenu={openMenu} navigate={navigate} />
                            ))}
                            {/* Ghost add card */}
                            <Card
                                onClick={() => setCreateOpen(true)}
                                sx={{
                                    cursor: "pointer",
                                    minHeight: 170,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    border: "1.5px dashed",
                                    borderColor: "divider",
                                    bgcolor: "transparent",
                                    transition: "all 0.15s",
                                    "&:hover": {
                                        borderColor: "primary.main",
                                        bgcolor: "action.hover",
                                        "& .add-icon": { color: "primary.main" },
                                    },
                                }}
                            >
                                <Box sx={{ textAlign: "center", color: "text.secondary" }}>
                                    <AddIcon className="add-icon" sx={{ fontSize: 28, mb: 0.5, transition: "color 0.15s" }} />
                                    <Typography variant="body2" fontWeight={500}>New Category</Typography>
                                </Box>
                            </Card>
                        </Box>
                    )}
                </Box>

                {/* ACTIVITY SIDEBAR */}
                <Box sx={{ minWidth: 0 }}>
                    <Box sx={{ mb: 2.5 }}>
                        <Typography variant="h6" fontWeight={700}>Activity</Typography>
                        <Typography variant="caption" color="text.secondary">Recent actions</Typography>
                    </Box>
                    {loading ? (
                        <Skeleton variant="rounded" height={300} sx={{ borderRadius: 3 }} />
                    ) : (
                        <ActivityFeed activities={mockActivities} />
                    )}
                </Box>
            </Box>

            {/* Menu (fixed positioning) */}
            <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={closeMenu}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                slotProps={{
                    paper: {
                        sx: {
                            mt: 0.5, minWidth: 160,
                            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                            border: "1px solid", borderColor: "divider",
                        },
                    },
                }}
            >
                <MenuItem onClick={handleEdit} sx={{ fontSize: "0.875rem", py: 1 }}>
                    <EditIcon fontSize="small" sx={{ mr: 1.5 }} /> Edit
                </MenuItem>
                <MenuItem onClick={handleDelete} sx={{ fontSize: "0.875rem", py: 1, color: "error.main" }}>
                    <DeleteOutlineIcon fontSize="small" sx={{ mr: 1.5 }} /> Delete
                </MenuItem>
            </Menu>

            {/* Modals */}
            <CreateCategoryModal open={createOpen} onClose={() => setCreateOpen(false)} onCreated={loadData} />
            <EditCategoryModal open={editOpen} onClose={() => setEditOpen(false)} category={selectedCategory} onUpdated={loadData} />
            <DeleteCategoryModal open={deleteOpen} onClose={() => setDeleteOpen(false)} category={selectedCategory} onDeleted={loadData} />
        </Box>
    );
}