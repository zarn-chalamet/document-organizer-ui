import { createTheme } from "@mui/material/styles";

const commonTypography = {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: { fontSize: "2.5rem", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1 },
    h2: { fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.15 },
    h3: { fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.2 },
    h4: { fontSize: "1.5rem", fontWeight: 600, letterSpacing: "-0.025em", lineHeight: 1.25 },
    h5: { fontSize: "1.25rem", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.3 },
    h6: { fontSize: "1rem", fontWeight: 600, letterSpacing: "-0.015em", lineHeight: 1.4 },
    body1: { fontSize: "0.9375rem", lineHeight: 1.6, letterSpacing: "-0.005em" },
    body2: { fontSize: "0.875rem", lineHeight: 1.5, letterSpacing: "-0.005em" },
    caption: { fontSize: "0.75rem", lineHeight: 1.4, letterSpacing: "-0.005em" },
    button: { textTransform: "none", fontWeight: 500, letterSpacing: "-0.01em" },
};

const darkPalette = {
    mode: "dark",
    primary: {
        main: "#8B5CF6",
        light: "#A78BFA",
        dark: "#7C3AED",
        contrastText: "#FFFFFF",
    },
    secondary: { main: "#EC4899" },
    success: { main: "#10B981", light: "#064E3B" },
    warning: { main: "#F59E0B", light: "#78350F" },
    error: { main: "#EF4444", light: "#7F1D1D" },
    info: { main: "#3B82F6", light: "#1E3A8A" },
    background: {
        default: "#0A0A0B",
        paper: "#111113",
    },
    text: {
        primary: "#FAFAFA",
        secondary: "#A1A1AA",
        disabled: "#52525B",
    },
    divider: "#1F1F23",
    grey: {
        50: "#FAFAFA",
        100: "#F4F4F5",
        200: "#E4E4E7",
        300: "#D4D4D8",
        400: "#A1A1AA",
        500: "#71717A",
        600: "#52525B",
        700: "#3F3F46",
        800: "#27272A",
        900: "#18181B",
    },
};

const lightPalette = {
    mode: "light",
    primary: {
        main: "#8B5CF6",
        light: "#A78BFA",
        dark: "#7C3AED",
        contrastText: "#FFFFFF",
    },
    secondary: { main: "#EC4899" },
    success: { main: "#10B981", light: "#D1FAE5" },
    warning: { main: "#F59E0B", light: "#FEF3C7" },
    error: { main: "#EF4444", light: "#FEE2E2" },
    info: { main: "#3B82F6", light: "#DBEAFE" },
    background: {
        default: "#FAFAFA",
        paper: "#FFFFFF",
    },
    text: {
        primary: "#09090B",
        secondary: "#71717A",
        disabled: "#A1A1AA",
    },
    divider: "#E4E4E7",
    grey: {
        50: "#FAFAFA",
        100: "#F4F4F5",
        200: "#E4E4E7",
        300: "#D4D4D8",
        400: "#A1A1AA",
        500: "#71717A",
        600: "#52525B",
        700: "#3F3F46",
        800: "#27272A",
        900: "#18181B",
    },
};

