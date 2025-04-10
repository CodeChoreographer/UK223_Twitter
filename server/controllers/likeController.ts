import { Response } from 'express';
import { Like } from '../database';
import { AuthenticatedRequest } from '../api/authenticateToken';

export class LikeController {
  async likeTweet(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const { tweetId } = req.body;
    const userId = req.user?.userId;

    if (!userId || !tweetId) {
      return res.status(400).json({ message: 'Fehlende Angaben' });
    }

    try {
      const existing = await Like.findOne({ where: { userId, tweetId } });

      if (existing) {
        return res.status(200).json({ message: 'Tweet bereits geliked', liked: false });
      }

      await Like.create({ userId, tweetId });
      return res.status(201).json({ message: 'Beitrag geliked', liked: true });
    } catch (error) {
      return res.status(500).json({ message: 'Fehler beim Liken', error });
    }
  }

  async unlikeTweet(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const { tweetId } = req.body;
    const userId = req.user?.userId;

    if (!userId || !tweetId) {
      return res.status(400).json({ message: 'Fehlende Angaben' });
    }

    try {
      const like = await Like.findOne({ where: { userId, tweetId } });

      if (!like) {
        return res.status(404).json({ message: 'Like nicht gefunden', liked: false });
      }

      await like.destroy();
      return res.status(200).json({ message: 'Like entfernt', liked: false });
    } catch (error) {
      return res.status(500).json({ message: 'Fehler beim Entfernen des Likes', error });
    }
  }

  async likeComment(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const { commentId } = req.body;
    const userId = req.user?.userId;

    if (!userId || !commentId) {
      return res.status(400).json({ message: 'Fehlende Angaben' });
    }

    try {
      const existing = await Like.findOne({ where: { userId, commentId } });

      if (existing) {
        return res.status(200).json({ message: 'Kommentar bereits geliked', liked: false });
      }

      await Like.create({ userId, commentId });
      return res.status(201).json({ message: 'Kommentar geliked', liked: true });
    } catch (error) {
      return res.status(500).json({ message: 'Fehler beim Liken des Kommentars', error });
    }
  }

  async unlikeComment(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const { commentId } = req.body;
    const userId = req.user?.userId;

    if (!userId || !commentId) {
      return res.status(400).json({ message: 'Fehlende Angaben' });
    }

    try {
      const like = await Like.findOne({ where: { userId, commentId } });

      if (!like) {
        return res.status(404).json({ message: 'Like nicht gefunden', liked: false });
      }

      await like.destroy();
      return res.status(200).json({ message: 'Kommentar-Like entfernt', liked: false });
    } catch (error) {
      return res.status(500).json({ message: 'Fehler beim Entfernen des Kommentar-Likes', error });
    }
  }
}
