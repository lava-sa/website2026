import type { Metadata } from "next";
import { Montserrat, Outfit } from "next/font/google";
import "./globals.css";

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
    metadataBase: new URL("https://www.lava-sa.co.za"),
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

const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Store"],
    "name": "Lava South Africa",
    "alternateName": "Lava-SA",
    "url": "https://www.lava-sa.co.za",
    "description":
        "South Africa's authorised distributor of German-engineered Lava vacuum sealers. Operating since 2007. Trusted by hunters, anglers, butchers, biltong makers and home cooks across South Africa.",
    "telephone": "+27721605556",
    "email": "info@lava-sa.co.za",
    "priceRange": "R2,500–R70,000",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "5 Stirling Road",
        "addressLocality": "Bryanston",
        "postalCode": "2191",
        "addressRegion": "Gauteng",
        "addressCountry": "ZA",
    },
    "foundingDate": "2007",
    "sameAs": [
        "https://www.facebook.com/lavasouthafrica",
        "https://www.instagram.com/lavasouthafrica",
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
