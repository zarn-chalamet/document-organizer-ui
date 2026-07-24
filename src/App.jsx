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
import Chat from "./pages/Chat";

function ProtectedRoute({ children }) {
    const token = localStorage.getItem("accessToken");
    if (!token) return <Navigate to="/login" replace />;
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
                    <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;