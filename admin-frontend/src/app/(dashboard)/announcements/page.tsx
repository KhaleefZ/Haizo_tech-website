'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Megaphone } from 'lucide-react';
import { AnnouncementEditorModal } from '@/components/announcements/AnnouncementEditorModal';

interface Announcement {
  id: string;
  title: string;
  content: string;
  audience: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function AnnouncementsPage() {
  const { role } = useAppStore();
  const isSuperAdmin = role === 'SUPER_ADMIN';

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/announcements`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data);
      }
    } catch (error) {
      console.error('Failed to fetch announcements', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/announcements/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        fetchAnnouncements();
      }
    } catch (error) {
      console.error('Failed to delete announcement', error);
    }
  };

  const getAudienceBadge = (audience: string) => {
    switch (audience) {
      case 'ALL':
        return <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10">Everyone</Badge>;
      case 'MANAGER':
        return <Badge variant="outline" className="border-purple-500/30 text-purple-400 bg-purple-500/10">Managers</Badge>;
      case 'DEV':
        return <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10">Developers</Badge>;
      default:
        return <Badge variant="outline">{audience}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Announcements</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isSuperAdmin ? 'Create and manage announcements for your team.' : 'Important updates from the leadership.'}
          </p>
        </div>
        {isSuperAdmin && (
          <Button
            onClick={() => { setEditing(null); setModalOpen(true); }}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" /> New Announcement
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : announcements.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No announcements yet</h3>
          <p className="text-muted-foreground text-sm">
            {isSuperAdmin ? 'Create your first announcement to keep the team informed.' : 'Check back later for updates.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="glass-card p-6 border border-white/10 rounded-xl hover:border-white/20 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white truncate">{announcement.title}</h3>
                    {getAudienceBadge(announcement.audience)}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap mb-4">
                    {announcement.content}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="font-medium text-white/60">{announcement.author?.name || 'Unknown'}</span>
                    <span>·</span>
                    <span>{new Date(announcement.createdAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}</span>
                  </div>
                </div>

                {isSuperAdmin && (
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-white/10 text-muted-foreground hover:text-white"
                      onClick={() => { setEditing(announcement); setModalOpen(true); }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-red-500/10 text-muted-foreground hover:text-red-400"
                      onClick={() => handleDelete(announcement.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <AnnouncementEditorModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSaved={fetchAnnouncements}
        announcement={editing}
      />
    </div>
  );
}
