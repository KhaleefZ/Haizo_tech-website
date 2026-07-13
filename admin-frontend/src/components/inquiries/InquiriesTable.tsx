'use client';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/useAppStore';
import { Mail, MailOpen, CheckCircle2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  submissionDate: string;
  status: 'NEW' | 'READ' | 'REPLIED';
}

const columnHelper = createColumnHelper<Inquiry>();

export function InquiriesTable() {
  const { role } = useAppStore();
  const isDev = role === 'DEV';
  
  const [data, setData] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/inquiries', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Failed to fetch inquiries', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:5001/api/inquiries/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchInquiries();
        toast.success(`Inquiry status updated to ${newStatus}`);
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      console.error(error);
      toast.error('Network error while updating status');
    }
  };

  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: info => <div className="font-medium">{info.getValue()}</div>,
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: info => <div className="text-muted-foreground">{info.getValue()}</div>,
    }),
    columnHelper.accessor('phone', {
      header: 'Phone',
      cell: info => <div className="text-muted-foreground">{info.getValue() || '-'}</div>,
    }),
    columnHelper.accessor('service', {
      header: 'Service',
      cell: info => <div className="font-medium text-white max-w-[150px] truncate">{info.getValue() || '-'}</div>,
    }),
    columnHelper.accessor('message', {
      header: 'Message Snippet',
      cell: info => <div className="text-sm text-muted-foreground line-clamp-1 max-w-[300px]">{info.getValue()}</div>,
    }),
    columnHelper.accessor('submissionDate', {
      header: 'Date',
      cell: info => <div className="text-muted-foreground">{new Date(info.getValue()).toLocaleDateString()}</div>,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => {
        const val = info.getValue();
        return (
          <Badge variant="outline" className={
            val === 'NEW' ? 'border-primary/30 text-primary bg-primary/10' :
            val === 'READ' ? 'border-amber-500/30 text-amber-500 bg-amber-500/10' :
            'border-emerald-500/30 text-emerald-500 bg-emerald-500/10'
          }>
            {val}
          </Badge>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      cell: (info) => (
        <div className="flex items-center gap-2 justify-end">
          <Button 
            variant="ghost" 
            size="icon" 
            disabled={isDev || info.row.original.status === 'NEW'} 
            onClick={() => handleUpdateStatus(info.row.original.id, 'NEW')}
            className="h-8 w-8 hover:bg-white/10 text-muted-foreground hover:text-amber-400" 
            title="Mark as Unread"
          >
            <MailOpen className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            disabled={isDev || info.row.original.status === 'REPLIED'} 
            onClick={() => handleUpdateStatus(info.row.original.id, 'REPLIED')}
            className="h-8 w-8 hover:bg-white/10 text-muted-foreground hover:text-white" 
            title="Mark as Replied"
          >
            <CheckCircle2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handleUpdateStatus(info.row.original.id, 'READ')}
            disabled={info.row.original.status !== 'NEW'}
            className="h-8 w-8 hover:bg-white/10 text-muted-foreground hover:text-primary" 
            title="Mark as Read"
          >
            <Mail className="h-4 w-4" />
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
