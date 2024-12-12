"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NuqsAdapter } from "nuqs/adapters/next";
import { ThemeProvider } from "../ThemeProvider";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
        },
    },
});

export default function QueryProvider ({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <NuqsAdapter>
                <ThemeProvider>
                    {children}
                </ThemeProvider>
                <ReactQueryDevtools initialIsOpen={true} buttonPosition='bottom-left' />
            </NuqsAdapter>
        </QueryClientProvider>
    );
}
