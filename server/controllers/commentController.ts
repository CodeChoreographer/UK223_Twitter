import { Request, Response } from 'express';
import { Comment } from '../database';

export class CommentController {

  async createComment(req: Request, res: Response): Promise<void> {
    const { userId, tweetId, content } = req.body;

    try {
      const comment = await Comment.create({ userId, tweetId, content });
      res.status(201).json({ message: 'Comment created successfully', comment });
    } catch (error) {
      res.status(500).json({ message: 'Error creating comment', error });
    }
  }

  async deleteComment(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      await Comment.destroy({ where: { id } });
      res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting comment', error });
    }
  }
}
