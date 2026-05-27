import { CalendarDays, DollarSign, Users, Store, Star, BarChart3 } from "lucide-react";

const features = [
  {
    icon: CalendarDays,
    title: "Event Management",
    description: "Create and manage multiple events with full CRUD. Track statuses, venues, and timelines in one dashboard.",
    color: "#818cf8",
    glow: "rgba(129,140,248,0.2)",
  },
  {
    icon: DollarSign,
    title: "Budget Tracking",
    description: "Set budgets per category — venue, catering, decor, and more. Visual progress bars keep spending in check.",
    color: "#67e8f9",
    glow: "rgba(103,232,249,0.2)",
  },
  {
    icon: Users,
    title: "Guest Management",
    description: "Manage your complete guest list with RSVP tracking, dietary restrictions, and table assignments.",
    color: "#f0abfc",
    glow: "rgba(240,171,252,0.2)",
  },
  {
    icon: Store,
    title: "Vendor Marketplace",
    description: "Discover top vendors across 8 categories. Filter by rating, price, and location. Save favourites to events.",
    color: "#c4b5fd",
    glow: "rgba(196,181,253,0.2)",
  },
  {
    icon: Star,
    title: "Reviews & Ratings",
    description: "Leave verified reviews for vendors you've worked with. Help the community find the best partners.",
    color: "#a5f3fc",
    glow: "rgba(165,243,252,0.2)",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Get instant stats on your events — confirmed guests, spend vs. budget, vendor status at a glance.",
    color: "#fbbf24",
    glow: "rgba(251,191,36,0.2)",
  },
];

export default function FeatureSection() {
  return (
    <section className="py-24 relative">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-vapor-border text-sm text-vapor-cyan mb-6">
            Everything You Need
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-slate-100 mb-4">
            Built for Serious{" "}
            <span className="text-gradient">Event Planners</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Six powerful tools working together so you never miss a detail — from first vendor call to final toast.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="glass-card group relative overflow-hidden"
            >
              {/* Glow effect */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                style={{ background: `radial-gradient(circle at 30% 30%, ${f.glow}, transparent 70%)` }}
              />
              <div className="relative">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${f.glow}`, border: `1px solid ${f.color}30` }}
                >
                  <f.icon className="w-6 h-6" style={{ color: f.color }} />
                </div>
                <h3 className="font-heading text-lg font-semibold text-slate-100 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
