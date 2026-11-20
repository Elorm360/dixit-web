import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { contact, siteConfig } from "@/config/site";
import "./globals.css";

const inter = Inter({ variable: "--font-sans", subsets: ["latin"], display: "swap" });
const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url),
  title: { default: "DIXIT | A Modern Fashion House", template: "%s | DIXIT" },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    siteName: "DIXIT",
    locale: "en_GH",
    images: [{ url: "/brand/dixit-hero.jpg", alt: "DIXIT editorial look" }],
  },
  twitter: { card: "summary_large_image" },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  name: "DIXIT",
  description: siteConfig.description,
  url: process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url,
  image: `${process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url}/brand/dixit-hero.jpg`,
  address: { "@type": "PostalAddress", addressLocality: "Accra", addressCountry: "GH" },
  ...(contact.phone && { telephone: contact.phone }),
  ...(contact.email && { email: contact.email }),
  ...(contact.instagram && { sameAs: [`https://instagram.com/${contact.instagram}`] }),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cormorant.variable}`}>
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </div>
        <WhatsAppButton />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
