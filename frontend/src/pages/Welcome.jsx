import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, Calendar, Users, DollarSign, Store } from "lucide-react";

export default function Welcome() {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const cards = [
    { icon: Calendar, label: "Create your first event", color: "bg-oatly-pink", path: "/dashboard" },
    { icon: Users, label: "Add your guest list", color: "bg-oatly-blue", path: "/guests" },
    { icon: DollarSign, label: "Set your budget", color: "bg-oatly-yellow", path: "/budget" },
    { icon: Store, label: "Explore vendors", color: "bg-oatly-green", path: "/vendor-marketplace" },
  ];

  return (
    <div className="min-h-screen bg-oatly-bg bg-mesh flex items-center justify-center px-4 py-16 relative overflow-hidden">
      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* Sparkles Icon Bubble */}
        <div className="w-16 h-16 bg-oatly-yellow border-[3px] border-black shadow-[4px_4px_0px_#000] flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-8 h-8 text-black" />
        </div>

        <h1 className="font-heading text-4xl md:text-5xl text-black uppercase tracking-wide mb-3 leading-tight">
          Welcome, <span className="underline decoration-oatly-pink decoration-[6px]">{user?.name?.split(" ")[0] || "Planner"}</span>! 🎉
        </h1>
        <p className="font-body font-bold text-black text-lg mb-10 max-w-md mx-auto">
          Your event planning journey starts here. What would you like to do first?
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          {cards.map(({ icon: Icon, label, color, path }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className="brutal-card p-6 bg-white text-left transition-all duration-150 group flex flex-col justify-between hover:translate-x-[2px] hover:translate-y-[2px]"
            >
              <div>
                <div className={`w-12 h-12 ${color} border-[3px] border-black shadow-[3px_3px_0px_#000] flex items-center justify-center mb-4 group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-[2px_2px_0px_#000] transition-all`}>
                  <Icon className="w-6 h-6 text-black" />
                </div>
                <h3 className="font-heading text-lg uppercase text-black mb-1">{label}</h3>
                <p className="font-body text-xs text-black/60 font-semibold">Get started on this now</p>
              </div>
              <div className="flex items-center gap-2 mt-4 font-heading text-xs uppercase text-black group-hover:text-oatly-pink transition-colors">
                Let's go <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="btn-brutal text-sm py-2.5 px-6"
        >
          Skip to Dashboard →
        </button>
      </div>
    </div>
  );
}
