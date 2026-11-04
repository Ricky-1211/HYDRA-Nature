import { Request, Response, NextFunction } from 'express';
import { Career } from '../models/Career';
import { JobApplication } from '../models/JobApplication';
import { ApiError } from '../utils/apiError';

export const getCareers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { department } = req.query;
    const query: any = { isActive: true };

    if (department && department !== 'All') {
      query.department = department;
    }

    const careers = await Career.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: careers.length,
      data: careers,
    });
  } catch (error) {
    next(error);
  }
};

export const getCareerBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;
    const career = await Career.findOne({ slug });

    if (!career) {
      return next(new ApiError('Job opening not found', 404));
    }

    res.status(200).json({
      success: true,
      data: career,
    });
  } catch (error) {
    next(error);
  }
};

export const applyForJob = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { careerId, jobTitle, fullName, email, phone, portfolioUrl, resumeUrl, coverLetter } =
      req.body;

    if (!careerId || !fullName || !email || !phone || !resumeUrl) {
      return next(new ApiError('Please complete all required fields and provide resume link', 400));
    }

    const application = await JobApplication.create({
      career: careerId,
      jobTitle: jobTitle || 'Position at Hydra',
      fullName,
      email,
      phone,
      portfolioUrl,
      resumeUrl,
      coverLetter,
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully. Our talent team will review your profile.',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

export const createCareer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const career = await Career.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Job opening posted successfully',
      data: career,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCareer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const career = await Career.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!career) {
      return next(new ApiError('Job opening not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Job opening updated successfully',
      data: career,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCareer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const career = await Career.findById(id);

    if (!career) {
      return next(new ApiError('Job opening not found', 404));
    }

    await career.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job opening deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getApplications = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const applications = await JobApplication.find()
      .populate('career', 'title department location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await JobApplication.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!application) {
      return next(new ApiError('Application not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Application status updated',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};
