import { useLanguage, Language } from "@/contexts/LanguageContext";

const languages: Language[] = ["EN", "FR", "AR"];

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 text-sm">
      {languages.map((lang, index) => (
        <span key={lang} className="flex items-center">
          <button
            onClick={() => setLanguage(lang)}
            className={`px-1 transition-colors ${
              language === lang
                ? "text-primary font-semibold"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            {lang}
          </button>
          {index < languages.length - 1 && (
            <span className="text-muted-foreground mx-0.5">|</span>
          )}
        </span>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
