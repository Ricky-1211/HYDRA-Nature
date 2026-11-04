import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';

interface Review {
  _id: string;
  user: { name: string; email: string } | null;
  product: { name: string } | null;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

const AdminReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await adminService.getReviews();
      setReviews(res.data?.reviews || res.reviews || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    try {
      setDeletingId(id);
      await adminService.deleteReview(id);
      setReviews(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = filter === 'all' ? reviews
    : filter === 'approved' ? reviews.filter(r => r.isApproved)
    : reviews.filter(r => !r.isApproved);

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <svg key={star} className={`w-3.5 h-3.5 ${star <= rating ? 'text-amber-400' : 'text-gray-200'}`}
          fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-playfair font-bold text-hydra-dark">Review Management</h1>
          <p className="text-hydra-muted text-sm mt-1">Monitor and moderate customer reviews</p>
        </div>
        <span className="text-sm text-hydra-muted bg-hydra-cream px-3 py-1 rounded-full">
          {filtered.length} reviews
        </span>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'approved', 'pending'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
              filter === f ? 'bg-hydra-dark text-white' : 'bg-white text-hydra-muted border border-gray-200 hover:border-hydra-dark'
            }`}>
            {f}
          </button>
        ))}
      </div>

      {/* Reviews Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-hydra-dark border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-gray-100 text-hydra-muted">
          <svg className="w-12 h-12 mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          <p>No reviews found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(review => (
            <div key={review._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-hydra-dark text-sm">{review.user?.name || 'Anonymous'}</p>
                  <p className="text-xs text-hydra-muted">{review.user?.email}</p>
                </div>
                <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${
                  review.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {review.isApproved ? 'Approved' : 'Pending'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <StarRating rating={review.rating} />
                <span className="text-xs text-hydra-muted">({review.rating}/5)</span>
              </div>

              <p className="text-sm text-hydra-muted leading-relaxed line-clamp-3">{review.comment}</p>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-hydra-muted">
                    on <span className="font-medium text-hydra-dark">{review.product?.name || 'Unknown Product'}</span>
                  </p>
                  <p className="text-xs text-hydra-muted mt-0.5">{new Date(review.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
                <button
                  onClick={() => handleDelete(review._id)}
                  disabled={deletingId === review._id}
                  className="text-xs border border-red-200 text-red-500 rounded-xl px-3 py-1.5 hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  {deletingId === review._id ? '…' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviewsPage;
