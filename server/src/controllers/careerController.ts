import { Request, Response, NextFunction } from 'express';
import { Career } from '../models/Career';
import { JobApplication } from '../models/JobApplication';
import { ApiError } from '../utils/apiError';

// Helper to normalize string arrays
const parseStringArray = (input: any): string[] => {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof input === 'string') {
    return input
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
};

export const getCareers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { department, all } = req.query;
    const query: any = {};

    // Only filter by isActive if not explicitly requesting all (e.g. admin)
    if (String(all) !== 'true') {
      query.isActive = true;
    }

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
    let career = await Career.findOne({ slug });

    // Fallback: search by id if not found by slug
    if (!career && slug.match(/^[0-9a-fA-F]{24}$/)) {
      career = await Career.findById(slug);
    }

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

export const uploadResume = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      return next(new ApiError('Please provide a resume document (PDF, DOC, DOCX, PNG, JPG)', 400));
    }

    const host = req.get('host') || 'localhost:5012';
    const fullUrl = `${req.protocol}://${host}/uploads/resumes/${req.file.filename}`;
    const relativeUrl = `/uploads/resumes/${req.file.filename}`;

    res.status(200).json({
      success: true,
      resumeUrl: fullUrl,
      relativeUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
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
    const {
      careerId,
      jobTitle,
      fullName,
      email,
      phone,
      portfolioUrl,
      resumeUrl,
      coverLetter,
    } = req.body;

    if (!careerId || !fullName || !email || !phone || !resumeUrl) {
      return next(
        new ApiError('Please complete all required fields and upload or provide your resume', 400)
      );
    }

    let resolvedTitle = jobTitle;
    if (!resolvedTitle) {
      const career = await Career.findById(careerId);
      resolvedTitle = career ? career.title : 'Hydra Team Opening';
    }

    const application = await JobApplication.create({
      career: careerId,
      jobTitle: resolvedTitle,
      fullName: String(fullName).trim(),
      email: String(email).trim().toLowerCase(),
      phone: String(phone).trim(),
      portfolioUrl: portfolioUrl ? String(portfolioUrl).trim() : undefined,
      resumeUrl: String(resumeUrl).trim(),
      coverLetter: coverLetter ? String(coverLetter).trim() : undefined,
      status: 'Received',
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! Our talent team will review your profile.',
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
    const {
      title,
      department,
      location,
      type,
      experience,
      description,
      responsibilities,
      requirements,
      benefits,
      isActive,
    } = req.body;

    if (!title || !department || !description) {
      return next(new ApiError('Title, department, and description are required', 400));
    }

    const career = await Career.create({
      title: String(title).trim(),
      department: String(department).trim(),
      location: location ? String(location).trim() : 'Bhubaneswar, India / Hybrid',
      type: type || 'Full-time',
      experience: experience || '2-4 Years',
      description: String(description).trim(),
      responsibilities: parseStringArray(responsibilities),
      requirements: parseStringArray(requirements),
      benefits: benefits && benefits.length > 0 ? parseStringArray(benefits) : undefined,
      isActive: isActive !== false,
    });

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
    const updateData: any = { ...req.body };

    if (updateData.responsibilities) {
      updateData.responsibilities = parseStringArray(updateData.responsibilities);
    }
    if (updateData.requirements) {
      updateData.requirements = parseStringArray(updateData.requirements);
    }
    if (updateData.benefits) {
      updateData.benefits = parseStringArray(updateData.benefits);
    }

    const career = await Career.findByIdAndUpdate(id, updateData, {
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
    const { careerId } = req.query;
    const query: any = {};

    if (careerId) {
      query.career = careerId;
    }

    const applications = await JobApplication.find(query)
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
      { new: true, runValidators: true }
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

export const deleteApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const application = await JobApplication.findByIdAndDelete(id);

    if (!application) {
      return next(new ApiError('Application not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Application deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
