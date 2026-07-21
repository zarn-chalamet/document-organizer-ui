import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import api from "../api/axios";
import { useParams } from "react-router-dom";

export default function DocumentDetail() {
    const { id } = useParams();
    const [doc, setDoc] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get(`/documents/${id}`)
            .then((res) => setDoc(res.data))
            .catch((err) => {
                console.error(err);
                setError("Could not load document");
            });
    }, [id]);

    if (error) {
        return (
            <Container>
                <Typography color="error" mt={10}>{error}</Typography>
            </Container>
        );
    }

    if (!doc) {
        return (
            <Container>
                <Typography mt={10}>Loading...</Typography>
            </Container>
        );
    }

    return (
        <Container>
            <Box mt={10}>
                <Typography variant="h4">{doc.title}</Typography>
                <Typography mt={2}>{doc.description}</Typography>
                <Typography mt={1} color="text.secondary">
                    Type: {doc.fileType}
                </Typography>
                {doc.expiryDate && (
                    <Typography mt={1} color="text.secondary">
                        Expires on: {doc.expiryDate}
                    </Typography>
                )}

                <Button
                    variant="contained"
                    sx={{ mt: 3 }}
                    href={doc.driveFileLink}
                    target="_blank"
                >
                    Open in Google Drive
                </Button>
            </Box>
        </Container>
    );
}