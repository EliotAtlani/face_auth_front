import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { RouterProvider } from "react-router-dom";
import { router } from "./components/routing/router.tsx";
import { Toaster } from "./components/ui/toaster.tsx";
import { AuthProvider } from "./components/auth/AuthProvider.tsx";
import ServerStatus from "./components/ServerStatus.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
        <ServerStatus />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
