import React, { useEffect, useState, useMemo } from "react";
import {
    Typography, Card, CardContent, CardActionArea,
    Button, Box, TextField, ToggleButton, ToggleButtonGroup,
    InputAdornment, Skeleton, Chip, Checkbox
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AddIcon from "@mui/icons-material/Add";
import DescriptionIcon from "@mui/icons-material/Description";
import SearchIcon from "@mui/icons-material/Search";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DashboardIcon from "@mui/icons-material/SpaceDashboard";
import CloudUploadIcon from "@mui/icons-material/CloudUploadOutlined";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
import CategoryStatsBar from "../components/CategoryStatsBar";
import CategoryActionMenu from "../components/CategoryActionMenu";
import SortDropdown from "../components/SortDropdown";
import ViewToggle from "../components/ViewToggle";
import DocumentListRow from "../components/DocumentListRow";
import BulkActionsBar from "../components/BulkActionsBar";
import EditCategoryModal from "../components/EditCategoryModal";
import DeleteCategoryModal from "../components/DeleteCategoryModal";
import BulkMoveModal from "../components/BulkMoveModal";
import BulkDeleteModal from "../components/BulkDeleteModal";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080/v1/api";

export default function CategoryDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [sortBy, setSortBy] = useState("recent");
    const [viewMode, setViewMode] = useState(() => {
        return localStorage.getItem("categoryViewMode") || "grid";
    });

    // Selection state
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [downloadingZip, setDownloadingZip] = useState(false);

    // Modal state
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [bulkMoveOpen, setBulkMoveOpen] = useState(false);
    const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

    // Persist view mode preference
    useEffect(() => {
        localStorage.setItem("categoryViewMode", viewMode);
    }, [viewMode]);

    const loadCategory = async (isInitial = false) => {
        
        if (isInitial) setLoading(true);
        else setRefreshing(true);

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
            setRefreshing(false);
        }
    };

    // Initial load 
    useEffect(() => {
        loadCategory(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // Filter/search changes
    useEffect(() => {
        if (loading) return;
        const timer = setTimeout(() => loadCategory(false), 300);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, filter]);

    useEffect(() => {
        setSelectedIds(new Set());
    }, [id, search, filter]);

    const sortedDocuments = useMemo(() => {
        if (!category?.documents) return [];
        const docs = [...category.documents];

        switch (sortBy) {
            case "name":
                return docs.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
            case "expiry-asc":
                return docs.sort((a, b) => {
                    if (!a.expiryDate && !b.expiryDate) return 0;
                    if (!a.expiryDate) return 1;
                    if (!b.expiryDate) return -1;
                    return new Date(a.expiryDate) - new Date(b.expiryDate);
                });
            case "expiry-desc":
                return docs.sort((a, b) => {
                    if (!a.expiryDate && !b.expiryDate) return 0;
                    if (!a.expiryDate) return 1;
                    if (!b.expiryDate) return -1;
                    return new Date(b.expiryDate) - new Date(a.expiryDate);
                });
            case "updated":
                return docs.sort((a, b) => {
                    const aTime = a.scannedAt ? new Date(a.scannedAt).getTime() : 0;
                    const bTime = b.scannedAt ? new Date(b.scannedAt).getTime() : 0;
                    return bTime - aTime;
                });
            case "recent":
            default:
                return docs.sort((a, b) => (b.id || 0) - (a.id || 0));
        }
    }, [category, sortBy]);

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

    // ============ SELECTION HANDLERS ============
    const toggleSelect = (docId, e) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(docId)) next.delete(docId);
            else next.add(docId);
            return next;
        });
    };

    const selectAll = () => {
        if (selectedIds.size === sortedDocuments.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(sortedDocuments.map((d) => d.id)));
        }
    };

    const clearSelection = () => setSelectedIds(new Set());

    // ============ ZIP DOWNLOAD ============
    const downloadZip = async (documentIds = null) => {
        setDownloadingZip(true);
        try {
            const token = localStorage.getItem("accessToken");
            let url;
            let requestOptions;

            if (documentIds && documentIds.length > 0) {
                url = `${API_BASE}/documents/bulk-download`;
                requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ documentIds }),
                };
            } else {
                url = `${API_BASE}/categories/${id}/download`;
                requestOptions = {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                };
            }

            const response = await fetch(url, requestOptions);
            if (!response.ok) throw new Error("Download failed");

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = downloadUrl;

            const filename = documentIds
                ? `documents-${new Date().toISOString().slice(0, 10)}.zip`
                : `${category?.name || "category"}.zip`;

            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(downloadUrl);
            a.remove();

            toast.success(documentIds
                ? `Downloaded ${documentIds.length} document${documentIds.length !== 1 ? "s" : ""}`
                : "Category downloaded"
            );
        } catch (err) {
            console.error(err);
            toast.error("Failed to download ZIP. Please try again.");
        } finally {
            setDownloadingZip(false);
        }
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
                backTo="/app"
                breadcrumbs={[
                    {
                        label: "Dashboard",
                        to: "/app",
                        icon: <DashboardIcon sx={{ fontSize: 14, mr: 0.5 }} />,
                    },
                    { label: category?.name || "..." },
                ]}
                titleAdornment={
                    category && (
                        <CategoryActionMenu
                            category={category}
                            onRename={() => setEditOpen(true)}
                            onDownloadZip={() => downloadZip()}
                            onDelete={() => setDeleteOpen(true)}
                            disabled={loading || downloadingZip}
                        />
                    )
                }
                action={
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate(`/categories/${id}/upload`)}
                        fullWidth
                        sx={{
                            boxShadow: "0 4px 14px -4px rgba(139, 92, 246, 0.5)",
                            whiteSpace: "nowrap",
                        }}
                    >
                        Upload Document
                    </Button>
                }
            />

            {/* Stats Bar */}
            {!loading && category && (
                <CategoryStatsBar documents={category.documents || []} />
            )}

            {/* ============ TOOLBAR ============ */}
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
                {/* Search — full width on mobile */}
                <TextField
                    placeholder="Search documents..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    size="small"
                    sx={{
                        flex: { xs: "1 1 100%", md: 1 },
                        minWidth: { xs: "100%", md: 240 },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Filter toggles */}
                <ToggleButtonGroup
                    value={filter}
                    exclusive
                    onChange={(e, v) => v && setFilter(v)}
                    size="small"
                    sx={{
                        flex: { xs: "1 1 100%", sm: "0 0 auto" },
                        "& .MuiToggleButton-root": {
                            flex: { xs: 1, sm: "0 0 auto" },
                        },
                    }}
                >
                    <ToggleButton value="all" sx={{ px: 2 }}>All</ToggleButton>
                    <ToggleButton value="expiring" sx={{ px: 2 }}>Expiring</ToggleButton>
                    <ToggleButton value="expired" sx={{ px: 2 }}>Expired</ToggleButton>
                    <ToggleButton value="no-date" sx={{ px: 2 }}>No Date</ToggleButton>
                </ToggleButtonGroup>

                {/* Sort + View Toggle group */}
                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                        flex: { xs: "1 1 100%", sm: "0 0 auto" },
                        justifyContent: { xs: "space-between", sm: "flex-start" },
                    }}
                >
                    <SortDropdown value={sortBy} onChange={setSortBy} />
                    <ViewToggle value={viewMode} onChange={setViewMode} />
                </Box>
            </Box>

            {/* Bulk Actions Bar */}
            <BulkActionsBar
                selectedCount={selectedIds.size}
                totalCount={sortedDocuments.length}
                onDownloadZip={() => downloadZip(Array.from(selectedIds))}
                onMove={() => setBulkMoveOpen(true)}
                onDelete={() => setBulkDeleteOpen(true)}
                onSelectAll={selectAll}
                onClear={clearSelection}
                processing={downloadingZip}
            />

            {/* ============ DOCUMENTS DISPLAY ============ */}
            <Box sx={{ position: "relative", minHeight: 200 }}>
                {/* ============ SUBTLE REFRESH OVERLAY ============ */}
                {refreshing && (
                    <Box
                        sx={{
                            position: "absolute",
                            inset: 0,
                            zIndex: 5,
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "center",
                            pt: 4,
                            pointerEvents: "none",
                            animation: "fadeIn 0.15s ease",
                            "@keyframes fadeIn": {
                                "0%": { opacity: 0 },
                                "100%": { opacity: 1 },
                            },
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                px: 2,
                                py: 1,
                                borderRadius: 10,
                                bgcolor: "background.paper",
                                border: "1px solid",
                                borderColor: "primary.main",
                                boxShadow: "0 4px 20px -4px rgba(139, 92, 246, 0.4)",
                            }}
                        >
                            <Box
                                sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: "50%",
                                    border: "2px solid",
                                    borderColor: "primary.main",
                                    borderTopColor: "transparent",
                                    animation: "spin 0.8s linear infinite",
                                    "@keyframes spin": {
                                        "0%": { transform: "rotate(0deg)" },
                                        "100%": { transform: "rotate(360deg)" },
                                    },
                                }}
                            />
                            <Typography
                                sx={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: "0.6875rem",
                                    fontWeight: 700,
                                    letterSpacing: "0.08em",
                                    color: "primary.main",
                                    textTransform: "uppercase",
                                }}
                            >
                                Filtering...
                            </Typography>
                        </Box>
                    </Box>
                )}

                {/* ============ CONTENT (with fade effect during refresh) ============ */}
                <Box
                    sx={{
                        transition: "opacity 0.2s ease",
                        opacity: refreshing ? 0.4 : 1,
                        pointerEvents: refreshing ? "none" : "auto",
                    }}
                >
                    {loading ? (
                        viewMode === "grid" ? (
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
                        ) : (
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                {[1, 2, 3, 4].map((i) => (
                                    <Skeleton key={i} variant="rounded" height={72} sx={{ borderRadius: 2 }} />
                                ))}
                            </Box>
                        )
                    ) : sortedDocuments.length === 0 ? (
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
                    ) : viewMode === "list" ? (
                        // ============ LIST VIEW ============
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            {sortedDocuments.map((doc) => (
                                <DocumentListRow
                                    key={doc.id}
                                    doc={doc}
                                    isSelected={selectedIds.has(doc.id)}
                                    onToggleSelect={toggleSelect}
                                    onOpen={() => navigate(`/documents/${doc.id}`)}
                                />
                            ))}

                            {/* Ghost upload row */}
                            <Box
                                onClick={() => navigate(`/categories/${id}/upload`)}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 1.5,
                                    px: 2,
                                    py: 2,
                                    borderRadius: 2,
                                    border: "1.5px dashed",
                                    borderColor: "divider",
                                    cursor: "pointer",
                                    transition: "all 0.15s ease",
                                    color: "text.secondary",
                                    "&:hover": {
                                        borderColor: "primary.main",
                                        bgcolor: "action.hover",
                                        color: "primary.main",
                                    },
                                }}
                            >
                                <CloudUploadIcon sx={{ fontSize: 20 }} />
                                <Typography variant="body2" fontWeight={500}>
                                    Upload Document
                                </Typography>
                            </Box>
                        </Box>
                    ) : (
                        // ============ GRID VIEW ============
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
                            {/* ... your existing grid cards code (unchanged) ... */}
                            {sortedDocuments.map((doc) => {
                                const isSelected = selectedIds.has(doc.id);
                                return (
                                    <Card
                                        key={doc.id}
                                        sx={{
                                            height: "100%",
                                            position: "relative",
                                            transition: "all 0.2s ease",
                                            borderColor: isSelected ? "primary.main" : undefined,
                                            boxShadow: isSelected
                                                ? "0 8px 24px -8px rgba(139, 92, 246, 0.5)"
                                                : undefined,
                                            "&:hover": {
                                                borderColor: "primary.main",
                                                transform: "translateY(-2px)",
                                                boxShadow: "0 8px 24px -8px rgba(139, 92, 246, 0.35)",
                                                "& .doc-checkbox": {
                                                    opacity: 1,
                                                },
                                            },
                                            ...(isSelected && {
                                                "& .doc-checkbox": {
                                                    opacity: 1,
                                                },
                                            }),
                                        }}
                                    >
                                        <Checkbox
                                            className="doc-checkbox"
                                            checked={isSelected}
                                            onClick={(e) => toggleSelect(doc.id, e)}
                                            onMouseDown={(e) => e.stopPropagation()}
                                            size="small"
                                            sx={{
                                                position: "absolute",
                                                top: 8,
                                                left: 8,
                                                zIndex: 2,
                                                opacity: isSelected ? 1 : 0,
                                                transition: "opacity 0.15s ease",
                                                bgcolor: "background.paper",
                                                borderRadius: 1,
                                                p: 0.5,
                                                "&:hover": {
                                                    bgcolor: "background.paper",
                                                },
                                                color: "text.disabled",
                                                "&.Mui-checked": {
                                                    color: "primary.main",
                                                },
                                            }}
                                        />

                                        <CardActionArea
                                            onClick={() => navigate(`/documents/${doc.id}`)}
                                            sx={{ height: "100%" }}
                                        >
                                            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
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
                                );
                            })}

                            {/* Ghost "Upload Document" card */}
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
            </Box>

            {/* ============ MODALS ============ */}
            <EditCategoryModal
                open={editOpen}
                onClose={() => setEditOpen(false)}
                category={category}
                onUpdated={() => { loadCategory(); }}
            />

            <DeleteCategoryModal
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                category={category}
                onDeleted={() => navigate("/app")}
            />

            <BulkMoveModal
                open={bulkMoveOpen}
                onClose={() => setBulkMoveOpen(false)}
                selectedDocIds={Array.from(selectedIds)}
                currentCategoryId={parseInt(id)}
                onMoved={() => {
                    clearSelection();
                    loadCategory();
                }}
            />

            <BulkDeleteModal
                open={bulkDeleteOpen}
                onClose={() => setBulkDeleteOpen(false)}
                selectedDocIds={Array.from(selectedIds)}
                onDeleted={() => {
                    clearSelection();
                    loadCategory();
                }}
            />
        </Box>
    );
}