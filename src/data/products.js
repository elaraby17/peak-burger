// // Centralized product data — the single source of truth for the menu.
// // Sourced directly from the real Peak Burger menu. Prices are in Egyptian Pounds (E.L).
// // Do not hardcode products inside components — import from here.
// //
// // Sized items expose a `sizes` array; `price` always mirrors the first (smallest) size
// // so cards/list views can show a "from" price without extra logic.

// export const CURRENCY = "E.L";

// export const products = [
//     // ---------- Burgers (سندوتشات البرجر) ----------
//     {
//         id: 1,
//         slug: "classic-burger",
//         name: { en: "Classic Burger", ar: "كلاسيك برجر" },
//         category: "burgers",
//         price: 70,
//         sizes: [
//             { id: "single", label: { en: "Single", ar: "سنجل" }, price: 70 },
//             { id: "double", label: { en: "Double", ar: "دبل" }, price: 90 },
//             { id: "triple", label: { en: "Triple", ar: "تربل" }, price: 120 },
//         ],
//         image: "/src/assets/images/products/classic-burger.jpg",
//         description: {
//             en: "Our signature 120g smash patty with Peek sauce, lettuce and pickles, served with fries.",
//             ar: "قطعة سماش برجر 120 جرام مع بيك صوص، خس وخيار مخلل، وبطاطس.",
//         },
//         ingredients: {
//             en: ["120g smash beef patty", "Peek signature sauce", "Lettuce", "Pickles", "Fries"],
//             ar: ["قطعة سماش برجر 120 جرام", "بيك صوص", "خس", "خيار مخلل", "بطاطس"],
//         },
//         popular: true,
//     },
//     {
//         id: 2,
//         slug: "barbecue-rings",
//         name: { en: "Barbecue Rings", ar: "باربيكيو رينج" },
//         category: "burgers",
//         price: 85,
//         sizes: [
//             { id: "single", label: { en: "Single", ar: "سنجل" }, price: 85 },
//             { id: "double", label: { en: "Double", ar: "دبل" }, price: 105 },
//             { id: "triple", label: { en: "Triple", ar: "تربل" }, price: 125 },
//         ],
//         image: "/src/assets/images/products/classic-burger.jpg",
//         description: {
//             en: "Smash patty loaded with crispy onion rings and smoky BBQ sauce.",
//             ar: "سماش برجر مع اونيون رينجز مقرمشة وصوص باربيكيو مدخن.",
//         },
//         ingredients: {
//             en: ["120g smash beef patty", "Peek signature sauce", "Lettuce", "Pickles", "Onion rings", "BBQ sauce", "Fries"],
//             ar: ["قطعة سماش برجر 120 جرام", "بيك صوص", "خس", "خيار مخلل", "اونيون رينجز", "صوص الباربيكيو", "بطاطس"],
//         },
//         popular: true,
//     },
//     {
//         id: 3,
//         slug: "mexicano",
//         name: { en: "Mexicano", ar: "مكسيكانو" },
//         category: "burgers",
//         price: 90,
//         sizes: [
//             { id: "single", label: { en: "Single", ar: "سنجل" }, price: 90 },
//             { id: "double", label: { en: "Double", ar: "دبل" }, price: 110 },
//             { id: "triple", label: { en: "Triple", ar: "تربل" }, price: 130 },
//         ],
//         image: "/src/assets/images/products/classic-burger.jpg",
//         description: {
//             en: "A spicy Mexican-sauce build with sausage slices.",
//             ar: "سماش برجر بصوص مكسيكانو حار مع شرائح سوسيس.",
//         },
//         ingredients: {
//             en: ["120g smash beef patty", "Peek signature sauce", "Lettuce", "Pickles", "Mexicano sauce", "Sausage slices", "Fries"],
//             ar: ["قطعة سماش برجر 120 جرام", "بيك صوص", "خس", "خيار مخلل", "صوص مكسيكانو", "شرائح سوسيس", "بطاطس"],
//         },
//     },
//     {
//         id: 4,
//         slug: "mushroom-ranch",
//         name: { en: "Mushroom Ranch", ar: "مشروم رانش" },
//         category: "burgers",
//         price: 95,
//         sizes: [
//             { id: "single", label: { en: "Single", ar: "سنجل" }, price: 95 },
//             { id: "double", label: { en: "Double", ar: "دبل" }, price: 115 },
//             { id: "triple", label: { en: "Triple", ar: "تربل" }, price: 135 },
//         ],
//         image: "/src/assets/images/products/classic-burger.jpg",
//         description: {
//             en: "Sauteed mushrooms and creamy ranch sauce over a smash patty.",
//             ar: "مشروم مع صوص رانش كريمي فوق قطعة سماش برجر.",
//         },
//         ingredients: {
//             en: ["120g smash beef patty", "Peek signature sauce", "Lettuce", "Pickles", "Ranch sauce", "Mushrooms", "Fries"],
//             ar: ["قطعة سماش برجر 120 جرام", "بيك صوص", "خس", "خيار مخلل", "صوص رانش", "مشروم", "بطاطس"],
//         },
//     },
//     {
//         id: 5,
//         slug: "amsterdam",
//         name: { en: "Amsterdam", ar: "امستردام" },
//         category: "burgers",
//         price: 100,
//         sizes: [
//             { id: "single", label: { en: "Single", ar: "سنجل" }, price: 100 },
//             { id: "double", label: { en: "Double", ar: "دبل" }, price: 120 },
//             { id: "triple", label: { en: "Triple", ar: "تربل" }, price: 140 },
//         ],
//         image: "/src/assets/images/products/classic-burger.jpg",
//         description: {
//             en: "Texas sauce and pepperoni for a bold, smoky bite.",
//             ar: "صوص تكساس مع بيبروني لطعم مدخن قوي.",
//         },
//         ingredients: {
//             en: ["120g smash beef patty", "Peek signature sauce", "Lettuce", "Pickles", "Texas sauce", "Pepperoni", "Fries"],
//             ar: ["قطعة سماش برجر 120 جرام", "بيك صوص", "خس", "خيار مخلل", "صوص تكساس", "بيبروني", "بطاطس"],
//         },
//     },
//     {
//         id: 6,
//         slug: "world-war",
//         name: { en: "World War", ar: "وورلد وور" },
//         category: "burgers",
//         price: 100,
//         sizes: [
//             { id: "single", label: { en: "Single", ar: "سنجل" }, price: 100 },
//             { id: "double", label: { en: "Double", ar: "دبل" }, price: 120 },
//             { id: "triple", label: { en: "Triple", ar: "تربل" }, price: 140 },
//         ],
//         image: "/src/assets/images/products/classic-burger.jpg",
//         description: {
//             en: "Texas & cheddar sauce with smoked turkey slices.",
//             ar: "صوص تكساس وشيدر مع شرائح تركي مدخن.",
//         },
//         ingredients: {
//             en: ["120g smash beef patty", "Peek signature sauce", "Lettuce", "Pickles", "Texas & cheddar sauce", "Smoked turkey slices", "Fries"],
//             ar: ["قطعة سماش برجر 120 جرام", "بيك صوص", "خس", "خيار مخلل", "صوص تكساس و شيدر", "شرائح تركي مدخن", "بطاطس"],
//         },
//     },
//     {
//         id: 7,
//         slug: "peek-peek-burger",
//         name: { en: "Peek Peek Burger", ar: "بيبيك برجر" },
//         category: "burgers",
//         price: 105,
//         sizes: [
//             { id: "single", label: { en: "Single", ar: "سنجل" }, price: 105 },
//             { id: "double", label: { en: "Double", ar: "دبل" }, price: 125 },
//             { id: "triple", label: { en: "Triple", ar: "تربل" }, price: 145 },
//         ],
//         image: "/src/assets/images/products/classic-burger.jpg",
//         description: {
//             en: "Texas & cheddar sauce loaded with mozzarella sticks.",
//             ar: "صوص تكساس وشيدر مع موتزاريلا ستيكس.",
//         },
//         ingredients: {
//             en: ["120g smash beef patty", "Peek signature sauce", "Lettuce", "Pickles", "Texas & cheddar sauce", "Mozzarella sticks", "Fries"],
//             ar: ["قطعة سماش برجر 120 جرام", "بيك صوص", "خس", "خيار مخلل", "صوص تكساس و شيدر", "موتزاريلا ستيكس", "بطاطس"],
//         },
//         popular: true,
//     },
//     {
//         id: 8,
//         slug: "kids-meal",
//         name: { en: "Kids Meal", ar: "كيدز ميل" },
//         category: "burgers",
//         price: 70,
//         sizes: [
//             { id: "regular", label: { en: "Regular", ar: "عادي" }, price: 70 },
//             { id: "large", label: { en: "Large", ar: "كبير" }, price: 90 },
//         ],
//         image: "/src/assets/images/products/classic-burger.jpg",
//         description: {
//             en: "A gentler 100g patty with fries and juice — sized for smaller appetites.",
//             ar: "قطعة سماش برجر 100 جرام مع بطاطس وعصير — مناسبة للأطفال.",
//         },
//         ingredients: {
//             en: ["100g smash beef patty", "Peek signature sauce", "Lettuce", "Pickles", "Fries", "Juice"],
//             ar: ["قطعة سماش برجر 100 جرام", "بيك صوص", "خس", "خيار مخلل", "بطاطس", "عصير"],
//         },
//     },

