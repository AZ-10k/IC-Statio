import { Instagram } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { INSTAGRAM_PROFILE_URL } from "@/constants/socialLinks";

const InstagramButton = () => {
  const { t, isRTL } = useLanguage();
  
  return (
    <a
      href={INSTAGRAM_PROFILE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="static flex items-center group ltr:flex-row rtl:flex-row-reverse"
      aria-label="Contact us on Instagram"
    >
      {/* Text Label - Hidden by default, reveals on hover */}
      <div className={`flex items-center bg-white text-foreground px-4 py-2 rounded-full shadow-lg w-0 overflow-hidden opacity-0 pointer-events-none group-hover:w-auto group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 ease-in-out whitespace-nowrap ${isRTL ? "ml-3" : "mr-3"}`}>
        <span className="text-sm font-medium">{t.floatingButton.dmToOrder}</span>
      </div>
      
      {/* Instagram Button - Official Instagram gradient with hover glow */}
      <div className="w-14 h-14 bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-[0_0_25px_rgba(221,42,123,0.6)]">
        <Instagram className="h-7 w-7" />
      </div>
    </a>
  );
};

export default InstagramButton;
