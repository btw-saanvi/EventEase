import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { Sparkles, Check } from "lucide-react";
import { useAuthContext } from "../context/AuthContext";
import { toast } from "sonner";

const features = [
  "Manage unlimited events",
  "Budget tracking & analytics",
  "Guest list & RSVP management",
  "Vendor marketplace access",
];

export default function Signup() {
  const { loginWithGoogle, mockLogin, isAuthenticated, loading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const res = await loginWithGoogle(tokenResponse);
      if (res.success) {
        toast.success("Account created successfully!");
      } else {
        toast.error(res.error || "Sign up failed.");
      }
    },
    onError: () => toast.error("Google sign up failed. Please try again."),
  });

  const handleSignup = () => {
    try {
      googleLogin();
    } catch {
      toast.error("Sign up failed. Please try again.");
    }
  };

  const handleMockSignup = async () => {
    try {
      const res = await mockLogin();
      if (res.success) {
        toast.success("Signed up as Demo Planner!");
      } else {
        toast.error(res.error || "Demo signup failed.");
      }
    } catch (err) {
      toast.error("Demo signup failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-1/3 w-96 h-96 rounded-full bg-pink-500/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-indigo-400/8 blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left: Features */}
        <div className="hidden md:block">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading text-xl font-bold text-gradient">EventEase</span>
          </div>
          <h2 className="font-heading text-4xl font-bold text-white mb-4 leading-tight">
            Plan events that <span className="text-gradient">wow</span> everyone
          </h2>
          <p className="text-slate-400 mb-8">Join thousands of event planners who use EventEase to create unforgettable experiences.</p>
          <ul className="space-y-4">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-slate-300">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Sign up form */}
        <div className="glass-card p-8 md:p-10 text-center">
          <div className="inline-flex items-center gap-2 mb-6 md:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading text-xl font-bold text-gradient">EventEase</span>
          </div>

          <h1 className="font-heading text-2xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-slate-400 mb-8 text-sm">Free forever. No credit card required.</p>

          <button
            id="google-signup-btn"
            onClick={handleSignup}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl border border-vapor-border bg-white/5 hover:bg-white/10 text-white font-medium transition-all duration-200 hover:border-vapor-lavender/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-vapor-lavender/30 border-t-vapor-lavender rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            {loading ? "Creating account..." : "Sign up with Google"}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-vapor-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0a0a0f] px-2 text-slate-500 font-mono">Or for quick preview</span>
            </div>
          </div>

          <button
            id="mock-signup-btn"
            onClick={handleMockSignup}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-dashed border-vapor-lavender/30 hover:border-vapor-lavender/70 bg-vapor-lavender/5 hover:bg-vapor-lavender/10 text-vapor-lavender font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sign in as Demo User (Bypass Google)
          </button>

          <p className="text-xs text-slate-500 mt-6">
            By signing up, you agree to our{" "}
            <span className="text-vapor-lavender cursor-pointer hover:underline">Terms of Service</span>
            {" "}and{" "}
            <span className="text-vapor-lavender cursor-pointer hover:underline">Privacy Policy</span>
          </p>

          <div className="mt-6 pt-6 border-t border-vapor-border">
            <p className="text-sm text-slate-400">
              Already have an account?{" "}
              <a href="/login" className="text-vapor-lavender hover:underline font-medium">Sign in</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