//     // ---------- Special Burgers (البرجر الخاص) ----------
//     {
//         id: 9,
//         slug: "peek-burger-ultimate",
//         name: { en: "Peek Burger Ultimate", ar: "بييك برجر" },
//         category: "special",
//         price: 140,
//         image: "/src/assets/images/products/classic-burger.jpg",
//         description: {
//             en: "A 200g patty stacked with crispy chicken, caramelized onion and beef bacon.",
//             ar: "قطعة برجر 200 جرام مع قطعة فراخ كريسبي، بصل مكرمل، وبيف بيكون.",
//         },
//         ingredients: {
//             en: ["200g beef patty", "Cheddar sauce", "Crispy chicken piece", "Fries", "Caramelized onion", "Beef bacon"],
//             ar: ["قطعة برجر 200 جرام", "صوص شيدر", "قطعة فراخ كريسبي", "بطاطس", "بصل مكرمل", "بيف بيكون"],
//         },
//         popular: true,
//     },
//     {
//         id: 10,
//         slug: "juicy-lucy",
//         name: { en: "Juicy Lucy", ar: "جوسي لوسي" },
//         category: "special",
//         price: 155,
//         image: "/src/assets/images/products/classic-burger.jpg",
//         description: {
//             en: "A 200g patty with lettuce, Peek sauce, cheddar sauce and crispy chicken.",
//             ar: "قطعة برجر 200 جرام مع خس، صوص البيك، صوص شيدر، وقطعة فراخ كريسبي.",
//         },
//         ingredients: {
//             en: ["200g beef patty", "Lettuce", "Peek sauce", "Cheddar sauce", "Crispy chicken piece", "Fries"],
//             ar: ["قطعة برجر 200 جرام", "خس", "صوص البيك", "صوص شيدر", "قطعة فراخ كريسبي", "بطاطس"],
//         },
//         popular: true,
//     },

