import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authenticateToken';
import { Tweet } from '../database';
import { TweetInstance } from '../types/modelTypes';

export async function requireTweetPermission(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const tweetId = parseInt(req.params.id) || req.body.id;
  const userId = req.user?.userId;
  const roles = req.user?.roles || [];

  if (!userId || isNaN(tweetId)) {
    res.status(400).json({ message: 'Ungültige Anfrage' });
    return;
  }

  const tweet = await Tweet.findByPk(tweetId) as TweetInstance;

  if (!tweet) {
    res.status(404).json({ message: 'Tweet nicht gefunden' });
    return;
  }

  const isOwner = tweet.userId === userId;
  const isModeratorOrAdmin = roles.includes('moderator') || roles.includes('admin');

  if (isOwner || isModeratorOrAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Zugriff verweigert' });
  }
}
