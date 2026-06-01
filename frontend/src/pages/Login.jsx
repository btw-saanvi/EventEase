import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { Sparkles, Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuthContext } from "../context/AuthContext";
import { toast } from "sonner";

export default function Login() {
  const { loginWithEmail, loginWithGoogle, mockLogin, isAuthenticated, loading } = useAuthContext();
  const navigate = useNavigate();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [errors, setErrors]     = useState({});

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  // ── Validation ────────────────────────────────────────────────
  function validate() {
    const e = {};
    if (!email.trim())           e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password)               e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // ── Handlers ──────────────────────────────────────────────────
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const res = await loginWithEmail(email, password);
    if (res.success) {
      toast.success("Welcome back! 🎉");
    } else {
      toast.error(res.error || "Login failed.");
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const res = await loginWithGoogle(tokenResponse);
      if (res.success) toast.success("Signed in with Google!");
      else toast.error(res.error || "Google login failed.");
    },
    onError: () => toast.error("Google login failed. Please try again."),
  });

  const handleMockLogin = async () => {
    const res = await mockLogin();
    if (res.success) toast.success("Signed in as Demo Planner!");
    else toast.error(res.error || "Demo login failed.");
  };

  return (
    <div className="min-h-screen bg-oatly-bg bg-mesh flex items-center justify-center py-16 px-4">
      {/* Decorative blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-oatly-pink rounded-full opacity-30 blur-2xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-oatly-yellow rounded-full opacity-20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-oatly-blue rounded-full opacity-15 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div className="brutal-card bg-white p-8 md:p-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-oatly-yellow border-2 border-oatly-text flex items-center justify-center shadow-brutal">
              <Sparkles className="w-5 h-5 text-oatly-text" />
            </div>
            <span className="font-heading text-2xl text-oatly-text">EventEase</span>
          </div>

          <h1 className="font-heading text-4xl text-oatly-text mb-1">Welcome back!</h1>
          <p className="text-oatly-text/60 text-sm mb-8 font-body">Sign in to continue planning your perfect events.</p>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} noValidate className="space-y-4">
            {/* Email */}
            <div>
              <label className="block font-body font-semibold text-oatly-text text-sm mb-1" htmlFor="login-email">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-oatly-text/40" />
                <input
                  id="login-email"
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
              <div className="flex items-center justify-between mb-1">
                <label className="block font-body font-semibold text-oatly-text text-sm" htmlFor="login-password">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs font-semibold text-oatly-brown hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-oatly-text/40" />
                <input
                  id="login-password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors(v => ({...v, password: ""})); }}
                  placeholder="••••••••"
                  className={`input-brutal pl-10 pr-10 ${errors.password ? "border-red-500 shadow-[2px_2px_0px_#ef4444]" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-oatly-text/40 hover:text-oatly-text transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.password}</p>}
            </div>

            {/* Login Button */}
            <button
              id="email-login-btn"
              type="submit"
              disabled={loading}
              className="btn-brutal w-full py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-oatly-text/30 border-t-oatly-text rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-dashed border-oatly-text/20" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs font-semibold text-oatly-text/50 uppercase tracking-widest font-body">
                or continue with
              </span>
            </div>
          </div>

          {/* Google Button */}
          <button
            id="google-login-btn"
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
            Continue with Google
          </button>

          {/* Demo Button */}
          <button
            id="mock-login-btn"
            onClick={handleMockLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-dashed border-oatly-text/40 hover:border-oatly-text bg-transparent hover:bg-oatly-pink/20 text-oatly-text/70 font-body font-semibold transition-all duration-150 text-sm disabled:opacity-50"
          >
            ⚡ Try Demo (no account needed)
          </button>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t-2 border-dashed border-oatly-text/10 text-center">
            <p className="text-sm text-oatly-text/60 font-body">
              Don't have an account?{" "}
              <Link to="/signup" className="text-oatly-text font-bold underline underline-offset-2 hover:text-oatly-brown transition-colors">
                Sign up free →
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="mt-4 text-center">
          <p className="text-xs text-oatly-text/40 font-body">
            By signing in, you agree to our{" "}
            <span className="underline cursor-pointer hover:text-oatly-text/70">Terms</span>
            {" "}and{" "}
            <span className="underline cursor-pointer hover:text-oatly-text/70">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}
