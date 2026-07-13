'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { fetchWithAuth } from '@/lib/api';
import { Edit2, ExternalLink } from 'lucide-react';
import { ProjectStatsEditor } from './ProjectStatsEditor';
import Link from 'next/link';

export function ProjectStatsTable() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<any | null>(null);

  const loadProjects = async () => {
    try {
      const res = await fetchWithAuth('http://localhost:5001/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading projects...</div>;
  }

  return (
    <div className="glass-panel border-white/10 mt-6 overflow-hidden rounded-xl border bg-background text-card-foreground shadow">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="font-semibold leading-none tracking-tight">All Projects Overview</h3>
      </div>
      <div className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-medium">Project Name</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Progress</th>
                <th className="px-6 py-4 font-medium">Dates</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-base">{project.name}</div>
                    <div className="text-xs text-muted-foreground mt-1 truncate max-w-xs">{project.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={
                      project.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                        project.status === 'In Progress' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                          'bg-white/10 text-white border-white/20'
                    }>
                      {project.status || 'Planning'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-white/10 rounded-full h-2 min-w-[80px] max-w-[150px]">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${project.progress || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{project.progress || 0}%</span>
                      </div>
                      {project.stats && project.stats.totalTasks > 0 && (
                        <span className="text-[10px] text-muted-foreground">
                          {project.stats.completedTasks} / {project.stats.totalTasks} tasks
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-muted-foreground flex flex-col gap-1">
                      {project.startDate && <span>Start: {new Date(project.startDate).toLocaleDateString()}</span>}
                      {project.endDate && <span>Due: {new Date(project.endDate).toLocaleDateString()}</span>}
                      {!project.startDate && !project.endDate && <span>Not set</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setEditingProject(project)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Link href={`/projects/${project.id}`}>
                        <Button variant="ghost" size="icon">
                          <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-muted-foreground">
                    No projects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingProject && (
        <ProjectStatsEditor
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onSuccess={loadProjects}
        />
      )}
    </div>
  );
}
