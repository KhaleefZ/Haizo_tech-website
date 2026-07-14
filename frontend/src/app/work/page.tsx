"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import GlassCard from "@/components/ui/GlassCard";
import { useState, useEffect } from "react";
import { ArrowUpRight, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// The categories are now fetched from the backend

type Work = {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrls: string[];
  published: boolean;
};

export default function WorkPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [projects, setProjects] = useState<Work[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string, order: number}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [worksRes, catsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/works`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/work-categories`)
        ]);
        
        if (worksRes.ok) {
          const data = await worksRes.json();
          setProjects(data.filter((p: Work) => p.published));
        }
        
        if (catsRes.ok) {
          const catsData = await catsRes.json();
          setCategories(catsData);
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  const defaultImage = "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2940&auto=format&fit=crop";

  const getImageUrl = (url: string | null) => {
    if (!url) return defaultImage;
    if (url.startsWith('http')) return url;
    return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <AnimatedSection className="text-center mb-16 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Our Work</h1>
        <p className="text-xl text-gray-400">
          Explore our portfolio of scalable platforms, AI solutions, and enterprise services we've delivered for industry leaders.
        </p>
      </AnimatedSection>

      {/* Filter Tabs */}
      <AnimatedSection>
        <div className="flex flex-wrap gap-4 mb-12 relative z-10 justify-center">
          <button
            onClick={() => setActiveCategory("All")}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
              activeCategory === "All"
                ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.name)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category.name
                  ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </AnimatedSection>

      {/* Portfolio Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-blue-500" size={48} />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          No portfolio works available at the moment.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, idx) => (
            <AnimatedSection key={project.id} delay={idx * 0.1}>
              <div className="relative group rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer shadow-xl">
                {/* Background Image */}
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                  <Image 
                    src={getImageUrl(project.imageUrls?.[0] || null)} 
                    alt={project.title} 
                    fill
                    priority={idx < 3}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="w-full h-full object-cover" 
                  />
                </div>
                
                {/* Permanent overlay for readability */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-500" />
                
                {/* Glassmorphic hover overlay */}
                <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <GlassCard className="p-6 backdrop-blur-md bg-black/40 border-white/20">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-blue-400 text-xs font-bold tracking-wider uppercase">{project.category}</span>
                      <Link href={`/work/${project.id}`} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-600 hover:scale-110 transition-all">
                        <ArrowUpRight size={16} className="text-white" />
                      </Link>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-gray-300 text-sm line-clamp-2">{project.description}</p>
                  </GlassCard>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      )}
    </div>
  );
}
