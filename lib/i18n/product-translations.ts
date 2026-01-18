// Product translations mapping
// Maps product names and descriptions by language
// Format: product_id: { en: { name, description }, pt: { name, description }, ... }
// Add translations by matching product IDs from the database

export const productTranslations: Record<
  string,
  Partial<Record<"en" | "pt" | "hi" | "ar" | "ur" | "fr" | "es", { name?: string; description?: string }>>
> = {
  "64": {
    en: { 
      name: "ALSA LEÃO", 
      description: "A warm and welcoming fragrance that greets the day with elegance. Rich, golden notes that radiate positivity and grace." 
    },
    pt: { 
      name: "ALSA LEÃO", 
      description: "Uma fragrância quente e acolhedora que cumprimenta o dia com elegância. Notas ricas e douradas que irradiam positividade e graça." 
    },
    hi: { 
      name: "ALSA LEÃO", 
      description: "एक गर्म और स्वागत योग्य सुगंध जो दिन का सत्कार करती है। समृद्ध, सुनहरे नोट जो सकारात्मकता और अनुग्रह बिखेरते हैं।" 
    },
    ar: { 
      name: "ALSA LEÃO", 
      description: "عطر دافئ ومرحب يحيي اليوم بأناقة. نوتات غنية وذهبية تشع بالإيجابية والنعمة." 
    },
    ur: { 
      name: "ALSA LEÃO", 
      description: "ایک گرم اور خوش آمدید خوشبو جو دن کا استقبال کرتی ہے۔ امیر، سنہری نوٹ جو مثبتیت اور فضل پھیلاتے ہیں۔" 
    },
    fr: { 
      name: "ALSA LEÃO", 
      description: "Un parfum chaleureux et accueillant qui salue la journée avec élégance. Des notes riches et dorées qui rayonnent de positivité et de grâce." 
    },
    es: { 
      name: "ALSA LEÃO", 
      description: "Una fragancia cálida y acogedora que saluda el día con elegancia. Notas ricas y doradas que irradian positividad y gracia." 
    },
  },
  "66": {
    en: { 
      name: "ALSA FOR MEN", 
      description: "ALSA for Men is a confident and modern fragrance with a fresh, spicy opening, a refined aromatic heart, and a warm, long-lasting finish. Bold yet elegant, it's designed for men who appreciate strength, style, and sophistication." 
    },
    pt: { 
      name: "ALSA PARA HOMENS", 
      description: "ALSA para Homens é uma fragrância confiante e moderna com uma abertura fresca e picante, um coração aromático refinado e um acabamento quente e duradouro. Ousado mas elegante, foi projetado para homens que apreciam força, estilo e sofisticação." 
    },
    hi: { 
      name: "ALSA फॉर मेन", 
      description: "ALSA फॉर मेन एक आत्मविश्वासी और आधुनिक सुगंध है जिसमें ताज़ी, मसालेदार शुरुआत, परिष्कृत सुगंधित हृदय, और गर्म, लंबे समय तक चलने वाला फिनिश है। बोल्ड लेकिन सुरुचिपूर्ण, यह उन पुरुषों के लिए डिज़ाइन किया गया है जो ताकत, शैली और परिष्कार की सराहना करते हैं।" 
    },
    ar: { 
      name: "ALSA للرجال", 
      description: "ALSA للرجال هو عطر واثق وعصري بافتتاح منعش وحار، وقلب عطري رفيع، وإنهاء دافئ ودائم. جريء وأنيق، صُمم للرجال الذين يقدرون القوة والأناقة والتطور." 
    },
    ur: { 
      name: "ALSA FOR MEN", 
      description: "ALSA FOR MEN ایک پراعتماد اور جدید خوشبو ہے جس میں تازہ، مصالحے دار شروع، بہتر خوشبو والا دل، اور گرم، دیرپا اختتام ہے۔ بہادر لیکن شائستہ، یہ ان مردوں کے لیے بنایا گیا ہے جو طاقت، انداز، اور نفاست کی تعریف کرتے ہیں۔" 
    },
    fr: { 
      name: "ALSA POUR HOMMES", 
      description: "ALSA pour Hommes est un parfum confiant et moderne avec une ouverture fraîche et épicée, un cœur aromatique raffiné et une finition chaude et durable. Audacieux mais élégant, il est conçu pour les hommes qui apprécient la force, le style et la sophistication." 
    },
    es: { 
      name: "ALSA PARA HOMBRES", 
      description: "ALSA para Hombres es una fragancia segura y moderna con una apertura fresca y especiada, un corazón aromático refinado y un final cálido y duradero. Audaz pero elegante, está diseñado para hombres que aprecian la fuerza, el estilo y la sofisticación." 
    },
  },
  "67": {
    en: { 
      name: "ALSA MIDNIGHT", 
      description: "ALSA Midnight is a fresh yet intense fragrance that captures energy and elegance. Bright and aromatic at the start, it evolves into a smooth, balanced heart with a warm, confident finish. Modern and versatile, it's ideal for evenings and moments that call for a lasting impression." 
    },
    pt: { 
      name: "ALSA MEIA-NOITE", 
      description: "ALSA Meia-Noite é uma fragrância fresca mas intensa que captura energia e elegância. Brilhante e aromático no início, evolui para um coração suave e equilibrado com um acabamento quente e confiante. Moderno e versátil, é ideal para noites e momentos que exigem uma impressão duradoura." 
    },
    hi: { 
      name: "ALSA मिडनाइट", 
      description: "ALSA मिडनाइट एक ताज़ी लेकिन तीव्र सुगंध है जो ऊर्जा और सुरुचि को पकड़ती है। शुरुआत में चमकदार और सुगंधित, यह गर्म, आत्मविश्वासपूर्ण फिनिश के साथ एक चिकना, संतुलित हृदय में विकसित होता है। आधुनिक और बहुमुखी, यह शाम और उन क्षणों के लिए आदर्श है जो स्थायी प्रभाव की मांग करते हैं।" 
    },
    ar: { 
      name: "ALSA منتصف الليل", 
      description: "ALSA منتصف الليل هو عطر منعش ولكنه مكثف يلتقط الطاقة والأناقة. مشرق وعطري في البداية، يتطور إلى قلب ناعم ومتوازن مع إنهاء دافئ وواثق. عصري ومتعدد الاستخدامات، مثالي للمساء واللحظات التي تتطلب انطباعًا دائمًا." 
    },
    ur: { 
      name: "ALSA مڈنائٹ", 
      description: "ALSA مڈنائٹ ایک تازہ لیکن شدید خوشبو ہے جو توانائی اور نفاست کو پکڑتی ہے۔ شروع میں روشن اور خوشبودار، یہ گرم، پراعتماد اختتام کے ساتھ ہموار، متوازن دل میں تیار ہوتا ہے۔ جدید اور کثیر جہتی، یہ شام اور ایسے لمحات کے لیے مثالی ہے جو دیرپا تاثر کی ضرورت ہوتی ہے۔" 
    },
    fr: { 
      name: "ALSA MINUIT", 
      description: "ALSA Minuit est un parfum frais mais intense qui capture l'énergie et l'élégance. Lumineux et aromatique au départ, il évolue vers un cœur doux et équilibré avec une finition chaude et confiante. Moderne et polyvalent, il est idéal pour les soirées et les moments qui demandent une impression durable." 
    },
    es: { 
      name: "ALSA MEDIANOCHE", 
      description: "ALSA Medianoche es una fragancia fresca pero intensa que captura energía y elegancia. Brillante y aromática al inicio, evoluciona hacia un corazón suave y equilibrado con un final cálido y seguro. Moderna y versátil, es ideal para las noches y los momentos que requieren una impresión duradera." 
    },
  },
  "69": {
    en: { 
      name: "ALSA VELMIR", 
      description: "ALSA Velmir is a refined and luxurious fragrance with a smooth, modern character. It opens with a clean, elegant impression, unfolding into a rich and balanced heart before settling into a deep, sensual finish. Sophisticated and long-lasting, it is designed for those who appreciate understated power and timeless style." 
    },
    pt: { 
      name: "ALSA VELMIR", 
      description: "ALSA Velmir é uma fragrância refinada e luxuosa com um caráter suave e moderno. Abre com uma impressão limpa e elegante, desdobrando-se em um coração rico e equilibrado antes de se estabelecer em um acabamento profundo e sensual. Sofisticado e duradouro, foi projetado para aqueles que apreciam poder discreto e estilo atemporal." 
    },
    hi: { 
      name: "ALSA VELMIR", 
      description: "ALSA Velmir एक परिष्कृत और शानदार सुगंध है जिसमें एक चिकनी, आधुनिक चरित्र है। यह एक साफ, सुरुचिपूर्ण प्रभाव के साथ खुलता है, एक गहरे, कामुक फिनिश में बसने से पहले एक समृद्ध और संतुलित हृदय में खुलता है। परिष्कृत और लंबे समय तक चलने वाला, यह उन लोगों के लिए डिज़ाइन किया गया है जो संयमित शक्ति और कालातीत शैली की सराहना करते हैं।" 
    },
    ar: { 
      name: "ALSA VELMIR", 
      description: "ALSA Velmir هو عطر راقي وفاخر بطابع ناعم وعصري. يفتح بانطباع نظيف وأنيق، ويتكشف إلى قلب غني ومتوازن قبل أن يستقر في إنهاء عميق وحسي. متطور ودائم، صُمم لمن يقدرون القوة المتواضعة والأناقة الخالدة." 
    },
    ur: { 
      name: "ALSA VELMIR", 
      description: "ALSA VELMIR ایک بہتر اور شاندار خوشبو ہے جس کا ہموار، جدید کردار ہے۔ یہ صاف، شائستہ تاثر کے ساتھ کھلتا ہے، ایک گہرے، حسی اختتام میں بسنے سے پہلے ایک امیر اور متوازن دل میں کھلتا ہے۔ پیچیدہ اور دیرپا، یہ ان لوگوں کے لیے بنایا گیا ہے جو کم قوت اور لازوال انداز کی تعریف کرتے ہیں۔" 
    },
    fr: { 
      name: "ALSA VELMIR", 
      description: "ALSA Velmir est un parfum raffiné et luxueux avec un caractère doux et moderne. Il s'ouvre avec une impression propre et élégante, se déploie en un cœur riche et équilibré avant de s'installer dans une finition profonde et sensuelle. Sophistiqué et durable, il est conçu pour ceux qui apprécient le pouvoir discret et le style intemporel." 
    },
    es: { 
      name: "ALSA VELMIR", 
      description: "ALSA Velmir es una fragancia refinada y lujosa con un carácter suave y moderno. Se abre con una impresión limpia y elegante, desarrollándose en un corazón rico y equilibrado antes de establecerse en un final profundo y sensual. Sofisticado y duradero, está diseñado para quienes aprecian el poder discreto y el estilo atemporal." 
    },
  },
  "70": {
    en: { 
      name: "ALSA GOOD MORNING", 
      description: "ALSA Good Morning is a warm and inviting fragrance with a smooth, elegant character. It opens with a rich, vibrant impression, softening into a balanced aromatic heart and finishing with a deep, comforting trail. Refined yet distinctive, it's perfect for those who enjoy a confident and welcoming scent." 
    },
    pt: { 
      name: "ALSA BOM DIA", 
      description: "ALSA Bom Dia é uma fragrância quente e acolhedora com um caráter suave e elegante. Abre com uma impressão rica e vibrante, suavizando em um coração aromático equilibrado e terminando com um rastro profundo e reconfortante. Refinado mas distintivo, é perfeito para aqueles que apreciam um aroma confiante e acolhedor." 
    },
    hi: { 
      name: "ALSA गुड मॉर्निंग", 
      description: "ALSA गुड मॉर्निंग एक गर्म और आमंत्रित करने वाली सुगंध है जिसमें एक चिकनी, सुरुचिपूर्ण चरित्र है। यह एक समृद्ध, जीवंत प्रभाव के साथ खुलता है, एक संतुलित सुगंधित हृदय में नरम हो जाता है और एक गहरी, आरामदायक ट्रेल के साथ समाप्त होता है। परिष्कृत लेकिन विशिष्ट, यह उन लोगों के लिए एकदम सही है जो एक आत्मविश्वासपूर्ण और स्वागत योग्य सुगंध का आनंद लेते हैं।" 
    },
    ar: { 
      name: "ALSA صباح الخير", 
      description: "ALSA صباح الخير هو عطر دافئ وجذاب بطابع ناعم وأنيق. يفتح بانطباع غني ونابض بالحياة، ثم يلين إلى قلب عطري متوازن وينتهي بأثر عميق ومريح. راقي لكن مميز، مثالي لمن يستمتعون برائحة واثقة ومرحبة." 
    },
    ur: { 
      name: "ALSA گڈ مارننگ", 
      description: "ALSA گڈ مارننگ ایک گرم اور دعوت دینے والی خوشبو ہے جس کا ہموار، شائستہ کردار ہے۔ یہ امیر، متحرک تاثر کے ساتھ کھلتا ہے، متوازن خوشبودار دل میں نرم ہوتا ہے اور گہرا، آرام دہ ٹریل کے ساتھ ختم ہوتا ہے۔ بہتر لیکن مخصوص، یہ ان لوگوں کے لیے بہترین ہے جو پراعتماد اور خوش آمدید خوشبو سے لطف اندوز ہوتے ہیں۔" 
    },
    fr: { 
      name: "ALSA BONJOUR", 
      description: "ALSA Bonjour est une fragrance chaude et invitante avec un caractère doux et élégant. Elle s'ouvre avec une impression riche et vibrante, s'adoucit en un cœur aromatique équilibré et se termine par une traînée profonde et réconfortante. Raffinée mais distinctive, elle est parfaite pour ceux qui apprécient un parfum confiant et accueillant." 
    },
    es: { 
      name: "ALSA BUENOS DÍAS", 
      description: "ALSA Buenos Días es una fragancia cálida e invitante con un carácter suave y elegante. Se abre con una impresión rica y vibrante, suavizándose en un corazón aromático equilibrado y finalizando con un rastro profundo y reconfortante. Refinada pero distintiva, es perfecta para aquellos que disfrutan de un aroma seguro y acogedor." 
    },
  },
}

/**
 * Get translated product name and description
 * Falls back to original if translation not available
 */
export function getTranslatedProduct(
  productId: string | number,
  originalName: string,
  originalDescription: string,
  language: "en" | "pt" | "hi" | "ar" | "ur" | "fr" | "es"
): { name: string; description: string } {
  const id = String(productId)
  const translations = productTranslations[id]
  
  if (!translations || !translations[language]) {
    return {
      name: originalName,
      description: originalDescription,
    }
  }
  
  const langTranslations = translations[language]
  return {
    name: langTranslations?.name || originalName,
    description: langTranslations?.description || originalDescription,
  }
}
