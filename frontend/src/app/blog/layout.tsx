import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog & Insights | HaizoTech",
  description: "Read the latest insights, trends, and tutorials on software development, AI, and digital business strategies from the HaizoTech team.",
  openGraph: {
    title: "Blog & Insights | HaizoTech",
    description: "Read the latest insights, trends, and tutorials on software development, AI, and digital business strategies from the HaizoTech team.",
  },
  alternates: {
    canonical: "https://haizotech.com/blog",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
