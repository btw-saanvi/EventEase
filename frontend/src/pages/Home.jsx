import HeroSection from "../components/home/HeroSection";
import CategoryCarousel from "../components/home/CategoryCarousel";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Camera, Sparkles, Music, Utensils, Home as HomeIcon, Users, Lock } from "lucide-react";
import { useAuth } from "../hooks/use-auth";

const quotationCards = [
  { title: "House Party Quotation", subtitle: "Cozy gatherings & epic playlist vibes", color: "bg-oatly-pink", type: "house_party" },
  { title: "Casual Friends & Family", subtitle: "Dinner parties, BBQs & milestones", color: "bg-oatly-blue", type: "casual_family" },
  { title: "Intimate Birthday", subtitle: "Cake, photo corner, and custom fun", color: "bg-oatly-yellow", type: "birthday" },
  { title: "Micro-Wedding", subtitle: "Small scale, big memories", color: "bg-oatly-green", type: "micro_wedding" },
];

const vendorTiles = [
  { name: "Photographer", icon: Camera, color: "bg-oatly-pink" },
  { name: "Catering & Snacks", icon: Utensils, color: "bg-oatly-yellow" },
  { name: "DJ & Sound", icon: Music, color: "bg-oatly-blue" },
  { name: "Decor & Lighting", icon: Sparkles, color: "bg-oatly-green" },
];

const housePartyPlans = [
  { title: "Weekend Terrace Party", category: "House Party", guests: "15-25 Guests", price: "Starts at ₹15,000", desc: "Ambient fairy lights, sound system rental & finger food catering." },
  { title: "Backyard BBQ & Drinks", category: "Casual Friends", guests: "20-40 Guests", price: "Starts at ₹25,000", desc: "Live grill chef, DIY mocktail bar setup & cozy outdoor seating." },
  { title: "Intimate Birthday Bash", category: "Casual Friends", guests: "10-30 Guests", price: "Starts at ₹18,000", desc: "Custom theme balloon backdrop, cake bar & playlist manager." },
];

