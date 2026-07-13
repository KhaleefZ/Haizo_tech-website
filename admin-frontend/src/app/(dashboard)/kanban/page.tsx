import { KanbanBoard } from '@/components/kanban/KanbanBoard';

export default function KanbanPage() {
  return (
    <div className="flex flex-col gap-6 w-full h-full">
      <div className="flex flex-col gap-2 shrink-0">
        <h1 className="text-3xl font-bold tracking-tight">Kanban Board</h1>
        <p className="text-muted-foreground">Manage active sprint tasks and workflow.</p>
      </div>
      
      <KanbanBoard />
    </div>
  );
}
