import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Send, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import SEO from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";

const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT || "https://formspree.io/f/mjggvjaj";

const getSEOLabels = (language: "EN" | "FR" | "AR") => ({
  EN: {
    title: "Contact Us - Instant Créatif Statio",
    description: "Get in touch with Instant Créatif Statio. Have a question or special request? We'd love to hear from you.",
  },
  FR: {
    title: "Contactez-nous - Instant Créatif Statio",
    description: "Contactez Instant Créatif Statio. Avez-vous une question ou une demande spéciale? Nous serions ravis de vous entendre.",
  },
  AR: {
    title: "تواصل معنا - إنستانت كرياتيف ستاتيو",
    description: "تواصل مع إنستانت كرياتيف ستاتيو. هل لديك سؤال أو طلب خاص؟ نحب أن نسمع منك.",
  },
}[language]);

const Contact = () => {
  const { language, isRTL } = useLanguage();
  const seoLabels = getSEOLabels(language);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const labels = {
    EN: {
      title: "Get in Touch",
      subtitle: "Have a question or special request? We'd love to hear from you.",
      backToHome: "Back to Home",
      name: "Name",
      namePlaceholder: "Your name",
      email: "Email",
      emailPlaceholder: "your@email.com",
      phone: "Phone Number",
      phonePlaceholder: "+213 XXX XXX XXX",
      message: "Message",
      messagePlaceholder: "Tell us about your inquiry...",
      send: "Send Message",
      sending: "Sending...",
      success: "Message Sent Successfully!",
      error: "Error sending message. Please try again.",
    },
    FR: {
      title: "Contactez-nous",
      subtitle: "Avez-vous une question ou une demande spéciale? Nous serions ravis de vous entendre.",
      backToHome: "Retour à l'accueil",
      name: "Nom",
      namePlaceholder: "Votre nom",
      email: "Email",
      emailPlaceholder: "votre@email.com",
      phone: "Numéro de téléphone",
      phonePlaceholder: "+213 XXX XXX XXX",
      message: "Message",
      messagePlaceholder: "Parlez-nous de votre demande...",
      send: "Envoyer le message",
      sending: "Envoi en cours...",
      success: "Message envoyé avec succès!",
      error: "Erreur lors de l'envoi. Veuillez réessayer.",
    },
    AR: {
      title: "تواصل معنا",
      subtitle: "هل لديك سؤال أو طلب خاص؟ نحب أن نسمع منك.",
      backToHome: "العودة للرئيسية",
      name: "الاسم",
      namePlaceholder: "اسمك",
      email: "البريد الإلكتروني",
      emailPlaceholder: "your@email.com",
      phone: "رقم الهاتف",
      phonePlaceholder: "+213 XXX XXX XXX",
      message: "الرسالة",
      messagePlaceholder: "أخبرنا عن استفسارك...",
      send: "إرسال الرسالة",
      sending: "جاري الإرسال...",
      success: "تم إرسال الرسالة بنجاح!",
      error: "خطأ في الإرسال. يرجى المحاولة مرة أخرى.",
    },
  };

  const l = labels[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen bg-background ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      <SEO 
        title={seoLabels.title}
        description={seoLabels.description}
        canonical="/contact"
      />
      <Navbar />
      <main className="pt-24 lg:pt-28">
        <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
          <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-8 transition-colors">
            <ArrowLeft className={`h-4 w-4 ${isRTL ? "ml-2 rotate-180" : "mr-2"}`} />
            {l.backToHome}
          </Link>

          <section className="py-12 lg:py-16 bg-blush rounded-xl">
            <div className="max-w-2xl mx-auto px-6">
              <div className="text-center mb-12">
                <h1 className="font-serif text-3xl lg:text-4xl font-semibold text-primary mb-4">{l.title}</h1>
                <p className="text-foreground/80">{l.subtitle}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      {l.name}
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder={l.namePlaceholder}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="bg-background border-border focus:border-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      {l.email}
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder={l.emailPlaceholder}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="bg-background border-border focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    {l.phone}
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder={l.phonePlaceholder}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-background border-border focus:border-primary"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    {l.message}
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder={l.messagePlaceholder}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                    className="bg-background border-border focus:border-primary resize-none"
                  />
                </div>

                {submitStatus === "success" && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-950/30 p-3 rounded-md">
                    <CheckCircle className="h-5 w-5" />
                    <span>{l.success}</span>
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-md">
                    <AlertCircle className="h-5 w-5" />
                    <span>{l.error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg cursor-pointer"
                >
                  <Send className="h-5 w-5 mr-2" />
                  {isSubmitting ? l.sending : l.send}
                </Button>
              </form>
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default Contact;
