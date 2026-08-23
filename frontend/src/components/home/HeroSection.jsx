import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search, MapPin, Sparkles } from "lucide-react";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/packages?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden bg-oatly-bg pt-20 pb-10 border-b-[4px] border-black">
      
      {/* Quirky background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-oatly-pink border-[4px] border-black rounded-full shadow-[8px_8px_0px_#000] -rotate-6 animate-wiggle" />
        <div className="absolute bottom-20 right-10 w-96 h-40 bg-oatly-blue border-[4px] border-black shadow-[8px_8px_0px_#000] rotate-12" />
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-oatly-yellow border-[4px] border-black shadow-[8px_8px_0px_#000] rotate-45" />
      </div>

      <div className="section-container relative z-10 max-w-5xl mx-auto text-center">
        {/* Headline */}
        <h1 className="font-heading text-5xl md:text-8xl text-black leading-[1.1] mb-8 uppercase drop-shadow-[4px_4px_0px_#FFB0C2]">
          Plan Small & Medium Events
          <br />
          <span className="text-oatly-yellow drop-shadow-[4px_4px_0px_#000] stroke-black" style={{ WebkitTextStroke: "3px black" }}>
            Entirely On Your Own.
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-black font-body font-bold max-w-3xl mx-auto mb-12 bg-white border-[3px] border-black shadow-[4px_4px_0px_#000] p-4 -rotate-1 inline-block">
          Ideas for house parties & family plans • AI budget math tailored to your level!
        </p>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-12 transform rotate-1">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row bg-white border-[4px] border-black shadow-[8px_8px_0px_#000] p-2 gap-2">
            <div className="flex-1 flex items-center gap-2 px-4 bg-gray-100 border-[2px] border-black">
              <Search className="w-6 h-6 text-black" />
              <input
                type="text"
                placeholder="Search House Parties, Friends & Family Plans..."
                className="w-full bg-transparent py-4 text-lg font-body font-bold text-black outline-none placeholder:text-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="hidden sm:flex flex-1 items-center gap-2 px-4 bg-gray-100 border-[2px] border-black">
              <MapPin className="w-6 h-6 text-black" />
              <input
                type="text"
                placeholder="Where?"
                className="w-full bg-transparent py-4 text-lg font-body font-bold text-black outline-none placeholder:text-gray-500"
              />
            </div>
            <button type="submit" className="btn-brutal btn-brutal-blue px-8 py-4 text-xl">
              GO!
            </button>
          </form>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 font-heading uppercase text-lg">
          <span className="text-black bg-white border-[2px] border-black px-4 py-1 shadow-[2px_2px_0px_#000] -rotate-2">Ideas:</span>
          <Link to="/quotations?type=house_party" className="text-black hover:text-oatly-pink hover:underline underline-offset-4 decoration-4">House Party</Link>
          <Link to="/quotations?type=casual_family" className="text-black hover:text-oatly-blue hover:underline underline-offset-4 decoration-4">Casual Family</Link>
          <Link to="/quotations?type=birthday" className="text-black hover:text-oatly-green hover:underline underline-offset-4 decoration-4">Intimate Birthday</Link>
        </div>
      </div>
    </section>
  );
}
