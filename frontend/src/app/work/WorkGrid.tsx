"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import GlassCard from "@/components/ui/GlassCard";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type Work = {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrls: string[];
  published: boolean;
};

type Category = { id: string; name: string; order: number };

export default function WorkGrid({
  projects,
  categories,
}: {
  projects: Work[];
  categories: Category[];
}) {
  const [activeCategory, setActiveCategory] = useState("All");

  const defaultImage =
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop";

  const getImageUrl = (url: string | undefined | null) => {
    if (!url) return defaultImage;
    if (url.includes('/uploads/')) {
      return url.substring(url.indexOf('/uploads/'));
    }
    return url;
  };

  const tabs = ["All", ...categories.sort((a, b) => a.order - b.order).map((c) => c.name)];

  const filtered =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <div className="container mx-auto px-6 py-12 md:py-20">
      <AnimatedSection className="text-center mb-12 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Our Work</h1>
        <p className="text-xl text-gray-400">
          Selected projects delivered by the HaizoTech engineering team.
        </p>
      </AnimatedSection>

      {tabs.length > 1 && (
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveCategory(tab)}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition-all ${
                activeCategory === tab
                  ? "bg-blue-600 border-blue-500 text-white"
                  : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/30"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-gray-400 text-lg">
            We&apos;re preparing our case studies. In the meantime,{" "}
            <Link href="/contact" className="text-blue-400 hover:underline">
              tell us about your project
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((project, idx) => (
            <AnimatedSection key={project.id} delay={idx * 0.05} className="h-full">
              <Link href={`/work/${project.id}`} className="group block h-full">
                <GlassCard className="h-full p-0 overflow-hidden border-white/10 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-2">
                  <div className="flex flex-col h-full">
                    <div className="h-52 relative border-b border-white/10 overflow-hidden">
                      <Image
                        src={getImageUrl(project.imageUrls?.[0])}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500" />
                    </div>
                    <div className="p-8 flex flex-col flex-grow bg-black/40 backdrop-blur-md">
                      <span className="text-blue-400 text-sm font-semibold mb-3">
                        {project.category}
                      </span>
                      <h2 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                        {project.title}
                      </h2>
                      <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                        {project.description}
                      </p>
                      <span className="flex items-center gap-1 text-xs text-gray-500 mt-auto pt-4 border-t border-white/5 group-hover:text-blue-400 transition-colors">
                        View Case Study
                        <ArrowUpRight
                          size={14}
                          className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                        />
                      </span>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      )}
    </div>
  );
}