//     // ---------- Peek Cup & Sauces (بيك كب والصوصات) ----------
//     {
//         id: 11,
//         slug: "chicken-strips-cup",
//         name: { en: "Chicken Strips", ar: "قطع ستريبس" },
//         category: "peek-cup",
//         price: 80,
//         image: "/src/assets/images/products/classic-burger.jpg",
//         description: {
//             en: "Crispy chicken strips served with fries and a sauce of your choice.",
//             ar: "قطع ستريبس مقرمشة مع بطاطس وصوص من اختيارك.",
//         },
//         ingredients: { en: ["Chicken strips", "Fries", "Sauce of choice"], ar: ["قطع ستريبس", "بطاطس", "صوص من اختيارك"] },
//         sauceOptions: ["cheddar", "ranch", "texas", "chilli"],
//     },
//     {
//         id: 12,
//         slug: "smash-patty-cup",
//         name: { en: "Smash Patty Cup", ar: "قطعة اسماش برجر" },
//         category: "peek-cup",
//         price: 70,
//         image: "/src/assets/images/products/classic-burger.jpg",
//         description: {
//             en: "A smash patty cup with fries and a sauce of your choice.",
//             ar: "قطعة اسماش برجر مع بطاطس وصوص من اختيارك.",
//         },
//         ingredients: { en: ["Smash beef patty", "Fries", "Sauce of choice"], ar: ["قطعة اسماش برجر", "بطاطس", "صوص من اختيارك"] },
//         sauceOptions: ["cheddar", "ranch", "texas", "chilli"],
//     },
//     {
//         id: 13,
//         slug: "jalapeno-fries",
//         name: { en: "Jalapeño Fries", ar: "هالبينو فرايز" },
//         category: "peek-cup",
//         price: 60,
//         image: "/src/assets/images/products/classic-burger.jpg",
//         description: {
//             en: "Fries loaded with jalapeños and a sauce of your choice.",
//             ar: "بطاطس مع هالبينو وصوص من اختيارك.",
//         },
//         ingredients: { en: ["Fries", "Jalapeños", "Sauce of choice"], ar: ["بطاطس", "هالبينو", "صوص من اختيارك"] },
//         sauceOptions: ["cheddar", "ranch", "texas", "chilli"],
//     },
//     {
//         id: 14,
//         slug: "cup-fries",
//         name: { en: "Cup Fries", ar: "كب فرايز" },
//         category: "peek-cup",
//         price: 45,
//         image: "/src/assets/images/products/classic-burger.jpg",
//         description: {
//             en: "A cup of crispy fries with a sauce of your choice.",
//             ar: "كوب بطاطس مقرمشة مع صوص من اختيارك.",
//         },
//         ingredients: { en: ["Fries", "Sauce of choice"], ar: ["بطاطس", "صوص من اختيارك"] },
//         sauceOptions: ["cheddar", "ranch", "texas", "chilli"],
//     },

