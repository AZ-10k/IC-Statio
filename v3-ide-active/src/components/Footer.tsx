import { useSearchParams } from "react-router-dom";
import { Instagram } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { INSTAGRAM_PROFILE_URL } from "@/constants/socialLinks";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// TikTok icon component since it's not in Lucide
const TikTokIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-5 w-5"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const socialLinks = [
  {
    name: "Instagram",
    href: INSTAGRAM_PROFILE_URL,
    icon: Instagram,
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@ic.stationery",
    icon: TikTokIcon,
  },
];

const Footer = () => {
  const { t, isRTL, language } = useLanguage();
  const [searchParams] = useSearchParams();

  // Utility function to navigate while preserving language parameter
  const navigateWithLanguage = (url: string) => {
    const currentLang = (searchParams.get("lang") || language).toLowerCase();
    const urlObj = new URL(url, window.location.origin);

    // Only add lang parameter if it's not already present
    if (!urlObj.searchParams.has("lang")) {
      urlObj.searchParams.set("lang", currentLang);
    }

    window.location.href = urlObj.toString();
  };

  const followUsLabel = {
    EN: "Follow Us",
    FR: "Suivez-nous",
    AR: "تابعنا",
  };

  const scrollToTop = () => window.scrollTo(0, 0);

  const footerLinks = [
    {
      title: t.footer.catalog,
      links: [
        { name: t.categories.planners, href: "/shop", isRoute: true },
        { name: t.categories.notebooks, href: "/shop", isRoute: true },
        { name: t.categories.giftTags, href: "/shop", isRoute: true },
        { name: t.categories.accessories, href: "/shop", isRoute: true },
      ],
    },
    {
      title: t.footer.company,
      links: [
        { name: t.footer.ourStory, href: "/about", isRoute: true },
        { name: t.nav.contact, href: "/contact", isRoute: true },
        { name: t.footer.faqs, href: "/faq", isRoute: true },
        { name: t.footer.shippingReturns, href: "/shipping-terms", isRoute: true },
      ],
    },
    {
      title: t.footer.legal,
      links: [
        { name: t.footer.privacyPolicy, href: "/privacy", isRoute: true },
        { name: t.footer.termsOfService, href: "/terms", isRoute: true },
      ],
    },
  ];

  return (
    <footer id="footer" className={`bg-primary text-primary-foreground ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Main Footer */}
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <h3 className="font-serif text-2xl font-semibold mb-4 italic">
              Statio
            </h3>
            <p className="text-primary-foreground/70 mb-6 max-w-sm">
              {t.footer.description}
            </p>
            
            {/* Social Links */}
            <div className="flex flex-row items-center gap-4">
              <h4 className="text-sm font-medium text-primary-foreground/80">{followUsLabel[language]}</h4>
              <div className="flex gap-3 rtl:flex-row-reverse">
                {socialLinks.map((social) => (
                  <Tooltip key={social.name}>
                    <TooltipTrigger asChild>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full border border-primary-foreground/30 flex items-center justify-center hover:bg-primary-foreground hover:text-primary transition-all duration-300"
                        aria-label={social.name}
                      >
                        <social.icon className="h-5 w-5" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{social.name}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
            </div>

          {/* Link Columns */}
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h4 className="font-medium text-sm uppercase tracking-wider mb-4">
                {column.title}
              </h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <div
                      onClick={() => navigateWithLanguage(link.href)}
                      className="text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-200 cursor-pointer"
                    >
                      {link.name}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <p className="text-primary-foreground/50 text-sm">
              © {new Date().getFullYear()} Instant Créatif Statio. {t.footer.allRights}
            </p>
            <span className="text-xs px-2 py-1 rounded bg-amber-500/20 text-amber-200 font-medium border border-amber-400/30">
              v3.0 Beta
            </span>
          </div>
          <p className="text-primary-foreground/50 text-sm">
            {t.footer.madeWith}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
