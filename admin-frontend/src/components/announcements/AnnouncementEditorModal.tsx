'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  audience: string;
}

interface AnnouncementEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  announcement?: Announcement | null;
}

export function AnnouncementEditorModal({ isOpen, onClose, onSaved, announcement }: AnnouncementEditorModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    audience: 'ALL',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (announcement) {
      setFormData({
        title: announcement.title,
        content: announcement.content,
        audience: announcement.audience,
      });
    } else {
      setFormData({ title: '', content: '', audience: 'ALL' });
    }
  }, [announcement, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = announcement
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/announcements/${announcement.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/announcements`;
      const method = announcement ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        onSaved();
        onClose();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to save announcement');
      }
    } catch (error) {
      console.error('Failed to save announcement', error);
      alert('Network error');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg mx-4 glass-panel border border-white/10 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {announcement ? 'Edit Announcement' : 'New Announcement'}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Announcement title..."
              required
              className="bg-white/5 border-white/10"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Content *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Write your announcement..."
              required
              rows={5}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Audience</label>
            <div className="flex gap-3">
              {[
                { value: 'ALL', label: 'Everyone', color: 'bg-blue-500/20 border-blue-500/30 text-blue-400' },
                { value: 'MANAGER', label: 'Managers Only', color: 'bg-purple-500/20 border-purple-500/30 text-purple-400' },
                { value: 'DEV', label: 'Developers Only', color: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' },
              ].map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, audience: option.value }))}
                  className={`flex-1 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                    formData.audience === option.value
                      ? option.color + ' ring-1 ring-white/20'
                      : 'bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="flex-1 bg-primary hover:bg-primary/90">
              {saving ? 'Saving...' : announcement ? 'Update' : 'Publish'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
