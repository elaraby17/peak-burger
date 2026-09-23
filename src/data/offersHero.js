// Offers config. The image is ONLY a food photo: the whole design
// (badge, discount, title, arrows, underline, stamp, note...) is rendered
// by Hero.jsx, so any clean landscape food photo can be dropped in.
//
// Images live in /public/images/offers/ and are referenced by URL string.
// That means: no import needed, the build never breaks if a file is missing,
// and later you can put a full API URL here instead.
//
// Every text field is { en, ar }.
//
// Optional per-offer fields:
//   focus:   CSS object-position for the photo, e.g. "70% 50%" (default "center")
//   callout: { en, ar } text for the hand-drawn stamp (default: LIMITED TIME)
//   to:      route for the "Explore Offer" button (default: the menu route)

const offers = [
    {
        id: 1,
        image: "/src/assets/hero/classic-combo.jpg",
        alt: {
            en: "Double bacon burger with melted cheese",
            ar: "برجر دبل بيكون مع جبنة سايحة",
        },
        badge: { en: "LIMITED OFFER", ar: "عرض لفترة محدودة" },
        discount: { en: "25% OFF", ar: "خصم 25%" },
        title: { en: "DOUBLE BACON", ar: "دبل بيكون" },
        highlight: { en: "BURGER", ar: "برجر" },
        description: {
            en: "Two beef patties, crispy bacon, melted cheese and our special sauce.",
            ar: "قطعتان من اللحم مع بيكون مقرمش وجبنة سايحة وصوصنا الخاص.",
        },
        note: { en: "MORE FLAVOR MORE HAPPINESS", ar: "طعم أكتر سعادة أكتر" },
    },
    {
        id: 2,
        image: "/src/assets/hero/double-bacon.jpg",
        alt: {
            en: "Classic burger combo with fries and a cola",
            ar: "كومبو برجر كلاسيك مع بطاطس وكولا",
        },
        badge: { en: "SPECIAL COMBO", ar: "كومبو مميز" },
        discount: { en: "20% OFF", ar: "خصم 20%" },
        title: { en: "CLASSIC", ar: "كلاسيك" },
        highlight: { en: "COMBO", ar: "كومبو" },
        description: {
            en: "Classic burger with crispy fries and a refreshing drink.",
            ar: "برجر كلاسيك مع بطاطس مقرمشة ومشروب منعش.",
        },
        note: { en: "BURGER. FRIES. COLA. DONE.", ar: "برجر وبطاطس ومشروب. خلاص!" },
    },
    {
        id: 3,
        image: "/src/assets/hero/loaded-cheese.jpg",
        alt: {
            en: "Spicy crispy chicken burger with jalapeños",
            ar: "برجر دجاج سبايسي مقرمش مع هالبينو",
        },
        badge: { en: "HOT OFFER", ar: "عرض ساخن" },
        discount: { en: "20% OFF", ar: "خصم 20%" },
        title: { en: "SPICY", ar: "سبايسي" },
        highlight: { en: "CHICKEN", ar: "تشيكن" },
        description: {
            en: "Crispy chicken, jalapeños and our signature spicy sauce.",
            ar: "دجاج مقرمش مع هالبينو وصوصنا الحار المميز.",
        },
        note: { en: "HOT. CRISPY. ADDICTIVE.", ar: "حار ومقرمش ويدمّن" },
    },
    {
        id: 4,
        image: "/src/assets/hero/spicy-chicken.jpg",
        alt: {
            en: "Loaded cheeseburger with caramelized onions",
            ar: "تشيز برجر محمّل مع بصل مكرمل",
        },
        badge: { en: "CHEESE LOVERS", ar: "لعشاق الجبنة" },
        discount: { en: "15% OFF", ar: "خصم 15%" },
        title: { en: "LOADED", ar: "محمّل" },
        highlight: { en: "CHEESE", ar: "تشيز" },
        description: {
            en: "Double cheese, caramelized onions and our signature sauce.",
            ar: "جبنة دبل وبصل مكرمل وصوصنا المميز.",
        },
        note: { en: "CHEESE PULL GUARANTEED", ar: "جبنة سايحة مضمونة" },
    },
];

export default offers;
