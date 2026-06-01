import { CalendarDays, DollarSign, Users, Store, Star, BarChart3 } from "lucide-react";

const features = [
  {
    icon: CalendarDays,
    title: "Event Management",
    description: "Create and manage multiple events with full CRUD. Track statuses, venues, and timelines in one dashboard.",
    color: "#A7D7E8", // Blue
  },
  {
    icon: DollarSign,
    title: "Budget Tracking",
    description: "Set budgets per category — venue, catering, decor, and more. Visual progress bars keep spending in check.",
    color: "#FFD933", // Yellow
  },
  {
    icon: Users,
    title: "Guest Management",
    description: "Manage your complete guest list with RSVP tracking, dietary restrictions, and table assignments.",
    color: "#FFB0C2", // Pink
  },
  {
    icon: Store,
    title: "Vendor Marketplace",
    description: "Discover top vendors across 8 categories. Filter by rating, price, and location. Save favourites to events.",
    color: "#A4CBA3", // Green
  },
  {
    icon: Star,
    title: "Reviews & Ratings",
    description: "Leave verified reviews for vendors you've worked with. Help the community find the best partners.",
    color: "#FFB0C2", // Pink
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Get instant stats on your events — confirmed guests, spend vs. budget, vendor status at a glance.",
    color: "#A7D7E8", // Blue
  },
];

export default function FeatureSection() {
  return (
    <section className="py-24 bg-oatly-bg border-t-[4px] border-black">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 border-[2px] border-black bg-white shadow-[2px_2px_0px_#000] text-xs font-heading uppercase text-black mb-6">
            Everything You Need
          </div>
          <h2 className="font-heading text-4xl md:text-5xl text-black uppercase mb-4">
            Built for Serious <span className="text-oatly-blue">Event Planners</span>
          </h2>
          <p className="text-black/80 font-body font-bold text-lg max-w-2xl mx-auto">
            Six powerful tools working together so you never miss a detail — from first vendor call to final toast.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="brutal-card bg-white p-6 relative overflow-hidden"
            >
              <div className="relative">
                <div
                  className="w-12 h-12 border-[2px] border-black flex items-center justify-center mb-4 shadow-[2px_2px_0px_#000]"
                  style={{ backgroundColor: f.color }}
                >
                  <f.icon className="w-6 h-6 text-black" />
                </div>
                <h3 className="font-heading text-xl text-black uppercase mb-2">{f.title}</h3>
                <p className="text-sm font-body font-semibold text-black/70 leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
