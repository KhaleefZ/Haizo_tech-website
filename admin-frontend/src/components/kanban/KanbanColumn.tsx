import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { KanbanCard, Task } from './KanbanCard';
import { cn } from '@/lib/utils';
import { TaskEditorModal } from './TaskEditorModal';
import { ColumnEditorModal } from './ColumnEditorModal';
import { Edit2, GripHorizontal } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  projectId: string;
  onTaskCreated?: () => void;
}

export function KanbanColumn({ id, title, tasks, projectId, onTaskCreated }: KanbanColumnProps) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: id,
    data: {
      type: 'Column',
      columnId: id,
    }
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const { role } = useAppStore();
  const isAdmin = role === 'SUPER_ADMIN' || role === 'MANAGER';

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={cn(
        "flex flex-col gap-4 min-w-[300px] w-[300px]",
        isDragging && "opacity-50"
      )}
    >
      <div className="flex items-center justify-between group">
        <div className="flex items-center gap-2">
          {isAdmin && (
            <button {...attributes} {...listeners} className="cursor-grab hover:bg-white/10 p-1 rounded">
              <GripHorizontal className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
          <h3 className="font-semibold text-sm">{title}</h3>
          <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-muted-foreground">{tasks.filter(t => t.columnId === id).length}</span>
        </div>
        {isAdmin && onTaskCreated && (
          <ColumnEditorModal 
            projectId={projectId} 
            column={{ id, name: title, order: 0 }} 
            onSuccess={onTaskCreated} 
            trigger={
              <button className="text-muted-foreground hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit2 className="w-4 h-4" />
              </button>
            }
          />
        )}
      </div>
      <div
        className={cn(
          "flex-1 p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-3 min-h-[150px] transition-colors"
        )}
      >
        {tasks.filter(t => t.columnId === id).map(task => (
          <KanbanCard key={task.id} task={task} />
        ))}
        {onTaskCreated && <TaskEditorModal columnId={id} onSuccess={onTaskCreated} />}
      </div>
    </div>
  );
}