//     // ---------- Sauces (الصوصات) ----------
//     {
//         id: 15,
//         slug: "barbecue-sauce",
//         name: { en: "Barbecue Sauce", ar: "باربيكيو" },
//         category: "sauces",
//         price: 15,
//         image: "/src/assets/images/products/classic-burger.jpg",
//         description: { en: "Smoky barbecue sauce on the side.", ar: "صوص باربيكيو مدخن بجانب طلبك." },
//         ingredients: { en: [], ar: [] },
//     },
//     {
//         id: 16,
//         slug: "cheddar-sauce",
//         name: { en: "Cheddar Sauce", ar: "شيدر" },
//         category: "sauces",
//         price: 15,
//         image: "/src/assets/images/products/classic-burger.jpg",
//         description: { en: "Creamy cheddar sauce on the side.", ar: "صوص شيدر كريمي بجانب طلبك." },
//         ingredients: { en: [], ar: [] },
//     },
//     {
//         id: 17,
//         slug: "chilli-sauce",
//         name: { en: "Chilli Sauce", ar: "تشيلي" },
//         category: "sauces",
//         price: 15,
//         image: "/src/assets/images/products/classic-burger.jpg",
//         description: { en: "Spicy chilli sauce on the side.", ar: "صوص تشيلي حار بجانب طلبك." },
//         ingredients: { en: [], ar: [] },
//     },
//     {
//         id: 18,
//         slug: "honey-yummy-sauce",
//         name: { en: "Honey Yummy Sauce", ar: "صوص هاني يامي" },
//         category: "sauces",
//         price: null, // TODO: price not listed on the source menu — update once confirmed.
//         image: "/src/assets/images/products/classic-burger.jpg",
//         description: { en: "Our sweet honey-mustard house sauce.", ar: "صوص هاني يامي المميز — حلو ومنعش." },
//         ingredients: { en: [], ar: [] },
//     },

