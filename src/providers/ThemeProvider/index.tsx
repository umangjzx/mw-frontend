"use client";

import { useEffect } from "react";
import { getTheme } from "@/utils/theme";

interface ThemeProviderProps {
    children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    useEffect(() => {
        const theme = getTheme();

        // Set CSS variables
        document.documentElement.style.setProperty("--primary-color", theme.primary);
        document.documentElement.style.setProperty("--background-color", theme.background);
    }, []);

    // Listen for storage changes
    useEffect(() => {
        const handleStorageChange = () => {
            const theme = getTheme();
            document.documentElement.style.setProperty("--primary-color", theme.primary);
            document.documentElement.style.setProperty("--background-color", theme.background);
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return <>{children}</>;
};
