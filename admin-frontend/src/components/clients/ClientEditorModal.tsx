'use client';

import { useState } from 'react';
import { Plus, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

export interface ClientItem {
  id: string;
  organization: string;
  contactName: string;
  email: string;
  createdAt: string;
}

interface ClientEditorModalProps {
  client?: ClientItem;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function ClientEditorModal({ client, trigger, onSuccess }: ClientEditorModalProps) {
  const [open, setOpen] = useState(false);
  const { role } = useAppStore();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    organization: client?.organization || '',
    contactName: client?.contactName || '',
    email: client?.email || '',
  });

  const isDev = role === 'DEV';
  const isEditing = !!client;

  const handleSubmit = async () => {
    if (!formData.organization.trim() || !formData.contactName.trim()) {
      alert('Organization and Contact Name are required.');
      return;
    }

    setLoading(true);
    try {
      const url = isEditing ? `http://localhost:5001/api/clients/${client.id}` : 'http://localhost:5001/api/clients';
      const method = isEditing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to save client');
      }
      
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Error saving client');
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
            <Plus className="h-4 w-4" /> Add Client
          </Button>
        )
      } />
      <DialogContent className="glass-panel border-white/10 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Client' : 'New Client'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Modify client details.' : 'Add a new client to the directory.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="org" className="text-right text-sm font-medium">Organization</label>
            <Input id="org" value={formData.organization} onChange={(e) => setFormData(p => ({...p, organization: e.target.value}))} className="col-span-3 bg-white/5 border-white/10" disabled={isDev || loading} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="contact" className="text-right text-sm font-medium">Contact Name</label>
            <Input id="contact" value={formData.contactName} onChange={(e) => setFormData(p => ({...p, contactName: e.target.value}))} className="col-span-3 bg-white/5 border-white/10" disabled={isDev || loading} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="email" className="text-right text-sm font-medium">Email</label>
            <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData(p => ({...p, email: e.target.value}))} className="col-span-3 bg-white/5 border-white/10" disabled={isDev || loading} />
          </div>
        </div>
        <DialogFooter>
          {isDev && <p className="text-xs text-destructive mr-auto flex items-center">Devs cannot modify clients.</p>}
          <Button type="button" disabled={isDev || loading} onClick={handleSubmit}>
            {loading ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
