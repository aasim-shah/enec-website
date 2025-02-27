"use client";
import AuthGuard from "@/components/auth-guard";
import { ThemeProvider } from "next-themes";
import React from "react";
import StoreProvider from "./StoreProvider";

const Providers = ({ children }: any) => {
  return (
    <div>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <StoreProvider>
          <AuthGuard>{children}</AuthGuard>
        </StoreProvider>
      </ThemeProvider>
    </div>
  );
};

export default Providers;
