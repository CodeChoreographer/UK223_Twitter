import { Request, Response } from 'express';
import { Like } from '../database';

export class LikeController {

  async likeTweet(req: Request, res: Response): Promise<void> {
    const { userId, tweetId } = req.body;

    try {
      const like = await Like.create({ userId, tweetId });
      res.status(201).json({ message: 'Tweet liked successfully', like });
    } catch (error) {
      res.status(500).json({ message: 'Error liking tweet', error });
    }
  }

  async unlikeTweet(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      await Like.destroy({ where: { id } });
      res.status(200).json({ message: 'Tweet unliked successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error unliking tweet', error });
    }
  }
}
