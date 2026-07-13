'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/store/useAppStore';
import { Plus, User as UserIcon } from 'lucide-react';
import { fetchWithAuth } from '@/lib/api';
import { useEffect } from 'react';

export function TaskEditorModal({ 
  columnId, 
  onSuccess,
  trigger,
  initialDueDate,
  defaultOpen = false,
  onOpenChange,
  task
}: { 
  columnId: string;
  onSuccess: () => void;
  trigger?: React.ReactNode;
  initialDueDate?: Date;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  task?: any; // Existing task for editing
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [loading, setLoading] = useState(false);
  const { role } = useAppStore();
  const isAdmin = role === 'SUPER_ADMIN' || role === 'MANAGER';

  const [team, setTeam] = useState<{id: string, name: string}[]>([]);

  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    tags: task?.tags ? task.tags.join(', ') : '',
    assigneeId: task?.assigneeId || '',
    priority: task?.priority || 'Low',
    dueDate: task?.dueDate ? task.dueDate.split('T')[0] : (initialDueDate ? initialDueDate.toISOString().split('T')[0] : '')
  });

  useEffect(() => {
    if (open) {
      fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/team`)
        .then(async res => {
          if (!res.ok) throw new Error('Failed to fetch team');
          return res.json();
        })
        .then(data => setTeam(data))
        .catch(console.error);
    }
  }, [open]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const isEditing = !!task;
      const endpoint = isEditing ? `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${task.id}` : `${process.env.NEXT_PUBLIC_API_URL}/api/tasks`;
      const res = await fetchWithAuth(endpoint, {
        method: isEditing ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          columnId,
          priority: formData.priority,
          assigneeId: formData.assigneeId || null,
          dueDate: formData.dueDate || null,
          tags: formData.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
        })
      });

      if (res.ok) {
        setOpen(false);
        if (onOpenChange) onOpenChange(false);
        if (!task) {
          setFormData({ title: '', description: '', tags: '', assigneeId: '', priority: 'Low', dueDate: initialDueDate ? initialDueDate.toISOString().split('T')[0] : '' });
        }
        onSuccess();
      } else {
        alert('Failed to save task');
      }
    } catch (error) {
      console.error(error);
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (onOpenChange) onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={trigger ? (trigger as React.ReactElement) : (
          <Button variant="ghost" size="sm" className="w-full mt-2 gap-2 text-muted-foreground hover:text-white bg-white/5 hover:bg-white/10">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        )}
      />
      <DialogContent className="glass-panel border-white/10 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-medium">Task Title</label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Design Homepage"
              className="bg-white/5 border-white/10"
              disabled={loading || !isAdmin}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Detailed description..."
              className="bg-white/5 border-white/10 p-2 rounded-md min-h-[80px] text-sm resize-none focus:ring-1 focus:ring-primary outline-none"
              disabled={loading || !isAdmin}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="assignee" className="text-sm font-medium">Assignee</label>
            <select
              id="assignee"
              value={formData.assigneeId}
              onChange={(e) => setFormData(prev => ({ ...prev, assigneeId: e.target.value }))}
              className="bg-white/5 border border-white/10 p-2 rounded-md text-sm outline-none focus:border-primary h-10 w-full"
              disabled={loading || !isAdmin}
            >
              <option value="" className="bg-black text-white/50">Unassigned</option>
              {team.map(member => (
                <option key={member.id} value={member.id} className="bg-black text-white">
                  {member.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <label htmlFor="tags" className="text-sm font-medium">Tags (comma separated)</label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="e.g. High, UI/UX"
              className="bg-white/5 border-white/10"
              disabled={loading || !isAdmin}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground">Priority</label>
            <select 
              className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.priority}
              onChange={e => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="Low" className="bg-background">Low</option>
              <option value="Medium" className="bg-background">Medium</option>
              <option value="High" className="bg-background">High</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} className="bg-white/5 border-white/10">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !formData.title || !isAdmin}>
            {loading ? 'Saving...' : 'Save Task'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
