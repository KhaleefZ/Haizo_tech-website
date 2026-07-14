import AnimatedSection from "@/components/ui/AnimatedSection";
import GlassCard from "@/components/ui/GlassCard";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight } from "lucide-react";

type Blog = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  imageUrl: string | null;
  published: boolean;
  createdAt: string;
};

async function getBlogs(): Promise<Blog[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs`, {
      next: { revalidate: 600, tags: ['blogs'] },
    });
    if (!res.ok) throw new Error('Failed to fetch');
    const allBlogs: Blog[] = await res.json();
    return allBlogs.filter(b => b.published);
  } catch (err) {
    console.error(err);
    return [];
  }
}

export default async function BlogPage() {
  const blogPosts = await getBlogs();
  
  if (blogPosts.length === 0) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <h1 className="text-4xl font-extrabold mb-6">Insights & Engineering</h1>
        <p className="text-gray-400">No published blogs found.</p>
      </div>
    );
  }

  const featuredPost = blogPosts[0];
  const regularPosts = blogPosts.slice(1);

  // Fallback image if null
  const defaultImage = "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2940&auto=format&fit=crop";

  const getImageUrl = (url: string | null) => {
    if (!url) return defaultImage;
    if (url.startsWith('http')) return url;
    return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <AnimatedSection className="text-center mb-16 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Insights & Engineering</h1>
        <p className="text-xl text-gray-400">
          Thoughts, methodologies, and technical deep-dives from the HaizoTech engineering team.
        </p>
      </AnimatedSection>

      {/* Featured Post */}
      <AnimatedSection className="mb-16">
        <Link href={`/blog/${featuredPost.id}`} className="group block">
          <GlassCard className="p-0 overflow-hidden border border-white/10 hover:border-blue-500/50 transition-colors duration-500">
            <div className="grid md:grid-cols-2 gap-0 h-full w-full">
              <div 
                className="h-[300px] md:h-full md:min-h-[350px] relative flex items-center justify-center border-r border-white/10 bg-black transition-transform duration-700 group-hover:scale-105 overflow-hidden"
              >
                 <Image 
                   src={getImageUrl(featuredPost.imageUrl)} 
                   alt={featuredPost.title} 
                   fill
                   priority
                   sizes="(max-width: 768px) 100vw, 50vw"
                   className="absolute inset-0 w-full h-full object-cover" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/20" />
                 <div className="absolute inset-0 bg-blue-900/20 mix-blend-overlay" />
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center relative bg-black/40 backdrop-blur-md">
              <span className="text-blue-400 font-semibold mb-4">{featuredPost.tags[0] || 'Tech'}</span>
              <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">{featuredPost.title}</h2>
              <p className="text-gray-400 mb-8 line-clamp-3">{featuredPost.content}</p>
              
              <div className="flex items-center gap-6 text-sm text-gray-500 mt-auto">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{new Date(featuredPost.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>5 min read</span>
                </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </Link>
      </AnimatedSection>

      {/* Standard Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {regularPosts.map((post, idx) => (
          <AnimatedSection key={post.id} delay={idx * 0.1} className="h-full">
            <Link href={`/blog/${post.id}`} className="group block h-full">
              <GlassCard className="h-full p-0 overflow-hidden border-white/10 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-2">
                <div className="flex flex-col h-full w-full">
                  <div 
                    className="h-48 relative border-b border-white/10 overflow-hidden"
                  >
                    <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                      <Image 
                        src={getImageUrl(post.imageUrl)} 
                        alt={post.title} 
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500" />
                  </div>
                  <div className="p-8 flex flex-col flex-grow bg-black/40 backdrop-blur-md">
                    <span className="text-blue-400 text-sm font-semibold mb-3">{post.tags[0] || 'Tech'}</span>
                    <h2 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">{post.title}</h2>
                    <p className="text-gray-400 text-sm mb-6 line-clamp-2">{post.content}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-4 border-t border-white/5">
                      <span className="flex items-center gap-2"><Calendar size={14} /> {new Date(post.createdAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1 group-hover:text-blue-400 transition-colors">
                        Read Article <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </Link>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
}