export const createAppTheme = (mode) => {
    const isDark = mode === "dark";
    const palette = isDark ? darkPalette : lightPalette;

    return createTheme({
        palette,
        typography: commonTypography,
        shape: { borderRadius: 8 },
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        scrollbarWidth: "thin",
                        scrollbarColor: isDark ? "#27272A #0A0A0B" : "#D4D4D8 #FAFAFA",
                        "&::-webkit-scrollbar": { width: 8, height: 8 },
                        "&::-webkit-scrollbar-track": { background: isDark ? "#0A0A0B" : "#FAFAFA" },
                        "&::-webkit-scrollbar-thumb": {
                            background: isDark ? "#27272A" : "#D4D4D8",
                            borderRadius: 4,
                            "&:hover": { background: isDark ? "#3F3F46" : "#A1A1AA" },
                        },
                    },
                    "*::selection": {
                        background: "#8B5CF6",
                        color: "#FFFFFF",
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        padding: "8px 16px",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        boxShadow: "none",
                        transition: "all 0.15s ease",
                        "&:hover": { boxShadow: "none" },
                    },
                    contained: {
                        background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
                        "&:hover": {
                            background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
                            boxShadow: "0 0 20px rgba(139, 92, 246, 0.4)",
                        },
                    },
                    outlined: {
                        borderColor: isDark ? "#27272A" : "#E4E4E7",
                        color: isDark ? "#FAFAFA" : "#09090B",
                        "&:hover": {
                            borderColor: isDark ? "#3F3F46" : "#D4D4D8",
                            background: isDark ? "#111113" : "#FAFAFA",
                        },
                    },
                    text: {
                        color: isDark ? "#A1A1AA" : "#71717A",
                        "&:hover": {
                            background: isDark ? "#111113" : "#F4F4F5",
                            color: isDark ? "#FAFAFA" : "#09090B",
                        },
                    },
                    sizeSmall: { padding: "4px 12px", fontSize: "0.8125rem" },
                    sizeLarge: { padding: "10px 20px", fontSize: "0.9375rem" },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 12,
                        border: `1px solid ${isDark ? "#1F1F23" : "#E4E4E7"}`,
                        background: isDark ? "#111113" : "#FFFFFF",
                        boxShadow: "none",
                        transition: "all 0.15s ease",
                        "&:hover": {
                            borderColor: isDark ? "#2A2A2E" : "#D4D4D8",
                            transform: "translateY(-1px)",
                        },
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: "none",
                        background: isDark ? "#111113" : "#FFFFFF",
                    },
                },
            },
            MuiTextField: {
                defaultProps: { variant: "outlined", size: "small" },
                styleOverrides: {
                    root: {
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 8,
                            fontSize: "0.9375rem",
                            background: isDark ? "#0A0A0B" : "#FFFFFF",
                            "& fieldset": { borderColor: isDark ? "#1F1F23" : "#E4E4E7" },
                            "&:hover fieldset": { borderColor: isDark ? "#2A2A2E" : "#D4D4D8" },
                            "&.Mui-focused fieldset": {
                                borderWidth: 1,
                                borderColor: "#8B5CF6",
                            },
                        },
                    },
                },
            },
            MuiChip: {
                styleOverrides: {
                    root: { fontWeight: 500, fontSize: "0.75rem", height: 24, borderRadius: 6 },
                },
            },
            MuiDialog: {
                styleOverrides: {
                    paper: {
                        borderRadius: 16,
                        border: `1px solid ${isDark ? "#1F1F23" : "#E4E4E7"}`,
                        background: isDark ? "#111113" : "#FFFFFF",
                        boxShadow: isDark
                            ? "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.3)"
                            : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
                    },
                },
                defaultProps: {
                    slotProps: {
                        backdrop: {
                            sx: {
                                backdropFilter: "blur(6px)",
                                backgroundColor: isDark ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.3)",
                            },
                        },
                    },
                },
            },
            MuiDialogTitle: {
                styleOverrides: {
                    root: { fontSize: "1.125rem", fontWeight: 600, padding: "20px 24px 12px" },
                },
            },
            MuiDialogContent: { styleOverrides: { root: { padding: "0 24px 20px" } } },
            MuiDialogActions: { styleOverrides: { root: { padding: "12px 24px 20px", gap: 8 } } },
            MuiIconButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        transition: "all 0.15s ease",
                        color: isDark ? "#A1A1AA" : "#71717A",
                        "&:hover": {
                            background: isDark ? "#1A1A1D" : "#F4F4F5",
                            color: isDark ? "#FAFAFA" : "#09090B",
                        },
                    },
                },
            },
            MuiToggleButton: {
                styleOverrides: {
                    root: {
                        textTransform: "none",
                        fontWeight: 500,
                        fontSize: "0.8125rem",
                        padding: "6px 14px",
                        borderColor: isDark ? "#1F1F23" : "#E4E4E7",
                        color: isDark ? "#A1A1AA" : "#71717A",
                        "&.Mui-selected": {
                            backgroundColor: isDark ? "rgba(139, 92, 246, 0.15)" : "#F5F3FF",
                            color: "#8B5CF6",
                            borderColor: "#8B5CF6",
                            "&:hover": {
                                backgroundColor: isDark ? "rgba(139, 92, 246, 0.25)" : "#EDE9FE",
                            },
                        },
                    },
                },
            },
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        boxShadow: "none",
                        borderBottom: `1px solid ${isDark ? "#1F1F23" : "#E4E4E7"}`,
                    },
                },
            },
            MuiAlert: { styleOverrides: { root: { borderRadius: 10, fontSize: "0.875rem" } } },
            MuiMenu: {
                styleOverrides: {
                    paper: {
                        borderRadius: 10,
                        border: `1px solid ${isDark ? "#1F1F23" : "#E4E4E7"}`,
                        background: isDark ? "#111113" : "#FFFFFF",
                        boxShadow: isDark
                            ? "0 10px 15px -3px rgba(0, 0, 0, 0.5)"
                            : "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                        marginTop: 4,
                    },
                },
            },
            MuiMenuItem: {
                styleOverrides: {
                    root: {
                        fontSize: "0.875rem",
                        padding: "8px 12px",
                        borderRadius: 6,
                        margin: "2px 4px",
                        "&:hover": {
                            background: isDark ? "#1A1A1D" : "#F4F4F5",
                        },
                    },
                },
            },
            MuiTooltip: {
                styleOverrides: {
                    tooltip: {
                        background: isDark ? "#27272A" : "#18181B",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        padding: "6px 10px",
                        borderRadius: 6,
                    },
                },
            },
            MuiDivider: {
                styleOverrides: { root: { borderColor: isDark ? "#1F1F23" : "#E4E4E7" } },
            },
        },
    });
};