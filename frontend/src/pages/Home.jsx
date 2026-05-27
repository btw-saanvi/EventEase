import HeroSection from "../components/home/HeroSection";
import CategoryCarousel from "../components/home/CategoryCarousel";
import { Link } from "react-router-dom";
import { ArrowRight, Plane, Quote, Camera, Sparkles } from "lucide-react";

const quotationCards = [
  { title: "Wedding Quotation", subtitle: "Let's start your forever day", color: "bg-oatly-pink" },
  { title: "Destination Quotation", subtitle: "A celebration with passport vibes", color: "bg-oatly-blue" },
  { title: "Corporate Quotation", subtitle: "Serious planning, zero boring", color: "bg-oatly-green" },
  { title: "Birthday Quotation", subtitle: "Cake, chaos, and perfect logistics", color: "bg-oatly-yellow" },
];

const vendorTiles = [
  { name: "Photographer", icon: Camera, color: "bg-oatly-pink" },
  { name: "Makeup Artist", icon: Sparkles, color: "bg-oatly-yellow" },
  { name: "Event Planner", icon: Quote, color: "bg-oatly-blue" },
  { name: "Decorator", icon: Plane, color: "bg-oatly-green" },
];

const internationalPackages = [
  { place: "Thailand", price: "Starts at ₹4,00,000" },
  { place: "Mauritius", price: "Starts at ₹7,50,000" },
  { place: "Vietnam", price: "Starts at ₹18,00,000" },
];

const weddingPackages = [
  { city: "Lucknow", price: "Starts at ₹5,00,000" },
  { city: "Jaipur", price: "Starts at ₹10,00,000" },
  { city: "Varanasi", price: "Starts at ₹5,50,000" },
];

const toSeed = (value) =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function Home() {
  return (
    <main className="bg-oatly-bg min-h-screen">
      <HeroSection />
      
      {/* Marquee Separator */}
      <div className="marquee-container">
        <div className="animate-marquee">
          <span>NO BORING EVENTS ALLOWED • WE DO THE MATH FOR YOU • VENDORS THAT ACTUALLY SHOW UP • NO BORING EVENTS ALLOWED • WE DO THE MATH FOR YOU • VENDORS THAT ACTUALLY SHOW UP • NO BORING EVENTS ALLOWED • WE DO THE MATH FOR YOU • VENDORS THAT ACTUALLY SHOW UP • NO BORING EVENTS ALLOWED • WE DO THE MATH FOR YOU • VENDORS THAT ACTUALLY SHOW UP • </span>
        </div>
      </div>

      <CategoryCarousel />

      <section className="py-20 bg-oatly-bg border-b-[4px] border-black">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="font-heading text-5xl md:text-7xl text-black uppercase mb-4">
              Fill Your Quotation
            </h2>
            <p className="font-body font-bold text-lg text-black">
              Tell us what you need. We will find the right team and pricing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {quotationCards.map((card, i) => (
              <Link
                key={card.title}
                to="/quotations"
                className={`${card.color} border-[4px] border-black shadow-[6px_6px_0px_#000] p-6 ${
                  i % 2 === 0 ? "-rotate-1" : "rotate-1"
                } hover:rotate-0 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_#000] transition-all`}
              >
                <p className="font-heading text-2xl uppercase text-black mb-2">{card.title}</p>
                <p className="font-body font-bold text-black mb-4">{card.subtitle}</p>
                <span className="font-heading uppercase flex items-center gap-2">
                  Get estimate <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white border-b-[4px] border-black">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="font-heading text-5xl md:text-7xl text-black uppercase mb-4">
              I Want To Book
            </h2>
            <p className="font-body font-bold text-lg text-black">
              Build your dream team one vendor at a time.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {vendorTiles.map((tile) => (
              <Link
                key={tile.name}
                to="/vendor-marketplace"
                className={`${tile.color} border-[4px] border-black shadow-[5px_5px_0px_#000] p-5 text-center hover:-translate-y-1 transition-transform`}
              >
                <div className="w-14 h-14 mx-auto mb-3 bg-white border-[3px] border-black flex items-center justify-center">
                  <tile.icon className="w-6 h-6 text-black" />
                </div>
                <p className="font-heading text-xl uppercase text-black leading-tight">{tile.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-oatly-bg border-b-[4px] border-black">
        <div className="section-container">
          <div className="glass-card p-6 md:p-8 grid md:grid-cols-2 gap-8 items-center">
            <img
              src="https://picsum.photos/seed/plan-perfect-celebration/1200/800"
              alt="Celebration setup"
              className="w-full h-72 md:h-80 object-cover border-[3px] border-black"
            />
            <div>
              <h2 className="font-heading text-4xl md:text-6xl uppercase text-black mb-4">
                Plan Your Perfect Celebration
              </h2>
              <p className="font-body font-bold text-black text-lg mb-6">
                Share your event details and get a personalized quotation with top venues and vendors.
              </p>
              <Link to="/quotations" className="btn-brutal btn-brutal-pink">
                Get My Quotation <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white border-b-[4px] border-black">
        <div className="section-container">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="font-heading text-4xl md:text-6xl text-black uppercase">International Packages</h2>
              <p className="font-body font-bold text-black mt-2">Destination-ready plans with full vendor coordination.</p>
            </div>
            <Link to="/packages" className="btn-brutal btn-brutal-blue">View All</Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {internationalPackages.map((pkg, idx) => (
              <Link key={pkg.place} to="/packages?type=international" className="brutal-card p-4">
                <img
                  src={`https://picsum.photos/seed/international-${toSeed(pkg.place)}-${idx + 1}/640/400`}
                  alt={`${pkg.place} destination package`}
                  className="w-full h-44 object-cover border-[3px] border-black mb-4"
                />
                <p className="font-body font-bold text-sm uppercase text-black">International</p>
                <h3 className="font-heading text-3xl uppercase text-black mb-2">{pkg.place}</h3>
                <p className="font-body font-bold text-black">{pkg.price}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-oatly-bg">
        <div className="section-container">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="font-heading text-4xl md:text-6xl text-black uppercase">Wedding Packages</h2>
              <p className="font-body font-bold text-black mt-2">Local favorites with budgets that make sense.</p>
            </div>
            <Link to="/packages?type=wedding" className="btn-brutal">Explore Wedding</Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {weddingPackages.map((pkg, idx) => (
              <Link key={pkg.city} to="/packages?type=wedding" className="brutal-card p-4 bg-white">
                <img
                  src={`https://picsum.photos/seed/wedding-${toSeed(pkg.city)}-${idx + 11}/640/400`}
                  alt={`${pkg.city} wedding package`}
                  className="w-full h-44 object-cover border-[3px] border-black mb-4"
                />
                <p className="font-body font-bold text-sm uppercase text-black">Wedding Package</p>
                <h3 className="font-heading text-3xl uppercase text-black mb-2">{pkg.city}</h3>
                <p className="font-body font-bold text-black">{pkg.price}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
