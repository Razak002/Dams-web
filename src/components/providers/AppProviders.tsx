"use client";

import * as React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "sonner";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const toaster = (
    <Toaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        style: {
          fontFamily: "var(--font-sans)",
        },
      }}
    />
  );

  if (!GOOGLE_CLIENT_ID) {
    return (
      <>
        {children}
        {toaster}
      </>
    );
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {children}
      {toaster}
    </GoogleOAuthProvider>
  );
}
