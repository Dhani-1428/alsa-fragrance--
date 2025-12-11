export type Language = "en" | "pt" | "hi" | "ar" | "ur"

export interface Translations {
  // Navigation
  nav: {
    home: string
    about: string
    shop: string
    contact: string
    forHer: string
    forHim: string
    attars: string
    testers: string
    newArrivals: string
    limitedEdition: string
  }
  // Common
  common: {
    addToCart: string
    buyNow: string
    cancel: string
    submit: string
    loading: string
    error: string
    success: string
  }
  // Product
  product: {
    price: string
    originalPrice: string
    size: string
    description: string
    reviews: string
    inStock: string
    outOfStock: string
    quantity: string
    addToCart: string
  }
  // Cart
  cart: {
    title: string
    empty: string
    subtotal: string
    shipping: string
    tax: string
    total: string
    clearCart: string
    proceedToCheckout: string
    freeShipping: string
    items: string
  }
  // Checkout
  checkout: {
    title: string
    billingInfo: string
    fullName: string
    email: string
    phone: string
    address: string
    city: string
    postalCode: string
    country: string
    additionalNotes: string
    orderSummary: string
    paymentMethod: string
    cardPayment: string
    mbway: string
    placeOrder: string
    processing: string
  }
  // Footer
  footer: {
    followUs: string
    quickLinks: string
    customerService: string
    newsletter: string
    subscribe: string
  }
  // Homepage
  home: {
    discoverCollection: string
    shopNow: string
    newArrivals: string
    featuredProducts: string
    limitedEdition: string
  }
  // Shop
  shop: {
    title: string
    filters: string
    allProducts: string
    showingResults: string
    noProducts: string
    sortBy: string
    priceRange: string
  }
  // Pages
  pages: {
    cartEmpty: string
    startShopping: string
    selectPaymentMethod: string
    confirmPaymentMethod: string
    cardDetails: string
    mbwayInstructions: string
    mbwayNumber: string
    mbwayDescription: string
  }
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      shop: "Shop",
      contact: "Contact",
      forHer: "For Her",
      forHim: "For Him",
      attars: "Attars",
      testers: "Testers",
      newArrivals: "New Arrivals",
      limitedEdition: "Limited Edition",
    },
    common: {
      addToCart: "Add to Cart",
      buyNow: "Buy Now",
      cancel: "Cancel",
      submit: "Submit",
      loading: "Loading...",
      error: "Error",
      success: "Success",
    },
    product: {
      price: "Price",
      originalPrice: "Original Price",
      size: "Size",
      description: "Description",
      reviews: "Reviews",
      inStock: "In Stock",
      outOfStock: "Out of Stock",
      quantity: "Quantity",
      addToCart: "Add to Cart",
    },
    cart: {
      title: "Shopping Cart",
      empty: "Your cart is empty",
      subtotal: "Subtotal",
      shipping: "Shipping",
      tax: "Tax",
      total: "Total",
      clearCart: "Clear Cart",
      proceedToCheckout: "Proceed to Checkout",
      freeShipping: "Free Shipping",
      items: "items",
    },
    checkout: {
      title: "Checkout",
      billingInfo: "Billing Information",
      fullName: "Full Name",
      email: "Email Address",
      phone: "Phone Number",
      address: "Street Address",
      city: "City",
      postalCode: "Postal Code",
      country: "Country",
      additionalNotes: "Additional Notes",
      orderSummary: "Order Summary",
      paymentMethod: "Payment Method",
      cardPayment: "Debit/Credit Card (Visa, Mastercard, etc.)",
      mbway: "MBWay",
      placeOrder: "Place Order",
      processing: "Processing...",
    },
    footer: {
      followUs: "Follow Us",
      quickLinks: "Quick Links",
      customerService: "Customer Service",
      newsletter: "Newsletter",
      subscribe: "Subscribe",
    },
    home: {
      discoverCollection: "Discover Our Collection",
      shopNow: "Shop Now",
      newArrivals: "New Arrivals",
      featuredProducts: "Featured Products",
      limitedEdition: "Limited Edition",
    },
    shop: {
      title: "Shop",
      filters: "Filters",
      allProducts: "All Products",
      showingResults: "Showing Results",
      noProducts: "No products found",
      sortBy: "Sort By",
      priceRange: "Price Range",
    },
    pages: {
      cartEmpty: "Your cart is empty",
      startShopping: "Start Shopping",
      selectPaymentMethod: "Select Payment Method",
      confirmPaymentMethod: "Confirm Payment Method",
      cardDetails: "Card Details",
      mbwayInstructions: "MBWay Payment Instructions",
      mbwayNumber: "+351 920062535",
      mbwayDescription: "Please send payment to the following MBWay number:",
    },
  },
  pt: {
    nav: {
      home: "Início",
      about: "Sobre",
      shop: "Loja",
      contact: "Contacto",
      forHer: "Para Ela",
      forHim: "Para Ele",
      attars: "Attars",
      testers: "Testadores",
      newArrivals: "Novidades",
      limitedEdition: "Edição Limitada",
    },
    common: {
      addToCart: "Adicionar ao Carrinho",
      buyNow: "Comprar Agora",
      cancel: "Cancelar",
      submit: "Enviar",
      loading: "A carregar...",
      error: "Erro",
      success: "Sucesso",
    },
    product: {
      price: "Preço",
      originalPrice: "Preço Original",
      size: "Tamanho",
      description: "Descrição",
      reviews: "Avaliações",
      inStock: "Em Stock",
      outOfStock: "Sem Stock",
      quantity: "Quantidade",
      addToCart: "Adicionar ao Carrinho",
    },
    cart: {
      title: "Carrinho de Compras",
      empty: "O seu carrinho está vazio",
      subtotal: "Subtotal",
      shipping: "Portes",
      tax: "Imposto",
      total: "Total",
      clearCart: "Limpar Carrinho",
      proceedToCheckout: "Prosseguir para o Checkout",
      freeShipping: "Portes Grátis",
      items: "itens",
    },
    checkout: {
      title: "Checkout",
      billingInfo: "Informações de Faturação",
      fullName: "Nome Completo",
      email: "Endereço de Email",
      phone: "Número de Telefone",
      address: "Morada",
      city: "Cidade",
      postalCode: "Código Postal",
      country: "País",
      additionalNotes: "Notas Adicionais",
      orderSummary: "Resumo do Pedido",
      paymentMethod: "Método de Pagamento",
      cardPayment: "Cartão de Débito/Crédito (Visa, Mastercard, etc.)",
      mbway: "MBWay",
      placeOrder: "Fazer Pedido",
      processing: "A processar...",
    },
    footer: {
      followUs: "Siga-nos",
      quickLinks: "Links Rápidos",
      customerService: "Serviço ao Cliente",
      newsletter: "Newsletter",
      subscribe: "Subscrever",
    },
    home: {
      discoverCollection: "Descubra a Nossa Coleção",
      shopNow: "Comprar Agora",
      newArrivals: "Novidades",
      featuredProducts: "Produtos em Destaque",
      limitedEdition: "Edição Limitada",
    },
    shop: {
      title: "Loja",
      filters: "Filtros",
      allProducts: "Todos os Produtos",
      showingResults: "Mostrando Resultados",
      noProducts: "Nenhum produto encontrado",
      sortBy: "Ordenar Por",
      priceRange: "Gama de Preços",
    },
    pages: {
      cartEmpty: "O seu carrinho está vazio",
      startShopping: "Começar a Comprar",
      selectPaymentMethod: "Selecionar Método de Pagamento",
      confirmPaymentMethod: "Confirmar Método de Pagamento",
      cardDetails: "Detalhes do Cartão",
      mbwayInstructions: "Instruções de Pagamento MBWay",
      mbwayNumber: "+351 920062535",
      mbwayDescription: "Por favor, envie o pagamento para o seguinte número MBWay:",
    },
  },
  hi: {
    nav: {
      home: "होम",
      about: "के बारे में",
      shop: "दुकान",
      contact: "संपर्क",
      forHer: "उसके लिए",
      forHim: "उसके लिए",
      attars: "अत्तर",
      testers: "टेस्टर",
      newArrivals: "नए आगमन",
      limitedEdition: "सीमित संस्करण",
    },
    common: {
      addToCart: "कार्ट में जोड़ें",
      buyNow: "अभी खरीदें",
      cancel: "रद्द करें",
      submit: "जमा करें",
      loading: "लोड हो रहा है...",
      error: "त्रुटि",
      success: "सफलता",
    },
    product: {
      price: "मूल्य",
      originalPrice: "मूल मूल्य",
      size: "आकार",
      description: "विवरण",
      reviews: "समीक्षाएं",
      inStock: "स्टॉक में",
      outOfStock: "स्टॉक खत्म",
      quantity: "मात्रा",
      addToCart: "कार्ट में जोड़ें",
    },
    cart: {
      title: "खरीदारी की टोकरी",
      empty: "आपकी टोकरी खाली है",
      subtotal: "उप-योग",
      shipping: "शिपिंग",
      tax: "कर",
      total: "कुल",
      clearCart: "कार्ट साफ करें",
      proceedToCheckout: "चेकआउट पर जाएं",
      freeShipping: "मुफ्त शिपिंग",
      items: "वस्तुएं",
    },
    checkout: {
      title: "चेकआउट",
      billingInfo: "बिलिंग जानकारी",
      fullName: "पूरा नाम",
      email: "ईमेल पता",
      phone: "फोन नंबर",
      address: "सड़क का पता",
      city: "शहर",
      postalCode: "पिन कोड",
      country: "देश",
      additionalNotes: "अतिरिक्त नोट्स",
      orderSummary: "ऑर्डर सारांश",
      paymentMethod: "भुगतान विधि",
      cardPayment: "डेबिट/क्रेडिट कार्ड (वीज़ा, मास्टरकार्ड, आदि)",
      mbway: "MBWay",
      placeOrder: "ऑर्डर दें",
      processing: "प्रसंस्करण...",
    },
    footer: {
      followUs: "हमें फॉलो करें",
      quickLinks: "त्वरित लिंक",
      customerService: "ग्राहक सेवा",
      newsletter: "न्यूज़लेटर",
      subscribe: "सब्सक्राइब करें",
    },
    home: {
      discoverCollection: "हमारे संग्रह की खोज करें",
      shopNow: "अभी खरीदें",
      newArrivals: "नए आगमन",
      featuredProducts: "विशेष उत्पाद",
      limitedEdition: "सीमित संस्करण",
    },
    shop: {
      title: "दुकान",
      filters: "फिल्टर",
      allProducts: "सभी उत्पाद",
      showingResults: "परिणाम दिखा रहे हैं",
      noProducts: "कोई उत्पाद नहीं मिला",
      sortBy: "क्रमबद्ध करें",
      priceRange: "मूल्य सीमा",
    },
    pages: {
      cartEmpty: "आपकी टोकरी खाली है",
      startShopping: "खरीदारी शुरू करें",
      selectPaymentMethod: "भुगतान विधि चुनें",
      confirmPaymentMethod: "भुगतान विधि की पुष्टि करें",
      cardDetails: "कार्ड विवरण",
      mbwayInstructions: "MBWay भुगतान निर्देश",
      mbwayNumber: "+351 920062535",
      mbwayDescription: "कृपया निम्नलिखित MBWay नंबर पर भुगतान भेजें:",
    },
  },
  ar: {
    nav: {
      home: "الرئيسية",
      about: "حول",
      shop: "المتجر",
      contact: "اتصل",
      forHer: "لها",
      forHim: "له",
      attars: "العطار",
      testers: "عينات",
      newArrivals: "وافدات جديدة",
      limitedEdition: "إصدار محدود",
    },
    common: {
      addToCart: "أضف إلى السلة",
      buyNow: "اشتري الآن",
      cancel: "إلغاء",
      submit: "إرسال",
      loading: "جاري التحميل...",
      error: "خطأ",
      success: "نجاح",
    },
    product: {
      price: "السعر",
      originalPrice: "السعر الأصلي",
      size: "الحجم",
      description: "الوصف",
      reviews: "المراجعات",
      inStock: "متوفر",
      outOfStock: "غير متوفر",
      quantity: "الكمية",
      addToCart: "أضف إلى السلة",
    },
    cart: {
      title: "سلة التسوق",
      empty: "سلتك فارغة",
      subtotal: "المجموع الفرعي",
      shipping: "الشحن",
      tax: "الضريبة",
      total: "الإجمالي",
      clearCart: "مسح السلة",
      proceedToCheckout: "المتابعة للدفع",
      freeShipping: "شحن مجاني",
      items: "عناصر",
    },
    checkout: {
      title: "الدفع",
      billingInfo: "معلومات الفوترة",
      fullName: "الاسم الكامل",
      email: "عنوان البريد الإلكتروني",
      phone: "رقم الهاتف",
      address: "عنوان الشارع",
      city: "المدينة",
      postalCode: "الرمز البريدي",
      country: "الدولة",
      additionalNotes: "ملاحظات إضافية",
      orderSummary: "ملخص الطلب",
      paymentMethod: "طريقة الدفع",
      cardPayment: "بطاقة الخصم/الائتمان (فيزا، ماستركارد، إلخ)",
      mbway: "MBWay",
      placeOrder: "تقديم الطلب",
      processing: "جاري المعالجة...",
    },
    footer: {
      followUs: "تابعنا",
      quickLinks: "روابط سريعة",
      customerService: "خدمة العملاء",
      newsletter: "النشرة الإخبارية",
      subscribe: "اشترك",
    },
    home: {
      discoverCollection: "اكتشف مجموعتنا",
      shopNow: "تسوق الآن",
      newArrivals: "وافدات جديدة",
      featuredProducts: "منتجات مميزة",
      limitedEdition: "إصدار محدود",
    },
    shop: {
      title: "المتجر",
      filters: "فلاتر",
      allProducts: "جميع المنتجات",
      showingResults: "عرض النتائج",
      noProducts: "لم يتم العثور على منتجات",
      sortBy: "ترتيب حسب",
      priceRange: "نطاق السعر",
    },
    pages: {
      cartEmpty: "سلتك فارغة",
      startShopping: "ابدأ التسوق",
      selectPaymentMethod: "اختر طريقة الدفع",
      confirmPaymentMethod: "تأكيد طريقة الدفع",
      cardDetails: "تفاصيل البطاقة",
      mbwayInstructions: "تعليمات دفع MBWay",
      mbwayNumber: "+351 920062535",
      mbwayDescription: "يرجى إرسال الدفع إلى رقم MBWay التالي:",
    },
  },
  ur: {
    nav: {
      home: "ہوم",
      about: "ہمارے بارے میں",
      shop: "دکان",
      contact: "رابطہ",
      forHer: "اس کے لیے",
      forHim: "اس کے لیے",
      attars: "عطار",
      testers: "ٹیسٹر",
      newArrivals: "نئے آئٹمز",
      limitedEdition: "محدود ایڈیشن",
    },
    common: {
      addToCart: "کارٹ میں شامل کریں",
      buyNow: "ابھی خریدیں",
      cancel: "منسوخ کریں",
      submit: "جمع کریں",
      loading: "لوڈ ہو رہا ہے...",
      error: "خرابی",
      success: "کامیابی",
    },
    product: {
      price: "قیمت",
      originalPrice: "اصل قیمت",
      size: "سائز",
      description: "تفصیل",
      reviews: "جائزے",
      inStock: "اسٹاک میں",
      outOfStock: "اسٹاک ختم",
      quantity: "مقدار",
      addToCart: "کارٹ میں شامل کریں",
    },
    cart: {
      title: "خریداری کی ٹوکری",
      empty: "آپ کی ٹوکری خالی ہے",
      subtotal: "ذیلی کل",
      shipping: "شپنگ",
      tax: "ٹیکس",
      total: "کل",
      clearCart: "کارٹ صاف کریں",
      proceedToCheckout: "چیک آؤٹ پر جائیں",
      freeShipping: "مفت شپنگ",
      items: "اشیاء",
    },
    checkout: {
      title: "چیک آؤٹ",
      billingInfo: "بلنگ کی معلومات",
      fullName: "پورا نام",
      email: "ای میل پتہ",
      phone: "فون نمبر",
      address: "گلی کا پتہ",
      city: "شہر",
      postalCode: "پن کوڈ",
      country: "ملک",
      additionalNotes: "اضافی نوٹس",
      orderSummary: "آرڈر کا خلاصہ",
      paymentMethod: "ادائیگی کا طریقہ",
      cardPayment: "ڈیبٹ/کریڈٹ کارڈ (ویزا، ماسٹرکارڈ، وغیرہ)",
      mbway: "MBWay",
      placeOrder: "آرڈر دیں",
      processing: "پروسیسنگ...",
    },
    footer: {
      followUs: "ہمیں فالو کریں",
      quickLinks: "فوری لنکس",
      customerService: "کسٹمر سروس",
      newsletter: "نیوز لیٹر",
      subscribe: "سبسکرائب کریں",
    },
    home: {
      discoverCollection: "ہمارے مجموعہ کی دریافت کریں",
      shopNow: "ابھی خریدیں",
      newArrivals: "نئے آئٹمز",
      featuredProducts: "نمایاں مصنوعات",
      limitedEdition: "محدود ایڈیشن",
    },
    shop: {
      title: "دکان",
      filters: "فلٹرز",
      allProducts: "تمام مصنوعات",
      showingResults: "نتائج دکھا رہے ہیں",
      noProducts: "کوئی مصنوعات نہیں ملی",
      sortBy: "ترتیب دیں",
      priceRange: "قیمت کی حد",
    },
    pages: {
      cartEmpty: "آپ کی ٹوکری خالی ہے",
      startShopping: "خریداری شروع کریں",
      selectPaymentMethod: "ادائیگی کا طریقہ منتخب کریں",
      confirmPaymentMethod: "ادائیگی کے طریقے کی تصدیق کریں",
      cardDetails: "کارڈ کی تفصیلات",
      mbwayInstructions: "MBWay ادائیگی کی ہدایات",
      mbwayNumber: "+351 920062535",
      mbwayDescription: "براہ کرم مندرجہ ذیل MBWay نمبر پر ادائیگی بھیجیں:",
    },
  },
}
