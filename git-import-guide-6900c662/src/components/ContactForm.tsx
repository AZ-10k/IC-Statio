import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, ContactFormData } from "@/lib/validations";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT || "https://formspree.io/f/mjggvjaj";

const ContactForm = () => {
  const { language, isRTL } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema(language)),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  // Update form resolver when language changes
  useEffect(() => {
    form.clearErrors();
    // Re-validate with new schema
    form.trigger();
  }, [language]);

  const labels = {
    EN: {
      title: "Get in Touch",
      subtitle: "Have a question or special request? We'd love to hear from you.",
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

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus("success");
        form.reset();
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
    <section id="contact" className="py-16 lg:py-24 bg-blush" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-primary mb-4">{l.title}</h2>
            <p className="text-foreground/80">{l.subtitle}</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{l.name}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={l.namePlaceholder}
                          className="bg-background border-border focus:border-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{l.email}</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={l.emailPlaceholder}
                          className="bg-background border-border focus:border-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{l.phone}</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder={l.phonePlaceholder}
                        className="bg-background border-border focus:border-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{l.message}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={l.messagePlaceholder}
                        rows={5}
                        className="bg-background border-border focus:border-primary resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            {submitStatus === "success" && (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-md">
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
                <Send className={`h-5 w-5 ${isRTL ? "ml-2" : "mr-2"}`} />
                {isSubmitting ? l.sending : l.send}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
