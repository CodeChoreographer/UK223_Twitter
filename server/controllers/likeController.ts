import { Request, Response } from 'express';
import { Like } from '../database';

export class LikeController {
  async likeTweet(req: Request, res: Response): Promise<Response> {
    const { userId, tweetId } = req.body;

    try {
      const existing = await Like.findOne({ where: { userId, tweetId } });

      if (existing) {
        return res.status(200).json({ message: 'Tweet bereits geliked', like: existing });
      }

      const like = await Like.create({ userId, tweetId });
      return res.status(201).json({ message: 'Beitrag geliked', like });
    } catch (error) {
      return res.status(500).json({ message: 'Fehler beim Liken', error });
    }
  }

  async unlikeTweet(req: Request, res: Response): Promise<Response> {
    const { userId, tweetId } = req.body;

    try {
      const like = await Like.findOne({ where: { userId, tweetId } });

      if (!like) return res.status(404).json({ message: 'Like nicht gefunden' });

      await like.destroy();
      return res.status(200).json({ message: 'Like entfernt' });
    } catch (error) {
      return res.status(500).json({ message: 'Fehler beim Entfernen des Likes', error });
    }
  }
}
