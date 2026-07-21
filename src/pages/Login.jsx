import React from "react";
import { Button, Container, Typography, Box } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

export default function Login() {
    const handleLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
    };

    return (
        <Container maxWidth="sm">
            <Box textAlign="center" mt={15}>
                <Typography variant="h4" gutterBottom>
                    Digital Document Organizer
                </Typography>

                <Button
                    variant="contained"
                    startIcon={<GoogleIcon />}
                    fullWidth
                    size="large"
                    onClick={handleLogin}
                >
                    Sign in with Google
                </Button>
            </Box>
        </Container>
    );
}
