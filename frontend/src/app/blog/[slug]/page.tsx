import AnimatedSection from "@/components/ui/AnimatedSection";
import GlassCard from "@/components/ui/GlassCard";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, User, CheckCircle2 } from "lucide-react";

type Blog = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  imageUrl: string | null;
  published: boolean;
  createdAt: string;
};

async function getBlog(id: string): Promise<Blog | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${id}`, {
      next: { revalidate: 600, tags: ['blogs'] },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlog(slug);

  if (!post) {
    return { title: "Blog Post Not Found | HaizoTech" };
  }

  const defaultImage = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop";
  const getImageUrl = (url: string | null) => {
    if (!url) return defaultImage;
    if (url.startsWith('http')) return url;
    return url;
  };

  return {
    title: `${post.title} | HaizoTech Blog`,
    description: post.content.slice(0, 160) + '...',
    alternates: {
      canonical: `https://haizotech.com/blog/${slug}`,
    },
    openGraph: {
      title: `${post.title} | HaizoTech`,
      description: post.content.slice(0, 160) + '...',
      type: "article",
      publishedTime: post.createdAt,
      images: [{ url: getImageUrl(post.imageUrl) }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.content.slice(0, 160) + '...',
      images: [getImageUrl(post.imageUrl)],
    }
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlog(slug);

  if (!post) {
    return (
      <div className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
        <Link href="/blog" className="text-blue-500 hover:underline">Return to Blogs</Link>
      </div>
    );
  }

  const defaultImage = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop";
  const coverImage = post.imageUrl ? (post.imageUrl.startsWith('http') ? post.imageUrl : post.imageUrl) : defaultImage;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://haizotech.com/blog/${slug}`
    },
    "headline": post.title,
    "image": [coverImage],
    "datePublished": post.createdAt,
    "dateModified": post.createdAt,
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
    if (!url) return "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2940&auto=format&fit=crop";
    if (url.startsWith('http')) return url;
    return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
  };
  const category = post.tags && post.tags.length > 0 ? post.tags[0] : "Technology Insight";
  const dateStr = new Date(post.createdAt).toLocaleDateString();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-6 py-12 md:py-20 relative">
      <AnimatedSection className="mb-8 max-w-4xl mx-auto">
        <Link href="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
          <ArrowLeft size={18} className="transform group-hover:-translate-x-1 transition-transform" /> Back to Blog
        </Link>
      </AnimatedSection>

      <article className="max-w-4xl mx-auto">
        <AnimatedSection delay={0.1}>
          <div className="mb-10">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium border border-blue-500/20 mb-6 inline-block shadow-[0_0_10px_rgba(59,130,246,0.2)]">
              {category}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-6 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm mt-8 border-t border-white/5 pt-6">
              <div className="flex items-center gap-2">
                <User size={16} />
                <span className="font-medium text-gray-300">HaizoTech Engineering</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{dateStr}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>5 min read</span>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <GlassCard className="w-full aspect-[21/9] mb-12 flex items-center justify-center p-0 border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden rounded-3xl group relative">
            <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-105">
              <img src={coverImage} alt={post.title} className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/40 to-transparent mix-blend-multiply" />
          </GlassCard>
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <div className="prose prose-invert prose-lg max-w-none prose-blue">
            <div className="text-lg whitespace-pre-wrap">
              {post.content}
            </div>
            
            <div className="p-10 rounded-3xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-white/10 mt-20 hover:border-blue-500/30 transition-colors shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
              <h3 className="text-3xl font-bold text-white mb-4 relative z-10">Want to build this with us?</h3>
              <p className="text-gray-400 mb-8 text-lg relative z-10">Our engineering team is ready to tackle your most complex technical challenges.</p>
              <Link href="/contact" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-medium transition-all shadow-lg inline-flex items-center gap-2 group/btn relative z-10">
                Start a conversation <ArrowLeft className="rotate-180 transform group-hover/btn:translate-x-1 transition-transform" size={18} />
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </article>
    </div>
    </>
  );
}

