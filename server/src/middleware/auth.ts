import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User, IUser } from '../models/User';
import { ApiError } from '../utils/apiError';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ApiError('Not authorized to access this route. Please log in.', 401));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string; role: string };
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ApiError('User belonging to this token no longer exists.', 401));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError('Invalid or expired authentication token.', 401));
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ApiError(
          `User role '${req.user?.role}' is not authorized to access this resource.`,
          403
        )
      );
    }
    next();
  };
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string; role: string };
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = user;
      }
    } catch (e) {
      // Ignore token verification errors for optional auth
    }
  }
  next();
};
