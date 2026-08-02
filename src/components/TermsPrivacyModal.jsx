import React from "react";
import {
    Dialog, DialogContent, Typography, Box, IconButton, Tabs, Tab, Divider
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";

export default function TermsPrivacyModal({ open, onClose, initialTab = 0 }) {
    const [tab, setTab] = React.useState(initialTab);

    React.useEffect(() => {
        if (open) setTab(initialTab);
    }, [open, initialTab]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: 3,
                        maxHeight: "85vh",
                        overflow: "hidden",
                        position: "relative",
                    },
                },
            }}
        >
            {/* Ambient glow */}
            <Box
                sx={{
                    position: "absolute",
                    top: -80,
                    right: -80,
                    width: 300,
                    height: 300,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
                    filter: "blur(50px)",
                    pointerEvents: "none",
                }}
            />

            {/* ============ HEADER ============ */}
            <Box sx={{ px: 3.5, pt: 3, pb: 0, position: "relative" }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
                    <Box>
                        <Typography
                            sx={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: "0.6875rem",
                                fontWeight: 700,
                                letterSpacing: "0.1em",
                                color: "primary.main",
                                textTransform: "uppercase",
                                mb: 0.5,
                            }}
                        >
                            Legal · PDPA Compliant
                        </Typography>
                        <Typography variant="h6" fontWeight={700} letterSpacing="-0.02em">
                            Terms & Privacy
                        </Typography>
                    </Box>
                    <IconButton size="small" onClick={onClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>

                <Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    sx={{
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        "& .MuiTab-root": {
                            textTransform: "none",
                            fontWeight: 600,
                            fontSize: "0.875rem",
                            minHeight: 44,
                        },
                        "& .Mui-selected": { color: "primary.main" },
                        "& .MuiTabs-indicator": {
                            height: 2,
                            background: "linear-gradient(90deg, #8B5CF6, #7C3AED)",
                        },
                    }}
                >
                    <Tab
                        icon={<DescriptionOutlinedIcon sx={{ fontSize: 18 }} />}
                        iconPosition="start"
                        label="Terms of Service"
                    />
                    <Tab
                        icon={<ShieldOutlinedIcon sx={{ fontSize: 18 }} />}
                        iconPosition="start"
                        label="Privacy Policy"
                    />
                </Tabs>
            </Box>

            {/* ============ CONTENT ============ */}
            <DialogContent sx={{ px: 3.5, py: 3, position: "relative" }}>
                {tab === 0 ? <TermsContent /> : <PrivacyContent />}
            </DialogContent>

            {/* ============ FOOTER ============ */}
            <Divider />
            <Box sx={{ px: 3.5, py: 2, textAlign: "center" }}>
                <Typography
                    sx={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.6875rem",
                        color: "text.disabled",
                        letterSpacing: "0.1em",
                    }}
                >
                    LAST UPDATED · JANUARY 2025 · V1.0
                </Typography>
            </Box>
        </Dialog>
    );
}

// ============ REUSABLE STYLED SECTION ============
function Section({ title, children }) {
    return (
        <Box sx={{ mb: 3.5 }}>
            <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{ mb: 1, fontSize: "1rem", color: "text.primary" }}
            >
                {title}
            </Typography>
            <Box sx={{ color: "text.secondary", fontSize: "0.875rem", lineHeight: 1.7 }}>
                {children}
            </Box>
        </Box>
    );
}

