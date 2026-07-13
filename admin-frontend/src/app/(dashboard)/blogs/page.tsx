import { BlogsTable } from '@/components/blogs/BlogsTable';

export default function BlogsPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Blogs</h1>
        <p className="text-muted-foreground max-w-2xl">
          Manage blog posts for the public website. Publish, edit, and categorize your content.
        </p>
      </div>

      <BlogsTable />
    </div>
  );
}
