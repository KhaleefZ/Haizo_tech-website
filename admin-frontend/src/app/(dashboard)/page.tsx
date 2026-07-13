'use client';

import { useState, useEffect } from 'react';
import { SystemHealthWidget } from '@/components/dashboard/SystemHealthWidget';
import { VelocityChart } from '@/components/dashboard/VelocityChart';
import { PendingApprovals } from '@/components/dashboard/PendingApprovals';
import { AuditLog } from '@/components/dashboard/AuditLog';
import { ProjectStatsTable } from '@/components/dashboard/ProjectStatsTable';
import { AnimatedSection } from '@/components/ui/AnimatedSection';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:5001/api/dashboard/stats', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(async res => {
      if (!res.ok) throw new Error('Failed to fetch dashboard stats');
      return res.json();
    })
    .then(data => setStats(data))
    .catch(console.error);
  }, []);

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">Monitor system health, sprint progress, and recent activities.</p>
      </div>
      
      <AnimatedSection>
        <ProjectStatsTable />
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <SystemHealthWidget counts={stats?.counts} analytics={stats?.analytics} />
      </AnimatedSection>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AnimatedSection delay={0.1} className="lg:col-span-2">
          <VelocityChart />
        </AnimatedSection>
        <div className="flex flex-col gap-6">
          <AnimatedSection delay={0.2}>
            <PendingApprovals inquiries={stats?.counts?.newInquiries} />
          </AnimatedSection>
          <AnimatedSection delay={0.3}>
            <AuditLog activity={stats?.recentActivity} />
          </AnimatedSection>
        </div>
      </div>
      
    </div>
  );
}
