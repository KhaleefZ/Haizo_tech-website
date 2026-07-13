'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, Circle, Clock, Activity, Users, Box, Loader2 } from 'lucide-react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { Badge } from '@/components/ui/badge';

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) {
          const data = await res.json();
          setProject(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="animate-spin text-muted-foreground w-8 h-8" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-muted-foreground gap-4">
        <p>Project not found.</p>
        <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  // Derive progress from columns/tasks
  const allTasks = project.columns?.flatMap((col: any) => col.tasks) || [];
  const completedTasks = project.columns?.find((c: any) => c.name.toLowerCase() === 'done')?.tasks || [];
  const progress = allTasks.length > 0 ? Math.round((completedTasks.length / allTasks.length) * 100) : 0;
  
  // Collect unique assignees
  const assignees = new Set(allTasks.map((t: any) => t.assigneeId).filter(Boolean));

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-10">
      <AnimatedSection>
        <Button variant="ghost" className="mb-4 gap-2 w-fit -ml-4" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" /> Back to Projects
        </Button>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold tracking-tight">{project.name}</h1>
            <Badge variant="outline" className={
              progress === 100 ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10' :
              progress > 0 ? 'border-blue-500/30 text-blue-500 bg-blue-500/10' :
              'border-muted/30 text-muted-foreground bg-muted/10'
            }>
              {progress === 100 ? 'Completed' : progress > 0 ? 'In Progress' : 'Planning'}
            </Badge>
          </div>
          <p className="text-xl text-muted-foreground mt-2 max-w-3xl">
            {project.description}
          </p>
        </div>
      </AnimatedSection>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
        {/* Quick Stats */}
        <AnimatedSection delay={0.1} className="md:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-6 flex flex-col gap-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Activity className="h-16 w-16 text-primary" />
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg text-primary">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overall Progress</p>
                <h3 className="text-2xl font-bold">{progress}%</h3>
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 mt-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="glass-card p-6 flex items-center gap-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Users className="h-16 w-16 text-emerald-500" />
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-500 relative z-10">
              <Users className="h-6 w-6" />
            </div>
            <div className="relative z-10">
              <p className="text-sm text-muted-foreground">Team Members</p>
              <h3 className="text-2xl font-bold">{assignees.size} Allocated</h3>
            </div>
          </div>

          <div className="glass-card p-6 flex items-center gap-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Clock className="h-16 w-16 text-amber-500" />
            </div>
            <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500 relative z-10 shrink-0">
              <Clock className="h-6 w-6" />
            </div>
            <div className="relative z-10 w-full">
              <div className="flex flex-col gap-1">
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Deadline</p>
                  <h3 className="text-xl font-bold">{project.endDate ? new Date(project.endDate).toLocaleDateString() : 'TBD'}</h3>
                </div>
                {project.startDate && (
                  <div className="flex items-center gap-1.5 mt-1 pt-1 border-t border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <p className="text-xs text-muted-foreground">Started: <span className="text-white/80">{new Date(project.startDate).toLocaleDateString()}</span></p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="glass-card p-6 flex items-center gap-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="text-6xl font-bold text-green-500">₹</span>
            </div>
            <div className="p-3 bg-green-500/10 rounded-lg text-green-500 relative z-10">
              <span className="text-xl font-bold">₹</span>
            </div>
            <div className="relative z-10">
              <p className="text-sm text-muted-foreground">Budget</p>
              <h3 className="text-2xl font-bold truncate max-w-[150px]">{project.budget || 'Not Set'}</h3>
            </div>
          </div>
        </AnimatedSection>

        {/* Key Tasks */}
        <AnimatedSection delay={0.2} className="md:col-span-3 glass-card p-0 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" /> Key Tasks
            </h2>
            <Badge variant="secondary" className="bg-white/10">{allTasks.length} Total</Badge>
          </div>
          <div className="flex flex-col gap-0 overflow-y-auto max-h-[500px]">
            {allTasks.length > 0 ? allTasks.map((task: any, index: number) => {
              const isDone = task.isCompleted || project.columns?.find((c:any) => c.id === task.columnId)?.name.toLowerCase() === 'done';
              const colName = project.columns?.find((c:any) => c.id === task.columnId)?.name || 'Unknown';
              return (
                <div key={task.id} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 hover:bg-white/5 transition-colors ${index !== allTasks.length - 1 ? 'border-b border-white/5' : ''}`}>
                  <div className="flex items-start gap-3">
                    {isDone ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                    )}
                    <div className="flex flex-col gap-1">
                      <h4 className={`font-medium ${isDone ? 'text-muted-foreground line-through' : 'text-white'}`}>{task.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap mt-1">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {task.assignee ? task.assignee.name : 'Unassigned'}
                        </span>
                        {task.dueDate && (
                          <span className="flex items-center gap-1 text-amber-500/80">
                            <Clock className="w-3 h-3" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                        <Badge variant="outline" className={`text-[10px] px-2 py-0 h-4 border-white/10 bg-white/5`}>
                          {colName}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline" className={
                      task.priority === 'High' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                      task.priority === 'Medium' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                      'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    }>
                      {task.priority || 'Low'}
                    </Badge>
                  </div>
                </div>
              );
            }) : (
              <div className="p-10 text-center text-muted-foreground">
                <Box className="h-10 w-10 mx-auto mb-3 opacity-20" />
                <p>No tasks defined yet.</p>
                <p className="text-sm mt-1">Add tasks in the Kanban board to track progress.</p>
              </div>
            )}
          </div>
        </AnimatedSection>

        {/* Project Columns */}
        <AnimatedSection delay={0.3} className="md:col-span-1 glass-card p-0 flex flex-col h-fit">
          <div className="p-6 border-b border-white/10 bg-white/5">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Box className="h-5 w-5 text-primary" /> Kanban Columns
            </h2>
          </div>
          <div className="flex flex-col p-4 gap-3">
            {(project.columns ? [...project.columns].sort((a: any, b: any) => a.order - b.order) : []).map((col: any) => (
              <div key={col.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <span className="font-medium text-sm text-foreground/80">{col.name}</span>
                <Badge variant="secondary" className="bg-primary/20 text-primary border-none">
                  {col.tasks?.length || 0}
                </Badge>
              </div>
            ))}
            {(!project.columns || project.columns.length === 0) && (
              <p className="text-muted-foreground text-center py-4 text-sm">No columns defined yet.</p>
            )}
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
