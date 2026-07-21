import React from "react";
import { Typography, Container } from "@mui/material";

export default function Dashboard() {
    return (
        <Container>
            <Typography variant="h4" mt={10}>Dashboard</Typography>
            <Typography mt={2}>
                Welcome! Manage your documents safely and easily.
            </Typography>
        </Container>
    );
}
