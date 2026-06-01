import { Star, MapPin } from "lucide-react";

const vendors = [
  { name: "Crystal Bloom Florals", category: "Florist", location: "Mumbai", rating: 4.9, price: "₹₹₹", color: "#FFB0C2" }, // Pink
  { name: "Shutter & Soul", category: "Photography", location: "Delhi", rating: 4.8, price: "₹₹₹₹", color: "#A7D7E8" }, // Blue
  { name: "The Grand Feast", category: "Catering", location: "Bangalore", rating: 4.7, price: "₹₹", color: "#FFD933" }, // Yellow
  { name: "Rhythm & Beat DJs", category: "Entertainment", location: "Mumbai", rating: 4.6, price: "₹₹", color: "#A4CBA3" }, // Green
  { name: "Royal Mandap Decor", category: "Decoration", location: "Jaipur", rating: 4.8, price: "₹₹₹", color: "#FFB0C2" }, // Pink
  { name: "Starlight Venues", category: "Venue", location: "Hyderabad", rating: 4.5, price: "₹₹₹₹", color: "#A7D7E8" }, // Blue
];

export default function VendorShowcase() {
  return (
    <section className="py-24 bg-oatly-bg overflow-hidden border-t-[4px] border-black">
      <div className="section-container mb-12">
        <div className="text-center">
          <h2 className="font-heading text-4xl md:text-5xl text-black uppercase mb-4">
            Top Vendors <span className="text-oatly-pink">Near You</span>
          </h2>
          <p className="text-black/80 font-body font-bold text-lg">Trusted by thousands of events across India</p>
        </div>
      </div>

      {/* Infinite scroll carousel */}
      <div className="relative">
        {/* Gradient fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-oatly-bg to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-oatly-bg to-transparent pointer-events-none" />

        <div className="flex gap-6 animate-[scroll_30s_linear_infinite] hover:[animation-play-state:paused] py-4"
          style={{ width: "max-content" }}>
          {[...vendors, ...vendors].map((v, i) => (
            <div key={i} className="brutal-card w-64 flex-shrink-0 bg-white p-5 flex flex-col justify-between">
              <div>
                {/* Color band */}
                <div className="h-4 border-[2px] border-black mb-4" style={{ backgroundColor: v.color }} />
                
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center rounded-none px-2 py-0.5 text-[10px] font-heading uppercase tracking-wider border-[2px] border-black bg-white text-black shadow-[1px_1px_0px_#000]">
                    {v.category}
                  </span>
                  <div className="flex items-center gap-1 text-black font-body font-bold text-sm">
                    <Star className="w-4 h-4 fill-[#FFD933] stroke-black stroke-[2px]" />
                    <span>{v.rating}</span>
                  </div>
                </div>
                
                <h3 className="font-heading text-lg text-black uppercase mb-2 line-clamp-1">{v.name}</h3>
              </div>

              <div className="flex items-center justify-between text-xs font-body font-bold text-black/70 mt-2 border-t-2 border-black pt-3">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-black" />
                  {v.location}
                </div>
                <span className="font-heading text-black uppercase">{v.price}</span>
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
