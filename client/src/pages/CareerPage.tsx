import React, { useState, useEffect } from 'react';
import { ArrowRight, MapPin, Briefcase, CheckCircle2, X, Upload } from 'lucide-react';
import { careerService } from '../services/careerService';
import { Career } from '../types';

export const CareerPage: React.FC = () => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);

  // Application Modal state
  const [selectedJob, setSelectedJob] = useState<Career | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ success?: boolean; message?: string }>({});

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const data = await careerService.getAll();
        setCareers(data);
      } catch (err) {
        console.error('Error fetching careers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCareers();
  }, []);

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    setSubmitting(true);
    setSubmitStatus({});

    try {
      const res = await careerService.apply({
        careerId: selectedJob._id,
        jobTitle: selectedJob.title,
        fullName,
        email,
        phone,
        resumeUrl,
        portfolioUrl,
        coverLetter,
      });

      setSubmitStatus({
        success: true,
        message: res.message || 'Application submitted successfully! Our talent team will review your application.',
      });

      // Clear form
      setTimeout(() => {
        setSelectedJob(null);
        setFullName('');
        setEmail('');
        setPhone('');
        setResumeUrl('');
        setPortfolioUrl('');
        setCoverLetter('');
        setSubmitStatus({});
      }, 2500);
    } catch (err: any) {
      setSubmitStatus({
        success: false,
        message: err.message || 'Submission failed. Please check your inputs.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#FAF8F5] pb-24">
      {/* 1. CAREER HERO BANNER (Pixel-matched from reference Image 1) */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#F0ECE4] via-[#F4EFEB] to-[#EBE4D8] border-b border-[#EDE8E1] py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <span className="text-xs font-semibold tracking-widest text-[#3F6352] uppercase">
              Careers at Hydra
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-medium text-[#13382B] leading-tight">
              Join Our Team
            </h1>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Grow with Hydra. Be a part of our innovative journey redefining clean botanical
              dermatology across India and beyond.
            </p>
            <div className="pt-2">
              <a
                href="#openings"
                className="inline-flex items-center gap-2 px-7 py-3 bg-[#13382B] text-white rounded-full text-xs font-semibold hover:bg-[#1E4D3B] transition-colors shadow-md"
              >
                <span>Explore Careers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Boardroom with lush botanical office aesthetic matching reference */}
          <div className="relative w-56 sm:w-72 h-44 sm:h-56 rounded-3xl overflow-hidden shadow-xl border-4 border-white flex-shrink-0 flex items-center justify-center bg-white p-3">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=700&q=80"
              alt="Hydra Collaborative Headquarters"
              className="w-full h-full object-cover rounded-2xl"
            />
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-[#13382B] shadow-sm">
              Build • Innovate • Grow
            </div>
          </div>
        </div>
      </section>

      {/* 2. CURRENT OPENINGS SECTION (Pixel-matched from reference Image 1) */}
      <section id="openings" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="mb-10 pb-4 border-b border-[#EDE8E1]">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#13382B]">
            Current Openings
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Explore active positions across our engineering, product, and laboratory teams.
          </p>
        </div>

        {/* Job Cards */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 bg-white rounded-2xl animate-pulse border border-[#EDE8E1]" />
            ))}
          </div>
        ) : careers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {careers.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-3xl p-6 border border-[#EDE8E1] shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 bg-[#EAF1EB] text-[#2E6B48] rounded-full">
                      {job.department}
                    </span>
                    <span className="text-[11px] text-gray-400">{job.type}</span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#13382B] leading-snug">
                    {job.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span>{job.location}</span>
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                    {job.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-gray-100 mt-6">
                  <button
                    onClick={() => {
                      setSelectedJob(job);
                      setSubmitStatus({});
                    }}
                    className="w-full py-2.5 bg-[#FAF8F5] hover:bg-[#13382B] text-[#13382B] hover:text-white border border-[#EDE8E1] rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 group"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#EDE8E1]">
            <p className="text-sm text-gray-500">No open positions at this moment. Check back soon!</p>
          </div>
        )}
      </section>

      {/* 3. INTERACTIVE APPLICATION MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-[#EDE8E1] shadow-2xl relative animate-scale-in">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-6 right-6 p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-[11px] font-bold text-[#2E6B48] uppercase tracking-wider">
                Application Form
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#13382B] mt-1">
                Apply for {selectedJob.title}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {selectedJob.department} • {selectedJob.location}
              </p>
            </div>

            {submitStatus.success ? (
              <div className="p-6 bg-[#EAF1EB] text-[#2E6B48] rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto" />
                <p className="font-serif text-base font-bold">Application Received!</p>
                <p className="text-xs">{submitStatus.message}</p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-[#EDE8E1] rounded-xl focus:outline-none focus:border-[#13382B]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rahul@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs border border-[#EDE8E1] rounded-xl focus:outline-none focus:border-[#13382B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs border border-[#EDE8E1] rounded-xl focus:outline-none focus:border-[#13382B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Resume / CV Link (Google Drive / Dropbox / LinkedIn PDF) *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://drive.google.com/your-resume-link"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-[#EDE8E1] rounded-xl focus:outline-none focus:border-[#13382B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Portfolio / GitHub / LinkedIn (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/username or your-portfolio.com"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-[#EDE8E1] rounded-xl focus:outline-none focus:border-[#13382B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Why do you want to build Hydra? (Cover Note)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Share what excites you about clean skincare, your past projects, or your impact..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-[#EDE8E1] rounded-xl focus:outline-none focus:border-[#13382B]"
                  />
                </div>

                {submitStatus.message && (
                  <p className="text-xs text-red-600">{submitStatus.message}</p>
                )}

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setSelectedJob(null)}
                    className="px-5 py-2.5 border border-gray-300 rounded-full text-xs font-semibold text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-7 py-2.5 bg-[#13382B] text-white rounded-full text-xs font-semibold hover:bg-[#1E4D3B] disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
