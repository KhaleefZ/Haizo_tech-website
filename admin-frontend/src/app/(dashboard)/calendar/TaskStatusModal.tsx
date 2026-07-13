'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { fetchWithAuth } from '@/lib/api';
import { CheckCircle2, Clock } from 'lucide-react';

import { useAppStore } from '@/store/useAppStore';

import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar as CalendarIcon, User as UserIcon } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description?: string;
  assigneeId?: string | null;
  assignee?: { name: string; avatar?: string } | null;
  dueDate?: string | null;
  startDate?: string | null;
  priority?: 'Low' | 'Medium' | 'High';
  isCompleted: boolean;
  delayReason: string | null;
}

interface TaskStatusModalProps {
  task: Task;
  onClose: () => void;
  onUpdate: () => void;
}

export function TaskStatusModal({ task, onClose, onUpdate }: TaskStatusModalProps) {
  const { user, role } = useAppStore();
  const canUpdate = role === 'SUPER_ADMIN' || role === 'MANAGER' || (role === 'DEV' && task.assigneeId === user?.id);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'completed' | 'delayed' | 'pending'>(
    task.isCompleted ? 'completed' : task.delayReason ? 'delayed' : 'pending'
  );
  const [delayReason, setDelayReason] = useState(task.delayReason || '');

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const isCompleted = status === 'completed';
      const reason = status === 'delayed' ? delayReason : null;

      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isCompleted,
          delayReason: reason
        })
      });

      if (res.ok) {
        onUpdate();
        onClose();
      } else {
        alert('Failed to update status');
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
          <DialogTitle>Update Task Status</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div className="font-medium text-lg">{task.title}</div>
              {task.priority && (
                <Badge variant="outline" className={
                  task.priority === 'High' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                  task.priority === 'Medium' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                  'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                }>
                  {task.priority}
                </Badge>
              )}
            </div>
            {task.description && (
              <p className="text-sm text-muted-foreground mt-2">{task.description}</p>
            )}
            
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <UserIcon className="w-4 h-4" />
                <span className="truncate">
                  {task.assignee ? task.assignee.name : 'Unassigned'}
                </span>
              </div>
              {task.dueDate && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarIcon className="w-4 h-4" />
                  <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
          
          {canUpdate ? (
            <>
              <div className="flex flex-col gap-3 mt-2">
            <label className="flex items-center gap-3 p-3 rounded-lg border border-white/10 cursor-pointer hover:bg-white/5 transition-colors">
              <input 
                type="radio" 
                name="status" 
                checked={status === 'completed'}
                onChange={() => setStatus('completed')}
                className="accent-primary"
              />
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>Mark as Completed</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg border border-white/10 cursor-pointer hover:bg-white/5 transition-colors">
              <input 
                type="radio" 
                name="status" 
                checked={status === 'delayed'}
                onChange={() => setStatus('delayed')}
                className="accent-primary"
              />
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-red-500" />
                <span>Yet to Complete (Delayed)</span>
              </div>
            </label>
            
            <label className="flex items-center gap-3 p-3 rounded-lg border border-white/10 cursor-pointer hover:bg-white/5 transition-colors">
              <input 
                type="radio" 
                name="status" 
                checked={status === 'pending'}
                onChange={() => setStatus('pending')}
                className="accent-primary"
              />
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                <span>Pending</span>
              </div>
            </label>
          </div>

          {status === 'delayed' && (
            <div className="grid gap-2 mt-2 animate-in fade-in slide-in-from-top-2">
              <label htmlFor="delayReason" className="text-sm font-medium text-red-400">Reason for Delay</label>
              <textarea
                id="delayReason"
                value={delayReason}
                onChange={(e) => setDelayReason(e.target.value)}
                placeholder="Please explain why this task is delayed..."
                className="bg-red-500/10 border-red-500/30 text-white p-3 rounded-md min-h-[100px] text-sm resize-none focus:ring-1 focus:ring-red-500 outline-none placeholder:text-white/30"
                disabled={loading}
                autoFocus
              />
            </div>
          )}
            </>
          ) : (
            <div className="mt-2 p-4 rounded-lg border border-white/10 bg-white/5">
              <p className="text-sm font-medium">
                Status: <span className={task.isCompleted ? "text-green-500" : task.delayReason ? "text-red-500" : "text-muted-foreground"}>
                  {task.isCompleted ? 'Completed' : task.delayReason ? 'Delayed' : 'Pending'}
                </span>
              </p>
              {task.delayReason && !task.isCompleted && (
                 <p className="text-sm text-red-400 mt-2">Reason: {task.delayReason}</p>
              )}
            </div>
          )}
        </div>
        <DialogFooter>
          {canUpdate ? (
            <>
              <Button variant="outline" onClick={onClose} className="bg-white/5 border-white/10">
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={loading || (status === 'delayed' && !delayReason.trim())}
              >
                {loading ? 'Saving...' : 'Update Status'}
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={onClose} className="bg-white/5 border-white/10">
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
