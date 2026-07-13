'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
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

export function AllocationModal() {
  const [open, setOpen] = useState(false);
  const { role } = useAppStore();

  const isDev = role === 'DEV';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2"><Plus className="h-4 w-4" /> Create Task</Button>} />
      <DialogContent className="glass-panel border-white/10 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Allocate New Task</DialogTitle>
          <DialogDescription>
            Assign a new task to a team member and link it to a project.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="title" className="text-right text-sm font-medium">
              Task Title
            </label>
            <Input
              id="title"
              placeholder="E.g. Update API schema"
              className="col-span-3 bg-white/5 border-white/10"
              disabled={isDev} // Devs cannot create new tasks arbitrarily in this setup
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="assignee" className="text-right text-sm font-medium">
              Assignee
            </label>
            <Input
              id="assignee"
              placeholder="Select team member..."
              className="col-span-3 bg-white/5 border-white/10"
              disabled={isDev}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="budget" className="text-right text-sm font-medium">
              Budget Hours
            </label>
            <Input
              id="budget"
              type="number"
              placeholder="e.g. 10"
              className="col-span-3 bg-white/5 border-white/10"
              disabled={role !== 'SUPER_ADMIN'} // Only Admins can set budgets
            />
          </div>
        </div>
        <DialogFooter>
          {isDev && (
            <p className="text-xs text-destructive mr-auto flex items-center">
              Your role (Dev) cannot allocate tasks.
            </p>
          )}
          {role === 'MANAGER' && (
            <p className="text-xs text-amber-500 mr-auto flex items-center">
              Managers cannot set budgets.
            </p>
          )}
          <Button type="submit" disabled={isDev} onClick={() => setOpen(false)}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
