import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Login from "./pages/Login";
import OAuthSuccess from "./pages/OAuthSuccess";
import Dashboard from "./pages/Dashboard";
import UploadDocument from "./pages/UploadDocument";
import DocumentList from "./pages/DocumentList";
import DocumentDetail from "./pages/DocumentDetail";

// Route protection wrapper
function ProtectedRoute({ children }) {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
}

function App() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <BrowserRouter>
            <Navbar onMenuClick={() => setSidebarOpen(true)} />
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/oauth-success" element={<OAuthSuccess />} />

                <Route path="/" element={
                    <ProtectedRoute><Dashboard /></ProtectedRoute>
                } />
                <Route path="/upload" element={
                    <ProtectedRoute><UploadDocument /></ProtectedRoute>
                } />
                <Route path="/documents" element={
                    <ProtectedRoute><DocumentList /></ProtectedRoute>
                } />
                <Route path="/documents/:id" element={
                    <ProtectedRoute><DocumentDetail /></ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;