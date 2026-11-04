import mongoose, { Document, Schema } from 'mongoose';
import { IAddress } from './User';

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IAddress;
  paymentMethod: 'razorpay' | 'cod' | 'card';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentDetails?: {
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
  };
  subtotal: number;
  shippingFee: number;
  discount: number;
  couponCode?: string;
  tax: number;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  trackingNumber?: string;
  trackingHistory: {
    status: string;
    message: string;
    timestamp: Date;
  }[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, required: true },
  size: { type: String },
});

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [OrderItemSchema],
    shippingAddress: {
      fullName: { type: String, required: true },
      street: { type: String, required: true },
      apartment: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: 'India' },
      phone: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ['razorpay', 'cod', 'card'],
      default: 'razorpay',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentDetails: {
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,
    },
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    couponCode: { type: String },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    trackingNumber: { type: String },
    trackingHistory: [
      {
        status: String,
        message: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    notes: { type: String },
  },
  {
    timestamps: true,
  }
);

OrderSchema.index({ user: 1, createdAt: -1 });

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
