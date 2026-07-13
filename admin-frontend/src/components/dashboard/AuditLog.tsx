import { List } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const logs = [
  { id: 1, action: 'User X moved Task Y to Staging', time: '10 mins ago', type: 'update' },
  { id: 2, action: 'Admin granted API access to Dev Team', time: '45 mins ago', type: 'security' },
  { id: 3, action: 'New project "Alpha" created', time: '2 hours ago', type: 'create' },
  { id: 4, action: 'Server reboot initiated by System', time: '5 hours ago', type: 'system' },
];

export function AuditLog({ activity }: { activity?: any }) {
  const dynamicLogs: any[] = [];
  if (activity?.projects) {
    activity.projects.forEach((p: any) => {
      dynamicLogs.push({ id: `p-${p.id}`, action: `New project "${p.name}" created`, time: new Date(p.createdAt).toLocaleDateString(), type: 'create' });
    });
  }
  if (activity?.inquiries) {
    activity.inquiries.forEach((i: any) => {
      dynamicLogs.push({ id: `i-${i.id}`, action: `New inquiry from ${i.name}`, time: new Date(i.submissionDate).toLocaleDateString(), type: 'inquiry' });
    });
  }

  return (
    <div className="glass-card p-6 flex flex-col gap-4">
      <h3 className="font-semibold text-lg flex items-center gap-2">
        <List className="h-5 w-5 text-purple-500" />
        Recent Activity
      </h3>

      <div className="flex flex-col gap-0 relative before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-white/10 mt-2">
        {dynamicLogs.length === 0 && <p className="text-sm text-muted-foreground ml-6">No recent activity.</p>}
        {dynamicLogs.map((log: any) => (
          <div key={log.id} className="relative pl-8 py-3 group">
            <div className="absolute left-[7px] top-[18px] h-[10px] w-[10px] rounded-full bg-white/20 border-2 border-[#050505] group-hover:bg-primary transition-colors" />
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{log.action}</span>
                <span className="text-xs text-muted-foreground">{log.time}</span>
              </div>
              <div>
                <Badge variant="outline" className="text-[10px] bg-white/5 border-white/10">
                  {log.type}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
