import { Request, Response } from 'express';
import prisma from '../config/db';
import { getIo } from '../sockets/index';

export const getKanbanBoard = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.projectId as string;
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        columns: {
          orderBy: { order: 'asc' },
          include: {
            tasks: {
              orderBy: { order: 'asc' },
              include: {
                assignee: { select: { id: true, name: true } },
                subtasks: true
              }
            }
          }
        }
      }
    });

    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch kanban board' });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, priority, startDate, columnId, dueDate, assigneeId, tags } = req.body;
    
    // Find highest order in the column
    const highestTask = await prisma.task.findFirst({
      where: { columnId },
      orderBy: { order: 'desc' }
    });
    
    const newOrder = highestTask ? highestTask.order + 1 : 0;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority: priority || undefined,
        startDate: startDate ? new Date(startDate) : null,
        columnId,
        order: newOrder,
        dueDate: dueDate ? new Date(dueDate) : null,
        assigneeId: assigneeId || null,
        tags: tags || []
      },
      include: {
        assignee: { select: { id: true, name: true } },
        subtasks: true
      }
    });

    // Notify Socket.io
    const column = await prisma.column.findUnique({ where: { id: columnId }, include: { project: true } });
    if (column) {
      const io = getIo();
      io.to(`project_${column.projectId}`).emit('taskCreated', task);
      
      if (assigneeId) {
        const notif = await prisma.notification.create({
          data: {
            userId: assigneeId,
            type: 'task_assigned',
            title: 'New Task Assigned',
            message: `You have been assigned to "${task.title}" in project "${column.project.name}"`
          }
        });

        io.to(`user_${assigneeId}`).emit('notification', {
          id: notif.id,
          type: notif.type,
          title: notif.title,
          message: notif.message,
          time: notif.createdAt.toLocaleTimeString(),
        });
      }
    }

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
};

export const moveTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.taskId as string;
    const { targetColumnId, newOrder } = req.body;

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const sourceColumnId = task.columnId;

    // Shift orders in the new column
    if (sourceColumnId === targetColumnId) {
      // Moving in the same column
      if (task.order < newOrder) {
        await prisma.task.updateMany({
          where: { columnId: targetColumnId, order: { gt: task.order, lte: newOrder } },
          data: { order: { decrement: 1 } }
        });
      } else {
        await prisma.task.updateMany({
          where: { columnId: targetColumnId, order: { gte: newOrder, lt: task.order } },
          data: { order: { increment: 1 } }
        });
      }
    } else {
      // Moving to a different column
      // 1. Shift up tasks in old column
      await prisma.task.updateMany({
        where: { columnId: sourceColumnId, order: { gt: task.order } },
        data: { order: { decrement: 1 } }
      });
      // 2. Shift down tasks in new column
      await prisma.task.updateMany({
        where: { columnId: targetColumnId, order: { gte: newOrder } },
        data: { order: { increment: 1 } }
      });
    }

    // Update task
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { columnId: targetColumnId, order: newOrder },
      include: {
        assignee: { select: { id: true, name: true } },
        subtasks: true
      }
    });

    const column = await prisma.column.findUnique({ where: { id: targetColumnId } });
    if (column) {
      getIo().to(`project_${column.projectId}`).emit('taskMoved', { taskId, sourceColumnId, targetColumnId, newOrder, updatedTask });
    }

    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to move task' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.taskId as string;
    const { title, description, priority, startDate, dueDate, isCompleted, delayReason, assigneeId } = req.body;
    const user = (req as any).user;
    
    const currentTask = await prisma.task.findUnique({ where: { id: taskId }, include: { column: { include: { project: true } } } });
    if (!currentTask) return res.status(404).json({ error: 'Task not found' });

    // Enforce role-based limits: DEVs can only update isCompleted and delayReason
    const isDev = user.role === 'DEV';
    
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { 
        title: !isDev && title !== undefined ? title : undefined,
        description: !isDev && description !== undefined ? description : undefined,
        priority: !isDev && priority !== undefined ? priority : undefined,
        startDate: !isDev && startDate !== undefined ? new Date(startDate) : undefined,
        dueDate: !isDev && dueDate !== undefined ? new Date(dueDate) : undefined,
        assigneeId: !isDev && assigneeId !== undefined ? (assigneeId || null) : undefined,
        
        isCompleted: isCompleted !== undefined ? isCompleted : undefined,
        delayReason: delayReason !== undefined ? delayReason : undefined,
      },
      include: { assignee: true }
    });

    getIo().to(`project_${currentTask.column.projectId}`).emit('taskUpdated', updatedTask);
    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.taskId as string;
    
    const task = await prisma.task.findUnique({ 
      where: { id: taskId },
      include: { column: { include: { project: true } } }
    });
    
    if (!task) return res.status(404).json({ error: 'Task not found' });
    
    await prisma.task.delete({ where: { id: taskId } });
    
    getIo().to(`project_${task.column.projectId}`).emit('taskDeleted', taskId);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

export const createColumn = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.projectId as string;
    const { name } = req.body;
    
    const highestColumn = await prisma.column.findFirst({
      where: { projectId },
      orderBy: { order: 'desc' }
    });
    
    const newOrder = highestColumn ? highestColumn.order + 1 : 0;
    
    const column = await prisma.column.create({
      data: { name, projectId, order: newOrder },
      include: { tasks: true }
    });
    
    getIo().to(`project_${projectId}`).emit('columnCreated', column);
    res.status(201).json(column);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create column' });
  }
};

export const updateColumn = async (req: Request, res: Response) => {
  try {
    const columnId = req.params.columnId as string;
    const { name } = req.body;
    
    const column = await prisma.column.update({
      where: { id: columnId },
      data: { name },
      include: { tasks: true }
    });
    
    getIo().to(`project_${column.projectId}`).emit('columnUpdated', column);
    res.json(column);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update column' });
  }
};

export const deleteColumn = async (req: Request, res: Response) => {
  try {
    const columnId = req.params.columnId as string;
    
    const column = await prisma.column.findUnique({ where: { id: columnId } });
    if (!column) return res.status(404).json({ error: 'Column not found' });
    
    await prisma.column.delete({ where: { id: columnId } });
    
    getIo().to(`project_${column.projectId}`).emit('columnDeleted', columnId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete column' });
  }
};

export const moveColumn = async (req: Request, res: Response) => {
  try {
    const columnId = req.params.columnId as string;
    const { newOrder } = req.body;

    const column = await prisma.column.findUnique({ where: { id: columnId } });
    if (!column) return res.status(404).json({ error: 'Column not found' });

    if (column.order === newOrder) {
      return res.json(column);
    }

    if (column.order > newOrder) {
      // Moving up (lower order)
      await prisma.column.updateMany({
        where: { projectId: column.projectId, order: { gte: newOrder, lt: column.order } },
        data: { order: { increment: 1 } }
      });
    } else {
      // Moving down (higher order)
      await prisma.column.updateMany({
        where: { projectId: column.projectId, order: { gt: column.order, lte: newOrder } },
        data: { order: { decrement: 1 } }
      });
    }

    const updatedColumn = await prisma.column.update({
      where: { id: columnId },
      data: { order: newOrder },
      include: { tasks: true }
    });

    getIo().to(`project_${column.projectId}`).emit('columnMoved', { columnId, newOrder, updatedColumn });
    res.json(updatedColumn);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to move column' });
  }
};
