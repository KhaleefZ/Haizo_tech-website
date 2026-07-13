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

export interface TeamMemberItem {
  id: string;
  name: string;
  email: string;
  role: string;
  bio?: string;
}

interface TeamEditorModalProps {
  member?: TeamMemberItem;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function TeamEditorModal({ member, trigger, onSuccess }: TeamEditorModalProps) {
  const [open, setOpen] = useState(false);
  const { role: userRole } = useAppStore();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: member?.name || '',
    email: member?.email || '',
    role: member?.role || 'DEV',
    bio: member?.bio || '',
    password: '',
  });

  const isDev = userRole === 'DEV';
  const isEditing = !!member;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const url = isEditing ? `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${member.id}` : `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/invite`;
      const method = isEditing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to save team member');
      
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      alert('Error saving team member');
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
            <Plus className="h-4 w-4" /> Add Member
          </Button>
        )
      } />
      <DialogContent className="glass-panel border-white/10 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Team Member' : 'New Team Member'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Modify details.' : 'Add a new member to your team.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium">Name</label>
            <Input value={formData.name} onChange={(e) => setFormData(p => ({...p, name: e.target.value}))} className="col-span-3 bg-white/5 border-white/10" disabled={isDev || loading} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium">Email</label>
            <Input type="email" value={formData.email} onChange={(e) => setFormData(p => ({...p, email: e.target.value}))} className="col-span-3 bg-white/5 border-white/10" disabled={isEditing || isDev || loading} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium">Role</label>
            <select 
              value={formData.role} 
              onChange={(e) => setFormData(p => ({...p, role: e.target.value}))} 
              className="col-span-3 flex h-10 w-full items-center justify-between rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50" 
              disabled={isDev || loading}
            >
              <option value="SUPER_ADMIN" className="bg-background text-foreground">Super Admin</option>
              <option value="MANAGER" className="bg-background text-foreground">Manager</option>
              <option value="DEV" className="bg-background text-foreground">Dev</option>
            </select>
          </div>
          {!isEditing && (
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium">Password</label>
              <Input type="password" placeholder="Leave empty to send invite link" value={formData.password} onChange={(e) => setFormData(p => ({...p, password: e.target.value}))} className="col-span-3 bg-white/5 border-white/10" disabled={isDev || loading} />
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium">Bio</label>
            <Input value={formData.bio} onChange={(e) => setFormData(p => ({...p, bio: e.target.value}))} className="col-span-3 bg-white/5 border-white/10" disabled={isDev || loading} />
          </div>
        </div>
        <DialogFooter>
          {isDev && <p className="text-xs text-destructive mr-auto flex items-center">Devs cannot modify team.</p>}
          <Button type="button" disabled={isDev || loading} onClick={handleSubmit}>
            {loading ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
