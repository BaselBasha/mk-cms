import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title:
    "MK Group - Leading Agricultural Development & Land Reclamation | المصرية الخليجية",
  description:
    "Al Masria Elkhaligia Group (MKGROUP) - 35+ years of expertise in agricultural development, desert land reclamation, and sustainable farming solutions in Egypt and the Middle East. Integrated agricultural projects, solar energy, irrigation systems, and jojoba cultivation.",
  keywords: [
    // English Keywords
    "agricultural development",
    "land reclamation",
    "desert agriculture",
    "sustainable farming",
    "Egypt agriculture",
    "Middle East farming",
    "agricultural projects",
    "well drilling",
    "solar energy agriculture",
    "irrigation systems",
    "project management",
    "sustainable production",
    "triple bottom line",
    "SDGs sustainable development",
    "agricultural consulting",
    "desert transformation",
    "productive lands",
    "agricultural investment",
    "farmers partnership",
    "agricultural expertise",
    "MK Group",
    "Al Masria Elkhaligia",
    "jojoba oil",
    "jojoba cultivation",
    "organic farming",
    "environmental projects",
    "agricultural research",
    "university cooperation",
    "agricultural innovation",
    "desert land development",
    "agricultural solutions",
    // Arabic Keywords
    "المصرية الخليجية",
    "استصلاح الأراضي",
    "التنمية الزراعية",
    "الزراعة الصحراوية",
    "الزراعة المستدامة",
    "مصر الزراعة",
    "الشرق الأوسط الزراعة",
    "المشروعات الزراعية",
    "حفر الآبار",
    "الطاقة الشمسية",
    "أنظمة الري",
    "إدارة المشاريع",
    "الإنتاج المستدام",
    "المشروعات البيئية",
    "أهداف التنمية المستدامة",
    "الاستشارات الزراعية",
    "تحويل الصحراء",
    "الأراضي المنتجة",
    "الاستثمار الزراعي",
    "شراكة المزارعين",
    "الخبرة الزراعية",
    "زيت الجوجوبا",
    "زراعة الجوجوبا",
    "الزراعة العضوية",
    "البحوث الزراعية",
    "التعاون الجامعي",
    "الابتكار الزراعي",
    "تطوير الأراضي الصحراوية",
    "الحلول الزراعية",
    "مجموعة إم كي",
    "الشركة المساهمة",
    "المشروعات الشاملة",
    "الخبراء الزراعيين",
    "المراكز البحثية",
    "المستقبل الزراعي",
    "الاستدامة البيئية",
    "الأبعاد الثلاثية",
    "البعد الاجتماعي",
    "البعد الاقتصادي",
    "البعد البيئي",
  ],
  authors: [{ name: "MK Group" }],
  creator: "MK Group",
  publisher: "MK Group",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://mkgroup-eg.com"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
      "ar-EG": "/",
    },
  },
  openGraph: {
    title:
      "MK Group - Leading Agricultural Development & Land Reclamation | المصرية الخليجية",
    description:
      "Al Masria Elkhaligia Group (MKGROUP) - 35+ years of expertise in agricultural development, desert land reclamation, and sustainable farming solutions in Egypt and the Middle East.",
    url: "https://mkgroup-eg.com",
    siteName: "MK Group - المصرية الخليجية",
    images: [
      {
        url: "/MK-GROUP.png",
        width: 1200,
        height: 630,
        alt: "MK Group - Agricultural Development & Land Reclamation",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MK Group - Leading Agricultural Development & Land Reclamation",
    description:
      "35+ years of expertise in agricultural development, desert land reclamation, and sustainable farming solutions in Egypt and the Middle East.",
    images: ["/MK-GROUP.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Replace with your actual Google verification code
    // yandex: "your-yandex-verification-code", // Optional - only if targeting Russian markets
    // yahoo: "your-yahoo-verification-code", // Optional - low priority
  },
};

export default function RootLayout({ children }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://mkgroup-eg.com/#organization",
        name: "MK Group",
        alternateName: "المصرية الخليجية",
        url: "https://mkgroup-eg.com",
        logo: {
          "@type": "ImageObject",
          url: "https://mkgroup-eg.com/MK-GROUP.png",
          width: 300,
          height: 100,
        },
        description:
          "Leading agricultural development and land reclamation company with 35+ years of expertise in Egypt and the Middle East",
        foundingDate: "1989",
        address: {
          "@type": "PostalAddress",
          addressCountry: "EG",
          addressRegion: "Egypt",
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+20-106-772-6594",
          contactType: "customer service",
          email: "info@mkgroup-eg.com",
        },
        sameAs: ["https://wa.me/201067726594"],
      },
      {
        "@type": "WebSite",
        "@id": "https://mkgroup-eg.com/#website",
        url: "https://mkgroup-eg.com",
        name: "MK Group - Agricultural Development & Land Reclamation",
        description:
          "Leading agricultural development, desert land reclamation, and sustainable farming solutions with 35+ years of expertise",
        publisher: {
          "@id": "https://mkgroup-eg.com/#organization",
        },
        inLanguage: ["en-US", "ar-EG"],
      },
      {
        "@type": "Product",
        name: "Jojoba Oil",
        description:
          "Premium cold-pressed jojoba oil for cosmetics and skincare",
        brand: {
          "@id": "https://mkgroup-eg.com/#organization",
        },
        category: "Natural Oils",
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          priceCurrency: "USD",
        },
      },
      {
        "@type": "Service",
        name: "Agricultural Development & Land Reclamation",
        description:
          "Comprehensive agricultural development services including site selection, well drilling, solar energy systems, irrigation systems, and project management",
        provider: {
          "@id": "https://mkgroup-eg.com/#organization",
        },
        areaServed: [
          {
            "@type": "Country",
            name: "Egypt",
          },
          {
            "@type": "Place",
            name: "Middle East",
          },
        ],
        serviceType: "Agricultural Development",
        category: "Agriculture",
      },
      {
        "@type": "Service",
        name: "Well Drilling & Water Management",
        description:
          "Professional well drilling and water management solutions for agricultural projects",
        provider: {
          "@id": "https://mkgroup-eg.com/#organization",
        },
        serviceType: "Water Management",
        category: "Infrastructure",
      },
      {
        "@type": "Service",
        name: "Solar Energy for Agriculture",
        description:
          "Solar energy systems and renewable energy solutions for agricultural operations",
        provider: {
          "@id": "https://mkgroup-eg.com/#organization",
        },
        serviceType: "Renewable Energy",
        category: "Energy",
      },
      {
        "@type": "Service",
        name: "Irrigation Systems",
        description:
          "Advanced irrigation systems and water distribution solutions for sustainable farming",
        provider: {
          "@id": "https://mkgroup-eg.com/#organization",
        },
        serviceType: "Irrigation",
        category: "Agriculture",
      },
    ],
  };

  return (
    <html lang="en" dir="ltr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <link rel="canonical" href="https://mkgroup-eg.com" />
        <link rel="alternate" hrefLang="en" href="https://mkgroup-eg.com" />
        <link rel="alternate" hrefLang="ar" href="https://mkgroup-eg.com" />
        <link
          rel="alternate"
          hrefLang="x-default"
          href="https://mkgroup-eg.com"
        />
        <meta name="geo.region" content="EG" />
        <meta name="geo.placename" content="Egypt" />
        <meta name="geo.position" content="26.8206;30.8025" />
        <meta name="ICBM" content="26.8206, 30.8025" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
