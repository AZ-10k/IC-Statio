import { Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Testimonial {
  id: number;
  name: {
    EN: string;
    FR: string;
    AR: string;
  };
  location: {
    EN: string;
    FR: string;
    AR: string;
  };
  content: {
    EN: string;
    FR: string;
    AR: string;
  };
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: { EN: "Amine", FR: "Amine", AR: "أمين" },
    location: { EN: "from Oran", FR: "d'Oran", AR: "من وهران" },
    content: {
      EN: "Great quality! The planner is beautifully crafted and the paper feels premium. Fast delivery to Oran. Highly recommend!",
      FR: "Excellente qualité ! Le planner est magnifiquement conçu et le papier est de qualité supérieure. Livraison rapide à Oran. Je recommande vivement !",
      AR: "جودة ممتازة! المخطط مصنوع بشكل جميل والورق يبدو فاخراً. توصيل سريع لوهران. أنصح به بشدة!",
    },
    rating: 5,
  },
  {
    id: 2,
    name: { EN: "Fatima", FR: "Fatima", AR: "فاطمة" },
    location: { EN: "from Algiers", FR: "d'Alger", AR: "من الجزائر" },
    content: {
      EN: "I ordered the gift tags for Eid and they were absolutely beautiful. The packaging was also very elegant. Will definitely order again!",
      FR: "J'ai commandé les étiquettes cadeaux pour l'Aïd et elles étaient absolument magnifiques. L'emballage était également très élégant. Je commanderai certainement à nouveau !",
      AR: "طلبت بطاقات الهدايا للعيد وكانت جميلة جداً. التغليف كان أنيقاً أيضاً. سأطلب مرة أخرى بالتأكيد!",
    },
    rating: 5,
  },
  {
    id: 3,
    name: { EN: "Karim", FR: "Karim", AR: "كريم" },
    location: { EN: "from Constantine", FR: "de Constantine", AR: "من قسنطينة" },
    content: {
      EN: "The notebook exceeded my expectations. Perfect for my daily notes. The leather cover is stunning and durable. Thank you Statio!",
      FR: "Le carnet a dépassé mes attentes. Parfait pour mes notes quotidiennes. La couverture en cuir est superbe et durable. Merci Statio !",
      AR: "الدفتر فاق توقعاتي. مثالي لملاحظاتي اليومية. الغلاف الجلدي رائع ومتين. شكراً Statio!",
    },
    rating: 5,
  },
];

const ClientLove = () => {
  const { language, t, isRTL } = useLanguage();

  const sectionContent = {
    EN: {
      title: "What Our Clients Say",
      subtitle: "Hear what our valued customers have to say about their Statio experience",
    },
    FR: {
      title: "Avis Clients",
      subtitle: "Découvrez ce que nos clients disent de leur expérience avec Statio",
    },
    AR: {
      title: "آراء عملائنا",
      subtitle: "اكتشف ما يقوله عملاؤنا عن تجربتهم مع Statio",
    },
  };

  const content = sectionContent[language];

  return (
    <section className="py-16 lg:py-24 bg-muted/30" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="font-serif text-3xl lg:text-4xl font-medium text-primary mb-4">
            {content.title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {content.subtitle}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-card rounded-lg p-6 lg:p-8 shadow-card hover:shadow-hover transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-primary text-primary"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-foreground/80 leading-relaxed mb-6">
                "{testimonial.content[language]}"
              </blockquote>

              {/* Author */}
              <div className="border-t border-border pt-4">
                <p className="font-serif font-medium text-primary">
                  {testimonial.name[language]}
                </p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.location[language]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientLove;
