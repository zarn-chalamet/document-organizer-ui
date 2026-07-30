import React, { useEffect, useState } from "react";
import {
    Typography, Card, CardContent, CardActionArea,
    Button, Box, TextField, ToggleButton, ToggleButtonGroup,
    InputAdornment, Skeleton, Chip
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AddIcon from "@mui/icons-material/Add";
import DescriptionIcon from "@mui/icons-material/Description";
import SearchIcon from "@mui/icons-material/Search";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DashboardIcon from "@mui/icons-material/SpaceDashboard";  // ← same icon as sidebar
import CloudUploadIcon from "@mui/icons-material/CloudUploadOutlined";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";

export default function CategoryDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const loadCategory = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append("search", search);
            if (filter && filter !== "all") params.append("filter", filter);
            const query = params.toString() ? `?${params.toString()}` : "";
            const res = await api.get(`/categories/${id}${query}`);
            setCategory(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Could not load category");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(loadCategory, 300);
        return () => clearTimeout(timer);
    }, [id, search, filter]);

    const getExpiryChip = (expiryDate) => {
        if (!expiryDate) return null;
        const today = new Date();
        const expiry = new Date(expiryDate);
        const days = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

        let color, text;
        if (days < 0) { color = "#EF4444"; text = "Expired"; }
        else if (days <= 30) { color = "#F59E0B"; text = `${days}d left`; }
        else { color = "#10B981"; text = "Valid"; }

        return (
            <Chip
                label={text}
                size="small"
                sx={{
                    bgcolor: `${color}20`,
                    color,
                    border: `1px solid ${color}40`,
                    fontWeight: 600,
                    fontSize: "0.6875rem",
                    height: 22,
                    fontFamily: "'JetBrains Mono', monospace",
                    "& .MuiChip-label": { px: 1 },
                }}
            />
        );
    };

    if (!category && !loading) {
        return (
            <Box sx={{ p: 4 }}>
                <Typography color="error">Category not found</Typography>
            </Box>
        );
    }

    const subtitle = category
        ? category.type === "CUSTOM"
            ? (category.customType || "Custom")
            : (category.type || "GENERAL").replace(/_/g, " ")
        : "";

    return (
        <Box sx={{
            width: "100%",
            px: { xs: 2, sm: 3, md: 4, lg: 5 },
            py: { xs: 3, md: 4 },
            boxSizing: "border-box",
        }}>
            <PageHeader
                title={category?.name || "Loading..."}
                subtitle={subtitle}
                backTo="/"
                breadcrumbs={[
                    {
                        label: "Dashboard",
                        to: "/",
                        icon: <DashboardIcon sx={{ fontSize: 14, mr: 0.5 }} />,
                    },
                    { label: category?.name || "..." },
                ]}
                action={
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate(`/categories/${id}/upload`)}
                        sx={{ boxShadow: "0 4px 14px -4px rgba(139, 92, 246, 0.5)" }}
                    >
                        Upload Document
                    </Button>
                }
            />

            {/* Toolbar */}
            <Box sx={{
                display: "flex",
                gap: 1.5,
                flexWrap: "wrap",
                alignItems: "center",
                mb: 3,
                p: 1.5,
                bgcolor: "background.paper",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
            }}>
                <TextField
                    placeholder="Search documents..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    size="small"
                    sx={{ flex: 1, minWidth: 240 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                            </InputAdornment>
                        ),
                    }}
                />
                <ToggleButtonGroup
                    value={filter}
                    exclusive
                    onChange={(e, v) => v && setFilter(v)}
                    size="small"
                >
                    <ToggleButton value="all" sx={{ px: 2 }}>All</ToggleButton>
                    <ToggleButton value="expiring" sx={{ px: 2 }}>Expiring</ToggleButton>
                    <ToggleButton value="expired" sx={{ px: 2 }}>Expired</ToggleButton>
                    <ToggleButton value="no-date" sx={{ px: 2 }}>No Date</ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {/* Documents grid */}
            {loading ? (
                <Box sx={{
                    display: "grid",
                    gap: 2,
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        md: "repeat(3, 1fr)",
                        lg: "repeat(4, 1fr)",
                    },
                }}>
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} variant="rounded" height={190} sx={{ borderRadius: 3 }} />
                    ))}
                </Box>
            ) : !category.documents || category.documents.length === 0 ? (
                <EmptyState
                    icon={<DescriptionIcon />}
                    title={search || filter !== "all" ? "No matching documents" : "No documents yet"}
                    description={
                        search || filter !== "all"
                            ? "Try adjusting your search or filters to find what you're looking for."
                            : "Upload your first document to get started with AI-powered organization."
                    }
                    actionLabel={!search && filter === "all" ? "Upload Document" : null}
                    onAction={!search && filter === "all" ? () => navigate(`/categories/${id}/upload`) : null}
                />
            ) : (
                <Box sx={{
                    display: "grid",
                    gap: 2,
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        md: "repeat(3, 1fr)",
                        lg: "repeat(4, 1fr)",
                    },
                }}>
                    {category.documents.map((doc) => (
                        <Card
                            key={doc.id}
                            sx={{
                                height: "100%",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                    borderColor: "primary.main",
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 8px 24px -8px rgba(139, 92, 246, 0.35)",
                                },
                            }}
                        >
                            <CardActionArea onClick={() => navigate(`/documents/${doc.id}`)} sx={{ height: "100%" }}>
                                <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                                    {/* ============ ACTUAL CARD CONTENT ============ */}
                                    <Box sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "flex-start",
                                        mb: 2,
                                    }}>
                                        <Box sx={{
                                            width: 40, height: 40, borderRadius: 1.5,
                                            background: "linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(37, 99, 235, 0.15))",
                                            border: "1px solid rgba(59, 130, 246, 0.35)",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                        }}>
                                            <DescriptionIcon sx={{ color: "#60A5FA", fontSize: 20 }} />
                                        </Box>
                                        {doc.scanStatus && <StatusBadge status={doc.scanStatus} />}
                                    </Box>

                                    <Typography
                                        variant="subtitle2"
                                        fontWeight={700}
                                        noWrap
                                        sx={{ mb: 0.5, fontSize: "0.9375rem" }}
                                    >
                                        {doc.title}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                            minHeight: "2.4em",
                                            mb: 2,
                                            fontSize: "0.75rem",
                                            lineHeight: 1.5,
                                        }}
                                    >
                                        {doc.description || "No description"}
                                    </Typography>

                                    {doc.expiryDate ? (
                                        <Box sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            pt: 1.5,
                                            borderTop: "1px solid",
                                            borderColor: "divider",
                                        }}>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                <CalendarTodayIcon sx={{ fontSize: 12, color: "text.disabled" }} />
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    sx={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6875rem" }}
                                                >
                                                    {new Date(doc.expiryDate).toLocaleDateString("en-US", {
                                                        month: "short", day: "numeric", year: "numeric",
                                                    })}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                {getExpiryChip(doc.expiryDate)}
                                                {doc.userVerifiedExpiry && (
                                                    <CheckCircleOutlineIcon
                                                        sx={{ fontSize: 14, color: "#10B981" }}
                                                        titleAccess="Verified by you"
                                                    />
                                                )}
                                            </Box>
                                        </Box>
                                    ) : (
                                        <Box sx={{ pt: 1.5, borderTop: "1px solid", borderColor: "divider" }}>
                                            <Typography
                                                variant="caption"
                                                sx={{ color: "text.disabled", fontStyle: "italic", fontSize: "0.6875rem" }}
                                            >
                                                No expiry date
                                            </Typography>
                                        </Box>
                                    )}
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    ))}

                    {/* ============ GHOST "Upload Document" CARD ============ */}
                    <Card
                        onClick={() => navigate(`/categories/${id}/upload`)}
                        sx={{
                            cursor: "pointer",
                            minHeight: 190,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1.5px dashed",
                            borderColor: "divider",
                            bgcolor: "transparent",
                            transition: "all 0.15s",
                            "&:hover": {
                                borderColor: "primary.main",
                                bgcolor: "action.hover",
                                "& .upload-icon": { color: "primary.main" },
                                "& .upload-text": { color: "primary.main" },
                            },
                        }}
                    >
                        <Box sx={{ textAlign: "center", color: "text.secondary" }}>
                            <CloudUploadIcon
                                className="upload-icon"
                                sx={{
                                    fontSize: 32,
                                    mb: 0.5,
                                    transition: "color 0.15s",
                                }}
                            />
                            <Typography
                                className="upload-text"
                                variant="body2"
                                fontWeight={500}
                                sx={{ transition: "color 0.15s" }}
                            >
                                Upload Document
                            </Typography>
                        </Box>
                    </Card>
                </Box>
            )}
        </Box>
    );
}