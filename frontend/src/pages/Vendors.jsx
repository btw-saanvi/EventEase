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
        <Star key={s} className={`w-3 h-3 ${s <= Math.round(rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-black/20"}`} />
      ))}
    </div>
  );

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8 border-b-3 border-black pb-6">
        <h1 className="font-heading text-4xl text-black uppercase mb-1">Saved Vendors</h1>
        <p className="font-body font-bold text-black/60">Your curated list of favourite vendors</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => <div key={i} className="brutal-card bg-white p-6 h-48 animate-pulse" />)}
        </div>
      ) : saved.length === 0 ? (
        <div className="brutal-card bg-white p-12 text-center">
          <div className="w-16 h-16 bg-oatly-yellow border-3 border-black shadow-[4px_4px_0px_#000] flex items-center justify-center mx-auto mb-5">
            <Store className="w-8 h-8 text-black" />
          </div>
          <h3 className="font-heading text-2xl text-black uppercase mb-2">No saved vendors</h3>
          <p className="font-body font-bold text-black/60 mb-6">Browse the marketplace and save vendors you love</p>
          <a href="/vendor-marketplace" className="btn-brutal btn-brutal-blue mx-auto inline-flex items-center gap-2 px-6 py-2.5">
            Explore Marketplace
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {saved.map((item) => {
            const vendor = item.vendorDetails || item;
            return (
              <div key={item._id} className="brutal-card bg-white p-5 group transition-all duration-150 flex flex-col justify-between">
                <div>
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
                      id={`unsave-vendor-${item._id}`}
                      onClick={() => unsaveMutation.mutate(item.vendorId)}
                      className="p-2 border-2 border-black bg-[#FF6B6B] text-white transition-all shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000]"
                      title="Remove from saved"
                    >
                      <Heart className="w-4 h-4 fill-white text-white" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mb-3 bg-oatly-bg/40 border border-black/10 py-1 px-2 w-fit">
                    {renderStars(vendor.rating)}
                    <span className="text-sm font-heading text-black">{vendor.rating?.toFixed(1)}</span>
                  </div>

                  {vendor.location && (
                    <div className="flex items-center gap-2 text-xs font-body font-bold text-black/60 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-black/50" />
                      {vendor.location}
                    </div>
                  )}
                  {vendor.priceRange && (
                    <div className="text-xs font-heading uppercase text-black/55 mb-4">Price Range: {vendor.priceRange}</div>
                  )}
                </div>

                <button className="btn-brutal btn-brutal-blue w-full py-2 text-xs flex items-center justify-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-black" /> View Details
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
