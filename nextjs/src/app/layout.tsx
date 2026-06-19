import type { Metadata } from "next";
import { Montserrat, Outfit } from "next/font/google";
import "./globals.css";
import { ANNEKE_PHONE, BUSINESS_HOURS, MAIN_PHONE } from "@/lib/contact";

const montserrat = Montserrat({
    variable: "--font-montserrat",
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800", "900"],
    display: "swap",
});

const outfit = Outfit({
    variable: "--font-outfit",
    subsets: ["latin"],
    weight: ["300", "400", "500", "700"],
    display: "swap",
});

// Only the live production domain should be indexed.
// VERCEL_ENV is set automatically: 'production' | 'preview' | 'development'
// When undefined (local dev) we also default to noindex.
const isProduction = process.env.VERCEL_ENV === "production";

export const metadata: Metadata = {
    title: {
        template: "%s | Lava-SA",
        default:
            "LAVA Vacuum Sealers South Africa | Premium German Food Preservation Since 2007 | Lava-SA",
    },
    description:
        "South Africa's leading German vacuum sealer brand. Preserve game meat, fish, biltong and food with Lava's hospital-grade vacuum technology. Trusted by hunters, anglers, butchers and home cooks.",
    metadataBase: new URL("https://lava-sa.com"),
    keywords: [
        "vacuum sealer South Africa",
        "vacuum sealer for hunters",
        "game meat vacuum sealer",
        "biltong vacuum sealer",
        "Lava vacuum sealer",
        "sous vide South Africa",
        "food preservation South Africa",
    ],
    openGraph: {
        siteName: "Lava-SA",
        locale: "en_ZA",
        type: "website",
        title: "Lava-SA — German Vacuum Sealers Since 2007",
        description:
            "South Africa's leading German vacuum sealer brand. Preserve game meat, fish, biltong and food with hospital-grade vacuum technology.",
        images: [
            {
                url: "/images/headers/lava-sa-vacuum-sealers-V300-header-pick-1250.jpg",
                width: 1250,
                height: 830,
                alt: "Lava-SA — German Vacuum Sealers",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Lava-SA — German Vacuum Sealers Since 2007",
        description: "South Africa's leading German vacuum sealer brand. Trusted by 350,000+ customers worldwide.",
        images: ["/images/headers/lava-sa-vacuum-sealers-V300-header-pick-1250.jpg"],
    },
    alternates: {
        canonical: "/",
    },
    robots: isProduction
        ? {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        }
        : {
            index: false,
            follow: false,
            googleBot: { index: false, follow: false },
        },
};

// Place ID + GBP URL are filled in once the Google Business Profile is verified.
// Set NEXT_PUBLIC_GBP_URL in Vercel env to add it to `sameAs` / `hasMap` without a code change.
const GBP_URL = process.env.NEXT_PUBLIC_GBP_URL?.trim() || "";

const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Store"],
    "name": "Lava South Africa",
    "alternateName": ["Lava-SA", "La.va South Africa", "Lava Vide SA"],
    "legalName": "Lava Vide SA (Pty) Ltd",
    "url": "https://www.lava-sa.com",
    "logo": "https://www.lava-sa.com/images/logo/lava-sa-logo.png",
    "image": "https://www.lava-sa.com/images/headers/lava-sa-vacuum-sealers-V300-header-pick-1250.jpg",
    "description":
        "Lava South Africa is the official local distributor of German-engineered la.va vacuum sealers since 2007. Chamber & external machines, bags, rolls, containers, sous-vide and spare parts for home cooks, hunters, butchers and food industry.",
    "telephone": [MAIN_PHONE.tel, ANNEKE_PHONE.tel],
    "email": "info@lava-sa.com",
    "priceRange": "R2,500–R70,000",
    "currenciesAccepted": "ZAR",
    "paymentAccepted": "Credit Card, EFT, Bank Transfer",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "5 Stirling Road",
        "addressLocality": "Bryanston",
        "postalCode": "2191",
        "addressRegion": "Gauteng",
        "addressCountry": "ZA",
    },
    "geo": {
        "@type": "GeoCoordinates",
        "latitude": -26.069000,
        "longitude": 28.006942,
    },
    "areaServed": [
        { "@type": "Country", "name": "South Africa" },
        { "@type": "AdministrativeArea", "name": "Gauteng" },
    ],
    "openingHoursSpecification": [
        {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": BUSINESS_HOURS.opens,
            "closes": BUSINESS_HOURS.closes,
        },
    ],
    "foundingDate": "2007",
    "parentOrganization": {
        "@type": "Organization",
        "name": "Lava Vacuum Packaging GmbH",
        "url": "https://la-va.com",
    },
    ...(GBP_URL ? { "hasMap": GBP_URL } : {}),
    "sameAs": [
        "https://www.facebook.com/lavavidesa",
        "https://www.instagram.com/lava_vide_sa",
        "https://la-va.com",
        ...(GBP_URL ? [GBP_URL] : []),
    ],
};

import SiteChrome from "@/components/layout/SiteChrome";
import { CartProvider } from "@/lib/cart-context";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en-ZA" className={`${montserrat.variable} ${outfit.variable}`}>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
                />
            </head>
            <body
                suppressHydrationWarning
                className="antialiased bg-white text-copy font-[family-name:var(--font-outfit)] leading-[1.65]"
            >
                <CartProvider>
                    <SiteChrome>
                        {children}
                    </SiteChrome>
                </CartProvider>
            </body>
        </html>
    );
}
