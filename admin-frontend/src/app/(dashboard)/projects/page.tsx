'use client';

import { ProjectsTable } from '@/components/projects/ProjectsTable';
import { ProjectEditorModal } from '@/components/projects/ProjectEditorModal';

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-10">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage active projects and tracking.</p>
        </div>
        <div className="flex gap-2">
          <ProjectEditorModal onSuccess={() => window.location.reload()} />
        </div>
      </div>
      
      <ProjectsTable />
    </div>
  );
}
