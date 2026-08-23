import { useLocation, Link } from "react-router-dom";
import { Sparkles, Home as HomeIcon, Users, ArrowRight } from "lucide-react";

const allPackages = [
  {
    id: "hp-1",
    title: "Weekend Terrace Party",
    category: "house_party",
    guests: "15-25 Guests",
    price: "₹15,000",
    color: "bg-oatly-pink",
    items: ["Fairy Lights & Ambient Outdoor Decor", "Sound System & Bluetooth Mic", "Finger Foods & Starters Catering", "DIY Drink Setup"]
  },
  {
    id: "hp-2",
    title: "Backyard BBQ & Chill",
    category: "house_party",
    guests: "20-40 Guests",
    price: "₹25,000",
    color: "bg-oatly-yellow",
    items: ["Live BBQ Chef with Equipment", "Outdoor Seating & Bean Bags", "Mocktail/Cocktail Station", "Custom Spotify Playlist Setup"]
  },
  {
    id: "ff-1",
    title: "Family Anniversary Dinner",
    category: "casual_family",
    guests: "30-50 Guests",
    price: "₹35,000",
    color: "bg-oatly-blue",
    items: ["Private Hall / Dining Area Decor", "Floral Table Centerpieces", "Candid Photographer (3 Hrs)", "Multi-Course Buffet Catering"]
  },
  {
    id: "ff-2",
    title: "Micro-Wedding Ceremony",
    category: "casual_family",
    guests: "40-80 Guests",
    price: "₹85,000",
    color: "bg-oatly-green",
    items: ["Minimalist Floral Stage Mandap", "Traditional Feast Catering", "Acoustic Musician / Singer", "Full Day Photo & Video Coverage"]
  },
  {
    id: "hp-3",
    title: "Intimate Birthday Bash",
    category: "house_party",
    guests: "10-30 Guests",
    price: "₹18,000",
    color: "bg-oatly-pink",
    items: ["Custom Balloon Arch & Backdrop", "Customized Theme Cake", "Party Games Coordinator", "Snack & Drink Bar"]
  },
  {
    id: "ff-3",
    title: "Casual Reunion / Gathering",
    category: "casual_family",
    guests: "25-60 Guests",
    price: "₹28,000",
    color: "bg-oatly-yellow",
    items: ["Cozy Lounge Seating Setup", "Live Food Counter (Chat/Pasta)", "Polaroid Photo Nook", "Background Music System"]
  }
];

export default function Packages() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type") || "all";
  const query = queryParams.get("q") || "";

  const filtered = allPackages.filter((pkg) => {
    if (type !== "all" && type !== "international" && type !== "wedding") {
      if (pkg.category !== type) return false;
    }
    if (query) {
      return pkg.title.toLowerCase().includes(query.toLowerCase()) || pkg.items.some(i => i.toLowerCase().includes(query.toLowerCase()));
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-oatly-bg pt-20 pb-12">
      <div className="section-container">
        <h1 className="font-heading text-6xl text-black uppercase mb-4 drop-shadow-[4px_4px_0px_#A7D7E8]">
          Event Plans & Packages
        </h1>
        <p className="font-body font-bold text-xl text-black mb-8">
          Designed specifically for house parties, small scale gatherings & casual friends/family celebrations.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-3 mb-10">
          <Link
            to="/packages?type=all"
            className={`btn-brutal text-sm py-2 px-5 ${type === "all" ? "bg-black text-white" : "bg-white"}`}
          >
            All Plans
          </Link>
          <Link
            to="/packages?type=house_party"
            className={`btn-brutal text-sm py-2 px-5 ${type === "house_party" ? "bg-oatly-pink" : "bg-white"}`}
          >
            <HomeIcon className="w-4 h-4" /> House Parties
          </Link>
          <Link
            to="/packages?type=casual_family"
            className={`btn-brutal text-sm py-2 px-5 ${type === "casual_family" ? "bg-oatly-blue" : "bg-white"}`}
          >
            <Users className="w-4 h-4" /> Casual Friends & Family
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((pkg) => (
            <div key={pkg.id} className={`brutal-card ${pkg.color} p-6 flex flex-col justify-between`}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-white border-[2px] border-black px-2.5 py-1 font-heading text-xs uppercase shadow-[2px_2px_0px_#000]">
                    {pkg.guests}
                  </span>
                  <span className="font-heading text-xl text-black bg-white border-[2px] border-black px-3 py-0.5 shadow-[2px_2px_0px_#000]">
                    {pkg.price}
                  </span>
                </div>
                <h3 className="font-heading text-2xl uppercase mb-4 text-black">{pkg.title}</h3>
                
                <div className="bg-white/90 border-[2px] border-black p-4 mb-6 space-y-2">
                  <p className="font-heading text-xs uppercase text-black border-b border-black pb-1">Included Services:</p>
                  {pkg.items.map((item, idx) => (
                    <p key={idx} className="font-body font-semibold text-xs text-black flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 flex-shrink-0 text-black" /> {item}
                    </p>
                  ))}
                </div>
              </div>

              <Link
                to={`/quotations?type=${pkg.category}`}
                className="btn-brutal bg-white hover:bg-black hover:text-white text-sm py-3 font-heading uppercase flex items-center justify-center gap-2"
              >
                Calculate AI Quotation <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
