import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authenticateToken';
import { Comment } from '../database';

export async function requireCommentPermission(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void | Response> {
  const commentId = req.body.id || parseInt(req.params.id);
  const userId = req.user?.userId;
  const roles = req.user?.roles || [];


  if (!userId || !commentId || isNaN(commentId)) {
    return res.status(400).json({ message: 'Ungültige Anfrage' });
  }

  const comment = await Comment.findByPk(commentId);

  if (!comment) {
    return res.status(404).json({ message: 'Kommentar nicht gefunden' });
  }

  const isOwner = comment.userId === userId;
  const isModeratorOrAdmin = roles.includes('moderator') || roles.includes('admin');

  if (isOwner || isModeratorOrAdmin) {
    return next();
  } else {
    return res.status(403).json({ message: 'Zugriff verweigert' });
  }
}
