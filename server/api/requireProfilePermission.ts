import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authenticateToken';
import { UserInstance } from '../types/modelTypes';

export async function requireProfilePermission(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const targetUserId = parseInt(req.params.id) || req.body.userId;
  const currentUserId = req.user?.userId;
  const roles = req.user?.roles || [];

  if (!currentUserId || isNaN(targetUserId)) {
    res.status(400).json({ message: 'Ungültige Anfrage' });
    return;
  }

  const isOwner = targetUserId === currentUserId;
  const isAdmin = roles.includes('admin');

  if (isOwner || isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Zugriff verweigert' });
  }
}
