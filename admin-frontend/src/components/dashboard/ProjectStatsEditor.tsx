'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchWithAuth } from '@/lib/api';

export function ProjectStatsEditor({ project, onClose, onSuccess }: { project: any, onClose: () => void, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    status: project.status || 'Planning',
    progress: project.progress || 0,
    budget: project.budget || '',
    startDate: project.startDate ? project.startDate.split('T')[0] : '',
    endDate: project.endDate ? project.endDate.split('T')[0] : ''
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth(`http://localhost:5001/api/projects/${project.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...project,
          status: formData.status,
          progress: formData.progress,
          budget: formData.budget,
          startDate: formData.startDate || null,
          endDate: formData.endDate || null
        })
      });

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        alert('Failed to update stats');
      }
    } catch (error) {
      console.error(error);
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="glass-panel border-white/10 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Project Stats</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Status</label>
            <select 
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="Planning" className="bg-slate-900">Planning</option>
              <option value="In Progress" className="bg-slate-900">In Progress</option>
              <option value="Completed" className="bg-slate-900">Completed</option>
              <option value="On Hold" className="bg-slate-900">On Hold</option>
            </select>
          </div>
          
          <div className="grid gap-2">
            <label className="text-sm font-medium">Progress (%)</label>
            <Input 
              type="number" 
              min="0" 
              max="100" 
              value={formData.progress}
              onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Budget</label>
            <Input 
              placeholder="e.g. $10,000"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Start Date</label>
              <Input 
                type="date" 
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="bg-white/5 border-white/10 [color-scheme:dark]"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">End Date</label>
              <Input 
                type="date" 
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="bg-white/5 border-white/10 [color-scheme:dark]"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="bg-white/5 border-white/10">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
