import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { IUser } from '../models/User';

export const generateToken = (userId: string, role: string): string => {
  return jwt.sign({ id: userId, role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });
};

export const sendTokenResponse = (
  user: IUser,
  statusCode: number,
  res: Response,
  message: string = 'Success'
): void => {
  const token = generateToken(user._id.toString(), user.role);

  const cookieExpireDays = parseInt(env.JWT_EXPIRES_IN) || 7;
  const options = {
    expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: (env.NODE_ENV === 'production' ? 'none' : 'lax') as any,
  };

  const userObj = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    phone: user.phone,
    addresses: user.addresses,
    createdAt: user.createdAt,
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      message,
      token,
      data: {
        user: userObj,
      },
    });
};
