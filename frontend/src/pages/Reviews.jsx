import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Star, Trash2, Edit3, X, MessageSquare, Camera } from "lucide-react";
import api from "../lib/api";
import { toast } from "sonner";

function StarRating({ value, onChange, readonly = false }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1.5">
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
                : "text-black/20"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function getReviewImage(vendorName = "", rating = 5) {
  const seedBase = (vendorName || "event-vendor")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const sig = Math.max(1, Math.min(10, Number(rating) || 5));
  return `https://picsum.photos/seed/${seedBase || "event-vendor"}-${sig}/640/400`;
}

function ReviewModal({ review, onClose, onSave }) {
  const [form, setForm] = useState(
    review || { vendorName: "", title: "", body: "", rating: 5, image: "" }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.vendorName || !form.body) return toast.error("Vendor name and review are required");
    onSave(form);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return toast.error("Image must be under 2MB");
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((f) => ({ ...f, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="brutal-card bg-white w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Modal image banner */}
        <div className="relative h-32 border-b-[3px] border-black overflow-hidden bg-oatly-bg">
          <img
            src={form.image || getReviewImage(form.vendorName, form.rating)}
            alt="Vendor preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-end p-4">
            <p className="font-heading text-lg uppercase text-white leading-tight drop-shadow">
              Share honest vendor feedback
            </p>
          </div>
        </div>

        <div className="p-6 md:p-7">
          <div className="flex items-center justify-between mb-5 border-b-2 border-black pb-4">
            <h2 className="font-heading text-2xl text-black uppercase">
              {review ? "Edit Review" : "Write Review"}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 border-2 border-black bg-white hover:bg-oatly-pink transition-colors shadow-[2px_2px_0px_#000]"
            >
              <X className="w-5 h-5 text-black" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-heading uppercase text-black mb-1.5">Vendor Name *</label>
              <input
                id="review-vendor"
                type="text"
                value={form.vendorName}
                onChange={(e) => setForm({ ...form, vendorName: e.target.value })}
                placeholder="e.g. Royal Caterers"
                className="input-brutal w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-heading uppercase text-black mb-1.5">Rating</label>
              <StarRating value={form.rating} onChange={(r) => setForm({ ...form, rating: r })} />
            </div>

            <div>
              <label className="block text-sm font-heading uppercase text-black mb-1.5">Review Title</label>
              <input
                id="review-title"
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Summarize your experience"
                className="input-brutal w-full"
                maxLength={100}
              />
            </div>

            <div>
              <label className="block text-sm font-heading uppercase text-black mb-1.5">Review Image (Optional)</label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="review-image-upload"
                />
                <label
                  htmlFor="review-image-upload"
                  className="btn-brutal bg-white px-4 py-2 text-xs cursor-pointer flex items-center gap-2 shadow-[2px_2px_0px_#000]"
                >
                  <Camera className="w-4 h-4 text-black" /> Choose Image
                </label>
                {form.image && (
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, image: "" }))}
                    className="px-3 py-2 border-2 border-black bg-red-400 hover:bg-red-500 font-heading text-xs uppercase cursor-pointer shadow-[2px_2px_0px_#000]"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-heading uppercase text-black mb-1.5">Your Review *</label>
              <textarea
                id="review-body"
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                placeholder="Share your experience with this vendor..."
                rows={4}
                className="input-brutal w-full resize-none"
                required
                maxLength={1000}
              />
              <div className="text-xs font-body font-bold text-black/50 text-right mt-1">{form.body.length}/1000</div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="btn-brutal bg-white flex-1 py-2.5">
                Cancel
              </button>
              <button type="submit" className="btn-brutal btn-brutal-pink flex-1 py-2.5">
                {review ? "Save Changes" : "Submit Review"}
              </button>
            </div>
          </form>
        </div>
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
    <div className="py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-3 border-black pb-6">
        <div>
          <h1 className="font-heading text-4xl text-black uppercase mb-1">My Reviews</h1>
          <p className="font-body font-bold text-black/60">Your vendor reviews and ratings</p>
        </div>
        <button
          id="write-review-btn"
          onClick={() => setShowModal(true)}
          className="btn-brutal btn-brutal-pink flex items-center gap-2 py-2.5 px-5 w-full sm:w-auto justify-center"
        >
          <Plus className="w-5 h-5 text-black" /> Write Review
        </button>
      </div>

      {/* Stats */}
      {reviews.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="brutal-card p-5 text-center bg-white">
            <div className="text-4xl font-heading text-black mb-1">{reviews.length}</div>
            <div className="text-xs font-heading uppercase text-black/70">Reviews</div>
          </div>
          <div className="brutal-card p-5 text-center bg-oatly-yellow">
            <div className="text-4xl font-heading text-black mb-1">{avgRating}</div>
            <div className="text-xs font-heading uppercase text-black/70">Avg Rating</div>
          </div>
          <div className="brutal-card p-5 text-center bg-oatly-green">
            <div className="text-4xl font-heading text-black mb-1">
              {reviews.filter((r) => r.rating >= 4).length}
            </div>
            <div className="text-xs font-heading uppercase text-black/70">Positive</div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="grid gap-5 md:grid-cols-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="brutal-card bg-white p-6 h-48 animate-pulse" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="brutal-card bg-white p-12 text-center">
          <div className="w-16 h-16 bg-oatly-yellow border-3 border-black shadow-[4px_4px_0px_#000] flex items-center justify-center mx-auto mb-5">
            <MessageSquare className="w-8 h-8 text-black" />
          </div>
          <h3 className="font-heading text-2xl text-black uppercase mb-2">No reviews yet</h3>
          <p className="font-body font-bold text-black/60 mb-6">Share your experience with vendors you've worked with</p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-brutal btn-brutal-pink mx-auto flex items-center gap-2 px-6 py-2.5"
          >
            <Plus className="w-5 h-5" /> Write Your First Review
          </button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {reviews.map((review) => (
            <article key={review._id} className="brutal-card bg-white overflow-hidden group">
              <img
                src={review.image || getReviewImage(review.vendorName, review.rating)}
                alt={`${review.vendorName} event`}
                className="w-full h-40 object-cover border-b-[3px] border-black"
              />
              <div className="p-5">
                <div className="flex items-start justify-between mb-3 gap-3">
                  <div>
                    <h3 className="font-heading text-xl text-black uppercase">{review.vendorName}</h3>
                    {review.title && <p className="text-sm font-body font-bold text-black/60 mt-0.5">{review.title}</p>}
                  </div>
                  <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button
                      id={`edit-review-${review._id}`}
                      onClick={() => setEditReview(review)}
                      className="p-1.5 border-2 border-black bg-white hover:bg-oatly-blue transition-colors shadow-[2px_2px_0px_#000]"
                    >
                      <Edit3 className="w-4 h-4 text-black" />
                    </button>
                    <button
                      id={`delete-review-${review._id}`}
                      onClick={() => deleteMutation.mutate(review._id)}
                      className="p-1.5 border-2 border-black bg-white hover:bg-[#FF6B6B] transition-colors shadow-[2px_2px_0px_#000]"
                    >
                      <Trash2 className="w-4 h-4 text-black" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <StarRating value={review.rating} readonly />
                  <span className="text-sm font-heading text-black">{review.rating}/5</span>
                  <span className="text-xs font-body font-bold text-black/50 ml-auto">
                    {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>

                <p className="text-sm font-body font-semibold text-black/75 leading-relaxed">{review.body}</p>
              </div>
            </article>
          ))}
        </div>
      )}

      {showModal && <ReviewModal onClose={() => setShowModal(false)} onSave={(d) => createMutation.mutate(d)} />}
      {editReview && <ReviewModal review={editReview} onClose={() => setEditReview(null)} onSave={(d) => updateMutation.mutate({ id: editReview._id, data: d })} />}
    </div>
  );
}
