import { Activity, Server, Database, Globe, Download, HardDrive } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';
import { fetchWithAuth } from '@/lib/api';
import { useState } from 'react';

const metrics = [
  { name: 'API Uptime', value: '99.99%', status: 'Operational', icon: Server, color: 'text-emerald-500' },
  { name: 'Database', value: '14ms', status: 'Healthy', icon: Database, color: 'text-blue-500' },
  { name: 'CDN Nodes', value: '42/42', status: 'Optimal', icon: Globe, color: 'text-purple-500' },
  { name: 'Error Rate', value: '0.01%', status: 'Low', icon: Activity, color: 'text-emerald-500' },
];

export function SystemHealthWidget({ counts, analytics }: { counts?: any, analytics?: any }) {
  const dynamicMetrics = [
    { name: 'Total Projects', value: counts?.projects ?? '-', status: 'Active', icon: Server, color: 'text-emerald-500' },
    { name: 'Clients', value: counts?.clients ?? '-', status: 'Healthy', icon: Database, color: 'text-blue-500' },
    { name: 'Task Completion', value: `${analytics?.completionRate ?? 0}%`, status: `${analytics?.completedTasks ?? 0} Done`, icon: Activity, color: 'text-purple-500' },
    { name: 'Works & Blogs', value: (counts?.works || 0) + (counts?.blogs || 0), status: 'Published', icon: Globe, color: 'text-emerald-500' },
  ];

  const { user } = useAppStore();
  const [isExporting, setIsExporting] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const res = await fetchWithAuth('http://localhost:5001/api/backup/export');
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'haizo_report.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleBackup = async () => {
    try {
      setIsBackingUp(true);
      const res = await fetchWithAuth('http://localhost:5001/api/backup/db');
      if (!res.ok) throw new Error('Backup failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // Get filename from Content-Disposition header if possible
      const contentDisposition = res.headers.get('Content-Disposition');
      let filename = 'haizo_backup.sql';
      if (contentDisposition && contentDisposition.includes('filename=')) {
        filename = contentDisposition.split('filename=')[1].replace(/"/g, '');
      }
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      console.error(err);
    } finally {
      setIsBackingUp(false);
    }
  };

  return (
    <div className="glass-card p-6 flex flex-col gap-4">
      <h3 className="font-semibold text-lg flex items-center gap-2">
        <Activity className="h-5 w-5 text-primary" />
        System Health & Stats
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
        {dynamicMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.name} className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/5">
              <div className={cn("p-2 rounded-md bg-white/5", metric.color)}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{metric.name}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold">{metric.value}</span>
                  <span className="text-xs text-muted-foreground">{metric.status}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="flex gap-4 mt-2 pt-4 border-t border-white/5">
        {user?.role === 'SUPER_ADMIN' && (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white/5 border-white/10 hover:bg-white/10 gap-2 text-xs"
              onClick={handleExport}
              disabled={isExporting}
            >
              <Download className="w-4 h-4" /> {isExporting ? 'Exporting...' : 'Export Report (CSV)'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white/5 border-white/10 hover:bg-white/10 gap-2 text-xs"
              onClick={handleBackup}
              disabled={isBackingUp}
            >
              <HardDrive className="w-4 h-4" /> {isBackingUp ? 'Backing up...' : 'Backup DB'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
