import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24 bg-oatly-bg border-t-[4px] border-black">
      <div className="section-container">
        <div className="brutal-card bg-oatly-yellow p-12 md:p-20 text-center relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 border-[2px] border-black bg-white shadow-[2px_2px_0px_#000] text-xs font-heading uppercase text-black mb-8">
              <Sparkles className="w-3.5 h-3.5 fill-[#FFD933] stroke-black stroke-[2px]" />
              Free to start. No credit card required.
            </div>

            <h2 className="font-heading text-4xl md:text-6xl text-black uppercase mb-6">
              Your Next Event Starts <span className="text-oatly-pink">Today</span>
            </h2>

            <p className="text-lg font-body font-bold text-black/80 max-w-xl mx-auto mb-10">
              Join thousands of planners who trust EventEase to deliver flawless events, every time.
            </p>

            <Link to="/signup" className="btn-brutal btn-brutal-pink gap-2 px-10 py-4 text-lg inline-flex">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
