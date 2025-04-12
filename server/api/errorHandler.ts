import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('❌ Fehler im Backend:', err);

  const statusCode = err.status || 500;

  res.status(statusCode).json({
    message: err.message || 'Interner Serverfehler',
  });
}
