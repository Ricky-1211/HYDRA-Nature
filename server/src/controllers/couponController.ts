import { Request, Response, NextFunction } from 'express';
import { Coupon } from '../models/Coupon';
import { ApiError } from '../utils/apiError';

// Validate coupon code against subtotal
export const validateCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { code, subtotal } = req.body;

    if (!code) {
      return next(new ApiError('Coupon code is required', 400));
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase().trim(),
      isActive: true,
      expiresAt: { $gt: new Date() },
    });

    if (!coupon) {
      return next(new ApiError('Invalid or expired coupon code', 400));
    }

    const cartSubtotal = Number(subtotal || 0);
    if (cartSubtotal < coupon.minOrderValue) {
      return next(
        new ApiError(
          `This coupon requires a minimum cart value of ₹${coupon.minOrderValue}`,
          400
        )
      );
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (cartSubtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    res.status(200).json({
      success: true,
      message: `Coupon '${coupon.code}' applied successfully!`,
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountCalculated: Math.round(discount),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCoupons = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: coupons,
    });
  } catch (error) {
    next(error);
  }
};

export const createCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { code, discountType, discountValue, minOrderValue, maxDiscount, expiresAt } = req.body;

    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return next(new ApiError('A coupon with this code already exists', 400));
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      minOrderValue: Number(minOrderValue || 0),
      maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
      expiresAt: new Date(expiresAt),
    });

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: coupon,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return next(new ApiError('Coupon not found', 404));
    }

    await coupon.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
