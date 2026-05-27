import { Star } from "lucide-react";
import { getInitials } from "../../lib/utils";

const testimonials = [
  { name: "Priya Sharma", role: "Wedding Planner, Mumbai", rating: 5, text: "EventEase transformed how I manage weddings. The vendor marketplace alone saved me 20+ hours per event. My clients love the transparency.", avatar: null, event: "150+ weddings planned" },
  { name: "Rahul Mehta", role: "Corporate Events, Delhi", rating: 5, text: "The budget tracker is phenomenal. I can now give clients real-time spend breakdowns. The RSVP system is flawless for large conferences.", avatar: null, event: "500-person conference" },
  { name: "Ananya Iyer", role: "Bride, Bangalore", rating: 5, text: "Planning our wedding felt impossible until EventEase. Having vendors, guests, and budget all in one place was a game-changer. 10/10 recommend!", avatar: null, event: "Dream wedding" },
  { name: "Vikram Patel", role: "Event Director, Hyderabad", rating: 5, text: "The review system helps me vet vendors before booking. I've discovered gems in the marketplace I never would've found otherwise.", avatar: null, event: "Corporate events" },
];

const colors = ["#818cf8", "#67e8f9", "#f0abfc", "#c4b5fd"];

export default function TestimonialSection() {
  return (
    <section className="py-24">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-slate-100 mb-4">
            Loved by <span className="text-gradient">Planners</span>
          </h2>
          <p className="text-slate-400 text-lg">Real stories from people who've used EventEase</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div key={t.name} className="glass-card flex flex-col gap-4">
              {/* Stars */}
              <div className="flex gap-1">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              {/* Quote */}
              <p className="text-slate-300 text-sm leading-relaxed italic">"{t.text}"</p>
              {/* Author */}
              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-vapor-border">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${colors[i]}, ${colors[(i + 1) % 4]})` }}
                >
                  {getInitials(t.name)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
                <div className="ml-auto">
                  <span className="badge-vapor badge-lavender text-xs">{t.event}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
