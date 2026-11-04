import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error('Error encountered:', err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id: ${err.value}`;
    error = new ApiError(message, 404);
  }

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate value entered for ${field}. Please use another value.`;
    error = new ApiError(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val: any) => val.message)
      .join(', ');
    error = new ApiError(message, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError('Invalid authentication token', 401);
  }
  if (err.name === 'TokenExpiredError') {
    error = new ApiError('Authentication token has expired', 401);
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: [${req.method}] ${req.originalUrl}`,
  });
};