const familyPlans = [
  { title: "Family Anniversary Dinner", category: "Family Plan", guests: "30-50 Guests", price: "Starts at ₹35,000", desc: "Private dining room setup, floral centerpiece & candid photo team." },
  { title: "Micro-Wedding Celebration", category: "Small Event", guests: "40-80 Guests", price: "Starts at ₹85,000", desc: "Minimalist floral mandap, traditional catering & acoustic music." },
  { title: "Baby Shower / Naming Ceremony", category: "Family Plan", guests: "25-60 Guests", price: "Starts at ₹28,000", desc: "Pastel decor theme, welcome drinks & photo booth nook." },
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleVendorClick = () => {
    if (isAuthenticated) {
      navigate("/vendor-marketplace");
    } else {
      navigate("/login?redirect=/vendor-marketplace");
    }
  };

  return (
    <main className="bg-oatly-bg min-h-screen">
      <HeroSection />
      
      {/* Marquee Separator */}
      <div className="marquee-container">
        <div className="animate-marquee">
          <span>SMALL & MEDIUM SCALE EVENTS • HOUSE PARTIES & FAMILY GATHERINGS • AI BUDGET MATH • VERIFIED VENDORS • SMALL & MEDIUM SCALE EVENTS • HOUSE PARTIES & FAMILY GATHERINGS • AI BUDGET MATH • VERIFIED VENDORS • </span>
        </div>
      </div>

      <CategoryCarousel />

      {/* Find Out Quotation Section */}
      <section className="py-20 bg-oatly-bg border-b-[4px] border-black">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="font-heading text-5xl md:text-7xl text-black uppercase mb-4">
              Find Out Quotation
            </h2>
            <p className="font-body font-bold text-lg md:text-xl text-black max-w-2xl mx-auto">
              We help you math according to your budget and the exact scale level you want using AI!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {quotationCards.map((card, i) => (
              <Link
                key={card.title}
                to={`/quotations?type=${card.type}`}
                className={`${card.color} border-[4px] border-black shadow-[6px_6px_0px_#000] p-6 ${
                  i % 2 === 0 ? "-rotate-1" : "rotate-1"
                } hover:rotate-0 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_#000] transition-all`}
              >
                <p className="font-heading text-2xl uppercase text-black mb-2">{card.title}</p>
                <p className="font-body font-bold text-black mb-4">{card.subtitle}</p>
                <span className="font-heading uppercase flex items-center gap-2">
                  Calculate AI Math <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* I Want To Book Section */}
      <section className="py-20 bg-white border-b-[4px] border-black">
        <div className="section-container">
          <div className="text-center mb-8">
            <h2 className="font-heading text-5xl md:text-7xl text-black uppercase mb-4">
              I Want To Book
            </h2>
            <p className="font-body font-bold text-lg text-black max-w-xl mx-auto">
              Sign in to search and connect with trusted local vendors for your house party or family event.
            </p>
          </div>

          {!isAuthenticated && (
            <div className="max-w-xl mx-auto mb-10 bg-oatly-yellow border-[3px] border-black p-4 text-center shadow-[4px_4px_0px_#000] flex items-center justify-center gap-3">
              <Lock className="w-5 h-5 text-black flex-shrink-0" />
              <span className="font-body font-bold text-sm text-black">
                Sign in is required to search and message vendors.
              </span>
              <Link to="/login" className="btn-brutal bg-white hover:bg-black hover:text-white px-4 py-1.5 text-xs font-heading">
                Sign In
              </Link>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {vendorTiles.map((tile) => (
              <button
                key={tile.name}
                onClick={handleVendorClick}
                className={`${tile.color} border-[4px] border-black shadow-[5px_5px_0px_#000] p-5 text-center hover:-translate-y-1 transition-transform w-full text-left`}
              >
                <div className="w-14 h-14 mx-auto mb-3 bg-white border-[3px] border-black flex items-center justify-center">
                  <tile.icon className="w-6 h-6 text-black" />
                </div>
                <p className="font-heading text-xl uppercase text-black leading-tight text-center">{tile.name}</p>
                <p className="font-body font-bold text-xs text-center mt-2 uppercase text-black/70">
                  {isAuthenticated ? "Search Vendors" : "Sign In to Search"}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* House Parties Plans */}
      <section className="py-20 bg-oatly-bg border-b-[4px] border-black">
        <div className="section-container">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="font-heading text-4xl md:text-6xl text-black uppercase flex items-center gap-3">
                <HomeIcon className="w-10 h-10 text-black" /> House Parties Plans
              </h2>
              <p className="font-body font-bold text-black mt-2">Fun, low-stress setups for cozy indoor and terrace parties.</p>
            </div>
            <Link to="/packages?type=house_party" className="btn-brutal btn-brutal-pink">View House Plans</Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {housePartyPlans.map((pkg, idx) => (
              <Link key={pkg.title} to={`/quotations?type=house_party`} className="brutal-card p-5 bg-white flex flex-col justify-between">
                <div>
                  <span className="inline-block bg-oatly-pink border-[2px] border-black px-2 py-0.5 font-heading text-xs uppercase mb-3 shadow-[2px_2px_0px_#000]">
                    {pkg.guests}
                  </span>
                  <h3 className="font-heading text-2xl uppercase text-black mb-2">{pkg.title}</h3>
                  <p className="font-body font-semibold text-sm text-gray-700 mb-4">{pkg.desc}</p>
                </div>
                <div className="border-t-[2px] border-black pt-3 flex items-center justify-between">
                  <p className="font-heading text-lg text-black">{pkg.price}</p>
                  <span className="font-heading text-xs uppercase flex items-center gap-1 text-black">Math Budget <ArrowRight className="w-3.5 h-3.5" /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Casual Friends & Family Plans */}
      <section className="py-20 bg-white">
        <div className="section-container">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="font-heading text-4xl md:text-6xl text-black uppercase flex items-center gap-3">
                <Users className="w-10 h-10 text-black" /> Casual Friends & Family Plans
              </h2>
              <p className="font-body font-bold text-black mt-2">Smart, medium-scale celebration plans for all your milestones.</p>
            </div>
            <Link to="/packages?type=casual_family" className="btn-brutal btn-brutal-blue">Explore Family Plans</Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {familyPlans.map((pkg, idx) => (
              <Link key={pkg.title} to={`/quotations?type=casual_family`} className="brutal-card p-5 bg-oatly-bg flex flex-col justify-between">
                <div>
                  <span className="inline-block bg-oatly-blue border-[2px] border-black px-2 py-0.5 font-heading text-xs uppercase mb-3 shadow-[2px_2px_0px_#000]">
                    {pkg.guests}
                  </span>
                  <h3 className="font-heading text-2xl uppercase text-black mb-2">{pkg.title}</h3>
                  <p className="font-body font-semibold text-sm text-gray-700 mb-4">{pkg.desc}</p>
                </div>
                <div className="border-t-[2px] border-black pt-3 flex items-center justify-between">
                  <p className="font-heading text-lg text-black">{pkg.price}</p>
                  <span className="font-heading text-xs uppercase flex items-center gap-1 text-black">Math Budget <ArrowRight className="w-3.5 h-3.5" /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
