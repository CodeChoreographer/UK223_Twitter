import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authenticateToken';

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ message: 'Zugriff verweigert. Nicht eingeloggt.' });
    return;
  }

  next();
}
