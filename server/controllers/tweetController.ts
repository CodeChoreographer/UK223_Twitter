import { Tweet } from '../models/Tweet';
import { Database } from '../database/database';
import { Request, Response } from 'express';

export class TweetController {
  private db: Database;

  constructor() {
    this.db = new Database();
  }

  async createTweet(req: Request, res: Response): Promise<void> {
    const { userId, content } = req.body;
    const tweet = new Tweet(0, userId, content);
    res.status(201).json({ message: 'Tweet created successfully.' });
  }

  async editTweet(req: Request, res: Response): Promise<void> {
    const { id, content } = req.body;
    res.status(200).json({ message: 'Tweet edited successfully.' });
  }

  async deleteTweet(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    res.status(200).json({ message: 'Tweet deleted successfully.' });
  }
}
