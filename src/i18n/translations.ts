export type Language = 'en' | 'mr';

export const TRANSLATIONS = {
  en: {
    // App Header & Branding
    appTitle: 'Jagdamb Enterprises',
    tagline: 'Dairy Farming & Milking Automation',
    location: 'Baramati, Maharashtra',
    searchPlaceholder: 'Search milking machines, analysers, spare parts...',
    resultsCount: '{count} equipment found',
    noResults: 'No equipment found matching your search.',
    clearSearch: 'Clear',
    clearCart: 'Clear Cart',
    cancelAction: 'Cancel',

    // Navigation Tabs
    tabHome: 'Home',
    tabCategories: 'Categories',
    tabQuote: 'Get Quote',
    tabWishlist: 'Wishlist',
    tabCart: 'Cart',
    tabAccount: 'Account',

    // Language Toggle
    langEn: 'English',
    langMr: 'मराठी',

    // Categories
    catAll: 'All Equipment',
    catMilkingMachines: 'Milking Machines',
    catMilkAnalysers: 'Milk Analysers',
    catMilkCooling: 'Milk Cooling Tanks',
    catDairyPumps: 'Dairy Pumps',
    catMilkCans: 'Milk Cans',
    catSpareParts: 'Spare Parts & Liners',

    // Filters
    filterAll: 'All',
    filterPopular: '🔥 Popular',
    filterDiscount: '🏷️ 15%+ Off',
    filterHighRated: '⭐ 4.8★ & Above',
    filterInStock: 'In Stock Only',

    // Product Cards & Badges
    bestSeller: 'BEST SELLER',
    priceOnRequest: 'Price on Request',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    addToCart: 'Add to Cart',
    requestQuote: 'Request Quote',
    viewDetails: 'View Details',
    warranty: 'Warranty',
    reviews: 'reviews',
    mrp: 'M.R.P.:',
    save: 'Save',
    itemsLeft: '{count} left in stock',

    // Details Screen
    specifications: 'Technical Specifications',
    keyFeatures: 'Key Features & Farmer Benefits',
    genuineAssurance: '100% Genuine Equipment Assurance',
    genuineSubtitle: 'Official Baramati showroom warranty with on-site technician service.',
    whatsappEnquiry: 'WhatsApp Enquiry',
    callShowroom: 'Call Showroom',
    shareProduct: 'Share',

    // Cart Screen
    myCart: 'Equipment Cart',
    emptyCartTitle: 'Your cart is empty',
    emptyCartMsg: 'Browse our dairy equipment catalogue and add required machinery.',
    cartItems: 'Items ({count})',
    orderSummary: 'Order Summary',
    subtotal: 'Subtotal',
    gst: 'GST (18% Machinery Tax)',
    deliveryFee: 'Delivery Fee',
    freeDelivery: 'FREE (Above ₹5,000)',
    totalAmount: 'Total Estimated Amount',
    totalSavings: 'Total Savings',
    proceedToQuote: 'Generate Formal Quotation',
    pickupNotice: 'Direct showroom pickup available at Kasba, Baramati.',

    // Wishlist Screen
    myWishlist: 'Saved Equipment',
    emptyWishlistTitle: 'Your wishlist is empty',
    emptyWishlistMsg: 'Save milking machines and equipment to review them later.',
    moveToCart: 'Move to Cart',

    // Quotation Screen
    quotationTitle: 'Request Official Machinery Quotation',
    quotationSubtitle: 'Custom quotes for Bulk Milk Coolers, pipeline parlours & dairy pumps.',
    farmerName: 'Farmer / Enterprise Name',
    contactNumber: 'WhatsApp / Mobile Number',
    villageCity: 'Village / Taluka / District',
    herdSize: 'Dairy Herd Size (Cattle Count)',
    herdPlaceholder: 'e.g., 15 Cows / 8 Buffaloes',
    targetProduct: 'Equipment of Interest',
    requirements: 'Specific Shed Requirements / Notes',
    requirementsPlaceholder: 'Mention phase power supply (Single/3-Phase), shed dimensions, etc.',
    submitQuote: 'Submit Quotation Request',
    submitting: 'Submitting to Baramati Office...',
    quoteSubmitted: 'Quotation request submitted! Our Baramati team will contact you within 2 hours.',
    recentQuotes: 'Your Recent Quotation Inquiries',

    // Account Screen
    accountTitle: 'Farmer Profile & Dairy Settings',
    farmDetails: 'Dairy Farm Details',
    editProfile: 'Edit Profile',
    saveProfile: 'Save Changes',
    farmName: 'Farm / Shed Name',
    address: 'Shed Address',
    supabaseConnected: 'Supabase Cloud Connected',
    supabaseLocalMode: 'Local Storage Mode',
    contactBaramati: 'Need Help? Contact Baramati Showroom',
    showroomAddress: 'Kasba, Baramati, Dist. Pune, Maharashtra - 413102',
    phoneHotline: '+91 98220 12345 / +91 94220 54321',
  },
  mr: {
    // App Header & Branding
    appTitle: 'जगदंब एंटरप्रायझेस',
    tagline: 'दुग्ध व्यवसाय व आधुनिक मिल्किंग ऑटोमेशन',
    location: 'बारामती, महाराष्ट्र',
    searchPlaceholder: 'मिल्किंग मशीन, मिल्क ॲनालायझर, सुटे भाग शोधा...',
    resultsCount: '{count} उपकरणे सापडली',
    noResults: 'तुमच्या शोधानुसार कोणतेही उपकरण आढळले नाही.',
    clearSearch: 'रद्द करा',
    clearCart: 'कार्ट रिकामी करा',
    cancelAction: 'रद्द करा',

    // Navigation Tabs
    tabHome: 'मुख्य',
    tabCategories: 'विभाग',
    tabQuote: 'कोटेशन',
    tabWishlist: 'आवडती',
    tabCart: 'कार्ट',
    tabAccount: 'खाते',

    // Language Toggle
    langEn: 'English',
    langMr: 'मराठी',

    // Categories
    catAll: 'सर्व उपकरणे',
    catMilkingMachines: 'मिल्किंग मशीन्स',
    catMilkAnalysers: 'मिल्क ॲनालायझर',
    catMilkCooling: 'मिल्क कुलिंग टँक (BMC)',
    catDairyPumps: 'डेअरी पंप व ट्रान्सफर',
    catMilkCans: 'स्टेनलेस स्टील कॅन्स',
    catSpareParts: 'सुटे भाग व लायनर्स',

    // Filters
    filterAll: 'सर्व',
    filterPopular: '🔥 लोकप्रिय',
    filterDiscount: '🏷️ १५%+ सूट',
    filterHighRated: '⭐ ४.८★ व अधिक',
    filterInStock: 'उपलब्ध स्टॉक',

    // Product Cards & Badges
    bestSeller: 'बेस्ट सेलर',
    priceOnRequest: 'दर मागणीनुसार',
    inStock: 'स्टॉकमध्ये उपलब्ध',
    outOfStock: 'स्टॉक संपला आहे',
    addToCart: 'कार्टमध्ये जोडा',
    requestQuote: 'कोटेशन मागा',
    viewDetails: 'तपशील पहा',
    warranty: 'वारंटी',
    reviews: 'समीक्षा',
    mrp: 'मूळ किंमत:',
    save: 'बचत',
    itemsLeft: 'फक्त {count} शिल्लक',

    // Details Screen
    specifications: 'तांत्रिक तपशील (Specifications)',
    keyFeatures: 'महत्त्वाची वैशिष्ट्ये व फायदे',
    genuineAssurance: '१००% अस्सल यंत्रसामग्री खात्री',
    genuineSubtitle: 'अधिकृत बारामती शोरूम वॉरंटी व घरपोच तंत्रज्ञ सेवा सहाय्य.',
    whatsappEnquiry: 'व्हॉट्सॲपवर चौकशी करा',
    callShowroom: 'शोरूमला फोन करा',
    shareProduct: 'शेअर करा',

    // Cart Screen
    myCart: 'उपकरण कार्ट',
    emptyCartTitle: 'तुमची कार्ट रिकामी आहे',
    emptyCartMsg: 'डेअरी कॅटलॉगमधून आवश्यक यंत्रसामग्री कार्टमध्ये जोडा.',
    cartItems: 'एकूण साहित्य ({count})',
    orderSummary: 'खर्च तपशील',
    subtotal: 'उपकरण मूल्य',
    gst: 'जीएसटी (१८% कृषी यंत्रसामग्री कर)',
    deliveryFee: 'वाहतूक खर्च',
    freeDelivery: 'मोफत (₹५,००० वरील खरेदीवर)',
    totalAmount: 'एकूण अंदाजे रक्कम',
    totalSavings: 'एकूण बचत',
    proceedToQuote: 'अधिकृत कोटेशन तयार करा',
    pickupNotice: 'कसबा, बारामती येथील शोरूममधून थेट माल घेण्याची सोय उपलब्ध.',

    // Wishlist Screen
    myWishlist: 'जतन केलेली उपकरणे',
    emptyWishlistTitle: 'आवडती यादी रिकामी आहे',
    emptyWishlistMsg: 'मिल्किंग मशीन्स व उपकरणे नंतर पाहण्यासाठी जतन करा.',
    moveToCart: 'कार्टमध्ये हलवा',

    // Quotation Screen
    quotationTitle: 'अधिकृत मशिनरी कोटेशन मागणी',
    quotationSubtitle: 'मोठ्या क्षमतेच्या बीएमसी, पाईपलाईन पार्लर व पंपांसाठी विशेष दर.',
    farmerName: 'शेतकरी / संस्थेचे नाव',
    contactNumber: 'व्हॉट्सॲप / मोबाईल नंबर',
    villageCity: 'गाव / तालुका / जिल्हा',
    herdSize: 'गाय-म्हैस संख्या (जनावरांची संख्या)',
    herdPlaceholder: 'उदा. १५ गायी / ८ म्हशी',
    targetProduct: 'इच्छित उपकरण / मशिनरी',
    requirements: 'शेडचे स्वरूप व वीज पुरवठा तपशील',
    requirementsPlaceholder: 'उदा. सिंगल/थ्री फेज वीज, शेडची लांबी-रुंदी इत्यादी...',
    submitQuote: 'कोटेशन मागणी पाठवा',
    submitting: 'बारामती कार्यालयाला पाठवत आहे...',
    quoteSubmitted: 'कोटेशन मागणी यशस्वीरीत्या नोंदवली गेली! आमची टीम २ तासांत संपर्क करेल.',
    recentQuotes: 'तुमच्या मागील कोटेशन मागण्या',

    // Account Screen
    accountTitle: 'शेतकरी प्रोफाईल व डेअरी माहिती',
    farmDetails: 'डेअरी फार्म तपशील',
    editProfile: 'माहिती बदला',
    saveProfile: 'माहिती जतन करा',
    farmName: 'फार्म / गोठ्याचे नाव',
    address: 'गोठ्याचा पत्ता',
    supabaseConnected: 'सुपाबेस क्लाउड जोडले आहे',
    supabaseLocalMode: 'लोकल स्टोरेज मोड',
    contactBaramati: 'मदत हवी आहे? बारामती शोरूमशी संपर्क साधा',
    showroomAddress: 'कसबा, बारामती, जि. पुणे, महाराष्ट्र - ४१३१०२',
    phoneHotline: '+९१ ९८२२० १२३४५ / +९१ ९४२२० ५४३२१',
  },
};
