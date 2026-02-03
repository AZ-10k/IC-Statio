import { useLanguage } from "@/contexts/LanguageContext";

const SkipToMainContent = () => {
  const { language, isRTL } = useLanguage();

  const skipText = {
    EN: "Skip to main content",
    FR: "Aller au contenu principal", 
    AR: "تخطي إلى المحتوى الرئيسي"
  };

  return (
    <a 
      href="#main-content" 
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-primary/50"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {skipText[language]}
    </a>
  );
};

export default SkipToMainContent;
