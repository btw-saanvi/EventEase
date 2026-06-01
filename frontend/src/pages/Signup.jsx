import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { Sparkles, Eye, EyeOff, Mail, Lock, User, Check, ArrowRight } from "lucide-react";
import { useAuthContext } from "../context/AuthContext";
import { toast } from "sonner";

const FEATURES = [
  { emoji: "🗓️", text: "Manage unlimited events" },
  { emoji: "💰", text: "Budget tracking & analytics" },
  { emoji: "👥", text: "Guest list & RSVP management" },
  { emoji: "🏪", text: "Vendor marketplace access" },
];

export default function Signup() {
  const { registerWithEmail, loginWithGoogle, mockLogin, isAuthenticated, loading } = useAuthContext();
  const navigate = useNavigate();

  const [name, setName]             = useState("");
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [confirm, setConfirm]       = useState("");
  const [showPw, setShowPw]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors]         = useState({});

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  // ── Validation ─────────────────────────────────────────────────
  function validate() {
    const e = {};
    if (!name.trim())                   e.name    = "Full name is required";
    if (!email.trim())                  e.email   = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password)                      e.password = "Password is required";
    else if (password.length < 6)       e.password = "Must be at least 6 characters";
    if (!confirm)                       e.confirm  = "Please confirm your password";
    else if (confirm !== password)      e.confirm  = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // ── Handlers ──────────────────────────────────────────────────
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const res = await registerWithEmail(name.trim(), email.trim(), password);
    if (res.success) {
      toast.success("Account created! Welcome to EventEase 🎉");
    } else {
      toast.error(res.error || "Sign up failed.");
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const res = await loginWithGoogle(tokenResponse);
      if (res.success) toast.success("Account created with Google!");
      else toast.error(res.error || "Google sign up failed.");
    },
    onError: () => toast.error("Google sign up failed. Please try again."),
  });

  const handleMockSignup = async () => {
    const res = await mockLogin();
    if (res.success) toast.success("Signed in as Demo Planner!");
    else toast.error(res.error || "Demo login failed.");
  };

  // ── Password strength ─────────────────────────────────────────
  const strength = password.length === 0 ? 0
    : password.length < 6 ? 1
    : password.length < 10 ? 2
    : 3;
  const strengthLabel = ["", "Weak", "Good", "Strong"][strength];
  const strengthColor = ["", "bg-red-400", "bg-oatly-yellow", "bg-oatly-green"][strength];

  return (
    <div className="min-h-screen bg-oatly-bg bg-mesh flex items-center justify-center py-16 px-4">
      {/* Decorative */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-10 right-10 w-72 h-72 bg-oatly-yellow rounded-full opacity-25 blur-3xl" />
        <div className="absolute bottom-10 -left-10 w-64 h-64 bg-oatly-pink rounded-full opacity-30 blur-2xl" />
      </div>

      <div className="relative z-10 w-full max-w-5xl grid md:grid-cols-2 gap-8 items-start">

        {/* ── Left: Feature Panel ─────────────────────────────────── */}
        <div className="hidden md:flex flex-col justify-center pt-8">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-oatly-yellow border-2 border-oatly-text flex items-center justify-center shadow-brutal">
              <Sparkles className="w-5 h-5 text-oatly-text" />
            </div>
            <span className="font-heading text-2xl text-oatly-text">EventEase</span>
          </div>

          <h2 className="font-heading text-5xl text-oatly-text leading-tight mb-4">
            Plan events that{" "}
            <span className="inline-block bg-oatly-pink border-2 border-oatly-text px-2 -rotate-1">
              wow
            </span>{" "}
            everyone
          </h2>
          <p className="text-oatly-text/60 font-body mb-10 text-lg">
            Join thousands of event planners who use EventEase to create unforgettable experiences.
          </p>

          <ul className="space-y-4">
            {FEATURES.map((f) => (
              <li key={f.text} className="flex items-center gap-4">
                <div className="w-9 h-9 flex-shrink-0 bg-oatly-yellow border-2 border-oatly-text flex items-center justify-center text-base shadow-brutal">
                  {f.emoji}
                </div>
                <span className="font-body font-semibold text-oatly-text">{f.text}</span>
              </li>
            ))}
          </ul>

          {/* Social proof */}
          <div className="mt-10 brutal-card bg-oatly-pink/30 p-4 inline-flex items-center gap-3">
            <div className="flex -space-x-2">
              {["Ada", "Bob", "Cal", "Dev"].map((s) => (
                <img
                  key={s}
                  src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${s}`}
                  className="w-8 h-8 rounded-full border-2 border-oatly-text bg-white"
                  alt={s}
                />
              ))}
            </div>
            <p className="text-sm font-body font-semibold text-oatly-text">
              2,000+ events planned this month
            </p>
          </div>
        </div>

        {/* ── Right: Signup Form ──────────────────────────────────── */}
        <div className="brutal-card bg-white p-8 md:p-10">
          {/* Mobile logo */}
          <div className="flex md:hidden items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-oatly-yellow border-2 border-oatly-text flex items-center justify-center shadow-brutal">
              <Sparkles className="w-5 h-5 text-oatly-text" />
            </div>
            <span className="font-heading text-2xl text-oatly-text">EventEase</span>
          </div>

          <h1 className="font-heading text-3xl text-oatly-text mb-1">Create account</h1>
          <p className="text-oatly-text/55 text-sm font-body mb-7">Free forever. No credit card required.</p>

          <form onSubmit={handleSignup} noValidate className="space-y-4">
            {/* Name */}
            <div>
              <label className="block font-body font-semibold text-oatly-text text-sm mb-1" htmlFor="signup-name">
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-oatly-text/40" />
                <input
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setErrors(v => ({...v, name: ""})); }}
                  placeholder="Jane Smith"
                  className={`input-brutal pl-10 ${errors.name ? "border-red-500 shadow-[2px_2px_0px_#ef4444]" : ""}`}
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block font-body font-semibold text-oatly-text text-sm mb-1" htmlFor="signup-email">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-oatly-text/40" />
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors(v => ({...v, email: ""})); }}
                  placeholder="you@example.com"
                  className={`input-brutal pl-10 ${errors.email ? "border-red-500 shadow-[2px_2px_0px_#ef4444]" : ""}`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block font-body font-semibold text-oatly-text text-sm mb-1" htmlFor="signup-password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-oatly-text/40" />
                <input
                  id="signup-password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors(v => ({...v, password: ""})); }}
                  placeholder="Min. 6 characters"
                  className={`input-brutal pl-10 pr-10 ${errors.password ? "border-red-500 shadow-[2px_2px_0px_#ef4444]" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-oatly-text/40 hover:text-oatly-text"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Strength bar */}
              {password && (
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex gap-1 flex-1">
                    {[1,2,3].map(i => (
                      <div key={i} className={`h-1.5 flex-1 border border-oatly-text/20 ${i <= strength ? strengthColor : "bg-oatly-text/10"}`} />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-oatly-text/60">{strengthLabel}</span>
                </div>
              )}
              {errors.password && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block font-body font-semibold text-oatly-text text-sm mb-1" htmlFor="signup-confirm">
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-oatly-text/40" />
                <input
                  id="signup-confirm"
                  type={showConfirm ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => { setConfirm(e.target.value); setErrors(v => ({...v, confirm: ""})); }}
                  placeholder="Re-enter password"
                  className={`input-brutal pl-10 pr-10 ${errors.confirm ? "border-red-500 shadow-[2px_2px_0px_#ef4444]" : confirm && confirm === password ? "border-green-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-oatly-text/40 hover:text-oatly-text"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirm && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.confirm}</p>}
              {!errors.confirm && confirm && confirm === password && (
                <p className="text-green-600 text-xs mt-1 font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Passwords match
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              id="signup-btn"
              type="submit"
              disabled={loading}
              className="btn-brutal w-full py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-oatly-text/30 border-t-oatly-text rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-dashed border-oatly-text/20" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs font-semibold text-oatly-text/50 uppercase tracking-widest">
                or
              </span>
            </div>
          </div>

          {/* Google */}
          <button
            id="google-signup-btn"
            onClick={() => googleLogin()}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 border-2 border-oatly-text bg-oatly-blue hover:bg-oatly-blue/80 text-oatly-text font-body font-semibold transition-all duration-150 shadow-brutal hover:shadow-brutal-hover hover:translate-x-0.5 hover:translate-y-0.5 disabled:opacity-50 mb-3"
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign up with Google
          </button>

          {/* Demo */}
          <button
            id="mock-signup-btn"
            onClick={handleMockSignup}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-dashed border-oatly-text/40 hover:border-oatly-text bg-transparent hover:bg-oatly-pink/20 text-oatly-text/70 font-body font-semibold transition-all duration-150 text-sm disabled:opacity-50"
          >
            ⚡ Try Demo (no account needed)
          </button>

          {/* Footer */}
          <div className="mt-6 pt-5 border-t-2 border-dashed border-oatly-text/10 text-center">
            <p className="text-sm text-oatly-text/60 font-body">
              Already have an account?{" "}
              <Link to="/login" className="text-oatly-text font-bold underline underline-offset-2 hover:text-oatly-brown transition-colors">
                Sign in →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
