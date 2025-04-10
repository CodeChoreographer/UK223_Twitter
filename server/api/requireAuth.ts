import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authenticateToken';

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): Response | void {
  if (!req.user) {
    return res.status(401).json({ message: 'Zugriff verweigert. Nicht eingeloggt.' });
  }

  next();
}
