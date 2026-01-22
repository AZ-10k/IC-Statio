import { z } from "zod";

// Contact Form Schema
export const contactFormSchema = (language: "EN" | "FR" | "AR") => {
  const messages = {
    EN: {
      name: {
        required: "Name is required",
        min: "Name must be at least 2 characters",
        max: "Name must be at most 100 characters",
      },
      email: {
        required: "Email is required",
        invalid: "Please enter a valid email address",
      },
      phone: {
        invalid: "Please enter a valid phone number (e.g., 05XXXXXXXX)",
      },
      message: {
        required: "Message is required",
        min: "Message must be at least 10 characters",
        max: "Message must be at most 2000 characters",
      },
    },
    FR: {
      name: {
        required: "Le nom est requis",
        min: "Le nom doit contenir au moins 2 caractères",
        max: "Le nom doit contenir au plus 100 caractères",
      },
      email: {
        required: "L'email est requis",
        invalid: "Veuillez entrer une adresse email valide",
      },
      phone: {
        invalid: "Veuillez entrer un numéro de téléphone valide (ex: 05XXXXXXXX)",
      },
      message: {
        required: "Le message est requis",
        min: "Le message doit contenir au moins 10 caractères",
        max: "Le message doit contenir au plus 2000 caractères",
      },
    },
    AR: {
      name: {
        required: "الاسم مطلوب",
        min: "يجب أن يكون الاسم على الأقل حرفين",
        max: "يجب أن يكون الاسم على الأكثر 100 حرف",
      },
      email: {
        required: "البريد الإلكتروني مطلوب",
        invalid: "يرجى إدخال عنوان بريد إلكتروني صالح",
      },
      phone: {
        invalid: "يرجى إدخال رقم هاتف صالح (مثال: 05XXXXXXXX)",
      },
      message: {
        required: "الرسالة مطلوبة",
        min: "يجب أن تكون الرسالة على الأقل 10 أحرف",
        max: "يجب أن تكون الرسالة على الأكثر 2000 حرف",
      },
    },
  };

  const t = messages[language];

  return z.object({
    name: z
      .string()
      .min(1, t.name.required)
      .min(2, t.name.min)
      .max(100, t.name.max)
      .trim(),
    email: z
      .string()
      .min(1, t.email.required)
      .email(t.email.invalid)
      .trim()
      .toLowerCase(),
    phone: z
      .string()
      .optional()
      .refine(
        (val) => !val || val.length === 0 || /^(\+213|0)[567]\d{8}$/.test(val.replace(/[\s-]/g, "")),
        t.phone.invalid
      ),
    message: z
      .string()
      .min(1, t.message.required)
      .min(10, t.message.min)
      .max(2000, t.message.max)
      .trim(),
  });
};

export type ContactFormData = z.infer<ReturnType<typeof contactFormSchema>>;

