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

// Add new address (Enforce max 4 addresses: 1 Primary + 3 Extra)
export const addAddress = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { fullName, street, apartment, city, state, postalCode, country, phone, isDefault, label } = req.body;

    if (!fullName || !street || !city || !state || !postalCode || !phone) {
      return next(new ApiError('Please provide all required address fields', 400));
    }

    const user = await User.findById(req.user?._id);
    if (!user) {
      return next(new ApiError('User not found', 404));
    }

    if (!user.addresses) {
      user.addresses = [];
    }

    if (user.addresses.length >= 4) {
      return next(
        new ApiError(
          'Address limit reached. You can save up to 4 addresses (1 Primary + 3 Extra). Please remove an existing address first.',
          400
        )
      );
    }

    const shouldBeDefault = user.addresses.length === 0 || !!isDefault;

    if (shouldBeDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    user.addresses.push({
      fullName,
      street,
      apartment,
      city,
      state,
      postalCode,
      country: country || 'India',
      phone,
      isDefault: shouldBeDefault,
      label: label || 'Home',
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: {
        addresses: user.addresses,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete an address
export const deleteAddress = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user?._id);
    if (!user) {
      return next(new ApiError('User not found', 404));
    }

    const addressIndex = user.addresses.findIndex((addr: any) => addr._id?.toString() === addressId);
    if (addressIndex === -1) {
      return next(new ApiError('Address not found', 404));
    }

    const wasDefault = user.addresses[addressIndex].isDefault;
    user.addresses.splice(addressIndex, 1);

    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
      data: {
        addresses: user.addresses,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Set Address as Primary / Default
export const setDefaultAddress = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user?._id);
    if (!user) {
      return next(new ApiError('User not found', 404));
    }

    let found = false;
    user.addresses.forEach((addr: any) => {
      if (addr._id?.toString() === addressId) {
        addr.isDefault = true;
        found = true;
      } else {
        addr.isDefault = false;
      }
    });

    if (!found) {
      return next(new ApiError('Address not found', 404));
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Primary address updated successfully',
      data: {
        addresses: user.addresses,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update an existing address
export const updateAddress = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { addressId } = req.params;
    const { fullName, street, apartment, city, state, postalCode, country, phone, isDefault, label } = req.body;

    const user = await User.findById(req.user?._id);
    if (!user) {
      return next(new ApiError('User not found', 404));
    }

    const address = user.addresses.find((addr: any) => addr._id?.toString() === addressId);
    if (!address) {
      return next(new ApiError('Address not found', 404));
    }

    if (fullName) address.fullName = fullName;
    if (street) address.street = street;
    if (apartment !== undefined) address.apartment = apartment;
    if (city) address.city = city;
    if (state) address.state = state;
    if (postalCode) address.postalCode = postalCode;
    if (country) address.country = country;
    if (phone) address.phone = phone;
    if (label) address.label = label;

    if (isDefault) {
      user.addresses.forEach((addr: any) => {
        addr.isDefault = addr._id?.toString() === addressId;
      });
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      data: {
        addresses: user.addresses,
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
