import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { AuthPayload } from '../types/auth';

export interface AuthenticatedRequest extends Request {
  user?: AuthPayload;
}

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
      (req as AuthenticatedRequest).user = decoded;
    } catch (err) {
    }
  }

  next();
}
