"use client";

import { useEffect } from 'react';
import { getTheme } from '@/utils/theme';
import { ConfigProvider, ThemeConfig } from 'antd';
import { Poppins } from "next/font/google";

const poppins = Poppins({
    weight: ["300", "400", "500", "600", "700"],
    subsets: ["latin"],
    display: "swap",
});

interface ThemeProviderProps {
    children: React.ReactNode;
}


const theme : ThemeConfig = {
  token: {
      // Using CSS variables for dynamic theming
      colorPrimary: "var(--primary-color)",
      colorBgContainer: "var(--white-color)",
      colorTextBase: "var(--black-color)",
      colorError: "var(--error-color)",
      colorSuccess: "var(--success-color)",
      colorBgLayout: "var(--secondary-color)", // For background

      // Typography
      fontSize: 16,
      fontFamily: poppins.style.fontFamily,
      // Border radius (keeping your existing values)
      borderRadius: 6,
      borderRadiusLG: 8,
      borderRadiusSM: 4,

      // Spacing
      padding: 16,
      margin: 16,
  },
  components: {
      Button: {
          borderRadiusLG: 20,
          borderRadiusSM: 18,
          borderRadius: 14,
          controlHeight: 40,

          // Error states
          dangerColor: "var(--error-color)",
          dangerShadow: "var(--error-color-light)"
      },

      Input: {
          borderRadius: 6,
          colorError: "var(--error-color)",
          colorErrorBorder: "var(--error-color)",
          colorErrorHover: "var(--error-color)",
      },
      Modal: {
          borderRadius: 8,
          paddingContentHorizontalLG: 24,

      },
      Card: {
          borderRadius: 8,
      },
      Message: {
          colorError: "var(--error-color)",
          colorSuccess: "var(--success-color)",
      },
  },
};


export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  useEffect(() => {
    const theme = getTheme();

    // Set CSS variables
    document.documentElement.style.setProperty('--primary-color', theme.primary);
    document.documentElement.style.setProperty('--background-color', theme.background);
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

  return <ConfigProvider theme={theme}>{children}</ConfigProvider>;
};
