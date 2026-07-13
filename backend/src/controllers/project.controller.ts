import { Request, Response } from 'express';
import prisma from '../config/db';

export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      include: { 
        client: true,
        columns: {
          include: {
            tasks: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const calculatedProjects = projects.map(project => {
      let totalTasks = 0;
      let completedTasks = 0;

      project.columns.forEach(col => {
        totalTasks += col.tasks.length;
        col.tasks.forEach(task => {
          if (task.isCompleted || col.name.toLowerCase() === 'done') {
            completedTasks++;
          }
        });
      });

      let progress = project.progress;
      let status = project.status;

      if (totalTasks > 0) {
        progress = Math.round((completedTasks / totalTasks) * 100);
        if (completedTasks === 0) {
          status = 'Planning';
        } else if (completedTasks === totalTasks) {
          status = 'Completed';
        } else {
          status = 'In Progress';
        }
      }

      const { columns, ...projectWithoutColumns } = project;

      return {
        ...projectWithoutColumns,
        progress,
        status,
        stats: { totalTasks, completedTasks }
      };
    });

    res.json(calculatedProjects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.projectId as string;
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        client: true,
        columns: {
          include: {
            tasks: {
              include: {
                assignee: { select: { id: true, name: true, role: true } },
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
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, description, clientId, status, progress, budget, startDate, endDate } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const project = await prisma.project.create({
      data: { 
        name, 
        description, 
        clientId,
        status: status || undefined,
        progress: progress ? parseInt(progress, 10) : undefined,
        budget: budget || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null
      }
    });

    // Create default Kanban columns for the new project
    await prisma.column.createMany({
      data: [
        { name: 'To Do', order: 0, projectId: project.id },
        { name: 'In Progress', order: 1, projectId: project.id },
        { name: 'In Review', order: 2, projectId: project.id },
        { name: 'Done', order: 3, projectId: project.id },
      ]
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, description, clientId, status, progress, budget, startDate, endDate } = req.body;
    
    // Build update data conditionally
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (clientId !== undefined) updateData.clientId = clientId;
    if (status !== undefined) updateData.status = status;
    if (progress !== undefined) updateData.progress = parseInt(progress, 10);
    if (budget !== undefined) updateData.budget = budget;
    if (startDate !== undefined) updateData.startDate = startDate ? new Date(startDate) : null;
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null;
    
    const project = await prisma.project.update({
      where: { id },
      data: updateData
    });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.project.delete({ where: { id } });
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

export const initKanbanBoard = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id as string;
    
    // Check if columns already exist
    const existingColumns = await prisma.column.count({ where: { projectId } });
    if (existingColumns > 0) {
      return res.status(400).json({ error: 'Columns already initialized' });
    }

    await prisma.column.createMany({
      data: [
        { name: 'To Do', order: 0, projectId: projectId },
        { name: 'In Progress', order: 1, projectId: projectId },
        { name: 'In Review', order: 2, projectId: projectId },
        { name: 'Done', order: 3, projectId: projectId },
      ]
    });
    
    res.json({ message: 'Kanban columns initialized' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to initialize kanban board' });
  }
};
