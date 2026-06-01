import { Star } from "lucide-react";
import { getInitials } from "../../lib/utils";

const testimonials = [
  { name: "Priya Sharma", role: "Wedding Planner, Mumbai", rating: 5, text: "EventEase transformed how I manage weddings. The vendor marketplace alone saved me 20+ hours per event. My clients love the transparency.", event: "150+ weddings planned", color: "bg-oatly-pink" },
  { name: "Rahul Mehta", role: "Corporate Events, Delhi", rating: 5, text: "The budget tracker is phenomenal. I can now give clients real-time spend breakdowns. The RSVP system is flawless for large conferences.", event: "500-person conference", color: "bg-oatly-blue" },
  { name: "Ananya Iyer", role: "Bride, Bangalore", rating: 5, text: "Planning our wedding felt impossible until EventEase. Having vendors, guests, and budget all in one place was a game-changer. 10/10 recommend!", event: "Dream wedding", color: "bg-oatly-yellow" },
  { name: "Vikram Patel", role: "Event Director, Hyderabad", rating: 5, text: "The review system helps me vet vendors before booking. I've discovered gems in the marketplace I never would've found otherwise.", event: "Corporate events", color: "bg-oatly-green" },
];

export default function TestimonialSection() {
  return (
    <section className="py-24 bg-white border-b-[4px] border-black">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="font-heading text-5xl md:text-7xl text-black uppercase mb-4">
            Loved by Planners
          </h2>
          <p className="font-body font-bold text-black/60 text-lg">Real stories from people who've used EventEase</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`brutal-card ${i % 2 === 0 ? "bg-white" : "bg-oatly-bg"} p-6 flex flex-col gap-4`}
            >
              {/* Stars */}
              <div className="flex gap-1">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              {/* Quote */}
              <p className="font-body font-semibold text-black/80 leading-relaxed flex-1">"{t.text}"</p>
              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t-2 border-black/10">
                <div className={`w-10 h-10 border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center text-sm font-heading text-black flex-shrink-0 ${t.color}`}>
                  {getInitials(t.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-heading uppercase text-black truncate">{t.name}</p>
                  <p className="text-xs font-body font-bold text-black/50 truncate">{t.role}</p>
                </div>
                <span className="flex-shrink-0 px-2 py-0.5 border-2 border-black bg-oatly-yellow text-xs font-heading uppercase text-black shadow-[2px_2px_0px_#000]">
                  {t.event}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
