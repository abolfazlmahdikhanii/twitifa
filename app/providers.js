"use client";
import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// react query providers
const QueryProviders = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

// main provider
const Providers = ({ children, clientId, initialUser=false }) => {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <QueryProviders>
        <AuthProvider initialUser={initialUser}>{children}</AuthProvider>
        {process.env.NODE_ENV === "development" && (
          <ReactQueryDevtools
            initialIsOpen={false}
            position="right"
            buttonPosition="bottom-right"
          />
        )}
      </QueryProviders>
    </GoogleOAuthProvider>
  );
};

export default Providers;
