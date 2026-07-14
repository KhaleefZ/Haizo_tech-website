import { Suspense } from "react";
import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | HaizoTech",
  description:
    "Get in touch with the HaizoTech engineering team in Coimbatore. Custom software, web and mobile apps, AI systems, and network solutions.",
  openGraph: {
    title: "Contact Us | HaizoTech",
    description:
      "Get in touch with the HaizoTech engineering team. Custom software, web and mobile apps, AI systems, and network solutions.",
  },
  alternates: {
    canonical: "https://haizotech.com/contact",
  },
};

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-6 py-24 text-center text-gray-400">
          Loading…
        </div>
      }
    >
      <ContactForm />
    </Suspense>
  );
}