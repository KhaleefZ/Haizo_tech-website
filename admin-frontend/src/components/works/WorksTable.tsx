'use client';

import { useState, useEffect } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/useAppStore';
import { Edit2, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WorkEditorModal, WorkItem } from './WorkEditorModal';
import { fetchWithAuth } from '@/lib/api';

const columnHelper = createColumnHelper<WorkItem>();

export function WorksTable() {
  const { role } = useAppStore();
  const isDev = role === 'DEV';
  const [data, setData] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorks = async () => {
    try {
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/works`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Failed to fetch works', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  const handleDelete = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/works/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchWorks();
      } else {
        alert('Failed to delete work');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    columnHelper.accessor('title', {
      header: 'Title',
      cell: info => <span className="font-medium text-white">{info.getValue()}</span>,
    }),
    columnHelper.accessor('category', {
      header: 'Category',
      cell: info => (
        <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10">
          {info.getValue()}
        </Badge>
      ),
    }),
    columnHelper.accessor('description', {
      header: 'Description',
      cell: info => <span className="text-sm text-muted-foreground line-clamp-1 max-w-xs">{info.getValue()}</span>,
    }),
    columnHelper.accessor('imageUrls', {
      header: 'Image Preview',
      cell: info => {
        const urls = info.getValue() as string[];
        const bgImage = urls && urls.length > 0 ? urls[0] : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2940&auto=format&fit=crop';
        return (
          <div 
            className="h-10 w-16 bg-cover bg-center rounded-md border border-white/10" 
            style={{ backgroundImage: `url(${bgImage})` }} 
          />
        );
      }
    }),
    columnHelper.display({
      id: 'actions',
      cell: (info) => (
        <div className="flex items-center gap-2 justify-end">
          <WorkEditorModal 
            work={info.row.original} 
            onSuccess={fetchWorks}
            trigger={
              <Button variant="ghost" size="icon" disabled={isDev} className="h-8 w-8 hover:bg-white/10 text-muted-foreground hover:text-white">
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
    <div className="glass-card overflow-hidden">
      <Table>
        <TableHeader className="bg-white/5">
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id} className="border-border/50 hover:bg-transparent">
              {headerGroup.headers.map(header => (
                <TableHead key={header.id} className="text-muted-foreground whitespace-nowrap">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10">
                <Loader2 className="animate-spin mx-auto text-muted-foreground" size={24} />
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                No works found.
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map(row => (
              <TableRow key={row.id} className="border-border/50 hover:bg-white/5 transition-colors">
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
