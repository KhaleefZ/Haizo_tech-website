'use client';

import { useState, useEffect } from 'react';
import { 
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/useAppStore';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { BlogEditorModal, BlogItem } from './BlogEditorModal';

const columnHelper = createColumnHelper<BlogItem>();

export function BlogsTable() {
  const { role } = useAppStore();
  const isDev = role === 'DEV';
  const [data, setData] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Failed to fetch blogs', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        fetchBlogs();
      } else {
        alert('Failed to delete blog');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    columnHelper.accessor('title', {
      header: 'Blog Title',
      cell: info => <span className="font-medium">{info.getValue()}</span>,
    }),
    columnHelper.accessor('published', {
      header: 'Status',
      cell: info => {
        const isPublished = info.getValue();
        return (
          <Badge variant="outline" className={isPublished ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10' : 'border-muted/30 text-muted-foreground bg-muted/10'}>
            {isPublished ? 'Published' : 'Draft'}
          </Badge>
        );
      },
    }),
    columnHelper.accessor('createdAt', {
      header: 'Date Created',
      cell: info => info.getValue() ? new Date(info.getValue() as string).toLocaleDateString() : 'N/A',
    }),
    columnHelper.display({
      id: 'actions',
      cell: (info) => (
        <div className="flex items-center gap-2 justify-end">
          <BlogEditorModal 
            blog={info.row.original} 
            onSuccess={fetchBlogs}
            trigger={
              <Button variant="ghost" size="icon" disabled={isDev} className="h-8 w-8 hover:bg-white/10 text-muted-foreground hover:text-white" title="Edit Blog">
                <Edit2 className="h-4 w-4" />
              </Button>
            }
          />
          <Button 
            variant="ghost" 
            size="icon" 
            disabled={isDev} 
            onClick={() => handleDelete(info.row.original.id)}
            className="h-8 w-8 hover:bg-destructive/20 text-muted-foreground hover:text-destructive" 
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <AnimatedSection className="glass-card flex flex-col w-full overflow-hidden">
      <div className="p-4 border-b border-white/5 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Content Management</h2>
        <BlogEditorModal onSuccess={fetchBlogs} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-white/5 text-muted-foreground">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-6 py-4 font-medium">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">Loading blogs...</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No blogs found. Create one to get started.</td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AnimatedSection>
  );
}
