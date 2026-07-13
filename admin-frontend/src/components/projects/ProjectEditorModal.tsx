'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAppStore } from '@/store/useAppStore';

export interface ProjectItem {
  id: string;
  name: string;
  description?: string;
  clientId?: string;
  client?: { id: string; organization: string };
  createdAt: string;
}

interface ProjectEditorModalProps {
  project?: ProjectItem;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function ProjectEditorModal({ project, trigger, onSuccess }: ProjectEditorModalProps) {
  const [open, setOpen] = useState(false);
  const { role } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<{id: string, organization: string}[]>([]);

  const [formData, setFormData] = useState({
    name: project?.name || '',
    description: project?.description || '',
    clientId: project?.clientId || '',
  });

  const isDev = role === 'DEV';
  const isEditing = !!project;

  useEffect(() => {
    if (open) {
      fetch('http://localhost:5001/api/clients', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      .then(res => res.ok ? res.json() : [])
      .then(data => setClients(data))
      .catch(console.error);
    }
  }, [open]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const url = isEditing ? `http://localhost:5001/api/projects/${project.id}` : 'http://localhost:5001/api/projects';
      const method = isEditing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          clientId: formData.clientId || undefined
        })
      });

      if (!res.ok) throw new Error('Failed to save project');
      
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      alert('Error saving project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        trigger ? (
          trigger as React.ReactElement
        ) : (
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Create Project
          </Button>
        )
      } />
      <DialogContent className="glass-panel border-white/10 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Project' : 'New Project'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Modify project details.' : 'Create a new project and initialize a kanban board.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium">Name</label>
            <Input value={formData.name} onChange={(e) => setFormData(p => ({...p, name: e.target.value}))} className="col-span-3 bg-white/5 border-white/10" disabled={isDev || loading} />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <label className="text-right text-sm font-medium pt-2">Description</label>
            <Textarea value={formData.description} onChange={(e) => setFormData(p => ({...p, description: e.target.value}))} className="col-span-3 bg-white/5 border-white/10 min-h-[80px]" disabled={isDev || loading} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium">Client</label>
            <select 
              value={formData.clientId} 
              onChange={(e) => setFormData(p => ({...p, clientId: e.target.value}))} 
              className="col-span-3 bg-black/50 border border-white/10 rounded-md p-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isDev || loading}
            >
              <option value="">No Client (Internal)</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.organization}</option>
              ))}
            </select>
          </div>
        </div>
        <DialogFooter>
          {isDev && <p className="text-xs text-destructive mr-auto flex items-center">Devs cannot modify projects.</p>}
          <Button type="button" disabled={isDev || loading} onClick={handleSubmit}>
            {loading ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
