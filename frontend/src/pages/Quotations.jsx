import { useState } from "react";
import { Calculator, Send, AlertCircle, CheckCircle2 } from "lucide-react";

export default function Quotations() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "wedding",
    eventDate: "",
    guests: "100",
    budget: "medium",
    services: [],
    details: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.eventDate) {
      setError("We need at least your name, email, and the date of this hypothetical bash!");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  const serviceOptions = [
    { id: "venue", label: "Epic Venue (A Place to Stand)" },
    { id: "catering", label: "Catering (Food People Actually Eat)" },
    { id: "decor", label: "Decor & Lighting (Make It Pretty)" },
    { id: "photo", label: "Photography (Proof It Happened)" },
    { id: "music", label: "DJ & Sound (Awkward Dancing Facilitators)" },
    { id: "planning", label: "Full Coordination (We Do the Worrying)" },
  ];

  return (
    <div className="min-h-screen bg-oatly-bg pt-20 pb-12">
      <div className="section-container max-w-4xl">
        <h1 className="font-heading text-5xl md:text-7xl text-black uppercase mb-4 drop-shadow-[4px_4px_0px_#fca5a5]">
          Quotations (The Math)
        </h1>
        <p className="font-heading text-xl uppercase mb-10 text-gray-800">
          Tell us what you're plotting. We'll add up the numbers and tell you how much it costs.
        </p>

        {submitted ? (
          <div className="bg-oatly-pink border-[4px] border-black shadow-[8px_8px_0px_#000] p-8 md:p-12 rotate-1 text-center my-12">
            <CheckCircle2 className="w-16 h-16 text-black mx-auto mb-6" />
            <h2 className="font-heading text-4xl uppercase mb-4">Numbers Sent to the Robots!</h2>
            <p className="font-body font-bold text-xl mb-6 max-w-lg mx-auto">
              We've received your request for the ultimate {formData.eventType} on {formData.eventDate}. 
              Our team of highly-trained carbon-based lifelike organizers will crunch the numbers and email you back soon.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="btn-brutal btn-brutal-blue px-8 py-3 font-heading text-lg"
            >
              Do It Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* The Form */}
            <form
              onSubmit={handleSubmit}
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
                <h3 className="font-heading text-2xl uppercase border-b-[3px] border-black pb-2">1. Who are you?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-heading uppercase text-sm mb-1">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Jane Doe (or whoever you are)"
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
                      placeholder="you@internet.com"
                      className="w-full p-3 border-[3px] border-black font-body font-medium focus:outline-none focus:bg-oatly-yellow"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-heading uppercase text-sm mb-1">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full p-3 border-[3px] border-black font-body font-medium focus:outline-none focus:bg-oatly-yellow"
                  />
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-4 pt-4">
                <h3 className="font-heading text-2xl uppercase border-b-[3px] border-black pb-2">2. The Grand Plan</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-heading uppercase text-sm mb-1">What kind of event?</label>
                    <select
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleInputChange}
                      className="w-full p-3 border-[3px] border-black font-heading uppercase text-sm focus:outline-none bg-white focus:bg-oatly-yellow"
                    >
                      <option value="wedding">Wedding (Big Day)</option>
                      <option value="birthday">Birthday (Getting Older)</option>
                      <option value="corporate">Corporate (Professional Stuff)</option>
                      <option value="anniversary">Anniversary (Milestone)</option>
                      <option value="festival">Festival / Concert</option>
                      <option value="other">Something Else Entirely</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-heading uppercase text-sm mb-1">When is this happening?</label>
                    <input
                      type="date"
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={handleInputChange}
                      className="w-full p-3 border-[3px] border-black font-body focus:outline-none focus:bg-oatly-yellow"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-heading uppercase text-sm mb-1">How many people are coming?</label>
                    <select
                      name="guests"
                      value={formData.guests}
                      onChange={handleInputChange}
                      className="w-full p-3 border-[3px] border-black font-heading uppercase text-sm focus:outline-none bg-white focus:bg-oatly-yellow"
                    >
                      <option value="under50">Just a few intimate friends (&lt; 50)</option>
                      <option value="100">Decent crowd (50 - 150)</option>
                      <option value="300">A serious gathering (150 - 350)</option>
                      <option value="500+">An absolute festival (350+)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-heading uppercase text-sm mb-1">Budget Expectation</label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="w-full p-3 border-[3px] border-black font-heading uppercase text-sm focus:outline-none bg-white focus:bg-oatly-yellow"
                    >
                      <option value="low">Keep it modest (Tight strings)</option>
                      <option value="medium">Reasonable (Good bang for buck)</option>
                      <option value="high">Premium (No expense spared)</option>
                      <option value="crazy">Unreasonable (I want a castle)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Services Required */}
              <div className="space-y-4 pt-4">
                <h3 className="font-heading text-2xl uppercase border-b-[3px] border-black pb-2">3. Services You Actually Need</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {serviceOptions.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => handleServiceChange(service.id)}
                      className={`flex items-center gap-3 p-3 border-[3px] border-black text-left font-heading text-xs uppercase transition-all shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000] ${
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

              {/* Details */}
              <div className="space-y-2 pt-4">
                <label className="block font-heading uppercase text-sm">Any extra secrets or requests?</label>
                <textarea
                  name="details"
                  value={formData.details}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Tell us about the dream, the theme, or the weird things you want."
                  className="w-full p-3 border-[3px] border-black font-body font-medium focus:outline-none focus:bg-oatly-yellow"
                ></textarea>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full btn-brutal btn-brutal-pink py-4 font-heading text-xl uppercase flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" /> Calculate the Damage
              </button>
            </form>

            {/* Sidebar info */}
            <div className="space-y-6">
              <div className="bg-oatly-yellow border-[4px] border-black shadow-[6px_6px_0px_#000] p-6 -rotate-1">
                <h3 className="font-heading text-2xl uppercase mb-3">Why fill this out?</h3>
                <ul className="space-y-3 font-body font-bold text-sm">
                  <li>• Get actual prices, not generic estimates.</li>
                  <li>• Custom curated vendor suggestions.</li>
                  <li>• 100% free with absolutely no pressure.</li>
                  <li>• It makes you feel like an organized planner.</li>
                </ul>
              </div>

              <div className="bg-oatly-blue border-[4px] border-black shadow-[6px_6px_0px_#000] p-6 rotate-1 text-black">
                <h3 className="font-heading text-2xl uppercase mb-3">How it works</h3>
                <ol className="space-y-3 font-body font-bold text-sm">
                  <li><span className="font-heading">1.</span> You fill the form.</li>
                  <li><span className="font-heading">2.</span> The robots analyze.</li>
                  <li><span className="font-heading">3.</span> Humans double-check.</li>
                  <li><span className="font-heading">4.</span> We send you a nice PDF.</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
