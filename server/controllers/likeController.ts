import { Like } from '../models/Like';
import { Database } from '../database/database';
import { Request, Response } from 'express';

export class LikeController {
  private db: Database;

  constructor() {
    this.db = new Database();
  }

  async likeTweet(req: Request, res: Response): Promise<void> {
    const { userId, tweetId } = req.body;
    res.status(200).json({ message: 'Tweet liked successfully.' });
  }

  async unlikeTweet(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    res.status(200).json({ message: 'Tweet unliked successfully.' });
  }
}
