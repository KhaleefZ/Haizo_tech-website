import WorkGrid from "./WorkGrid";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5001";
const IS_REMOTE_API = API_URL.startsWith("https://");

type Work = {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrls: string[];
  published: boolean;
};

type Category = { id: string; name: string; order: number };

async function getJSON<T>(path: string, tag: string): Promise<T[]> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate: 600, tags: [tag] },
    });
    if (!res.ok) throw new Error(`${path} returned ${res.status}`);
    return await res.json();
  } catch (err) {
    // In CI the API is remote — a failure here means we'd ship an empty
    // portfolio. Fail the build loudly instead of silently shipping nothing.
    if (IS_REMOTE_API) {
      throw new Error(`Build failed — API unreachable: ${API_URL}${path}`);
    }
    console.error(`Failed to fetch ${path}`, err);
    return [];
  }
}

export default async function WorkPage() {
  const [works, categories] = await Promise.all([
    getJSON<Work>("/api/works", "works"),
    getJSON<Category>("/api/work-categories", "works"),
  ]);

  return (
    <WorkGrid
      projects={works.filter((w) => w.published)}
      categories={categories}
    />
  );
}