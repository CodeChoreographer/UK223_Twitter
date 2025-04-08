import { Comment } from '../models/Comment';
import { Database } from '../database/database';
import { Request, Response } from 'express';

export class CommentController {
  private db: Database;

  constructor() {
    this.db = new Database();
  }

  async addComment(req: Request, res: Response): Promise<void> {
    const { userId, tweetId, content } = req.body;
    const comment = new Comment(0, userId, tweetId, content);
    res.status(201).json({ message: 'Comment added successfully.' });
  }

  async deleteComment(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    res.status(200).json({ message: 'Comment deleted successfully.' });
  }
}
