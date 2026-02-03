// PASTE ZR EXPRESS JSON HERE
// This data is from ZR Express contract - update prices as needed

export type DeliveryMode = "home" | "desk";

export interface ShippingRate {
  home: number;
  desk: number;
}

export const shippingRates: Record<number, ShippingRate> = {
  1:  { home: 1350, desk: 1000 }, // Adrar
  2:  { home: 750,  desk: 500 },  // Chlef
  3:  { home: 900,  desk: 600 },  // Laghouat
  4:  { home: 750,  desk: 500 },  // Oum El Bouaghi
  5:  { home: 800,  desk: 500 },  // Batna
  6:  { home: 800,  desk: 500 },  // Bejaia
  7:  { home: 900,  desk: 600 },  // Biskra
  8:  { home: 1150, desk: 700 },  // Bechar
  9:  { home: 650,  desk: 450 },  // Blida
  10: { home: 700,  desk: 500 },  // Bouira
  11: { home: 1600, desk: 1200 }, // Tamanrasset
  12: { home: 850,  desk: 500 },  // Tebessa
  13: { home: 850,  desk: 500 },  // Tlemcen
  14: { home: 750,  desk: 500 },  // Tiaret
  15: { home: 700,  desk: 500 },  // Tizi Ouzou
  16: { home: 650,  desk: 450 },  // Alger
  17: { home: 900,  desk: 600 },  // Djelfa
  18: { home: 800,  desk: 500 },  // Jijel
  19: { home: 750,  desk: 500 },  // Setif
  20: { home: 850,  desk: 550 },  // Saida
  21: { home: 800,  desk: 500 },  // Skikda
  22: { home: 800,  desk: 500 },  // Sidi Bel Abbes
  23: { home: 800,  desk: 500 },  // Annaba
  24: { home: 800,  desk: 500 },  // Guelma
  25: { home: 800,  desk: 500 },  // Constantine
  26: { home: 750,  desk: 500 },  // Medea
  27: { home: 800,  desk: 500 },  // Mostaganem
  28: { home: 850,  desk: 500 },  // M'Sila
  29: { home: 800,  desk: 500 },  // Mascara
  30: { home: 950,  desk: 600 },  // Ouargla
  31: { home: 750,  desk: 500 },  // Oran
  32: { home: 1050, desk: 600 },  // El Bayadh
  33: { home: 0,    desk: 0 },    // Illizi
  34: { home: 750,  desk: 500 },  // BB Arreridj
  35: { home: 400,  desk: 250 },  // Boumerdes (Local)
  36: { home: 800,  desk: 500 },  // El Tarf
  37: { home: 0,    desk: 0 },    // Tindouf
  38: { home: 850,  desk: 520 },  // Tissemsilt
  39: { home: 950,  desk: 600 },  // El Oued
  40: { home: 800,  desk: 500 },  // Khenchela
  41: { home: 800,  desk: 500 },  // Souk Ahras
  42: { home: 750,  desk: 500 },  // Tipaza
  43: { home: 800,  desk: 500 },  // Mila
  44: { home: 800,  desk: 500 },  // Ain Defla
  45: { home: 1150, desk: 600 },  // Naama
  46: { home: 800,  desk: 500 },  // Ain Temouchent
  47: { home: 900,  desk: 600 },  // Ghardaia
  48: { home: 800,  desk: 500 },  // Relizane
  49: { home: 1350, desk: 1000 }, // Timimoun
  50: { home: 0,    desk: 0 },    // Bordj Badji Mokhtar
  51: { home: 900,  desk: 600 },  // Ouled Djellal
  52: { home: 1350, desk: 1000 }, // Beni Abbes
  53: { home: 1600, desk: 1270 }, // In Salah
  54: { home: 1600, desk: 0 },    // In Guezzam
  55: { home: 950,  desk: 600 },  // Touggourt
  56: { home: 0,    desk: 0 },    // Djanet
  57: { home: 900,  desk: 0 },    // El Meghaier
  58: { home: 1050, desk: 0 }     // El Menia
};

