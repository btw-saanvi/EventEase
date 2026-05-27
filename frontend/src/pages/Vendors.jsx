import { useQuery } from "@tanstack/react-query";
import { Heart, Star, MapPin, ExternalLink, Store } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import { toast } from "sonner";

export default function Vendors() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["saved-vendors"],
    queryFn: () => api.get("/vendors/saved").then((r) => r.data),
  });

  const unsaveMutation = useMutation({
    mutationFn: (vendorId) => api.delete(`/vendors/save/${vendorId}`),
    onSuccess: () => { queryClient.invalidateQueries(["saved-vendors"]); toast.success("Vendor removed from saved"); },
    onError: () => toast.error("Failed to remove vendor"),
  });

  const saved = data?.saved || [];

  const renderStars = (rating) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`w-3 h-3 ${s <= Math.round(rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-slate-600"}`} />
      ))}
    </div>
  );

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-white mb-1">Saved Vendors</h1>
        <p className="text-slate-400">Your curated list of favourite vendors</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => <div key={i} className="glass-card p-6 h-48 animate-pulse" />)}
        </div>
      ) : saved.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Store className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="font-heading text-xl font-semibold text-slate-300 mb-2">No saved vendors</h3>
          <p className="text-slate-500 mb-6">Browse the marketplace and save vendors you love</p>
          <a href="/vendor-marketplace" className="btn-vapor-solid mx-auto inline-flex items-center gap-2 px-6 py-2.5">
            Explore Marketplace
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {saved.map((item) => {
            const vendor = item.vendorDetails || item;
            return (
              <div key={item._id} className="glass-card p-5 group hover:border-vapor-lavender/30 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white bg-gradient-to-br from-violet-600 to-cyan-500 flex-shrink-0">
                      {vendor.name?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-white text-sm">{vendor.name}</h3>
                      <span className="text-xs text-vapor-lavender">{vendor.category}</span>
                    </div>
                  </div>
                  <button
                    id={`unsave-vendor-${item._id}`}
                    onClick={() => unsaveMutation.mutate(item.vendorId)}
                    className="p-2 text-pink-400 hover:text-slate-400 transition-colors"
                    title="Remove from saved"
                  >
                    <Heart className="w-4 h-4 fill-pink-400" />
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  {renderStars(vendor.rating)}
                  <span className="text-sm text-slate-400">{vendor.rating?.toFixed(1)}</span>
                </div>

                {vendor.location && (
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {vendor.location}
                  </div>
                )}
                {vendor.priceRange && (
                  <div className="text-xs text-vapor-cyan font-medium mb-4">{vendor.priceRange}</div>
                )}

                <button className="btn-vapor-solid w-full py-2 text-xs flex items-center justify-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5" /> View Details
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
