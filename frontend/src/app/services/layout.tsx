import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Services | HaizoTech",
  description: "Explore our comprehensive suite of technology services including web development, mobile apps, AI integration, and scalable cloud infrastructure.",
  openGraph: {
    title: "Our Services | HaizoTech",
    description: "Explore our comprehensive suite of technology services including web development, mobile apps, AI integration, and scalable cloud infrastructure.",
  },
  alternates: {
    canonical: "https://haizotech.com/services",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