//     // ---------- Soda & Coffee (المشروبات الغازية والقهوة) ----------
//     {
//         id: 19,
//         slug: "kiwi-mint",
//         name: { en: "Kiwi Mint", ar: "كيوي نعناع" },
//         category: "drinks",
//         price: 60,
//         image: "/src/assets/images/products/classic-burger.jpg",
//         description: { en: "Kiwi, mint, soda and lemon.", ar: "كيوي، نعناع، صودا وليمون." },
//         ingredients: { en: ["Kiwi", "Mint", "Soda", "Lemon"], ar: ["كيوي", "نعناع", "صودا", "ليمون"] },
//     },
//     {
//         id: 20,
//         slug: "sunshine",
//         name: { en: "Sunshine", ar: "صن شاين" },
//         category: "drinks",
//         price: 50,
//         image: "/src/assets/images/products/classic-burger.jpg",
//         description: { en: "Strawberry, orange and soda.", ar: "فراولة، برتقال وصودا." },
//         ingredients: { en: ["Strawberry", "Orange", "Soda"], ar: ["فراولة", "برتقال", "صودا"] },
//     },
//     {
//         id: 21,
//         slug: "mojito",
//         name: { en: "Mojito", ar: "موخيتو" },
//         category: "drinks",
//         price: 50,
//         image: "/src/assets/images/products/classic-burger.jpg",
//         description: { en: "Mojito, mint, lemon and soda.", ar: "موخيتو، نعناع، ليمون وصودا." },
//         ingredients: { en: ["Mojito", "Mint", "Lemon", "Soda"], ar: ["موخيتو", "نعناع", "ليمون", "صودا"] },
//     },
//     {
//         id: 22,
//         slug: "mint-soda",
//         name: { en: "Mint Soda", ar: "صودا منت" },
//         category: "drinks",
//         price: 50,
//         image: "/src/assets/images/products/classic-burger.jpg",
//         description: { en: "Mint, lemon and soda.", ar: "نعناع، ليمون وصودا." },
//         ingredients: { en: ["Mint", "Lemon", "Soda"], ar: ["نعناع", "ليمون", "صودا"] },
//     },
//     {
//         id: 23,
//         slug: "cherry-blue-sky",
//         name: { en: "Cherry Blue Sky", ar: "شيري بلوسكاي" },
//         category: "drinks",
//         price: 55,
//         image: "/src/assets/images/products/classic-burger.jpg",
//         description: { en: "Cherry, blue curaçao and soda.", ar: "كريز، بلو كوراساو وصودا." },
//         ingredients: { en: ["Cherry", "Blue curaçao", "Soda"], ar: ["كريز", "بلو كوراساو", "صودا"] },
//     },
//     {
//         id: 24,
//         slug: "iced-coffee",
//         name: { en: "Iced Coffee", ar: "ايس كوفي" },
//         category: "drinks",
//         price: 60,
//         image: "/src/assets/images/products/classic-burger.jpg",
//         description: { en: "Classic iced coffee.", ar: "ايس كوفي كلاسيك." },
//         ingredients: { en: [], ar: [] },
//     },
//     {
//         id: 25,
//         slug: "frappuccino",
//         name: { en: "Frappuccino", ar: "فرابتشينو" },
//         category: "drinks",
//         price: 60,
//         image: "/src/assets/images/products/classic-burger.jpg",
//         description: { en: "Blended iced coffee frappé.", ar: "فرابتشينو مثلج." },
//         ingredients: { en: [], ar: [] },
//     },
//     {
//         id: 26,
//         slug: "iced-mocha",
//         name: { en: "Iced Mocha", ar: "ايس موكا" },
//         category: "drinks",
//         price: 60,
//         image: "/src/assets/images/products/classic-burger.jpg",
//         description: { en: "Iced mocha with chocolate.", ar: "ايس موكا بالشوكولاتة." },
//         ingredients: { en: [], ar: [] },
//     },
//     {
//         id: 27,
//         slug: "iced-latte",
//         name: { en: "Iced Latte", ar: "ايس لاتيه" },
//         category: "drinks",
//         price: 60,
//         image: "/images/products/iced-latte.jpg",
//         description: { en: "Smooth iced latte.", ar: "ايس لاتيه ناعم." },
//         ingredients: { en: [], ar: [] },
//     },

