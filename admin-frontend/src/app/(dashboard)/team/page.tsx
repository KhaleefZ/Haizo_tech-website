'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit2, Trash2 } from 'lucide-react';
import { TeamEditorModal, TeamMemberItem } from '@/components/team/TeamEditorModal';

export default function TeamPage() {
  const { role } = useAppStore();
  const isAdmin = role === 'SUPER_ADMIN' || role === 'MANAGER';
  const [team, setTeam] = useState<TeamMemberItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeam = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        setTeam(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) fetchTeam();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-10">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
          <p className="text-muted-foreground">Manage your team members and roles.</p>
        </div>
        <TeamEditorModal onSuccess={fetchTeam} />
      </div>

      {loading ? (
        <div className="text-muted-foreground">Loading team...</div>
      ) : team.length === 0 ? (
        <div className="text-muted-foreground">No team members found.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <div key={member.id} className="glass-card p-6 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <Avatar className="h-12 w-12 border-2 border-primary/20">
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex gap-2">
                  <TeamEditorModal 
                    member={member} 
                    onSuccess={fetchTeam}
                    trigger={
                      <Button variant="ghost" size="icon" disabled={!isAdmin} className="h-8 w-8 hover:bg-white/10">
                        <Edit2 className="h-4 w-4 text-muted-foreground hover:text-white" />
                      </Button>
                    } 
                  />
                  <Button variant="ghost" size="icon" disabled={!isAdmin} onClick={() => handleDelete(member.id)} className="h-8 w-8 hover:bg-destructive/20 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
                {member.bio && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{member.bio}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
