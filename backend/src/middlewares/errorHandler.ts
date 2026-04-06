import type { NextFunction, Request, Response } from 'express';

export const notFound = (_req: Request, res: Response) => {
  return res.status(404).json({ message: 'Not Found' });
};

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof Error) {
    return res.status(500).json({ message: err.message });
  }
  return res.status(500).json({ message: 'Internal server error' });
};
