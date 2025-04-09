import { Request, Response } from 'express';
import { Notification } from '../database';

export class NotificationController {

  async getNotifications(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;

    try {
      const notifications = await Notification.findAll({ where: { userId } });
      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching notifications', error });
    }
  }
}
