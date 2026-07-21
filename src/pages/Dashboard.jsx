import React, { useEffect, useState } from "react";
import {
    Container, Typography, Grid, Card, CardContent, CardActionArea,
    Button, Box, IconButton, Menu, MenuItem
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FolderIcon from "@mui/icons-material/Folder";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import CreateCategoryModal from "../components/CreateCategoryModal";
import EditCategoryModal from "../components/EditCategoryModal";
import DeleteCategoryModal from "../components/DeleteCategoryModal";

export default function Dashboard() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [menuCategory, setMenuCategory] = useState(null);

    const navigate = useNavigate();

    const loadCategories = async () => {
        setLoading(true);
        try {
            const res = await api.get("/categories");
            setCategories(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
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

    return (
        <Container>
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={10}>
                <Typography variant="h4">My Categories</Typography>
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
                                            <Typography variant="h6" noWrap>
                                                {cat.name}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            {cat.type === "CUSTOM"
                                                ? cat.customType
                                                : cat.type.replace("_", " ")}
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
                onCreated={loadCategories}
            />

            <EditCategoryModal
                open={editOpen}
                onClose={() => setEditOpen(false)}
                category={selectedCategory}
                onUpdated={loadCategories}
            />

            <DeleteCategoryModal
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                category={selectedCategory}
                onDeleted={loadCategories}
            />
        </Container>
    );
}