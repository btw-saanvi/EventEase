import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, Calendar, Users, DollarSign, Store } from "lucide-react";

export default function Welcome() {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const cards = [
    { icon: Calendar, label: "Create your first event", color: "#818cf8", path: "/dashboard" },
    { icon: Users, label: "Add your guest list", color: "#67e8f9", path: "/guests" },
    { icon: DollarSign, label: "Set your budget", color: "#f0abfc", path: "/budget" },
    { icon: Store, label: "Explore vendors", color: "#c4b5fd", path: "/vendor-marketplace" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-violet-600/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyan-400/8 blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 max-w-2xl w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-8 h-8 text-white" />
        </div>

        <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
          Welcome, <span className="text-gradient">{user?.name?.split(" ")[0] || "Planner"}</span>! 🎉
        </h1>
        <p className="text-slate-400 text-lg mb-12">
          Your event planning journey starts here. What would you like to do first?
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {cards.map(({ icon: Icon, label, color, path }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className="glass-card p-6 text-left hover:border-vapor-lavender/40 transition-all duration-200 group"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{ background: `${color}20` }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <p className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{label}</p>
              <ArrowRight className="w-4 h-4 mt-2 text-slate-500 group-hover:text-vapor-lavender transition-colors" />
            </button>
          ))}
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
        >
          Skip to Dashboard →
        </button>
      </div>
    </div>
  );
}
