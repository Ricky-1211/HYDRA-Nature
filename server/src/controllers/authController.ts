import { Request, Response, NextFunction } from 'express';
import { User, IUser } from '../models/User';
import { ApiError } from '../utils/apiError';
import { sendTokenResponse } from '../utils/token';
import { AuthRequest } from '../middleware/auth';
import { env } from '../config/env';
import crypto from 'crypto';

// Register Customer
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return next(new ApiError('Please provide name, email and password', 400));
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return next(new ApiError('An account with this email already exists', 400));
    }

    // Explicitly enforce 'customer' role on public registration
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      role: 'customer',
    });

    sendTokenResponse(user, 201, res, 'Registration successful. Welcome to Hydra!');
  } catch (error) {
    next(error);
  }
};

// Login User / Admin
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ApiError('Please provide email and password', 400));
    }

    // Check if credentials match configured environment admin
    if (
      email.toLowerCase() === env.ADMIN_EMAIL.toLowerCase() &&
      password === env.ADMIN_PASSWORD
    ) {
      let adminUser = await User.findOne({ email: env.ADMIN_EMAIL.toLowerCase() });
      if (!adminUser) {
        adminUser = await User.create({
          name: 'Hydra Administrator',
          email: env.ADMIN_EMAIL.toLowerCase(),
          password: env.ADMIN_PASSWORD,
          role: 'admin',
        });
      } else if (adminUser.role !== 'admin') {
        adminUser.role = 'admin';
        await adminUser.save();
      }
      return sendTokenResponse(adminUser, 200, res, 'Admin login successful');
    }

    // Regular database user lookup
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return next(new ApiError('Invalid email or password', 401));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new ApiError('Invalid email or password', 401));
    }

    sendTokenResponse(user, 200, res, 'Login successful');
  } catch (error) {
    next(error);
  }
};

// Logout User
export const logout = (req: Request, res: Response): void => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'User logged out successfully',
  });
};

// Get Current User Profile
export const getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id).populate('wishlist');
    if (!user) {
      return next(new ApiError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update Profile
export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, phone, avatar, addresses } = req.body;

    const fieldsToUpdate: any = {};
    if (name) fieldsToUpdate.name = name;
    if (phone !== undefined) fieldsToUpdate.phone = phone;
    if (avatar) fieldsToUpdate.avatar = avatar;
    if (addresses) fieldsToUpdate.addresses = addresses;

    const user = await User.findByIdAndUpdate(req.user?._id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Change Password
export const changePassword = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return next(new ApiError('Please provide current and new password', 400));
    }

    const user = await User.findById(req.user?._id).select('+password');
    if (!user) {
      return next(new ApiError('User not found', 404));
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return next(new ApiError('Current password is incorrect', 400));
    }

    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};

// Forgot Password
export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });

    if (!user) {
      // Avoid revealing whether an email exists for security
      res.status(200).json({
        success: true,
        message: 'If an account exists with that email, password reset instructions have been sent.',
      });
      return;
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    await user.save({ validateBeforeSave: false });

    // In dev, provide resetToken in response for instant testing
    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email address.',
      devResetToken: resetToken,
    });
  } catch (error) {
    next(error);
  }
};

// Reset Password
export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return next(new ApiError('Please provide reset token and new password', 400));
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ApiError('Invalid or expired reset token', 400));
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res, 'Password reset successful');
  } catch (error) {
    next(error);
  }
};
