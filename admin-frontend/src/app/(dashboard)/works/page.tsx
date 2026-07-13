import { WorksTable } from '@/components/works/WorksTable';
import { WorkEditorModal } from '@/components/works/WorkEditorModal';
import { CategoriesManager } from '@/components/works/CategoriesManager';

export default function WorksPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-10">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Works (Portfolio)</h1>
          <p className="text-muted-foreground">Manage the projects displayed on the public frontend portfolio.</p>
        </div>
        <WorkEditorModal />
      </div>
      
      <CategoriesManager />

      <WorksTable />
    </div>
  );
}
