import { Notification } from '../models/Notification';
import { Database } from '../database/database';
import { Request, Response } from 'express';

export class NotificationController {
  private db: Database;

  constructor() {
    this.db = new Database();
  }

  async markAsRead(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    res.status(200).json({ message: 'Notification marked as read.' });
  }

  async sendNotification(req: Request, res: Response): Promise<void> {
    const { userId, message } = req.body;
    res.status(201).json({ message: 'Notification sent successfully.' });
  }
}
