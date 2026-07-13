'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { useAppStore } from '@/store/useAppStore';

interface ColumnEditorModalProps {
  projectId: string;
  column?: { id: string; name: string; order: number };
  onSuccess: () => void;
  trigger?: React.ReactElement;
}

export function ColumnEditorModal({ projectId, column, onSuccess, trigger }: ColumnEditorModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(column?.name || '');
  const [loading, setLoading] = useState(false);
  const { role } = useAppStore();
  
  const isDev = role === 'DEV';
  const isEditing = !!column;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setLoading(true);
    try {
      const url = isEditing 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/projects/columns/${column.id}` 
        : `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}/columns`;
      const method = isEditing ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name })
      });
      
      if (!res.ok) throw new Error('Failed to save column');
      
      setOpen(false);
      onSuccess();
    } catch (error) {
      console.error(error);
      alert('Failed to save column');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!column || !confirm('Are you sure you want to delete this column? All tasks inside will be orphaned!')) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/columns/${column.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!res.ok) throw new Error('Failed to delete column');
      setOpen(false);
      onSuccess();
    } catch (error) {
      console.error(error);
      alert('Failed to delete column');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        trigger ? (
          trigger
        ) : (
          <Button variant="outline" className="h-10 border-white/10 bg-white/5 text-white whitespace-nowrap min-w-[200px] flex items-center justify-center gap-2">
            <Plus className="h-4 w-4" /> Add Column
          </Button>
        )
      } />
      <DialogContent className="glass-panel border-white/10 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Column' : 'Add Column'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium">Name</label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              className="col-span-3 bg-white/5 border-white/10"
              placeholder="e.g. In Progress"
              disabled={isDev || loading}
            />
          </div>
          
          <DialogFooter className="mt-4 flex items-center justify-between w-full">
            {isEditing && !isDev && (
              <Button type="button" variant="ghost" className="text-destructive hover:bg-destructive/10 mr-auto" onClick={handleDelete} disabled={loading}>
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </Button>
            )}
            <div className="flex gap-2">
              <Button type="submit" disabled={isDev || loading || !name.trim()}>
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
