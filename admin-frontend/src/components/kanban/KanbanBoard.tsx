'use client';

import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard, Task } from './KanbanCard';
import { Loader2, FolderKanban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ColumnEditorModal } from './ColumnEditorModal';
import { useAppStore } from '@/store/useAppStore';
import { getSocket } from '@/lib/socket';

interface ColumnData {
  id: string;
  name: string;
  order: number;
}

export function KanbanBoard() {
  const [columns, setColumns] = useState<ColumnData[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeColumn, setActiveColumn] = useState<ColumnData | null>(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<{id: string, name: string}[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const { user, role } = useAppStore();

  const fetchBoard = async (projectId: string) => {
    try {
      const boardRes = await fetch(`http://localhost:5001/api/projects/${projectId}/kanban`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!boardRes.ok) return;
      const boardData = await boardRes.json();
      setColumns(boardData.columns.map((c: any) => ({ id: c.id, name: c.name, order: c.order })));
      
      const allTasks: Task[] = [];
      boardData.columns.forEach((col: any) => {
        col.tasks.forEach((t: any) => {
          allTasks.push({
            id: t.id,
            title: t.title,
            description: t.description,
            tags: t.tags,
            dueDate: t.dueDate,
            columnId: col.id,
            assignee: t.assignee,
            assigneeId: t.assigneeId,
            priority: t.priority || 'Medium'
          });
        });
      });
      
      if (role === 'DEV') {
        setTasks(allTasks.filter(t => t.assigneeId === user?.id));
      } else {
        setTasks(allTasks);
      }
    } catch (e) {}
  };

  const handleInitKanban = async () => {
    if (!selectedProjectId) return;
    try {
      const res = await fetch(`http://localhost:5001/api/projects/${selectedProjectId}/init-kanban`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        fetchBoard(selectedProjectId);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/projects', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
          if (data.length > 0) {
            setSelectedProjectId(data[0].id);
            fetchBoard(data[0].id);
          }
        }
      } catch (e) {} finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (!selectedProjectId) return;
    
    const socket = getSocket();
    if (!socket) return;

    socket.emit('joinProject', selectedProjectId);

    socket.on('taskCreated', (task: any) => {
      if (role === 'DEV' && task.assigneeId !== user?.id) return;
      setTasks(prev => {
        if (prev.some(t => t.id === task.id)) return prev;
        return [...prev, {
          id: task.id,
          title: task.title,
          description: task.description,
          tags: task.tags,
          dueDate: task.dueDate,
          columnId: task.columnId,
          assignee: task.assignee,
          assigneeId: task.assigneeId,
          priority: task.priority || 'Medium'
        }];
      });
    });

    socket.on('taskMoved', (data: any) => {
      setTasks(prev => prev.map(t => 
        t.id === data.taskId 
          ? { ...t, columnId: data.targetColumnId } 
          : t
      ));
    });

    socket.on('taskUpdated', (task: any) => {
      if (role === 'DEV' && task.assigneeId !== user?.id) {
        setTasks(prev => prev.filter(t => t.id !== task.id));
        return;
      }
      
      setTasks(prev => {
        const exists = prev.some(t => t.id === task.id);
        if (exists) {
          return prev.map(t => t.id === task.id ? {
            id: task.id,
            title: task.title,
            description: task.description,
            tags: task.tags,
            dueDate: task.dueDate,
            columnId: task.columnId,
            assignee: task.assignee,
            assigneeId: task.assigneeId,
            priority: task.priority || 'Medium'
          } : t);
        } else {
          return [...prev, {
            id: task.id,
            title: task.title,
            description: task.description,
            tags: task.tags,
            dueDate: task.dueDate,
            columnId: task.columnId,
            assignee: task.assignee,
            assigneeId: task.assigneeId,
            priority: task.priority || 'Medium'
          }];
        }
      });
    });

    socket.on('taskDeleted', (taskId: string) => {
      setTasks(prev => prev.filter(t => t.id !== taskId));
    });

    socket.on('columnCreated', (col: any) => {
      setColumns(prev => {
        if (prev.some(c => c.id === col.id)) return prev;
        return [...prev, { id: col.id, name: col.name, order: col.order }].sort((a, b) => a.order - b.order);
      });
    });

    socket.on('columnUpdated', (col: any) => {
      setColumns(prev => prev.map(c => c.id === col.id ? { ...c, name: col.name, order: col.order } : c).sort((a, b) => a.order - b.order));
    });

    socket.on('columnDeleted', (columnId: string) => {
      setColumns(prev => prev.filter(c => c.id !== columnId));
      setTasks(prev => prev.filter(t => t.columnId !== columnId));
    });

    socket.on('columnMoved', () => {
      fetchBoard(selectedProjectId);
    });

    return () => {
      socket.emit('leaveProject', selectedProjectId);
      socket.off('taskCreated');
      socket.off('taskMoved');
      socket.off('taskUpdated');
      socket.off('taskDeleted');
      socket.off('columnCreated');
      socket.off('columnUpdated');
      socket.off('columnDeleted');
      socket.off('columnMoved');
    };
  }, [selectedProjectId, role, user?.id]);

  const handleProjectChange = (val: string) => {
    setSelectedProjectId(val);
    fetchBoard(val);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === 'Column') {
      const col = columns.find(c => c.id === active.id);
      if (col) setActiveColumn(col);
      return;
    }
    const task = tasks.find(t => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    setActiveColumn(null);
    const { active, over } = event;

    if (!over) return;

    if (active.data.current?.type === 'Column') {
      if (active.id !== over.id) {
        const oldIndex = columns.findIndex(c => c.id === active.id);
        const newIndex = columns.findIndex(c => c.id === over.id);
        
        setColumns((cols) => arrayMove(cols, oldIndex, newIndex));
        
        try {
          const res = await fetch(`http://localhost:5001/api/projects/columns/${active.id}/move`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ newOrder: newIndex })
          });
          if (!res.ok) throw new Error('Failed to move column');
        } catch (error) {
          console.error(error);
          if (selectedProjectId) fetchBoard(selectedProjectId);
        }
      }
      return;
    }

    const taskId = active.id as string;
    const targetColumnId = over.id as string;
    
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.columnId === targetColumnId) return; // Didn't move columns

    // Optimistic UI update
    const previousColumnId = task.columnId;
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, columnId: targetColumnId } : t));

    // API Call
    try {
      const res = await fetch(`http://localhost:5001/api/tasks/${taskId}/move`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          targetColumnId,
          newOrder: 0 // Putting at top for now
        })
      });

      if (!res.ok) {
        throw new Error('Failed to move task');
      }
    } catch (error) {
      console.error(error);
      // Revert optimistic update
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, columnId: previousColumnId } : t));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="animate-spin text-muted-foreground w-8 h-8" />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-muted-foreground gap-4">
        <FolderKanban className="w-12 h-12 text-muted-foreground/50" />
        <p>No projects found. Please create a project to use the Kanban board.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center gap-4">
        <select 
          value={selectedProjectId || ''} 
          onChange={(e) => handleProjectChange(e.target.value)}
          className="w-[250px] bg-[#121212] border border-white/10 text-sm rounded-md h-10 px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="" disabled>Select a project</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {columns.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 text-muted-foreground gap-4 border border-dashed border-white/10 rounded-xl bg-white/5">
          <p>This project has no Kanban columns.</p>
          <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10" onClick={handleInitKanban}>
            Initialize Default Columns
          </Button>
        </div>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-4 flex-1">
          <DndContext 
            sensors={sensors}
            onDragStart={handleDragStart} 
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={columns.map(c => c.id)} strategy={horizontalListSortingStrategy}>
              {columns.map(col => (
                <KanbanColumn 
                  key={col.id} 
                  id={col.id} 
                  title={col.name} 
                  tasks={tasks}
                  projectId={selectedProjectId || ''}
                  onTaskCreated={() => selectedProjectId && fetchBoard(selectedProjectId)}
                />
              ))}
            </SortableContext>

            <DragOverlay>
              {activeTask ? <KanbanCard task={activeTask} /> : null}
              {activeColumn ? (
                <div className="opacity-50">
                  <KanbanColumn 
                    id={activeColumn.id} 
                    title={activeColumn.name} 
                    tasks={tasks}
                    projectId={selectedProjectId || ''}
                  />
                </div>
              ) : null}
            </DragOverlay>
            
            {selectedProjectId && (
              <div className="pt-[44px]">
                <ColumnEditorModal projectId={selectedProjectId} onSuccess={() => fetchBoard(selectedProjectId)} />
              </div>
            )}
          </DndContext>
        </div>
      )}
    </div>
  );
}
