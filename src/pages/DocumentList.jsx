import React, { useEffect, useState } from "react";
import { Container, Card, CardContent, Typography, Grid, CardActionArea } from "@mui/material";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function DocumentList() {
    const [documents, setDocuments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/documents")
            .then((res) => setDocuments(res.data))
            .catch((err) => console.error("Failed to load documents:", err));
    }, []);

    return (
        <Container>
            <Typography variant="h4" mt={10}>Your Documents</Typography>

            {documents.length === 0 && (
                <Typography mt={2} color="text.secondary">
                    No documents yet. Upload your first document.
                </Typography>
            )}

            <Grid container spacing={2} mt={2}>
                {documents.map((doc) => (
                    <Grid item xs={12} md={4} key={doc.id}>
                        <Card>
                            <CardActionArea onClick={() => navigate(`/documents/${doc.id}`)}>
                                <CardContent>
                                    <Typography variant="h6">{doc.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {doc.fileType}
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
        </Container>
    );
}