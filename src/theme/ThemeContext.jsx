import React, { useState, useEffect, useMemo } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { createAppTheme } from "./theme";
import { ThemeContext } from "./context";

export function ThemeContextProvider({ children }) {
    const [mode, setMode] = useState(() => {
        const saved = localStorage.getItem("theme_mode");
        return saved || "dark";
    });

    useEffect(() => {
        localStorage.setItem("theme_mode", mode);
        document.documentElement.setAttribute("data-theme", mode);
    }, [mode]);

    const toggleMode = () => setMode((prev) => (prev === "dark" ? "light" : "dark"));

    const theme = useMemo(() => createAppTheme(mode), [mode]);

    return (
        <ThemeContext.Provider value={{ mode, toggleMode }}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
}