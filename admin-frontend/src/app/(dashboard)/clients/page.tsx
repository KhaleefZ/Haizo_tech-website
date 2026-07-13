'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Edit2, Trash2, Mail } from 'lucide-react';
import { ClientEditorModal, ClientItem } from '@/components/clients/ClientEditorModal';

export default function ClientsPage() {
  const { role } = useAppStore();
  const isAdmin = role === 'SUPER_ADMIN' || role === 'MANAGER';
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/clients', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        setClients(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client?')) return;
    try {
      const res = await fetch(`http://localhost:5001/api/clients/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) fetchClients();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-10">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Clients Directory</h1>
          <p className="text-muted-foreground">Manage your client organizations and contacts.</p>
        </div>
        <ClientEditorModal onSuccess={fetchClients} />
      </div>

      {loading ? (
        <div className="text-muted-foreground">Loading clients...</div>
      ) : clients.length === 0 ? (
        <div className="text-muted-foreground">No clients found.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          {clients.map((client) => (
            <div key={client.id} className="glass-card p-6 flex flex-col gap-4 hover:border-primary/30 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{client.organization}</h3>
                    <p className="text-sm text-muted-foreground">{client.contactName}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <ClientEditorModal 
                    client={client} 
                    onSuccess={fetchClients}
                    trigger={
                      <Button variant="ghost" size="icon" disabled={!isAdmin} className="h-8 w-8 hover:bg-white/10">
                        <Edit2 className="h-4 w-4 text-muted-foreground hover:text-white" />
                      </Button>
                    } 
                  />
                  <Button variant="ghost" size="icon" disabled={!isAdmin} onClick={() => handleDelete(client.id)} className="h-8 w-8 hover:bg-destructive/20 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-6 mt-2 pt-4 border-t border-white/5 text-sm">
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">Email</span>
                  <a href={`mailto:${client.email}`} className="flex items-center gap-1 text-primary hover:underline">
                    <Mail className="h-3 w-3" /> {client.email}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
