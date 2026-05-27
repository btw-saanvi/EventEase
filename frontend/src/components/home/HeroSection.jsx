import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Play, Star } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-violet-600/10 blur-3xl animate-pulse" style={{ animationDuration: "4s" }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyan-400/8 blur-3xl animate-pulse" style={{ animationDuration: "6s", animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-pink-400/8 blur-3xl animate-pulse" style={{ animationDuration: "5s", animationDelay: "1s" }} />
      </div>

      <div className="section-container relative z-10 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-vapor-border text-sm text-vapor-lavender mb-8 animate-slide-in-up">
            <Sparkles className="w-3.5 h-3.5" />
            <span>All-in-One Event Planning Platform</span>
          </div>

          {/* Headline */}
          <h1 className="font-heading text-5xl md:text-7xl font-bold leading-tight mb-6 animate-slide-in-up" style={{ animationDelay: "0.1s" }}>
            Plan Events That{" "}
            <span className="text-gradient">Leave Memories</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10 animate-slide-in-up" style={{ animationDelay: "0.2s" }}>
            Connect with top vendors, manage your budget effortlessly, track every RSVP, and deliver events that wow — all from one beautiful workspace.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-in-up" style={{ animationDelay: "0.3s" }}>
            <Link to="/signup" className="btn-vapor-solid gap-2 px-8 py-3 text-base">
              Start Planning Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/home" className="btn-vapor gap-2 px-8 py-3 text-base">
              <Play className="w-4 h-4" />
              See How It Works
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-sm text-slate-400 ml-2">4.9/5 from 2,400+ planners</span>
            </div>
            <div className="w-px h-4 bg-vapor-border hidden sm:block" />
            <div className="text-sm text-slate-400">
              <span className="text-vapor-lavender font-semibold">10,000+</span> events planned
            </div>
          </div>
        </div>

        {/* Dashboard Preview Card */}
        <div className="mt-20 max-w-4xl mx-auto animate-float" style={{ animationDelay: "0.4s" }}>
          <div className="glass-card p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 h-6 rounded-md bg-white/5 max-w-xs" />
            </div>
            {/* Mock dashboard grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {[
                { label: "Events", value: "12", color: "#818cf8" },
                { label: "Guests", value: "348", color: "#67e8f9" },
                { label: "Budget", value: "₹4.2L", color: "#f0abfc" },
                { label: "Vendors", value: "24", color: "#c4b5fd" },
              ].map((stat) => (
                <div key={stat.label} className="stat-card text-center">
                  <div className="text-2xl font-heading font-bold mb-1" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="text-xs text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {["Wedding Celebration", "Corporate Gala", "Birthday Party"].map((name, i) => (
                <div key={name} className="stat-card">
                  <div className="text-xs font-medium text-slate-300 mb-2 truncate">{name}</div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-violet-600 to-cyan-500" style={{ width: `${[75, 45, 90][i]}%` }} />
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{[75, 45, 90][i]}% planned</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
