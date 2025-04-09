import { Request, Response } from 'express';
import { Notification } from '../database';

export class NotificationController {

  async sendNotification(req: Request, res: Response): Promise<void> {
    const { userId, message } = req.body;

    try {
      const notification = await Notification.create({ userId, message });
      res.status(201).json({ message: 'Notification sent', notification });
    } catch (error) {
      res.status(500).json({ message: 'Error sending notification', error });
    }
  }

  async markAsRead(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      await Notification.update({ readStatus: true }, { where: { id } });
      res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating notification', error });
    }
  }
}
