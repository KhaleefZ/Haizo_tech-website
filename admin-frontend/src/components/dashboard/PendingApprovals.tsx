'use client';

import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';

const approvals = [
  { id: 1, title: 'Q3 Budget Increase', requester: 'Alice M.', role: 'Manager', time: '2 hours ago' },
  { id: 2, title: 'Deploy to Production', requester: 'Bob D.', role: 'Dev', time: '5 hours ago' },
  { id: 3, title: 'New API Key Access', requester: 'Charlie S.', role: 'Dev', time: '1 day ago' },
];

export function PendingApprovals({ inquiries }: { inquiries?: number }) {
  const { role } = useAppStore();

  return (
    <div className="glass-card p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Clock className="h-5 w-5 text-accent" />
          Pending Action Items
        </h3>
        <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
          {inquiries || 0} pending inquiries
        </span>
      </div>

      <div className="flex flex-col gap-3 mt-2">
        {inquiries === undefined ? <p className="text-sm text-muted-foreground">Loading...</p> : inquiries > 0 ? (
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 group">
            <div>
              <p className="font-medium text-sm">New Website Inquiries</p>
              <p className="text-xs text-muted-foreground">
                Check the Inquiries tab for {inquiries} unread messages.
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">You are all caught up!</p>
        )}
      </div>
    </div>
  );
}
