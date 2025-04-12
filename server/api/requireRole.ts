import { Response, NextFunction, RequestHandler } from 'express';
import { AuthenticatedRequest } from './authenticateToken';

export function requireRole(...allowedRoles: string[]): RequestHandler {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const userRoles = req.user?.roles || [];

    const hasRole = allowedRoles.some(role => userRoles.includes(role));

    if (!hasRole) {
      res.status(403).json({ message: 'Zugriff verweigert. Rolle fehlt.' });
      return;
    }

    next();
  };
}