// ============ TERMS CONTENT ============
function TermsContent() {
    return (
        <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontStyle: "italic" }}>
                Welcome to Organizer! By using our service, you agree to these terms. Please read them carefully.
            </Typography>

            <Section title="1. Acceptance of Terms">
                By accessing or using Organizer ("the Service"), you agree to be bound by these Terms of Service.
                If you do not agree, please do not use the Service.
            </Section>

            <Section title="2. Description of Service">
                Organizer is a document management application that helps you organize, track, and search important
                documents (such as passports, visas, and work permits). Your files are stored in your own Google Drive —
                we never store them on our servers.
            </Section>

            <Section title="3. User Accounts">
                <ul style={{ paddingLeft: 20, margin: 0 }}>
                    <li>You must sign in using a valid Google account.</li>
                    <li>You are responsible for maintaining the security of your Google account.</li>
                    <li>You must be at least 18 years old to use this Service.</li>
                    <li>You may not use the Service for any illegal or unauthorized purpose.</li>
                </ul>
            </Section>

            <Section title="4. Your Content">
                You retain full ownership of all documents you upload. Since your files are stored in your own Google
                Drive, we do not claim any rights to your content. You can revoke our access to your Drive at any time
                via your Google Account settings.
            </Section>

            <Section title="5. AI Processing">
                Organizer uses AI to extract information (such as expiry dates) from your documents and to provide
                a conversational assistant. By using the Service, you consent to:
                <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                    <li>OCR processing via Google Cloud Vision (transient, not stored).</li>
                    <li>Text embedding generation (runs locally on our servers).</li>
                    <li>Sending small text snippets to Groq for AI-powered answers.</li>
                </ul>
                No user identifiers or raw files are ever sent to third-party AI providers.
            </Section>

            <Section title="6. Acceptable Use">
                You agree NOT to:
                <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                    <li>Upload illegal, harmful, or infringing content.</li>
                    <li>Attempt to reverse engineer, hack, or disrupt the Service.</li>
                    <li>Use the Service to store other people's documents without their consent.</li>
                    <li>Abuse the AI assistant or attempt to extract other users' data.</li>
                </ul>
            </Section>

            <Section title="7. Service Availability">
                We strive to keep Organizer available 24/7, but we do not guarantee uninterrupted access.
                We may perform maintenance, updates, or modifications at any time.
            </Section>

            <Section title="8. Termination">
                You may delete your account at any time. Upon deletion, all your metadata, embeddings, and
                references are permanently removed from our systems. Your files in Google Drive remain untouched
                and under your control.
            </Section>

            <Section title="9. Limitation of Liability">
                Organizer is provided "as is" without warranties of any kind. We are not liable for lost data,
                missed expiry dates, or any damages arising from your use of the Service. Always keep independent
                backups of important documents.
            </Section>

            <Section title="10. Changes to Terms">
                We may update these Terms from time to time. Significant changes will require your re-acceptance
                before continuing to use the Service.
            </Section>

            <Section title="11. Contact">
                Questions about these Terms? Reach out at{" "}
                <Box
                    component="a"
                    href="mailto:support@organizer.app"
                    sx={{
                        color: "primary.main",
                        textDecoration: "none",
                        fontWeight: 500,
                        "&:hover": { textDecoration: "underline" },
                    }}
                >
                    support@organizer.app
                </Box>
            </Section>
        </Box>
    );
}

