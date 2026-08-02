import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import CommandPalette from "./components/CommandPalette";

import Login from "./pages/Login";
import OAuthSuccess from "./pages/OAuthSuccess";
import Dashboard from "./pages/Dashboard";
import CategoryDetail from "./pages/CategoryDetail";
import UploadDocument from "./pages/UploadDocument";
import DocumentDetail from "./pages/DocumentDetail";

// Check if JWT is valid (not expired)
function isTokenValid(token) {
    if (!token) return false;
    
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const now = Math.floor(Date.now() / 1000);
        // 5-second buffer for clock drift
        return payload.exp && payload.exp > now + 5;
    } catch (err) {
        console.error("Invalid JWT format:", err);
        return false;
    }
}

function ProtectedRoute({ children }) {
    const token = localStorage.getItem("accessToken");
    
    if (!isTokenValid(token)) {
        // Clean up expired/invalid token
        localStorage.removeItem("accessToken");
        localStorage.removeItem("email");
        return <Navigate to="/login" replace />;
    }
    
    return children;
}

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <CommandPalette />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/oauth-success" element={<OAuthSuccess />} />
                    <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/categories/:id" element={<ProtectedRoute><CategoryDetail /></ProtectedRoute>} />
                    <Route path="/categories/:id/upload" element={<ProtectedRoute><UploadDocument /></ProtectedRoute>} />
                    <Route path="/documents/:id" element={<ProtectedRoute><DocumentDetail /></ProtectedRoute>} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;