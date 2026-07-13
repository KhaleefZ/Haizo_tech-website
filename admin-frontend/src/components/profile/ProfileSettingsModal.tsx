'use client';

import { useState, useEffect } from 'react';
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
} from '@/components/ui/dialog';

interface ProfileSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileSettingsModal({ open, onOpenChange }: ProfileSettingsModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    avatarUrl: '',
    currentPassword: '',
    newPassword: '',
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (open) {
      fetch('http://localhost:5001/api/admin/users/profile', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      .then(res => res.json())
      .then(data => {
        setFormData(prev => ({
          ...prev,
          name: data.name || '',
          email: data.email || '',
          bio: data.bio || '',
          avatarUrl: data.avatarUrl || '',
        }));
      })
      .catch(console.error);
    }
  }, [open]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Update basic profile
      await fetch('http://localhost:5001/api/admin/users/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name: formData.name, bio: formData.bio, avatarUrl: formData.avatarUrl })
      });

      // Update password if provided
      if (formData.currentPassword && formData.newPassword) {
        const passRes = await fetch('http://localhost:5001/api/admin/users/security', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ 
            currentPassword: formData.currentPassword, 
            newPassword: formData.newPassword 
          })
        });
        if (!passRes.ok) {
          throw new Error('Failed to update password. Check current password.');
        }
      }

      onOpenChange(false);
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
    } catch (error: any) {
      alert(error.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel border-white/10 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>My Profile</DialogTitle>
          <DialogDescription>
            Update your account details and password.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Profile Photo</label>
            <div className="flex items-center gap-4">
              {formData.avatarUrl && (
                <div className="relative group">
                  <img src={formData.avatarUrl.startsWith('http') ? formData.avatarUrl : `http://localhost:5001${formData.avatarUrl}`} alt="Avatar" className="w-16 h-16 rounded-full object-cover border border-white/10" />
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        if (formData.avatarUrl.startsWith('/uploads/')) {
                          const filename = formData.avatarUrl.split('/').pop();
                          await fetch(`http://localhost:5001/api/upload/${filename}`, {
                            method: 'DELETE',
                            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                          });
                        }
                        setFormData(p => ({...p, avatarUrl: ''}));
                      } catch (err) {
                        alert('Failed to remove image');
                      }
                    }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </div>
              )}
              <div className="flex-1">
                <Input 
                  type="file" 
                  accept="image/*"
                  onChange={async (e) => {
                    if (!e.target.files || e.target.files.length === 0) return;
                    setUploading(true);
                    const formDataObj = new FormData();
                    formDataObj.append('image', e.target.files[0]);
                    try {
                      const res = await fetch('http://localhost:5001/api/upload', {
                        method: 'POST',
                        body: formDataObj,
                      });
                      if (res.ok) {
                        const { imageUrl } = await res.json();
                        setFormData(p => ({...p, avatarUrl: imageUrl}));
                      }
                    } catch (error) {
                      alert('Upload error');
                    } finally {
                      setUploading(false);
                    }
                  }}
                  className="bg-white/5 border-white/10" 
                  disabled={uploading}
                />
                {uploading && <p className="text-xs text-blue-400 mt-1">Uploading...</p>}
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Name</label>
            <Input 
              value={formData.name} 
              onChange={(e) => setFormData(p => ({...p, name: e.target.value}))} 
              className="bg-white/5 border-white/10" 
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Email (Read Only)</label>
            <Input 
              value={formData.email} 
              disabled
              className="bg-white/5 border-white/10 text-muted-foreground" 
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Bio</label>
            <Textarea 
              value={formData.bio} 
              onChange={(e) => setFormData(p => ({...p, bio: e.target.value}))} 
              className="bg-white/5 border-white/10 min-h-[80px]" 
            />
          </div>
          <div className="border-t border-white/10 my-2 pt-4 grid gap-4">
            <p className="text-sm font-medium text-muted-foreground">Change Password (Optional)</p>
            <div className="grid gap-2">
              <label className="text-xs font-medium">Current Password</label>
              <Input 
                type="password"
                value={formData.currentPassword} 
                onChange={(e) => setFormData(p => ({...p, currentPassword: e.target.value}))} 
                className="bg-white/5 border-white/10" 
              />
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-medium">New Password</label>
              <Input 
                type="password"
                value={formData.newPassword} 
                onChange={(e) => setFormData(p => ({...p, newPassword: e.target.value}))} 
                className="bg-white/5 border-white/10" 
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" disabled={loading} onClick={handleSubmit}>
            {loading ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