// Checkout Form Schema
export const checkoutFormSchema = (language: "EN" | "FR" | "AR") => {
  const messages = {
    EN: {
      firstName: {
        required: "First name is required",
        min: "First name must be at least 2 characters",
        max: "First name must be at most 50 characters",
      },
      lastName: {
        required: "Last name is required",
        min: "Last name must be at least 2 characters",
        max: "Last name must be at most 50 characters",
      },
      phone: {
        required: "Phone number is required",
        invalid: "Please enter a valid Algerian phone number (05XXXXXXXX)",
      },
      secondaryPhone: {
        invalid: "Please enter a valid phone number (05XXXXXXXX)",
      },
      email: {
        invalid: "Please enter a valid email address",
      },
      wilaya: {
        required: "Wilaya is required",
      },
      commune: {
        required: "Commune is required",
      },
      address: {
        required: "Address is required",
        min: "Address must be at least 5 characters",
        max: "Address must be at most 200 characters",
      },
      landmark: {
        max: "Landmark must be at most 100 characters",
      },
      orderNotes: {
        max: "Order notes must be at most 500 characters",
      },
    },
    FR: {
      firstName: {
        required: "Le prénom est requis",
        min: "Le prénom doit contenir au moins 2 caractères",
        max: "Le prénom doit contenir au plus 50 caractères",
      },
      lastName: {
        required: "Le nom de famille est requis",
        min: "Le nom de famille doit contenir au moins 2 caractères",
        max: "Le nom de famille doit contenir au plus 50 caractères",
      },
      phone: {
        required: "Le numéro de téléphone est requis",
        invalid: "Veuillez entrer un numéro de téléphone algérien valide (05XXXXXXXX)",
      },
      secondaryPhone: {
        invalid: "Veuillez entrer un numéro de téléphone valide (05XXXXXXXX)",
      },
      email: {
        invalid: "Veuillez entrer une adresse email valide",
      },
      wilaya: {
        required: "La wilaya est requise",
      },
      commune: {
        required: "La commune est requise",
      },
      address: {
        required: "L'adresse est requise",
        min: "L'adresse doit contenir au moins 5 caractères",
        max: "L'adresse doit contenir au plus 200 caractères",
      },
      landmark: {
        max: "Le point de repère doit contenir au plus 100 caractères",
      },
      orderNotes: {
        max: "Les notes de commande doivent contenir au plus 500 caractères",
      },
    },
    AR: {
      firstName: {
        required: "الاسم الأول مطلوب",
        min: "يجب أن يكون الاسم الأول على الأقل حرفين",
        max: "يجب أن يكون الاسم الأول على الأكثر 50 حرفًا",
      },
      lastName: {
        required: "اسم العائلة مطلوب",
        min: "يجب أن يكون اسم العائلة على الأقل حرفين",
        max: "يجب أن يكون اسم العائلة على الأكثر 50 حرفًا",
      },
      phone: {
        required: "رقم الهاتف مطلوب",
        invalid: "يرجى إدخال رقم هاتف جزائري صالح (05XXXXXXXX)",
      },
      secondaryPhone: {
        invalid: "يرجى إدخال رقم هاتف صالح (05XXXXXXXX)",
      },
      email: {
        invalid: "يرجى إدخال عنوان بريد إلكتروني صالح",
      },
      wilaya: {
        required: "الولاية مطلوبة",
      },
      commune: {
        required: "البلدية مطلوبة",
      },
      address: {
        required: "العنوان مطلوب",
        min: "يجب أن يكون العنوان على الأقل 5 أحرف",
        max: "يجب أن يكون العنوان على الأكثر 200 حرف",
      },
      landmark: {
        max: "يجب أن يكون المعلم على الأكثر 100 حرف",
      },
      orderNotes: {
        max: "يجب أن تكون ملاحظات الطلب على الأكثر 500 حرف",
      },
    },
  };

  const t = messages[language];

  // Algerian phone validation
  const algerianPhoneRegex = /^0[567]\d{8}$/;

  return z.object({
    firstName: z
      .string()
      .min(1, t.firstName.required)
      .min(2, t.firstName.min)
      .max(50, t.firstName.max)
      .trim(),
    lastName: z
      .string()
      .min(1, t.lastName.required)
      .min(2, t.lastName.min)
      .max(50, t.lastName.max)
      .trim(),
    phone: z
      .string()
      .min(1, t.phone.required)
      .refine(
        (val) => {
          const cleaned = val.replace(/[\s-]/g, "");
          return algerianPhoneRegex.test(cleaned);
        },
        { message: t.phone.invalid }
      ),
    secondaryPhone: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val || val.length === 0) return true;
          const cleaned = val.replace(/[\s-]/g, "");
          return algerianPhoneRegex.test(cleaned);
        },
        { message: t.secondaryPhone.invalid }
      ),
    email: z
      .string()
      .optional()
      .refine(
        (val) => !val || val.length === 0 || z.string().email().safeParse(val).success,
        { message: t.email.invalid }
      ),
    wilaya: z.string().min(1, t.wilaya.required),
    commune: z.string().min(1, t.commune.required),
    address: z
      .string()
      .min(1, t.address.required)
      .min(5, t.address.min)
      .max(200, t.address.max)
      .trim(),
    landmark: z.string().max(100, t.landmark.max).trim().optional(),
    orderNotes: z.string().max(500, t.orderNotes.max).trim().optional(),
    deliveryMode: z.enum(["desk", "home"]),
  });
};

export type CheckoutFormData = z.infer<ReturnType<typeof checkoutFormSchema>>;
