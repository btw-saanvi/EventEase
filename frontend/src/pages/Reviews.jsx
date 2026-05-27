import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Star, Trash2, Edit3, X, MessageSquare } from "lucide-react";
import api from "../lib/api";
import { toast } from "sonner";

function StarRating({ value, onChange, readonly = false }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={`transition-transform ${!readonly ? "hover:scale-110 cursor-pointer" : "cursor-default"}`}
        >
          <Star
            className={`w-6 h-6 transition-colors ${
              star <= (hover || value)
                ? "fill-yellow-400 text-yellow-400"
                : "text-slate-600"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewModal({ review, onClose, onSave }) {
  const [form, setForm] = useState(
    review || { vendorName: "", title: "", body: "", rating: 5 }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.vendorName || !form.body) return toast.error("Vendor name and review are required");
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl font-bold text-white">{review ? "Edit Review" : "Write Review"}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Vendor Name *</label>
            <input
              id="review-vendor"
              type="text"
              value={form.vendorName}
              onChange={(e) => setForm({ ...form, vendorName: e.target.value })}
              placeholder="e.g. Royal Caterers"
              className="vapor-input w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Rating</label>
            <StarRating value={form.rating} onChange={(r) => setForm({ ...form, rating: r })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Review Title</label>
            <input
              id="review-title"
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Summarize your experience"
              className="vapor-input w-full"
              maxLength={100}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Your Review *</label>
            <textarea
              id="review-body"
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              placeholder="Share your experience with this vendor..."
              rows={4}
              className="vapor-input w-full resize-none"
              required
              maxLength={1000}
            />
            <div className="text-xs text-slate-500 text-right mt-1">{form.body.length}/1000</div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-vapor flex-1 py-2.5">Cancel</button>
            <button type="submit" className="btn-vapor-solid flex-1 py-2.5">{review ? "Save Changes" : "Submit Review"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Reviews() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editReview, setEditReview] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["reviews"],
    queryFn: () => api.get("/reviews").then((r) => r.data),
  });

  const reviews = data?.reviews || [];

  const createMutation = useMutation({
    mutationFn: (d) => api.post("/reviews", d),
    onSuccess: () => { queryClient.invalidateQueries(["reviews"]); toast.success("Review submitted!"); setShowModal(false); },
    onError: () => toast.error("Failed to submit review"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/reviews/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries(["reviews"]); toast.success("Review updated!"); setEditReview(null); },
    onError: () => toast.error("Failed to update review"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/reviews/${id}`),
    onSuccess: () => { queryClient.invalidateQueries(["reviews"]); toast.success("Review deleted"); },
    onError: () => toast.error("Failed to delete"),
  });

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-white mb-1">My Reviews</h1>
          <p className="text-slate-400">Your vendor reviews and ratings</p>
        </div>
        <button id="write-review-btn" onClick={() => setShowModal(true)} className="btn-vapor-solid flex items-center gap-2 px-5 py-2.5">
          <Plus className="w-4 h-4" /> Write Review
        </button>
      </div>

      {/* Stats */}
      {reviews.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="stat-card text-center">
            <div className="text-3xl font-heading font-bold text-vapor-lavender">{reviews.length}</div>
            <div className="text-xs text-slate-400">Reviews Written</div>
          </div>
          <div className="stat-card text-center">
            <div className="text-3xl font-heading font-bold text-yellow-400">{avgRating}</div>
            <div className="text-xs text-slate-400">Average Rating</div>
          </div>
          <div className="stat-card text-center">
            <div className="text-3xl font-heading font-bold text-vapor-cyan">
              {reviews.filter((r) => r.rating >= 4).length}
            </div>
            <div className="text-xs text-slate-400">Positive Reviews</div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="glass-card p-6 h-36 animate-pulse" />)}
        </div>
      ) : reviews.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="font-heading text-xl font-semibold text-slate-300 mb-2">No reviews yet</h3>
          <p className="text-slate-500 mb-6">Share your experience with vendors you've worked with</p>
          <button onClick={() => setShowModal(true)} className="btn-vapor-solid mx-auto flex items-center gap-2 px-6 py-2.5">
            <Plus className="w-4 h-4" /> Write Your First Review
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {reviews.map((review) => (
            <div key={review._id} className="glass-card p-5 group hover:border-vapor-lavender/20 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-heading font-semibold text-white">{review.vendorName}</h3>
                  {review.title && <p className="text-sm text-slate-300 mt-0.5">{review.title}</p>}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button id={`edit-review-${review._id}`} onClick={() => setEditReview(review)} className="p-1.5 text-slate-400 hover:text-vapor-lavender"><Edit3 className="w-4 h-4" /></button>
                  <button id={`delete-review-${review._id}`} onClick={() => deleteMutation.mutate(review._id)} className="p-1.5 text-slate-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <StarRating value={review.rating} readonly />
                <span className="text-sm text-slate-400">{review.rating}/5</span>
                <span className="text-xs text-slate-500 ml-auto">
                  {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>

              <p className="text-sm text-slate-400 leading-relaxed">{review.body}</p>
            </div>
          ))}
        </div>
      )}

      {showModal && <ReviewModal onClose={() => setShowModal(false)} onSave={(d) => createMutation.mutate(d)} />}
      {editReview && <ReviewModal review={editReview} onClose={() => setEditReview(null)} onSave={(d) => updateMutation.mutate({ id: editReview._id, data: d })} />}
    </div>
  );
}
