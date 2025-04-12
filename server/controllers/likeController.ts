import { Response } from 'express';
import { Like } from '../database';
import { AuthenticatedRequest } from '../api/authenticateToken';

export class LikeController {
  async likeTweet(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const { tweetId } = req.body;
    const userId = req.user?.userId;

    if (!userId || !tweetId) {
      throw { status: 400, message: 'Fehlende Angaben' };
    }

    const existing = await Like.findOne({ where: { userId, tweetId } });
    if (existing) {
      return res.status(200).json({ message: 'Tweet bereits geliked', liked: false });
    }

    await Like.create({ userId, tweetId });
    return res.status(201).json({ message: 'Beitrag geliked', liked: true });
  }

  async unlikeTweet(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const { tweetId } = req.body;
    const userId = req.user?.userId;

    if (!userId || !tweetId) {
      throw { status: 400, message: 'Fehlende Angaben' };
    }

    const like = await Like.findOne({ where: { userId, tweetId } });
    if (!like) throw { status: 404, message: 'Like nicht gefunden', liked: false };

    await like.destroy();
    return res.status(200).json({ message: 'Like entfernt', liked: false });
  }

  async likeComment(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const { commentId } = req.body;
    const userId = req.user?.userId;

    if (!userId || !commentId) {
      throw { status: 400, message: 'Fehlende Angaben' };
    }

    const existing = await Like.findOne({ where: { userId, commentId } });
    if (existing) {
      return res.status(200).json({ message: 'Kommentar bereits geliked', liked: false });
    }

    await Like.create({ userId, commentId });
    return res.status(201).json({ message: 'Kommentar geliked', liked: true });
  }

  async unlikeComment(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const { commentId } = req.body;
    const userId = req.user?.userId;

    if (!userId || !commentId) {
      throw { status: 400, message: 'Fehlende Angaben' };
    }

    const like = await Like.findOne({ where: { userId, commentId } });
    if (!like) throw { status: 404, message: 'Like nicht gefunden', liked: false };

    await like.destroy();
    return res.status(200).json({ message: 'Kommentar-Like entfernt', liked: false });
  }
}
