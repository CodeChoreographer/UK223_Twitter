import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authenticateToken';
import { Tweet } from '../database';

export async function requireTweetPermission(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void | Response> {
  const tweetId = parseInt(req.params.id) || req.body.id;
  const userId = req.user?.userId;
  const roles = req.user?.roles || [];

  if (!userId || isNaN(tweetId)) {
    return res.status(400).json({ message: 'Ungültige Anfrage' });
  }

  const tweet = await Tweet.findByPk(tweetId);

  if (!tweet) {
    return res.status(404).json({ message: 'Tweet nicht gefunden' });
  }

  const isOwner = tweet.userId === userId;
  const isModeratorOrAdmin = roles.includes('moderator') || roles.includes('admin');

  if (isOwner || isModeratorOrAdmin) {
    next();
  } else {
    return res.status(403).json({ message: 'Zugriff verweigert' });
  }
}
