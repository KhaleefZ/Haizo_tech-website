import { Request, Response } from 'express';
import prisma from '../config/db';

export const submitInquiry = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, service, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const inquiry = await prisma.inquiry.create({
      data: { name, email, phone, service, message }
    });

    res.status(201).json(inquiry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit inquiry' });
  }
};

export const getInquiries = async (req: Request, res: Response) => {
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { submissionDate: 'desc' }
    });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
};

export const updateInquiryStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;
    
    if (!['NEW', 'READ', 'REPLIED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: { status }
    });
    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update inquiry status' });
  }
};
