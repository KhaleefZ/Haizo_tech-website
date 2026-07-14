import { MetadataRoute } from 'next';

// Define the base URL
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://haizotech.com';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static Routes
  const staticRoutes = [
    '',
    '/about',
    '/services',
    '/work',
    '/blog',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  try {
    // Fetch dynamic works
    const worksRes = await fetch(`${API_URL}/api/works`, { next: { revalidate: 3600 } });
    let workRoutes: MetadataRoute.Sitemap = [];
    if (worksRes.ok) {
      const works = await worksRes.json();
      workRoutes = works.map((work: any) => ({
        url: `${baseUrl}/work/${work.id}`,
        lastModified: new Date(work.updatedAt || work.createdAt).toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }

    // Fetch dynamic blogs
    const blogsRes = await fetch(`${API_URL}/api/blogs`, { next: { revalidate: 3600 } });
    let blogRoutes: MetadataRoute.Sitemap = [];
    if (blogsRes.ok) {
      const blogs = await blogsRes.json();
      blogRoutes = blogs.map((blog: any) => ({
        url: `${baseUrl}/blog/${blog.id}`, // using id as slug since that's what the current routing uses
        lastModified: new Date(blog.updatedAt || blog.createdAt).toISOString(),
        changeFrequency: 'daily' as const,
        priority: 0.7,
      }));
    }

    return [...staticRoutes, ...workRoutes, ...blogRoutes];
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Sitemap generation failed — API unreachable at ${API_URL}`);
    }
    console.error('Error generating sitemap:', error);
    return staticRoutes;
  }
}
