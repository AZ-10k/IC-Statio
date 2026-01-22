import PreferencesMenu from "./PreferencesMenu";
import ThemeToggle from "./ThemeToggle";
import { useLanguage } from "@/contexts/LanguageContext";

const TopBar = () => {
  const { t, isRTL } = useLanguage();

  return (
    <div className={`flex h-10 items-center justify-between px-4 lg:px-8 bg-blue-600 border-b border-border text-xs text-white font-bold ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Left side - Delivery text */}
      <div className="flex items-center">
        <span className="font-medium">🚚 Livraison gratuite partout en Algérie 🇩🇿</span>
      </div>

      {/* Right side - Controls */}
      <div className="flex items-center gap-2">
        <PreferencesMenu />
        <ThemeToggle />
      </div>
    </div>
  );
};

export default TopBar;