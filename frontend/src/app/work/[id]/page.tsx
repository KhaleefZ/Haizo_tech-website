import AnimatedSection from "@/components/ui/AnimatedSection";
import GlassCard from "@/components/ui/GlassCard";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ExternalLink, MessageSquare, Briefcase } from "lucide-react";

type WorkItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrls: string[];
  liveUrl?: string | null;
  published: boolean;
  createdAt: string;
};

async function getWork(id: string): Promise<WorkItem | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/works/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const project = await getWork(id);

  if (!project) {
    return { title: "Project Not Found | HaizoTech" };
  }

  const defaultImage = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop";
  const getImageUrl = (url: string | null) => {
    if (!url) return defaultImage;
    if (url.startsWith('http')) return url;
    return url;
  };
  
  const coverImage = project.imageUrls && project.imageUrls.length > 0 ? getImageUrl(project.imageUrls[0]) : defaultImage;

  return {
    title: `${project.title} - ${project.category} | HaizoTech Portfolio`,
    description: project.description.slice(0, 160) + '...',
    alternates: {
      canonical: `https://haizotech.com/work/${id}`,
    },
    openGraph: {
      title: `${project.title} | HaizoTech`,
      description: project.description.slice(0, 160) + '...',
      type: "article",
      images: [{ url: coverImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description.slice(0, 160) + '...',
      images: [coverImage],
    }
  };
}

export default async function WorkDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getWork(id);

  if (!project) {
    return (
      <div className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
        <Link href="/work" className="text-blue-500 hover:underline">Return to Portfolio</Link>
      </div>
    );
  }

  const defaultImage = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop";
  const coverImage = project.imageUrls && project.imageUrls.length > 0 ? (project.imageUrls[0].startsWith('http') ? project.imageUrls[0] : project.imageUrls[0]) : defaultImage;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://haizotech.com/work/${id}`
    },
    "headline": project.title,
    "image": [coverImage],
    "datePublished": project.createdAt,
    "author": {
      "@type": "Organization",
      "name": "HaizoTech Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "HaizoTech",
      "logo": {
        "@type": "ImageObject",
        "url": "https://haizotech.com/logo.jpg"
      }
    }
  };

  const getImageUrl = (url: string | null) => {
    if (!url) return defaultImage;
    if (url.startsWith('http')) return url;
    return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
  };

  // Map category to contact query param
  const getServiceParam = (cat: string) => {
    const lower = cat.toLowerCase();
    if (lower.includes("software")) return "custom-software";
    if (lower.includes("web") || lower.includes("mobile") || lower.includes("app")) return "web-mobile";
    if (lower.includes("ai") || lower.includes("neural") || lower.includes("intelligent")) return "ai-systems";
    if (lower.includes("network") || lower.includes("infra")) return "network-solutions";
    return "";
  };

  const serviceParam = getServiceParam(project.category);
  const contactLink = serviceParam ? `/contact?service=${serviceParam}` : "/contact";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-6 py-12 md:py-20">
      <AnimatedSection className="mb-8 max-w-5xl mx-auto">
        <Link href="/work" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
          <ArrowLeft size={18} className="transform group-hover:-translate-x-1 transition-transform" /> Back to Portfolio
        </Link>
      </AnimatedSection>

      <article className="max-w-5xl mx-auto">
        {/* Header Section */}
        <AnimatedSection delay={0.1}>
          <div className="mb-10">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium border border-blue-500/20 mb-6 inline-block shadow-[0_0_10px_rgba(59,130,246,0.2)]">
              {project.category}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
              {project.title}
            </h1>
          </div>
        </AnimatedSection>

        {/* Gallery / Images Grid */}
        <AnimatedSection delay={0.2} className="mb-12">
          {project.imageUrls && project.imageUrls.length > 1 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {/* Main Featured Image */}
              <div className="md:col-span-2 relative aspect-[16/10] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <Image 
                  src={getImageUrl(project.imageUrls[0])} 
                  alt={`${project.title} - Featured`}
                  fill
                  sizes="(max-width: 768px) 100vw, 66vw"
                  className="object-cover"
                  priority
                />
              </div>
              {/* Secondary Images List */}
              <div className="grid grid-rows-2 gap-6">
                {project.imageUrls.slice(1, 3).map((url, idx) => (
                  <div key={idx} className="relative aspect-[16/10] md:aspect-auto rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                    <Image 
                      src={getImageUrl(url)} 
                      alt={`${project.title} - Detail ${idx + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                ))}
                {/* Placeholder if only 2 images are present */}
                {project.imageUrls.length === 2 && (
                  <div className="bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center p-6 text-gray-500">
                    <Briefcase size={28} className="opacity-30" />
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Single Image Layout */
            <div className="relative w-full aspect-[21/9] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <Image 
                src={getImageUrl(project.imageUrls?.[0] || null)} 
                alt={project.title}
                fill
                unoptimized
                sizes="100vw"
                className="object-cover"
                priority
              />
            </div>
          )}
        </AnimatedSection>

        {/* Project Description & CTA Details */}
        <AnimatedSection delay={0.3} className="grid md:grid-cols-3 gap-12 items-start">
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-white">Project Overview</h2>
            <div className="text-gray-300 text-lg whitespace-pre-wrap leading-relaxed">
              {project.description}
            </div>
          </div>

          <div className="space-y-6">
            <GlassCard className="p-6 border-white/10 shadow-xl bg-black/40 backdrop-blur-md">
              <h3 className="text-lg font-bold text-white mb-4">Project Details</h3>
              <div className="space-y-4 text-sm text-gray-400">
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span>Category</span>
                  <span className="text-white font-medium">{project.category}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span>Delivered By</span>
                  <span className="text-white font-medium">HaizoTech</span>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                {project.liveUrl && (
                  <a 
                    href={project.liveUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all shadow-md flex items-center justify-center gap-2 group"
                  >
                    Launch Live Site 
                    <ExternalLink size={16} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                )}
                <Link 
                  href={contactLink}
                  className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare size={16} />
                  Discuss Similar Project
                </Link>
              </div>
            </GlassCard>
          </div>
        </AnimatedSection>
      </article>
      </div>
    </>
  );
}
