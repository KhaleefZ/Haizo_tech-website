import { useDraggable } from '@dnd-kit/core';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import { useState } from 'react';
import { TaskEditorModal } from './TaskEditorModal';
import { fetchWithAuth } from '@/lib/api';

export type Priority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  dueDate?: string | null;
  assignee: { name: string; avatar?: string } | null;
  assigneeId?: string | null;
  priority: Priority;
  columnId: string;
}

interface KanbanCardProps {
  task: Task;
}

export function KanbanCard({ task }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const { role } = useAppStore();
  const isAdmin = role === 'SUPER_ADMIN' || role === 'MANAGER';
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTaskEditorOpen, setIsTaskEditorOpen] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this task?')) return;
    setIsDeleting(true);
    try {
      const res = await fetchWithAuth(`http://localhost:5001/api/tasks/${task.id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete task');
      // The socket event will trigger a refresh on the board
    } catch (err) {
      console.error(err);
      alert('Failed to delete task');
      setIsDeleting(false);
    }
  };

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const priorityColors = {
    Low: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    Medium: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    High: 'bg-destructive/10 text-destructive border-destructive/20',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "glass-card p-4 cursor-grab active:cursor-grabbing flex flex-col gap-3 touch-none",
        isDragging && "opacity-50 ring-2 ring-primary scale-105 z-50"
      )}
    >
      <div className="flex items-start justify-between gap-2 group/header">
        <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
        
        {isAdmin && (
          <div onPointerDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger className="opacity-0 group-hover/header:opacity-100 transition-opacity hover:bg-white/10 p-1 rounded outline-none border-none cursor-pointer">
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => setIsTaskEditorOpen(true)} className="gap-2 cursor-pointer">
                  <Pencil className="h-4 w-4" /> Edit Task
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} disabled={isDeleting} className="text-destructive focus:text-destructive gap-2 cursor-pointer">
                  <Trash2 className="h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {isTaskEditorOpen && (
              <TaskEditorModal 
                task={task} 
                columnId={task.columnId} 
                onSuccess={() => setIsTaskEditorOpen(false)} 
                defaultOpen={true}
                onOpenChange={setIsTaskEditorOpen}
              />
            )}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between mt-2">
        <Badge variant="outline" className={cn("text-[10px] font-medium border", priorityColors[task.priority])}>
          {task.priority}
        </Badge>
        {task.assignee ? (
          <Avatar className="h-6 w-6 border border-border" title={task.assignee.name}>
            {task.assignee.avatar && <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />}
            <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
          </Avatar>
        ) : (
          <div className="h-6 w-6 rounded-full bg-white/10 border border-border flex items-center justify-center text-[10px] text-muted-foreground">
            U
          </div>
        )}
      </div>
    </div>
  );
}
