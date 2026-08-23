import { useState } from "react";
import { Calculator, Send, AlertCircle, CheckCircle2, Sparkles, Bot, DollarSign, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Quotations() {
  const queryParams = new URLSearchParams(window.location.search);
  const initialType = queryParams.get("type") || "house_party";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: initialType.toLowerCase().includes("wedding") ? "micro_wedding" : 
               initialType.toLowerCase().includes("house") ? "house_party" : 
               initialType.toLowerCase().includes("birthday") ? "birthday" : "casual_family",
    eventDate: "",
    guests: "25",
    budgetAmount: "25000",
    experienceLevel: "standard", // budget, standard, premium
    services: ["catering", "decor"],
    details: "",
  });

  const [aiCalculation, setAiCalculation] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (service) => {
    setFormData((prev) => {
      const services = prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service];
      return { ...prev, services };
    });
  };

  const calculateAiMath = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.budgetAmount) {
      setError("Please provide your name, email, and estimated budget amount so our AI can do the math!");
      return;
    }
    setError("");
    setIsCalculating(true);

    setTimeout(() => {
      const budget = parseFloat(formData.budgetAmount) || 30000;
      const guestCount = parseInt(formData.guests) || 25;
      
      // Calculate breakdown based on experience level
      let cateringPct = 0.40;
      let decorPct = 0.25;
      let venuePct = 0.15;
      let photoMusicPct = 0.15;
      let bufferPct = 0.05;

      if (formData.experienceLevel === "budget") {
        cateringPct = 0.50;
        decorPct = 0.20;
        venuePct = 0.10;
        photoMusicPct = 0.10;
        bufferPct = 0.10;
      } else if (formData.experienceLevel === "premium") {
        cateringPct = 0.35;
        decorPct = 0.30;
        venuePct = 0.15;
        photoMusicPct = 0.15;
        bufferPct = 0.05;
      }

      const catering = Math.round(budget * cateringPct);
      const decor = Math.round(budget * decorPct);
      const venue = Math.round(budget * venuePct);
      const photoMusic = Math.round(budget * photoMusicPct);
      const buffer = Math.round(budget * bufferPct);
      const perGuest = Math.round(budget / guestCount);

      let aiTip = "Great budget range! For small & medium scale gatherings, focusing 40% on live food or DIY stations gives the best experience.";
      if (formData.eventType === "house_party") {
        aiTip = "House party hack: Spend most on food & sound system, save on venue cost by using home/backyard space!";
      } else if (formData.eventType === "micro_wedding") {
        aiTip = "Micro-wedding tip: An intimate guest list lets you splurge on candid photography and customized floral arches.";
      }

      setAiCalculation({
        total: budget,
        perGuest,
        breakdown: [
          { category: "Food & Drinks (Catering)", amount: catering, pct: Math.round(cateringPct * 100) },
          { category: "Ambience & Decor", amount: decor, pct: Math.round(decorPct * 100) },
          { category: "Venue & Sound Setup", amount: venue, pct: Math.round(venuePct * 100) },
          { category: "Photo / Music / Extras", amount: photoMusic, pct: Math.round(photoMusicPct * 100) },
          { category: "Emergency Buffer", amount: buffer, pct: Math.round(bufferPct * 100) },
        ],
        tip: aiTip
      });

      setIsCalculating(false);
      setSubmitted(true);
    }, 600);
  };

  const serviceOptions = [
    { id: "catering", label: "Catering / Food & Drinks" },
    { id: "decor", label: "Decor, Lights & Balloons" },
    { id: "venue", label: "Cozy Space / Terrace / Hall" },
    { id: "photo", label: "Candid Photographer" },
    { id: "music", label: "DJ / Acoustic Music Corner" },
    { id: "coordination", label: "Host / Event Coordinator" },
  ];

  return (
    <div className="min-h-screen bg-oatly-bg pt-20 pb-12">
      <div className="section-container max-w-4xl">
        <h1 className="font-heading text-5xl md:text-7xl text-black uppercase mb-4 drop-shadow-[4px_4px_0px_#fca5a5]">
          Find Out Quotation
        </h1>
        <p className="font-body font-bold text-lg md:text-xl uppercase mb-10 text-black">
          We help you math according to your budget and the exact scale level you want using AI!
        </p>

        {submitted && aiCalculation ? (
          <div className="space-y-8 my-8">
            <div className="bg-oatly-yellow border-[4px] border-black shadow-[8px_8px_0px_#000] p-6 md:p-10 rotate-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white border-[3px] border-black flex items-center justify-center">
                  <Bot className="w-6 h-6 text-black" />
                </div>
                <div>
                  <span className="font-heading text-xs uppercase bg-black text-white px-2 py-0.5">AI Quotation Engine</span>
                  <h2 className="font-heading text-3xl uppercase text-black">Budget Math Complete!</h2>
                </div>
              </div>

              <p className="font-body font-bold text-lg mb-6">
                Hey {formData.name}, based on your budget of <span className="font-heading text-2xl">₹{aiCalculation.total.toLocaleString()}</span> for {formData.guests} guests (~₹{aiCalculation.perGuest.toLocaleString()} per guest), here is your optimal budget allocation:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {aiCalculation.breakdown.map((item, idx) => (
                  <div key={idx} className="bg-white border-[3px] border-black p-4 shadow-[3px_3px_0px_#000]">
                    <p className="font-heading text-xs uppercase text-gray-600 mb-1">{item.category}</p>
                    <p className="font-heading text-xl text-black">₹{item.amount.toLocaleString()}</p>
                    <span className="text-xs font-body font-bold text-black/60">{item.pct}% of budget</span>
                  </div>
                ))}
              </div>

              <div className="bg-white border-[3px] border-black p-4 mb-8">
                <p className="font-heading text-sm uppercase text-black flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-black" /> AI Planner Recommendation:
                </p>
                <p className="font-body font-bold text-sm text-black">{aiCalculation.tip}</p>
              </div>

              <div className="flex flex-wrap gap-4 items-center justify-between border-t-[3px] border-black pt-6">
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-brutal bg-white hover:bg-black hover:text-white px-6 py-3 font-heading text-sm"
                >
                  Adjust Numbers
                </button>
                <Link
                  to="/signup"
                  className="btn-brutal btn-brutal-pink px-8 py-3 font-heading text-lg flex items-center gap-2"
                >
                  Sign In to Save & Search Vendors <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* The Form */}
            <form
              onSubmit={calculateAiMath}
              className="lg:col-span-2 bg-white border-[4px] border-black shadow-[8px_8px_0px_#000] p-6 md:p-8 space-y-6"
            >
              {error && (
                <div className="bg-red-200 border-[3px] border-black p-4 flex items-center gap-3 font-body font-bold text-red-900">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="font-heading text-2xl uppercase border-b-[3px] border-black pb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-black" /> 1. Contact & Event Scale
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-heading uppercase text-sm mb-1">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Saanvi Garg"
                      className="w-full p-3 border-[3px] border-black font-body font-medium focus:outline-none focus:bg-oatly-yellow"
                    />
                  </div>
                  <div>
                    <label className="block font-heading uppercase text-sm mb-1">Your Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@gmail.com"
                      className="w-full p-3 border-[3px] border-black font-body font-medium focus:outline-none focus:bg-oatly-yellow"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-heading uppercase text-sm mb-1">Event Plan Type</label>
                    <select
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleInputChange}
                      className="w-full p-3 border-[3px] border-black font-heading uppercase text-sm focus:outline-none bg-white focus:bg-oatly-yellow"
                    >
                      <option value="house_party">House Party Bash (10-30 Guests)</option>
                      <option value="casual_family">Casual Friends & Family (25-75 Guests)</option>
                      <option value="birthday">Intimate Birthday Celebration</option>
                      <option value="micro_wedding">Micro-Wedding / Engagement</option>
                      <option value="dinner_gathering">Dinner & Drinks Gathering</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-heading uppercase text-sm mb-1">Estimated Guest Count</label>
                    <input
                      type="number"
                      name="guests"
                      value={formData.guests}
                      onChange={handleInputChange}
                      placeholder="25"
                      className="w-full p-3 border-[3px] border-black font-body font-medium focus:outline-none focus:bg-oatly-yellow"
                    />
                  </div>
                </div>
              </div>

              {/* Budget & Level */}
              <div className="space-y-4 pt-4">
                <h3 className="font-heading text-2xl uppercase border-b-[3px] border-black pb-2 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-black" /> 2. Budget & Level You Want
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-heading uppercase text-sm mb-1">Total Budget (₹)</label>
                    <input
                      type="number"
                      name="budgetAmount"
                      value={formData.budgetAmount}
                      onChange={handleInputChange}
                      placeholder="25000"
                      className="w-full p-3 border-[3px] border-black font-body font-bold text-lg focus:outline-none focus:bg-oatly-yellow"
                    />
                  </div>
                  <div>
                    <label className="block font-heading uppercase text-sm mb-1">Experience Level</label>
                    <select
                      name="experienceLevel"
                      value={formData.experienceLevel}
                      onChange={handleInputChange}
                      className="w-full p-3 border-[3px] border-black font-heading uppercase text-sm focus:outline-none bg-white focus:bg-oatly-yellow"
                    >
                      <option value="budget">Smart Budget (DIY + Key Highlights)</option>
                      <option value="standard">Standard Balanced (Quality & Comfort)</option>
                      <option value="premium">Premium Small Scale (Elevated Vibes)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Services Required */}
              <div className="space-y-4 pt-4">
                <h3 className="font-heading text-2xl uppercase border-b-[3px] border-black pb-2">3. Select What You Need</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {serviceOptions.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => handleServiceChange(service.id)}
                      className={`flex items-center gap-3 p-3 border-[3px] border-black text-left font-heading text-xs uppercase transition-all shadow-[2px_2px_0px_#000] ${
                        formData.services.includes(service.id)
                          ? "bg-oatly-pink text-black"
                          : "bg-white text-black"
                      }`}
                    >
                      <div className={`w-5 h-5 border-[2px] border-black flex items-center justify-center ${formData.services.includes(service.id) ? 'bg-black text-white' : 'bg-white'}`}>
                        {formData.services.includes(service.id) && "✓"}
                      </div>
                      {service.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isCalculating}
                className="w-full btn-brutal btn-brutal-pink py-4 font-heading text-xl uppercase flex items-center justify-center gap-2"
              >
                {isCalculating ? (
                  <>Crunching AI Math...</>
                ) : (
                  <>
                    <Calculator className="w-6 h-6" /> Calculate Quotation With AI
                  </>
                )}
              </button>
            </form>

            {/* Sidebar info */}
            <div className="space-y-6">
              <div className="bg-oatly-yellow border-[4px] border-black shadow-[6px_6px_0px_#000] p-6 -rotate-1">
                <h3 className="font-heading text-2xl uppercase mb-3">AI Budget Math</h3>
                <ul className="space-y-3 font-body font-bold text-sm">
                  <li>• Tailored breakdown for small & medium events.</li>
                  <li>• Smart percentage splits across food, decor & music.</li>
                  <li>• Zero guesswork — clear per-guest estimates.</li>
                  <li>• Instant recommendations based on event scale.</li>
                </ul>
              </div>

              <div className="bg-oatly-blue border-[4px] border-black shadow-[6px_6px_0px_#000] p-6 rotate-1 text-black">
                <h3 className="font-heading text-2xl uppercase mb-3">Next Step</h3>
                <p className="font-body font-bold text-sm mb-4">
                  Once your quotation math is done, sign in to search & save verified vendors directly for your event!
                </p>
                <Link to="/signup" className="btn-brutal bg-white hover:bg-black hover:text-white w-full py-2.5 text-xs font-heading uppercase text-center block">
                  Sign Up Now
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
