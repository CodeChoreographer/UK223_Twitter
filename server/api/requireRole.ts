import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authenticateToken';

export function requireRole(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): Response | void => {
    const userRoles = req.user?.roles || [];

    const hasRole = allowedRoles.some(role => userRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({ message: 'Zugriff verweigert. Rolle fehlt.' });
    }

    next();
  };
}
