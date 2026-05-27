import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Star, Heart, ExternalLink, Filter, MapPin, Phone } from "lucide-react";
import api from "../lib/api";
import { toast } from "sonner";

const CATEGORIES = ["All", "Photography", "Catering", "Venue", "Music", "Decoration", "Flowers", "Transport"];

export default function VendorMarketplace() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("rating");
  const [minRating, setMinRating] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ["vendors", { search, category, sortBy }],
    queryFn: () =>
      api.get("/vendors", { params: { search, category: category === "All" ? "" : category, sortBy } }).then((r) => r.data),
  });

  const { data: savedData } = useQuery({
    queryKey: ["saved-vendors"],
    queryFn: () => api.get("/vendors/saved").then((r) => r.data),
  });

  const savedIds = new Set((savedData?.saved || []).map((s) => s.vendorId));

  const saveMutation = useMutation({
    mutationFn: (vendorId) => api.post("/vendors/save", { vendorId }),
    onSuccess: () => { queryClient.invalidateQueries(["saved-vendors"]); toast.success("Vendor saved!"); },
    onError: () => toast.error("Failed to save vendor"),
  });

  const unsaveMutation = useMutation({
    mutationFn: (vendorId) => api.delete(`/vendors/save/${vendorId}`),
    onSuccess: () => { queryClient.invalidateQueries(["saved-vendors"]); toast.success("Vendor removed"); },
    onError: () => toast.error("Failed to remove"),
  });

  const vendors = (data?.vendors || []).filter((v) => v.rating >= minRating);

  const renderStars = (rating) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-slate-600"}`} />
      ))}
    </div>
  );

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-white mb-1">Vendor Marketplace</h1>
        <p className="text-slate-400">Discover and connect with top event vendors</p>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              id="vendor-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vendors, locations..."
              className="vapor-input w-full pl-9"
            />
          </div>
          <select id="category-filter" value={category} onChange={(e) => setCategory(e.target.value)} className="vapor-input min-w-36">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select id="sort-filter" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="vapor-input min-w-36">
            <option value="rating">Sort: Rating</option>
            <option value="price">Sort: Price</option>
            <option value="name">Sort: Name</option>
          </select>
          <select id="rating-filter" value={minRating} onChange={(e) => setMinRating(Number(e.target.value))} className="vapor-input min-w-36">
            <option value={0}>Min Rating: Any</option>
            <option value={3}>3+ Stars</option>
            <option value={4}>4+ Stars</option>
            <option value={4.5}>4.5+ Stars</option>
          </select>
        </div>
      </div>

      {/* Vendor Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="h-32 bg-white/5 rounded-lg mb-4" />
              <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
              <div className="h-3 bg-white/5 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : vendors.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Filter className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="font-heading text-xl font-semibold text-slate-300 mb-2">No vendors found</h3>
          <p className="text-slate-500">Try adjusting your search filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {vendors.map((vendor) => {
            const isSaved = savedIds.has(vendor._id || vendor.id);
            return (
              <div key={vendor._id || vendor.id} className="glass-card p-5 group hover:border-vapor-lavender/30 transition-all">
                {/* Vendor header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, #818cf8, #67e8f9)` }}
                    >
                      {vendor.name?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-white text-sm leading-tight">{vendor.name}</h3>
                      <span className="text-xs text-vapor-lavender">{vendor.category}</span>
                    </div>
                  </div>
                  <button
                    id={`save-vendor-${vendor._id || vendor.id}`}
                    onClick={() => isSaved ? unsaveMutation.mutate(vendor._id || vendor.id) : saveMutation.mutate(vendor._id || vendor.id)}
                    className={`p-2 rounded-lg transition-colors ${isSaved ? "text-pink-400 bg-pink-400/10" : "text-slate-400 hover:text-pink-400"}`}
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? "fill-pink-400" : ""}`} />
                  </button>
                </div>

                {/* Description */}
                {vendor.description && (
                  <p className="text-xs text-slate-400 mb-3 line-clamp-2">{vendor.description}</p>
                )}

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  {renderStars(vendor.rating)}
                  <span className="text-sm font-medium text-white">{vendor.rating?.toFixed(1)}</span>
                  <span className="text-xs text-slate-500">({vendor.reviewCount || 0} reviews)</span>
                </div>

                {/* Location & Price */}
                <div className="space-y-1.5 mb-4">
                  {vendor.location && (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {vendor.location}
                    </div>
                  )}
                  {vendor.priceRange && (
                    <div className="text-xs text-vapor-cyan font-medium">{vendor.priceRange}</div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="btn-vapor flex-1 py-2 text-xs flex items-center justify-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> Contact
                  </button>
                  <button className="btn-vapor-solid flex-1 py-2 text-xs flex items-center justify-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5" /> View
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
