import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authenticateToken';
import { User } from '../database';

export async function requireProfilePermission(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void | Response> {
  const targetUserId = parseInt(req.params.id) || req.body.userId;
  const currentUserId = req.user?.userId;
  const roles = req.user?.roles || [];

  if (!currentUserId || isNaN(targetUserId)) {
    return res.status(400).json({ message: 'Ungültige Anfrage' });
  }

  const isOwner = targetUserId === currentUserId;
  const isAdmin = roles.includes('admin');

  if (isOwner || isAdmin) {
    next();
  } else {
    return res.status(403).json({ message: 'Zugriff verweigert' });
  }
}
