import React, { useEffect, useState } from "react";
import {
    Container, Typography, Grid, Card, CardContent, CardActionArea,
    Button, Box, IconButton, Menu, MenuItem, Paper
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FolderIcon from "@mui/icons-material/Folder";
import DescriptionIcon from "@mui/icons-material/Description";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import CreateCategoryModal from "../components/CreateCategoryModal";
import EditCategoryModal from "../components/EditCategoryModal";
import DeleteCategoryModal from "../components/DeleteCategoryModal";

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

    const loadData = async () => {
        setLoading(true);
        try {
            const [catRes, sumRes] = await Promise.all([
                api.get("/categories"),
                api.get("/dashboard/summary")
            ]);
            setCategories(catRes.data);
            setSummary(sumRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const openMenu = (e, category) => {
        e.stopPropagation();
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

    const StatCard = ({ icon, label, value, color }) => (
        <Paper sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ color, display: "flex" }}>{icon}</Box>
            <Box>
                <Typography variant="h5">{value}</Typography>
                <Typography variant="caption" color="text.secondary">{label}</Typography>
            </Box>
        </Paper>
    );

    return (
        <Container>
            <Box mt={10}>
                <Typography variant="h4">Dashboard</Typography>

                {/* Summary Cards */}
                {summary && (
                    <Grid container spacing={2} mt={1}>
                        <Grid item xs={6} md={3}>
                            <StatCard
                                icon={<FolderIcon fontSize="large" />}
                                label="Categories"
                                value={summary.totalCategories}
                                color="primary.main"
                            />
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <StatCard
                                icon={<DescriptionIcon fontSize="large" />}
                                label="Total Documents"
                                value={summary.totalDocuments}
                                color="info.main"
                            />
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <StatCard
                                icon={<WarningAmberIcon fontSize="large" />}
                                label="Expiring Soon (30d)"
                                value={summary.expiringSoonCount}
                                color="warning.main"
                            />
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <StatCard
                                icon={<EventBusyIcon fontSize="large" />}
                                label="Expired"
                                value={summary.expiredCount}
                                color="error.main"
                            />
                        </Grid>
                    </Grid>
                )}

                {/* Categories */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={5}>
                    <Typography variant="h5">My Categories</Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setCreateOpen(true)}
                    >
                        Create Category
                    </Button>
                </Box>

                {loading && <Typography mt={3}>Loading...</Typography>}

                {!loading && categories.length === 0 && (
                    <Box mt={5} textAlign="center">
                        <Typography color="text.secondary">
                            No categories yet. Create one to get started.
                        </Typography>
                    </Box>
                )}

                <Grid container spacing={2} mt={2}>
                    {categories.map((cat) => (
                        <Grid item xs={12} sm={6} md={4} key={cat.id}>
                            <Card>
                                <Box position="relative">
                                    <CardActionArea onClick={() => navigate(`/categories/${cat.id}`)}>
                                        <CardContent>
                                            <Box display="flex" alignItems="center" mb={1}>
                                                <FolderIcon color="primary" sx={{ mr: 1 }} />
                                                <Typography variant="h6" noWrap>{cat.name}</Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary">
                                                {cat.type === "CUSTOM" ? cat.customType : cat.type.replace("_", " ")}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {cat.documentCount} document(s)
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => openMenu(e, cat)}
                                        sx={{ position: "absolute", top: 8, right: 8 }}
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
                    <MenuItem onClick={handleEdit}>Edit</MenuItem>
                    <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>Delete</MenuItem>
                </Menu>

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
        </Container>
    );
}