//     // ---------- Pan Cake (بان كيك) ----------
//     {
//         id: 28,
//         slug: "nutella-pancake",
//         name: { en: "Nutella Pancake", ar: "بان كيك نوتيلا" },
//         category: "pancake",
//         price: 50,
//         sizes: [
//             { id: "12pcs", label: { en: "12 pcs", ar: "12 قطعة" }, price: 50 },
//             { id: "24pcs", label: { en: "24 pcs", ar: "24 قطعة" }, price: 80 },
//         ],
//         image: "/images/products/nutella-pancake.jpg",
//         description: { en: "Mini pancakes with Nutella.", ar: "بان كيك صغير بالنوتيلا." },
//         ingredients: { en: [], ar: [] },
//         popular: true,
//     },
//     {
//         id: 29,
//         slug: "lotus-pancake",
//         name: { en: "Lotus Pancake", ar: "بان كيك لوتس" },
//         category: "pancake",
//         price: 55,
//         sizes: [
//             { id: "12pcs", label: { en: "12 pcs", ar: "12 قطعة" }, price: 55 },
//             { id: "24pcs", label: { en: "24 pcs", ar: "24 قطعة" }, price: 90 },
//         ],
//         image: "/images/products/lotus-pancake.jpg",
//         description: { en: "Mini pancakes with Lotus spread.", ar: "بان كيك صغير باللوتس." },
//         ingredients: { en: [], ar: [] },
//     },
//     {
//         id: 30,
//         slug: "caramel-pancake",
//         name: { en: "Caramel Pancake", ar: "بان كيك كاراميل" },
//         category: "pancake",
//         price: 50,
//         sizes: [
//             { id: "12pcs", label: { en: "12 pcs", ar: "12 قطعة" }, price: 50 },
//             { id: "24pcs", label: { en: "24 pcs", ar: "24 قطعة" }, price: 80 },
//         ],
//         image: "/images/products/caramel-pancake.jpg",
//         description: { en: "Mini pancakes with caramel.", ar: "بان كيك صغير بالكاراميل." },
//         ingredients: { en: [], ar: [] },
//     },
//     {
//         id: 31,
//         slug: "white-chocolate-pancake",
//         name: { en: "White Chocolate Pancake", ar: "بان كيك وايت شوكلت" },
//         category: "pancake",
//         price: 50,
//         sizes: [
//             { id: "12pcs", label: { en: "12 pcs", ar: "12 قطعة" }, price: 50 },
//             { id: "24pcs", label: { en: "24 pcs", ar: "24 قطعة" }, price: 80 },
//         ],
//         image: "/images/products/white-chocolate-pancake.jpg",
//         description: { en: "Mini pancakes with white chocolate.", ar: "بان كيك صغير بالوايت شوكلت." },
//         ingredients: { en: [], ar: [] },
//     },
//     {
//         id: 32,
//         slug: "pistachio-pancake",
//         name: { en: "Pistachio Pancake", ar: "بان كيك بستاشيو" },
//         category: "pancake",
//         price: 70,
//         sizes: [
//             { id: "12pcs", label: { en: "12 pcs", ar: "12 قطعة" }, price: 70 },
//             { id: "24pcs", label: { en: "24 pcs", ar: "24 قطعة" }, price: 120 },
//         ],
//         image: "/images/products/pistachio-pancake.jpg",
//         description: { en: "Mini pancakes with pistachio.", ar: "بان كيك صغير بالبستاشيو." },
//         ingredients: { en: [], ar: [] },
//     },

//     // ---------- New Items (أصناف جديدة) ----------
//     {
//         id: 33,
//         slug: "koko-smoke",
//         name: { en: "KoKo Smoke", ar: "KoKo SMOKE" },
//         category: "new",
//         price: 120,
//         image: "/images/products/koko-smoke.jpg",
//         description: {
//             en: "Grilled chicken breast with lettuce and honey-yummy sauce.",
//             ar: "صدر فراخ مشوي مع خس وصوص هاني يامي.",
//         },
//         ingredients: {
//             en: ["Grilled chicken breast", "Lettuce", "Honey-yummy sauce"],
//             ar: ["صدر فراخ مشوي", "خس", "صوص هاني يامي"],
//         },
//         popular: true,
//         isNew: true,
//     },
// ];

// export const sauceLabels = {
//   cheddar: { en: "Cheddar", ar: "شيدر" },
//   ranch: { en: "Ranch", ar: "رانش" },
//   texas: { en: "Texas", ar: "تكساس" },
//   chilli: { en: "Chilli", ar: "تشيلي" },
// };

// export const getProductBySlugOrId = (idOrSlug) =>
//   products.find((p) => p.slug === idOrSlug || String(p.id) === String(idOrSlug));

// export const getProductsByCategory = (categoryId) =>
//   products.filter((p) => p.category === categoryId);

// export const getPopularProducts = () => products.filter((p) => p.popular);
