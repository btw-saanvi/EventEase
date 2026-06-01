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
        <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-black/20"}`} />
      ))}
    </div>
  );

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8 border-b-3 border-black pb-6">
        <h1 className="font-heading text-4xl text-black uppercase mb-1">Vendor Marketplace</h1>
        <p className="font-body font-bold text-black/60">Discover and connect with top event vendors</p>
      </div>

      {/* Filters */}
      <div className="brutal-card bg-white p-5 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-black/60" />
            <input
              id="vendor-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vendors, locations..."
              className="input-brutal w-full pl-11"
            />
          </div>
          <select id="category-filter" value={category} onChange={(e) => setCategory(e.target.value)} className="input-brutal min-w-[160px] bg-white cursor-pointer">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select id="sort-filter" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input-brutal min-w-[160px] bg-white cursor-pointer">
            <option value="rating">Sort: Rating</option>
            <option value="price">Sort: Price</option>
            <option value="name">Sort: Name</option>
          </select>
          <select id="rating-filter" value={minRating} onChange={(e) => setMinRating(Number(e.target.value))} className="input-brutal min-w-[160px] bg-white cursor-pointer">
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
            <div key={i} className="brutal-card p-6 bg-white animate-pulse">
              <div className="h-32 bg-black/10 rounded mb-4" />
              <div className="h-4 bg-black/15 rounded w-3/4 mb-2" />
              <div className="h-3 bg-black/5 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : vendors.length === 0 ? (
        <div className="brutal-card bg-white p-12 text-center">
          <div className="w-16 h-16 bg-oatly-yellow border-3 border-black shadow-[4px_4px_0px_#000] flex items-center justify-center mx-auto mb-5">
            <Filter className="w-8 h-8 text-black" />
          </div>
          <h3 className="font-heading text-2xl text-black uppercase mb-2">No vendors found</h3>
          <p className="font-body font-bold text-black/60">Try adjusting your search filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {vendors.map((vendor) => {
            const isSaved = savedIds.has(vendor._id || vendor.id);
            return (
              <div key={vendor._id || vendor.id} className="brutal-card bg-white p-5 group transition-all duration-150 flex flex-col justify-between">
                <div>
                  {/* Vendor header */}
                  <div className="flex items-start justify-between mb-4 border-b-2 border-black/10 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 border-2 border-black bg-oatly-yellow shadow-[2px_2px_0px_#000] flex items-center justify-center text-xl font-heading text-black flex-shrink-0">
                        {vendor.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-heading text-lg text-black uppercase leading-tight pr-1">{vendor.name}</h3>
                        <span className="text-xs font-heading uppercase text-black/55">{vendor.category}</span>
                      </div>
                    </div>
                    <button
                      id={`save-vendor-${vendor._id || vendor.id}`}
                      onClick={() => isSaved ? unsaveMutation.mutate(vendor._id || vendor.id) : saveMutation.mutate(vendor._id || vendor.id)}
                      className={`p-2 border-2 border-black transition-all shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000] ${
                        isSaved ? "bg-[#FF6B6B]" : "bg-white hover:bg-oatly-pink"
                      }`}
                      title={isSaved ? "Unsave Vendor" : "Save Vendor"}
                    >
                      <Heart className={`w-4 h-4 ${isSaved ? "fill-white text-white" : "text-black"}`} />
                    </button>
                  </div>

                  {/* Description */}
                  {vendor.description && (
                    <p className="text-xs font-body font-semibold text-black/75 mb-3 line-clamp-2 leading-relaxed">{vendor.description}</p>
                  )}

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3 bg-oatly-bg/40 border border-black/10 py-1 px-2 w-fit">
                    {renderStars(vendor.rating)}
                    <span className="text-sm font-heading text-black">{vendor.rating?.toFixed(1)}</span>
                    <span className="text-xs font-body font-bold text-black/50">({vendor.reviewCount || 0} reviews)</span>
                  </div>

                  {/* Location & Price */}
                  <div className="space-y-1.5 my-3">
                    {vendor.location && (
                      <div className="flex items-center gap-2 text-xs font-body font-bold text-black/60">
                        <MapPin className="w-3.5 h-3.5 text-black/50" />
                        {vendor.location}
                      </div>
                    )}
                    {vendor.priceRange && (
                      <div className="text-xs font-heading uppercase text-black/55">Price Range: {vendor.priceRange}</div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-4 border-t-2 border-black/10 pt-4">
                  <button className="btn-brutal bg-white flex-1 py-2 text-xs flex items-center justify-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-black" /> Contact
                  </button>
                  <button className="btn-brutal btn-brutal-blue flex-1 py-2 text-xs flex items-center justify-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5 text-black" /> View
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
