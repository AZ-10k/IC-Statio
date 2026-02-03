import { useEffect } from "react";

const RTLProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Update document direction and language based on language
    const updateDirectionAndLang = () => {
      const language = localStorage.getItem("language") || "EN";
      const isRTL = language === "AR";
      const langMap = { EN: "en", FR: "fr", AR: "ar" };
      
      document.documentElement.dir = isRTL ? "rtl" : "ltr";
      document.documentElement.lang = langMap[language as keyof typeof langMap] || "en";
    };

    // Initial update
    updateDirectionAndLang();

    // Listen for language changes
    const handleLanguageChange = () => {
      updateDirectionAndLang();
    };

    // Listen for storage changes (for cross-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "language") {
        updateDirectionAndLang();
      }
    };

    // Custom event for language changes
    const handleCustomLanguageChange = () => {
      updateDirectionAndLang();
    };

    window.addEventListener("languagechange", handleLanguageChange);
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("languageUpdated", handleCustomLanguageChange);

    return () => {
      window.removeEventListener("languagechange", handleLanguageChange);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("languageUpdated", handleCustomLanguageChange);
    };
  }, []);

  return <>{children}</>;
};

export default RTLProvider;
