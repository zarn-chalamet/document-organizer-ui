import React, { useEffect, useState } from "react";
import {
    Container, Typography, Grid, Card, CardContent, CardActionArea,
    Button, Box, IconButton, TextField, ToggleButton, ToggleButtonGroup, InputAdornment
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DescriptionIcon from "@mui/icons-material/Description";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

export default function CategoryDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
            setError("Could not load category");
        } finally {
            setLoading(false);
        }
    };

    // Reload when search or filter changes (with small debounce for search)
    useEffect(() => {
        const timer = setTimeout(() => {
            loadCategory();
        }, 300);
        return () => clearTimeout(timer);
    }, [id, search, filter]);

    if (loading && !category) {
        return <Container><Typography mt={10}>Loading...</Typography></Container>;
    }

    if (error || !category) {
        return <Container><Typography mt={10} color="error">{error || "Not found"}</Typography></Container>;
    }

    return (
        <Container>
            <Box mt={10}>
                <IconButton onClick={() => navigate("/")} sx={{ mb: 1 }}>
                    <ArrowBackIcon />
                </IconButton>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="h4">{category.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {category.type === "CUSTOM" ? category.customType : category.type.replace("_", " ")}
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate(`/categories/${id}/upload`)}
                    >
                        Upload Document
                    </Button>
                </Box>

                {/* Search + Filter Bar */}
                <Box mt={3} display="flex" gap={2} flexWrap="wrap">
                    <TextField
                        placeholder="Search by title or description..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        size="small"
                        sx={{ flex: 1, minWidth: 250 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
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
                        <ToggleButton value="all">All</ToggleButton>
                        <ToggleButton value="expiring">Expiring Soon</ToggleButton>
                        <ToggleButton value="expired">Expired</ToggleButton>
                        <ToggleButton value="no-date">No Date</ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                {(!category.documents || category.documents.length === 0) && (
                    <Box mt={5} textAlign="center">
                        <Typography color="text.secondary">
                            {search || filter !== "all"
                                ? "No documents match your filter."
                                : "No documents yet. Upload your first document."}
                        </Typography>
                    </Box>
                )}

                <Grid container spacing={2} mt={2}>
                    {category.documents && category.documents.map((doc) => (
                        <Grid item xs={12} sm={6} md={4} key={doc.id}>
                            <Card>
                                <CardActionArea onClick={() => navigate(`/documents/${doc.id}`)}>
                                    <CardContent>
                                        <Box display="flex" alignItems="center" mb={1}>
                                            <DescriptionIcon color="primary" sx={{ mr: 1 }} />
                                            <Typography variant="h6" noWrap>{doc.title}</Typography>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" noWrap>
                                            {doc.description || "No description"}
                                        </Typography>
                                        {doc.expiryDate && (
                                            <Typography variant="caption" display="block" mt={1}>
                                                Expires: {doc.expiryDate}
                                            </Typography>
                                        )}
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
}