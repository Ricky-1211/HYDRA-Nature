import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { ApiError } from '../utils/apiError';
import mongoose from 'mongoose';

export const getWishlist = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id).populate('wishlist');
    if (!user) {
      return next(new ApiError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      data: user.wishlist,
    });
  } catch (error) {
    next(error);
  }
};

export const addToWishlist = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return next(new ApiError('Product not found', 404));
    }

    const user = await User.findById(req.user?._id);
    if (!user) {
      return next(new ApiError('User not found', 404));
    }

    const alreadyInWishlist = user.wishlist.some(
      (id) => id.toString() === productId.toString()
    );

    if (!alreadyInWishlist) {
      user.wishlist.push(new mongoose.Types.ObjectId(productId));
      await user.save();
    }

    const updatedUser = await User.findById(req.user?._id).populate('wishlist');

    res.status(200).json({
      success: true,
      message: 'Product added to wishlist',
      data: updatedUser?.wishlist,
    });
  } catch (error) {
    next(error);
  }
};

export const removeFromWishlist = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user?._id);
    if (!user) {
      return next(new ApiError('User not found', 404));
    }

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId.toString()
    );
    await user.save();

    const updatedUser = await User.findById(req.user?._id).populate('wishlist');

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
      data: updatedUser?.wishlist,
    });
  } catch (error) {
    next(error);
  }
};