// Wilaya names in all three languages
export const wilayaNames: Record<number, { en: string; fr: string; ar: string }> = {
  1:  { en: "Adrar", fr: "Adrar", ar: "أدرار" },
  2:  { en: "Chlef", fr: "Chlef", ar: "الشلف" },
  3:  { en: "Laghouat", fr: "Laghouat", ar: "الأغواط" },
  4:  { en: "Oum El Bouaghi", fr: "Oum El Bouaghi", ar: "أم البواقي" },
  5:  { en: "Batna", fr: "Batna", ar: "باتنة" },
  6:  { en: "Bejaia", fr: "Béjaïa", ar: "بجاية" },
  7:  { en: "Biskra", fr: "Biskra", ar: "بسكرة" },
  8:  { en: "Bechar", fr: "Béchar", ar: "بشار" },
  9:  { en: "Blida", fr: "Blida", ar: "البليدة" },
  10: { en: "Bouira", fr: "Bouira", ar: "البويرة" },
  11: { en: "Tamanrasset", fr: "Tamanrasset", ar: "تمنراست" },
  12: { en: "Tebessa", fr: "Tébessa", ar: "تبسة" },
  13: { en: "Tlemcen", fr: "Tlemcen", ar: "تلمسان" },
  14: { en: "Tiaret", fr: "Tiaret", ar: "تيارت" },
  15: { en: "Tizi Ouzou", fr: "Tizi Ouzou", ar: "تيزي وزو" },
  16: { en: "Algiers", fr: "Alger", ar: "الجزائر" },
  17: { en: "Djelfa", fr: "Djelfa", ar: "الجلفة" },
  18: { en: "Jijel", fr: "Jijel", ar: "جيجل" },
  19: { en: "Setif", fr: "Sétif", ar: "سطيف" },
  20: { en: "Saida", fr: "Saïda", ar: "سعيدة" },
  21: { en: "Skikda", fr: "Skikda", ar: "سكيكدة" },
  22: { en: "Sidi Bel Abbes", fr: "Sidi Bel Abbès", ar: "سيدي بلعباس" },
  23: { en: "Annaba", fr: "Annaba", ar: "عنابة" },
  24: { en: "Guelma", fr: "Guelma", ar: "قالمة" },
  25: { en: "Constantine", fr: "Constantine", ar: "قسنطينة" },
  26: { en: "Medea", fr: "Médéa", ar: "المدية" },
  27: { en: "Mostaganem", fr: "Mostaganem", ar: "مستغانم" },
  28: { en: "M'Sila", fr: "M'Sila", ar: "المسيلة" },
  29: { en: "Mascara", fr: "Mascara", ar: "معسكر" },
  30: { en: "Ouargla", fr: "Ouargla", ar: "ورقلة" },
  31: { en: "Oran", fr: "Oran", ar: "وهران" },
  32: { en: "El Bayadh", fr: "El Bayadh", ar: "البيض" },
  33: { en: "Illizi", fr: "Illizi", ar: "إليزي" },
  34: { en: "Bordj Bou Arreridj", fr: "Bordj Bou Arréridj", ar: "برج بوعريريج" },
  35: { en: "Boumerdes", fr: "Boumerdès", ar: "بومرداس" },
  36: { en: "El Tarf", fr: "El Tarf", ar: "الطارف" },
  37: { en: "Tindouf", fr: "Tindouf", ar: "تندوف" },
  38: { en: "Tissemsilt", fr: "Tissemsilt", ar: "تيسمسيلت" },
  39: { en: "El Oued", fr: "El Oued", ar: "الوادي" },
  40: { en: "Khenchela", fr: "Khenchela", ar: "خنشلة" },
  41: { en: "Souk Ahras", fr: "Souk Ahras", ar: "سوق أهراس" },
  42: { en: "Tipaza", fr: "Tipaza", ar: "تيبازة" },
  43: { en: "Mila", fr: "Mila", ar: "ميلة" },
  44: { en: "Ain Defla", fr: "Aïn Defla", ar: "عين الدفلى" },
  45: { en: "Naama", fr: "Naâma", ar: "النعامة" },
  46: { en: "Ain Temouchent", fr: "Aïn Témouchent", ar: "عين تموشنت" },
  47: { en: "Ghardaia", fr: "Ghardaïa", ar: "غرداية" },
  48: { en: "Relizane", fr: "Relizane", ar: "غليزان" },
  49: { en: "Timimoun", fr: "Timimoun", ar: "تيميمون" },
  50: { en: "Bordj Badji Mokhtar", fr: "Bordj Badji Mokhtar", ar: "برج باجي مختار" },
  51: { en: "Ouled Djellal", fr: "Ouled Djellal", ar: "أولاد جلال" },
  52: { en: "Beni Abbes", fr: "Béni Abbès", ar: "بني عباس" },
  53: { en: "In Salah", fr: "In Salah", ar: "عين صالح" },
  54: { en: "In Guezzam", fr: "In Guezzam", ar: "عين قزام" },
  55: { en: "Touggourt", fr: "Touggourt", ar: "تقرت" },
  56: { en: "Djanet", fr: "Djanet", ar: "جانت" },
  57: { en: "El Meghaier", fr: "El M'Ghair", ar: "المغير" },
  58: { en: "El Menia", fr: "El Ménéa", ar: "المنيعة" }
};
