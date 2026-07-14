import WorkGrid from "./WorkGrid";

async function getJSON(path: string, tag: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
      next: { revalidate: 600, tags: [tag] },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error(`Failed to fetch ${path}`, err);
    return [];
  }
}

export default async function WorkPage() {
  const [works, categories] = await Promise.all([
    getJSON("/api/works", "works"),
    getJSON("/api/work-categories", "works"),
  ]);

  return (
    <WorkGrid
      projects={works.filter((w: { published: boolean }) => w.published)}
      categories={categories}
    />
  );
}