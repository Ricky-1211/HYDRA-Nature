import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Review } from '../models/Review';
import { Product } from '../models/Product';
import { ApiError } from '../utils/apiError';

export const getProductReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

export const createReview = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId } = req.params;
    const { rating, title, comment } = req.body;

    if (!rating || !comment || !title) {
      return next(new ApiError('Please provide rating, title and review comment', 400));
    }

    const product = await Product.findById(productId);
    if (!product) {
      return next(new ApiError('Product not found', 404));
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product: productId,
      user: req.user?._id,
    });

    if (existingReview) {
      existingReview.rating = Number(rating);
      existingReview.title = title;
      existingReview.comment = comment;
      await existingReview.save();
    } else {
      await Review.create({
        product: productId,
        user: req.user?._id,
        rating: Number(rating),
        title,
        comment,
      });
    }

    // Recalculate average rating
    const allReviews = await Review.find({ product: productId });
    const avgRating =
      allReviews.reduce((sum, item) => sum + item.rating, 0) / (allReviews.length || 1);

    product.rating = Number(avgRating.toFixed(1));
    product.reviewCount = allReviews.length;
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: {
        rating: product.rating,
        reviewCount: product.reviewCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);

    if (!review) {
      return next(new ApiError('Review not found', 404));
    }

    const productId = review.product;
    await review.deleteOne();

    // Recalculate product rating
    const allReviews = await Review.find({ product: productId });
    const product = await Product.findById(productId);
    if (product) {
      if (allReviews.length > 0) {
        const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
        product.rating = Number(avg.toFixed(1));
        product.reviewCount = allReviews.length;
      } else {
        product.rating = 5.0;
        product.reviewCount = 0;
      }
      await product.save();
    }

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
