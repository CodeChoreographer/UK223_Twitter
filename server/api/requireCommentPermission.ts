import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authenticateToken';
import { Comment } from '../database';
import { CommentInstance } from '../types/modelTypes';

export async function requireCommentPermission(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const commentId = parseInt(req.params.id) || req.body.id;
  const userId = req.user?.userId;
  const roles = req.user?.roles || [];

  if (!userId || !commentId || isNaN(commentId)) {
    res.status(400).json({ message: 'Ungültige Anfrage' });
    return;
  }

  const comment = await Comment.findByPk(commentId) as CommentInstance;

  if (!comment) {
    res.status(404).json({ message: 'Kommentar nicht gefunden' });
    return;
  }

  const isOwner = comment.userId === userId;
  const isModeratorOrAdmin = roles.includes('moderator') || roles.includes('admin');

  if (isOwner || isModeratorOrAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Zugriff verweigert' });
  }
}
