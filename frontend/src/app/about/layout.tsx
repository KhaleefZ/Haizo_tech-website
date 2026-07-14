import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | HaizoTech",
  description: "Learn more about HaizoTech, our mission, vision, and the expert team driving digital transformation for businesses worldwide.",
  openGraph: {
    title: "About Us | HaizoTech",
    description: "Learn more about HaizoTech, our mission, vision, and the expert team driving digital transformation.",
  },
  alternates: {
    canonical: "https://haizotech.com/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
