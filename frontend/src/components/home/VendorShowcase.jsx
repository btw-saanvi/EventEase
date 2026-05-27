import { Star, MapPin } from "lucide-react";

const vendors = [
  { name: "Crystal Bloom Florals", category: "Florist", location: "Mumbai", rating: 4.9, price: "₹₹₹", color: "#f0abfc" },
  { name: "Shutter & Soul", category: "Photography", location: "Delhi", rating: 4.8, price: "₹₹₹₹", color: "#818cf8" },
  { name: "The Grand Feast", category: "Catering", location: "Bangalore", rating: 4.7, price: "₹₹", color: "#67e8f9" },
  { name: "Rhythm & Beat DJs", category: "Entertainment", location: "Mumbai", rating: 4.6, price: "₹₹", color: "#c4b5fd" },
  { name: "Royal Mandap Decor", category: "Decoration", location: "Jaipur", rating: 4.8, price: "₹₹₹", color: "#a5f3fc" },
  { name: "Starlight Venues", category: "Venue", location: "Hyderabad", rating: 4.5, price: "₹₹₹₹", color: "#fbbf24" },
];

export default function VendorShowcase() {
  return (
    <section className="py-24 overflow-hidden">
      <div className="section-container mb-10">
        <div className="text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-slate-100 mb-4">
            Top Vendors <span className="text-gradient">Near You</span>
          </h2>
          <p className="text-slate-400 text-lg">Trusted by thousands of events across India</p>
        </div>
      </div>

      {/* Infinite scroll carousel */}
      <div className="relative">
        {/* Gradient fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-vapor-dark to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-vapor-dark to-transparent pointer-events-none" />

        <div className="flex gap-5 animate-[scroll_30s_linear_infinite] hover:[animation-play-state:paused]"
          style={{ width: "max-content" }}>
          {[...vendors, ...vendors].map((v, i) => (
            <div key={i} className="glass-card w-64 flex-shrink-0">
              {/* Color band */}
              <div className="h-2 rounded-t-2xl -mx-6 -mt-6 mb-4" style={{ background: `linear-gradient(90deg, ${v.color}60, ${v.color}20)` }} />
              <div className="flex items-center justify-between mb-3">
                <span className="badge-vapor badge-lavender text-xs">{v.category}</span>
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-xs font-semibold">{v.rating}</span>
                </div>
              </div>
              <h3 className="font-heading font-semibold text-slate-200 mb-1 text-sm">{v.name}</h3>
              <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {v.location}
                </div>
                <span style={{ color: v.color }}>{v.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
