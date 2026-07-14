import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import BackgroundOrbs from "@/components/ui/BackgroundOrbs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://haizotech.com"),
  title: "HaizoTech | Intelligent Service Solutions",
  description: "HaizoTech is a premier technology agency specializing in custom web and mobile applications, scalable cloud infrastructure, artificial intelligence, and enterprise-grade software solutions.",
  keywords: ["Software Development", "AI Solutions", "Web Applications", "Mobile Apps", "IT Networks", "HaizoTech", "Tech Agency"],
  openGraph: {
    title: "HaizoTech | Intelligent Service Solutions",
    description: "HaizoTech is a premier technology agency accelerating digital growth with custom software and AI.",
    url: "https://haizotech.com",
    siteName: "HaizoTech",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "HaizoTech Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HaizoTech | Intelligent Service Solutions",
    description: "HaizoTech is a premier technology agency accelerating digital growth with custom software and AI.",
    images: ["/logo.jpg"],
  },
  alternates: {
    canonical: "https://haizotech.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://haizotech.com/#organization",
        "name": "HaizoTech",
        "url": "https://haizotech.com",
        "logo": "https://haizotech.com/logo.jpg",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91 8807341655",
          "contactType": "customer service",
          "areaServed": "IN",
          "availableLanguage": ["en", "Tamil"]
        },
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "3A, Udyam Nagar, Podanur",
          "addressLocality": "Coimbatore",
          "addressRegion": "Tamil Nadu",
          "postalCode": "641023",
          "addressCountry": "IN"
        },
        "sameAs": [
          "https://www.linkedin.com/company/haizotech",
          "https://www.instagram.com/haizotech"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://haizotech.com/#website",
        "url": "https://haizotech.com",
        "name": "HaizoTech",
        "publisher": {
          "@id": "https://haizotech.com/#organization"
        }
      }
    ]
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative text-white bg-black">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <BackgroundOrbs />
        <Navbar />
        <main className="flex-grow pt-24">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
