import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const languageOptions: { code: Language; flag: string; name: string }[] = [
  { code: "EN", flag: "https://flagcdn.com/w40/gb.png", name: "English" },
  { code: "FR", flag: "https://flagcdn.com/w40/fr.png", name: "Français" },
  { code: "AR", flag: "https://flagcdn.com/w40/sa.png", name: "العربية" },
];

const LanguageDropdown = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languageOptions.find((l) => l.code === language) || languageOptions[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors rounded-md hover:bg-muted cursor-pointer"
      >
        <img src={currentLang.flag} alt={currentLang.name} className="w-5 h-4 object-cover rounded-sm" />
        <span className="hidden sm:inline">{currentLang.name}</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-44 bg-background rounded-lg shadow-lg border border-border overflow-hidden z-50 animate-fade-in">
          {languageOptions.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={cn(
                "w-full px-4 py-2.5 text-sm text-left flex items-center gap-3 transition-colors cursor-pointer",
                language === lang.code
                  ? "bg-blush text-primary font-medium"
                  : "text-foreground hover:bg-blush/50"
              )}
            >
              <img src={lang.flag} alt={lang.name} className="w-5 h-4 object-cover rounded-sm" />
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;
