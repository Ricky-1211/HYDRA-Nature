import { Request, Response, NextFunction } from 'express';
import { Contact } from '../models/Contact';
import { ApiError } from '../utils/apiError';

export const submitContact = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return next(new ApiError('Please complete all required fields', 400));
    }

    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received. Our skincare advisors will get back to you within 24 hours.',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllContacts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContactStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const contact = await Contact.findByIdAndUpdate(id, { status }, { new: true });
    if (!contact) {
      return next(new ApiError('Inquiry not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Status updated',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};
