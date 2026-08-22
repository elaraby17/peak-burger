// Local promo data for the homepage "Special Offers" section, extended with
// the fields the admin dashboard needs (old/offer price, included products,
// date range, active flag). Existing fields (title, description, tag,
// badgeColor, image) are unchanged so SpecialOffers.jsx keeps working as-is.

export const offerSeed = [
  {
    id: "offer-1",
    title: { en: "Double Up Deal", ar: "عرض الدبل" },
    description: {
      en: "Any Double burger + Cup Fries + a Soda, for less.",
      ar: "أي برجر دبل + كب فرايز + مشروب غازي، بسعر أقل.",
    },
    tag: { en: "Combo", ar: "كومبو" },
    badgeColor: "secondary",
    image: "/images/offers/double-up-deal.jpg",
    includedProductIds: [2, 14, 19],
    oldPrice: 210,
    offerPrice: 180,
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    active: true,
  },
  {
    id: "offer-2",
    title: { en: "Peek Cup Duo", ar: "ديو بيك كب" },
    description: {
      en: "Pick any two Peek Cup items and save.",
      ar: "اختر أي صنفين من بيك كب ووفّر.",
    },
    tag: { en: "Snack Deal", ar: "عرض سناك" },
    badgeColor: "primary",
    image: "/images/offers/peek-cup-duo.jpg",
    includedProductIds: [11, 12],
    oldPrice: 150,
    offerPrice: 120,
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    active: true,
  },
  {
    id: "offer-3",
    title: { en: "Sweet Ending", ar: "خاتمة حلوة" },
    description: {
      en: "Any burger + a 12pcs Pan Cake box.",
      ar: "أي برجر + علبة بان كيك 12 قطعة.",
    },
    tag: { en: "New", ar: "جديد" },
    badgeColor: "secondary",
    image: "/images/offers/sweet-ending.jpg",
    includedProductIds: [1, 28],
    oldPrice: 120,
    offerPrice: 100,
    startDate: "2026-06-01",
    endDate: "2026-09-30",
    active: false,
  },
];

// Backwards-compatible export name used by SpecialOffers.jsx and any other
// existing customer-facing import. Points at the same seed data.
export const offers = offerSeed;
