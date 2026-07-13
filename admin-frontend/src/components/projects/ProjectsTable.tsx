'use client';

import { useState, useEffect } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAppStore } from '@/store/useAppStore';
import { Edit2, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ProjectEditorModal, ProjectItem } from './ProjectEditorModal';

const columnHelper = createColumnHelper<ProjectItem>();

export function ProjectsTable() {
  const { role } = useAppStore();
  const isAdmin = role === 'SUPER_ADMIN' || role === 'MANAGER';
  const [data, setData] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/projects', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) setData(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await fetch(`http://localhost:5001/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) fetchProjects();
    } catch (e) {
      console.error(e);
    }
  };

  const columns = [
    columnHelper.accessor('name', {
      header: 'Project Name',
      cell: info => <span className="font-medium">{info.getValue()}</span>,
    }),
    columnHelper.accessor('client', {
      header: 'Client',
      cell: info => <span className="text-sm">{info.getValue()?.organization || 'Internal'}</span>,
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created Date',
      cell: info => <span className="text-muted-foreground">{new Date(info.getValue()).toLocaleDateString()}</span>,
    }),
    columnHelper.display({
      id: 'actions',
      cell: (info) => (
        <div className="flex items-center gap-2 justify-end">
          <Link href={`/projects/${info.row.original.id}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 text-muted-foreground hover:text-white" title="View Details">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
          <ProjectEditorModal 
            project={info.row.original} 
            onSuccess={fetchProjects}
            trigger={
              <Button variant="ghost" size="icon" disabled={!isAdmin} className="h-8 w-8 hover:bg-white/10 text-muted-foreground hover:text-white" title="Edit Project">
                <Edit2 className="h-4 w-4" />
              </Button>
            } 
          />
          <Button variant="ghost" size="icon" disabled={!isAdmin} onClick={() => handleDelete(info.row.original.id)} className="h-8 w-8 hover:bg-destructive/20 text-muted-foreground hover:text-destructive" title="Delete">
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

  if (loading) return <div className="text-muted-foreground">Loading projects...</div>;
  if (data.length === 0) return <div className="text-muted-foreground">No projects found.</div>;

  return (
    <div className="glass-card overflow-hidden">
      <Table>
        <TableHeader className="bg-white/5">
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id} className="border-border/50 hover:bg-transparent">
              {headerGroup.headers.map(header => (
                <TableHead key={header.id} className="text-muted-foreground">
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
          {table.getRowModel().rows.map(row => (
            <TableRow key={row.id} className="border-border/50 hover:bg-white/5 transition-colors">
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
