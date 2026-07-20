import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = { ...err };
  error.message = err.message;

  console.error(err);

  // Resource not found
  if (err.name === 'CastError' || err.code === 'not-found') {
    const message = `Resource not found`;
    return res.status(404).json({ success: false, message });
  }

  // Duplicate entry
  if (err.code === 11000 || err.code === 'already-exists') {
    const message = 'Duplicate field value entered';
    return res.status(400).json({ success: false, message });
  }

  // Validation error
  if (err.name === 'ValidationError' || err.code === 'invalid-argument') {
    const message = err.errors ? Object.values(err.errors).map((val: any) => val.message) : err.message;
    return res.status(400).json({ success: false, message });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
};
