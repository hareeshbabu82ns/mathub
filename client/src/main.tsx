import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@/components/theme-provider";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { RouterProvider } from "react-aria-components";

import App from "./App.tsx";
import "./index.css";
import { TooltipProvider } from "@/components/ui/tooltip.tsx";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement!);

export const BaseApp = () => {
  const navigate = useNavigate();
  return (
    <RouterProvider navigate={navigate}>
      <TooltipProvider>
        <App />
      </TooltipProvider>
    </RouterProvider>
  );
};

root.render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <BaseApp />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
