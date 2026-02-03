import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import RTLProvider from "@/components/RTLProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <RTLProvider>
          <ThemeProvider>
            <LanguageProvider>
              <CurrencyProvider>
                {/* STRATEGIC MOVE: We place BrowserRouter as the LAST provider.
                  This ensures that when the URL changes, it is the direct 
                  parent of the App, forcing an update regardless of whether 
                  the Theme or Language providers are trying to "optimize" 
                  and skip renders.
                */}
                <BrowserRouter>
                  <App />
                </BrowserRouter>
              </CurrencyProvider>
            </LanguageProvider>
          </ThemeProvider>
        </RTLProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>
);