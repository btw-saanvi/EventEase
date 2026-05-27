import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24">
      <div className="section-container">
        <div className="relative overflow-hidden rounded-3xl p-12 md:p-20 text-center">
          {/* Aurora background */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/60 via-indigo-900/40 to-cyan-900/30" />
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 30% 50%, rgba(124,58,237,0.3) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(103,232,249,0.15) 0%, transparent 60%)"
          }} />
          <div className="absolute inset-0 border border-vapor-border rounded-3xl" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm text-vapor-lavender mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              Free to start. No credit card required.
            </div>

            <h2 className="font-heading text-4xl md:text-6xl font-bold text-white mb-6">
              Your Next Event Starts{" "}
              <span className="text-gradient">Today</span>
            </h2>

            <p className="text-lg text-slate-300 max-w-xl mx-auto mb-10">
              Join thousands of planners who trust EventEase to deliver flawless events, every time.
            </p>

            <Link to="/signup" className="btn-vapor-solid gap-2 px-10 py-4 text-lg inline-flex">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
