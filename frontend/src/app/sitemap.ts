import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://haizotech.com';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001';

// In CI/production the API is https://api.haizotech.com.
// Locally it's http://127.0.0.1:5001. Only fail the build in the former.
const IS_REMOTE_API = API_URL.startsWith('https://');

type ApiItem = {
  id: string;
  createdAt: string;
  updatedAt?: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
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
    const worksRes = await fetch(`${API_URL}/api/works`, {
      next: { revalidate: 3600 },
    });
    let workRoutes: MetadataRoute.Sitemap = [];
    if (worksRes.ok) {
      const works: ApiItem[] = await worksRes.json();
      workRoutes = works.map((work) => ({
        url: `${baseUrl}/work/${work.id}`,
        lastModified: new Date(work.updatedAt || work.createdAt).toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }

    const blogsRes = await fetch(`${API_URL}/api/blogs`, {
      next: { revalidate: 3600 },
    });
    let blogRoutes: MetadataRoute.Sitemap = [];
    if (blogsRes.ok) {
      const blogs: ApiItem[] = await blogsRes.json();
      blogRoutes = blogs.map((blog) => ({
        url: `${baseUrl}/blog/${blog.id}`,
        lastModified: new Date(blog.updatedAt || blog.createdAt).toISOString(),
        changeFrequency: 'daily' as const,
        priority: 0.7,
      }));
    }

    return [...staticRoutes, ...workRoutes, ...blogRoutes];
  } catch (error) {
    if (IS_REMOTE_API) {
      throw new Error(`Sitemap generation failed — API unreachable at ${API_URL}`);
    }
    console.error('Error generating sitemap:', error);
    return staticRoutes;
  }
}