// ============ PRIVACY CONTENT ============
function PrivacyContent() {
    return (
        <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontStyle: "italic" }}>
                Your privacy is our foundation, not an afterthought. This policy explains what data we collect,
                how we use it, and the choices you have.
            </Typography>

            {/* KEY POINTS BOX */}
            <Box
                sx={{
                    p: 2.25,
                    mb: 3,
                    borderRadius: 2,
                    bgcolor: "rgba(16, 185, 129, 0.06)",
                    border: "1px solid rgba(16, 185, 129, 0.2)",
                }}
            >
                <Typography
                    sx={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.6875rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        color: "#10B981",
                        textTransform: "uppercase",
                        mb: 1.25,
                    }}
                >
                    ✓ Privacy in Plain Language
                </Typography>
                <Box component="ul" sx={{ pl: 2.5, m: 0, "& li": { mb: 0.5, fontSize: "0.8125rem" } }}>
                    <li>Your files stay in YOUR Google Drive — we never store them.</li>
                    <li>We only store metadata (title, expiry date, category).</li>
                    <li>We never sell your data or show you ads.</li>
                    <li>Delete your account → everything is permanently removed.</li>
                    <li>Fully compliant with Thailand's PDPA law.</li>
                </Box>
            </Box>

            <Section title="1. Information We Collect">
                <strong style={{ color: "inherit" }}>From Google OAuth:</strong>
                <ul style={{ paddingLeft: 20, marginTop: 4 }}>
                    <li>Your name and email address</li>
                    <li>Google Drive access token (to upload/download your files)</li>
                </ul>
                <strong style={{ color: "inherit", display: "block", marginTop: 12 }}>From Documents You Upload:</strong>
                <ul style={{ paddingLeft: 20, marginTop: 4 }}>
                    <li>Document metadata (title, description, expiry date)</li>
                    <li>Extracted text (for search and AI features)</li>
                    <li>Text embeddings (numeric vectors for semantic search)</li>
                </ul>
                <strong style={{ color: "inherit", display: "block", marginTop: 12 }}>What We DO NOT Collect:</strong>
                <ul style={{ paddingLeft: 20, marginTop: 4 }}>
                    <li>Your actual document files (they stay in your Drive)</li>
                    <li>Your Google password</li>
                    <li>Location data, browsing history, or advertising IDs</li>
                </ul>
            </Section>

            <Section title="2. How We Use Your Information">
                <ul style={{ paddingLeft: 20, margin: 0 }}>
                    <li>To provide the document organization service</li>
                    <li>To send expiry reminders via email (Gmail SMTP)</li>
                    <li>To power AI features (OCR, expiry extraction, chat assistant)</li>
                    <li>To enable semantic search across your documents</li>
                </ul>
            </Section>

            <Section title="3. Third-Party Services">
                We use a small number of trusted providers, each with a specific purpose:
                <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                    <li>
                        <strong>Google Drive</strong> — stores your files (you already trust Google)
                    </li>
                    <li>
                        <strong>Google Cloud Vision</strong> — OCR processing (transient, not stored per Google's policy)
                    </li>
                    <li>
                        <strong>Groq</strong> — AI language model (receives only small text snippets, no files, no identifiers)
                    </li>
                </ul>
                We do NOT use analytics trackers, advertising networks, or social media pixels.
            </Section>

            <Section title="4. Data Storage & Security">
                <ul style={{ paddingLeft: 20, margin: 0 }}>
                    <li>Metadata is stored in an encrypted PostgreSQL database</li>
                    <li>JWT sessions expire after 2 days</li>
                    <li>Every query is scoped to your user ID — impossible to leak across users</li>
                    <li>All communications use HTTPS/TLS in production</li>
                </ul>
            </Section>

            <Section title="5. PDPA Compliance (Thailand)">
                We follow all core PDPA principles:
                <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                    <li>
                        <strong>Data Minimization</strong> — we only collect what we absolutely need
                    </li>
                    <li>
                        <strong>Purpose Limitation</strong> — your data is used only for the stated purpose
                    </li>
                    <li>
                        <strong>Storage Limitation</strong> — cascade delete removes all traces
                    </li>
                    <li>
                        <strong>User Control</strong> — you own and control your data at all times
                    </li>
                </ul>
            </Section>

            <Section title="6. Your Rights">
                You have the right to:
                <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                    <li>Access all data we hold about you</li>
                    <li>Delete your account and all associated data</li>
                    <li>Revoke Google Drive access at any time</li>
                    <li>Export your metadata (JSON format available on request)</li>
                    <li>Withdraw consent for AI processing</li>
                </ul>
            </Section>

            <Section title="7. Data Retention">
                We retain your data only as long as your account is active. When you delete your account:
                <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                    <li>All metadata is deleted immediately</li>
                    <li>All text embeddings are removed</li>
                    <li>Your Google Drive files remain untouched (you own them)</li>
                    <li>Backups are purged within 30 days</li>
                </ul>
            </Section>

            <Section title="8. Children's Privacy">
                Organizer is not intended for users under 18. We do not knowingly collect information from minors.
            </Section>

            <Section title="9. Changes to This Policy">
                We may update this Privacy Policy from time to time. Material changes will be communicated
                via email and require your re-acceptance before continuing to use the Service.
            </Section>

            <Section title="10. Contact">
                For privacy questions or to exercise your rights, contact us at{" "}
                <Box
                    component="a"
                    href="mailto:privacy@organizer.app"
                    sx={{
                        color: "primary.main",
                        textDecoration: "none",
                        fontWeight: 500,
                        "&:hover": { textDecoration: "underline" },
                    }}
                >
                    privacy@organizer.app
                </Box>
            </Section>
        </Box>
    );
}