'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { fetchWithAuth } from '@/lib/api';
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, Plus, Calendar as CalendarIcon, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskStatusModal } from './TaskStatusModal';
import { TaskEditorModal } from '@/components/kanban/TaskEditorModal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface Project {
  id: string;
  name: string;
}

interface Task {
  id: string;
  title: string;
  dueDate: string | null;
  assigneeId: string | null;
  assignee?: { name: string; avatar?: string };
  isCompleted: boolean;
  delayReason: string | null;
  priority: 'Low' | 'Medium' | 'High';
}

export default function CalendarPage() {
  const { user, role } = useAppStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // Center grid date
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Selected date for Agenda
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [firstColumnId, setFirstColumnId] = useState<string>('');
  const [isTaskEditorOpen, setIsTaskEditorOpen] = useState(false);
  const isAdmin = role === 'SUPER_ADMIN' || role === 'MANAGER';

  useEffect(() => {
    fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`)
      .then(async res => {
        if (!res.ok) throw new Error('Failed to fetch projects');
        const data = await res.json();
        setProjects(data);
        if (data.length > 0) {
          setSelectedProjectId(data[0].id);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedProjectId) return;

    fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${selectedProjectId}/kanban`)
      .then(async res => {
        if (!res.ok) throw new Error('Failed to fetch kanban board');
        const data = await res.json();
        
        if (data && data.columns && data.columns.length > 0) {
          setFirstColumnId(data.columns[0].id);
          
          let allTasks: Task[] = [];
          data.columns.forEach((col: any) => {
            if (col.tasks) {
              allTasks = [...allTasks, ...col.tasks];
            }
          });

          // Filter based on role
          if (role === 'DEV') {
            allTasks = allTasks.filter(t => t.assigneeId === user?.id);
          }

          setTasks(allTasks);
        } else {
          setTasks([]);
        }
      })
      .catch(console.error);
  }, [selectedProjectId, role, user?.id]);

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const handleTaskUpdate = () => {
    const pId = selectedProjectId;
    setSelectedProjectId('');
    setTimeout(() => setSelectedProjectId(pId), 10);
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(t => {
      if (!t.dueDate) return false;
      const d = new Date(t.dueDate);
      return d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate();
    });
  };

  const selectedDateTasks = getTasksForDate(selectedDate);

  // Left panel mini calendar rendering
  const renderMiniCalendar = () => {
    const miniDays = getDaysInMonth(currentDate);
    const miniFirstDay = getFirstDayOfMonth(currentDate);
    return (
      <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-1 hover:bg-white/10 rounded"><ChevronLeft className="w-4 h-4" /></button>
          <span className="text-sm font-medium">{monthName}</span>
          <button onClick={nextMonth} className="p-1 hover:bg-white/10 rounded"><ChevronRight className="w-4 h-4" /></button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 text-muted-foreground">
          {['S','M','T','W','T','F','S'].map((d, i) => <div key={i}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {Array.from({ length: miniFirstDay }).map((_, i) => <div key={`empty-${i}`} />)}
          {Array.from({ length: miniDays }).map((_, i) => {
            const day = i + 1;
            const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const isToday = d.toDateString() === new Date().toDateString();
            const isSelected = d.toDateString() === selectedDate.toDateString();
            const hasTasks = getTasksForDate(d).length > 0;
            return (
              <button 
                key={day}
                onClick={() => setSelectedDate(d)}
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center relative hover:bg-white/10 transition-colors",
                  isSelected && "bg-primary text-primary-foreground hover:bg-primary",
                  isToday && !isSelected && "text-primary font-bold"
                )}
              >
                {day}
                {hasTasks && !isSelected && <div className="absolute bottom-1 w-1 h-1 bg-primary rounded-full" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full p-4 gap-4 overflow-hidden">
      
      {/* LEFT COLUMN */}
      <div className="w-64 flex flex-col gap-4 overflow-y-auto hidden md:flex shrink-0">
        <h1 className="text-2xl font-bold px-2">Calendar</h1>
        
        {renderMiniCalendar()}

        <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col gap-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Project Filter</label>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="bg-black border border-white/10 rounded-md p-2 text-sm outline-none focus:border-primary w-full"
          >
            <option value="" disabled>Select a project</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* CENTER COLUMN: Main Grid */}
      <div className="flex-1 glass-panel rounded-xl border border-white/10 flex flex-col overflow-hidden min-w-[500px]">
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight">{monthName}</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())} className="bg-transparent border-white/20">
              Today
            </Button>
            <div className="flex items-center border border-white/20 rounded-md bg-transparent overflow-hidden">
              <button onClick={prevMonth} className="px-3 py-1.5 hover:bg-white/10 border-r border-white/20"><ChevronLeft className="h-4 w-4" /></button>
              <button onClick={nextMonth} className="px-3 py-1.5 hover:bg-white/10"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b border-white/10 bg-white/[0.02]">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground border-r border-white/10 last:border-0">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 flex-1 auto-rows-[minmax(100px,1fr)] overflow-y-auto">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="p-2 border-r border-b border-white/5 bg-white/[0.01]" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const currentDayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const isToday = currentDayDate.toDateString() === new Date().toDateString();
            const isSelected = currentDayDate.toDateString() === selectedDate.toDateString();
            const dayTasks = getTasksForDate(currentDayDate);

            return (
              <div 
                key={day} 
                className={cn(
                  "p-1.5 border-r border-b border-white/10 last:border-r-0 flex flex-col gap-1 transition-all cursor-pointer group",
                  isSelected ? "bg-primary/10" : "hover:bg-white/[0.03]",
                  isToday && !isSelected && "bg-white/[0.02]"
                )}
                onClick={() => setSelectedDate(currentDayDate)}
              >
                <div className="flex justify-between items-center px-1 mb-1">
                  <span className={cn(
                    "text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full",
                    isToday ? "bg-primary text-primary-foreground" : (isSelected ? "text-primary" : "text-muted-foreground group-hover:text-foreground transition-colors")
                  )}>
                    {day}
                  </span>
                  {isAdmin && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (firstColumnId) {
                          setSelectedDate(currentDayDate);
                          setIsTaskEditorOpen(true);
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-white/20 rounded text-muted-foreground hover:text-white transition-opacity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1 pr-1">
                  {dayTasks.map(task => (
                    <div
                      key={task.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTask(task);
                      }}
                      className={cn(
                        "text-[10px] px-1.5 py-1 rounded truncate border transition-colors flex items-center gap-1 font-medium",
                        task.isCompleted
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                          : task.delayReason
                            ? "bg-destructive/10 border-destructive/20 text-destructive"
                            : "bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20"
                      )}
                    >
                      {task.isCompleted && <CheckCircle2 className="h-3 w-3 shrink-0" />}
                      {task.delayReason && !task.isCompleted && <Clock className="h-3 w-3 shrink-0" />}
                      <span className="truncate">{task.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT COLUMN: Agenda */}
      <div className="w-80 glass-panel rounded-xl border border-white/10 flex flex-col overflow-hidden shrink-0 hidden lg:flex">
        <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold">Agenda</span>
            <span className="text-xs text-muted-foreground">{selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</span>
          </div>
          {isAdmin && firstColumnId && (
            <Button size="icon" className="h-8 w-8 rounded-full" onClick={() => setIsTaskEditorOpen(true)}>
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
          {selectedDateTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-2">
              <CalendarIcon className="w-8 h-8 opacity-20" />
              <p className="text-sm">No tasks for this day.</p>
            </div>
          ) : (
            selectedDateTasks.map(task => (
              <div 
                key={task.id} 
                className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors cursor-pointer flex flex-col gap-2"
                onClick={() => setSelectedTask(task)}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-sm leading-tight">{task.title}</h4>
                  {task.isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                </div>
                
                <div className="flex items-center justify-between mt-1">
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-medium border",
                    task.priority === 'High' ? "bg-destructive/10 text-destructive border-destructive/20" :
                    task.priority === 'Medium' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                    "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                  )}>
                    {task.priority || 'Low'}
                  </span>
                  
                  {task.assignee ? (
                    <Avatar className="h-5 w-5 border border-border">
                      {task.assignee.avatar && <AvatarImage src={task.assignee.avatar} />}
                      <AvatarFallback className="text-[10px]">{task.assignee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">Unassigned</span>
                  )}
                </div>
                {task.delayReason && !task.isCompleted && (
                  <div className="flex items-center gap-1 text-xs text-destructive bg-destructive/10 p-1.5 rounded mt-1">
                    <Info className="w-3 h-3 shrink-0" />
                    <span className="truncate">{task.delayReason}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {selectedTask && (
        <TaskStatusModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleTaskUpdate}
        />
      )}

      {isAdmin && firstColumnId && isTaskEditorOpen && (
        <TaskEditorModal
          columnId={firstColumnId}
          onSuccess={() => {
            setIsTaskEditorOpen(false);
            handleTaskUpdate();
          }}
          initialDueDate={selectedDate}
          defaultOpen={true}
          onOpenChange={setIsTaskEditorOpen}
        />
      )}
    </div>
  );
}
