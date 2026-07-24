import { useContext } from "react";
import { ThemeContext } from "./context";

export const useThemeMode = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useThemeMode must be used within ThemeContextProvider");
    return ctx;
};