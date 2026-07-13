import { Request, Response } from 'express';
import prisma from '../config/db';

export const getClients = async (req: Request, res: Response) => {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
};

export const createClient = async (req: Request, res: Response) => {
  try {
    const { organization, contactName, email } = req.body;
    const client = await prisma.client.create({
      data: { organization, contactName, email }
    });
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create client' });
  }
};

export const updateClient = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { organization, contactName, email } = req.body;
    const client = await prisma.client.update({
      where: { id },
      data: { organization, contactName, email }
    });
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update client' });
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.client.delete({ where: { id } });
    res.json({ message: 'Client deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete client' });
  }
};
