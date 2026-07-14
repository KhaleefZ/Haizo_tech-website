import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Works | HaizoTech",
  description: "Browse our portfolio of successful projects and case studies showcasing our expertise in delivering custom software solutions.",
  openGraph: {
    title: "Our Works | HaizoTech",
    description: "Browse our portfolio of successful projects and case studies showcasing our expertise in delivering custom software solutions.",
  },
  alternates: {
    canonical: "https://haizotech.com/work",
  },
};

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
