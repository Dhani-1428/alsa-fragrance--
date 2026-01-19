"use client"

import Script from 'next/script'

export function StructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.alsafragrance.com'
  
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AlsaFragrance",
    "alternateName": "Alsa Fragrance",
    "url": baseUrl,
    "description": "Discover premium perfumes, attars, and fragrances for men and women. Experience luxury scents that define elegance.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/shop?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AlsaFragrance",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/alsa-logo.png`
      }
    }
  }

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AlsaFragrance",
    "alternateName": "Alsa Fragrance",
    "url": baseUrl,
    "logo": `${baseUrl}/alsa-logo.png`,
    "description": "Luxury perfumes, attars, and fragrances crafted with royal sophistication since 2018",
    "foundingDate": "2018",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+351-920062535",
      "contactType": "Customer Service",
      "email": "fragrancealsa@gmail.com",
      "areaServed": "Worldwide",
      "availableLanguage": ["English", "Portuguese", "Hindi", "Arabic", "Urdu", "French", "Spanish"]
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Avenida doutor Miguel bombarda Loja n'47",
      "addressLocality": "Queluz",
      "postalCode": "2745-172",
      "addressCountry": "PT"
    },
    "sameAs": [
      baseUrl
    ]
  }

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "AlsaFragrance",
    "image": `${baseUrl}/luxury-alsa-fragrance-branded-perfume-bottles-eleg.jpg`,
    "description": "Premium perfumes, attars, and fragrances store. Luxury scents for men and women.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Avenida doutor Miguel bombarda Loja n'47",
      "addressLocality": "Queluz",
      "addressRegion": "Lisbon",
      "postalCode": "2745-172",
      "addressCountry": "PT"
    },
    "telephone": "+351-920062535",
    "email": "fragrancealsa@gmail.com",
    "url": baseUrl,
    "priceRange": "€",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ]
    },
    "paymentAccepted": "Visa, Mastercard, MBWay, IBAN",
    "currenciesAccepted": "EUR",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "500",
      "bestRating": "5",
      "worstRating": "1"
    }
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      }
    ]
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What types of perfumes does AlsaFragrance offer?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "AlsaFragrance offers premium perfumes for men and women, traditional attars, testers, limited edition fragrances, and new arrivals. We specialize in luxury scents crafted with royal sophistication."
        }
      },
      {
        "@type": "Question",
        "name": "Where is AlsaFragrance located?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "AlsaFragrance is located at Avenida doutor Miguel bombarda Loja n'47, Queluz, 2745-172, Portugal. We also ship worldwide."
        }
      },
      {
        "@type": "Question",
        "name": "What payment methods does AlsaFragrance accept?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We accept Visa, Mastercard, MBWay, and IBAN transfers. All transactions are secure and protected."
        }
      },
      {
        "@type": "Question",
        "name": "Does AlsaFragrance ship internationally?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, AlsaFragrance ships worldwide. We deliver premium perfumes and fragrances to customers globally with secure packaging."
        }
      }
    ]
  }

  return (
    <>
      <Script
        id="website-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Script
        id="organization-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="local-business-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}
