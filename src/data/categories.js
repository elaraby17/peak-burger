// Centralized category data — the single source of truth for the menu's structure.
// Do not hardcode category labels inside components; import from here instead.

export const categories =[
  {
    id: "burgers",
    name: { en: "Burgers", ar: "سندوتشات البرجر" },
    description: {
      en: "Smash-pressed patties, toasted buns, house sauce.",
      ar: "قطعة سماش مضغوطة، خبز محمص، وصوص البيت.",
    },
    icon: "beef",
  },
  {
    id: "special",
    name: { en: "Special Burgers", ar: "البرجر الخاص" },
    description: {
      en: "Bigger patties, bolder builds.",
      ar: "قطعة أكبر، وتركيبة أقوى.",
    },
    icon: "flame",
  },
  {
    id: "peek-cup",
    name: { en: "Peek Cup & Sauces", ar: "بيك كب والصوصات" },
    description: {
      en: "Snackable cups with a sauce of your choice.",
      ar: "أكواب سريعة مع صوص من اختيارك.",
    },
    icon: "cup-soda",
  },
  {
    id: "sauces",
    name: { en: "Sauces", ar: "الصوصات" },
    description: {
      en: "Extra sauces on the side.",
      ar: "صوصات إضافية بجانب طلبك.",
    },
    icon: "droplet",
  },
  {
    id: "drinks",
    name: { en: "Soda & Coffee", ar: "المشروبات الغازية والقهوة" },
    description: {
      en: "Fresh sodas and iced coffee.",
      ar: "مشروبات غازية طازجة وقهوة مثلجة.",
    },
    icon: "cup-soda",
  },
  {
    id: "pancake",
    name: { en: "Pan Cake", ar: "بان كيك" },
    description: {
      en: "Mini pancakes by the box.",
      ar: "بان كيك صغير بالعلبة.",
    },
    icon: "cookie",
  },
  {
    id: "new",
    name: { en: "New Items", ar: "أصناف جديدة" },
    description: {
      en: "Fresh off the grill.",
      ar: "أحدث إضافات المنيو.",
    },
    icon: "sparkles",
  },
];


export const getCategoryById = (id) => categories.find((c) => c.id === id);
