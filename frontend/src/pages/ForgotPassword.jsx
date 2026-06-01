import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, ShieldCheck, Lock, Eye, EyeOff, CheckCircle, RefreshCw } from "lucide-react";
import { useAuthContext } from "../context/AuthContext";
import { toast } from "sonner";

const STEPS = [
  { id: 1, label: "Enter Email"    },
  { id: 2, label: "Verify OTP"    },
  { id: 3, label: "New Password"  },
];

export default function ForgotPassword() {
  const { forgotPassword, verifyOTP, resetPassword, loading } = useAuthContext();
  const navigate = useNavigate();

  const [step, setStep]         = useState(1);
  const [email, setEmail]       = useState("");
  const [otp, setOtp]           = useState(["", "", "", "", "", ""]);
  const [newPw, setNewPw]       = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors]     = useState({});
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef([]);

  // ── OTP helpers ──────────────────────────────────────────────
  function handleOtpChange(idx, val) {
    val = val.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  }

  function handleOtpKeyDown(idx, e) {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && idx > 0) otpRefs.current[idx - 1]?.focus();
    if (e.key === "ArrowRight" && idx < 5) otpRefs.current[idx + 1]?.focus();
  }

  function handleOtpPaste(e) {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length > 0) {
      const next = [...otp];
      text.split("").forEach((ch, i) => { if (i < 6) next[i] = ch; });
      setOtp(next);
      otpRefs.current[Math.min(text.length, 5)]?.focus();
      e.preventDefault();
    }
  }

  // ── Resend timer ─────────────────────────────────────────────
  function startResendTimer() {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer(t => {
        if (t <= 1) { clearInterval(interval); return 0; }
        return t - 1;
      });
    }, 1000);
  }

  // ── Step 1: Send OTP ─────────────────────────────────────────
  async function handleSendOTP(e) {
    e.preventDefault();
    if (!email.trim())                { setErrors({ email: "Email is required" }); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setErrors({ email: "Enter a valid email" }); return; }
    setErrors({});
    const res = await forgotPassword(email.trim());
    if (res.success) {
      if (res.devOtp) {
        toast.success(`OTP generated (Dev Mode)! Code: ${res.devOtp}`);
        setOtp(res.devOtp.split(""));
      } else {
        toast.success("OTP sent! Check your email 📬");
      }
      setStep(2);
      startResendTimer();
    } else {
      toast.error(res.error || "Could not send OTP.");
    }
  }

  // ── Step 2: Verify OTP ────────────────────────────────────────
  async function handleVerifyOTP(e) {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) { setErrors({ otp: "Enter all 6 digits" }); return; }
    setErrors({});
    const res = await verifyOTP(email.trim(), code);
    if (res.success) {
      toast.success("OTP verified! Set your new password.");
      setStep(3);
    } else {
      toast.error(res.error || "Invalid OTP.");
      setErrors({ otp: res.error || "Incorrect OTP" });
    }
  }

  // ── Step 3: Reset Password ────────────────────────────────────
  async function handleResetPassword(e) {
    e.preventDefault();
    const errs = {};
    if (!newPw)           errs.newPw    = "Password is required";
    else if (newPw.length < 6) errs.newPw = "At least 6 characters";
    if (!confirmPw)       errs.confirmPw = "Please confirm your password";
    else if (confirmPw !== newPw) errs.confirmPw = "Passwords do not match";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    const res = await resetPassword(email.trim(), otp.join(""), newPw);
    if (res.success) {
      toast.success("Password reset! You can now log in 🎉");
      navigate("/login");
    } else {
      toast.error(res.error || "Reset failed.");
    }
  }

  // ── Resend OTP ────────────────────────────────────────────────
  async function handleResend() {
    if (resendTimer > 0) return;
    const res = await forgotPassword(email.trim());
    if (res.success) {
      if (res.devOtp) {
        toast.success(`New OTP generated (Dev Mode)! Code: ${res.devOtp}`);
        setOtp(res.devOtp.split(""));
      } else {
        toast.success("New OTP sent!");
        setOtp(["","","","","",""]);
      }
      setErrors({});
      startResendTimer();
    } else {
      toast.error(res.error || "Could not resend OTP.");
    }
  }

  return (
    <div className="min-h-screen bg-oatly-bg bg-mesh flex items-center justify-center py-16 px-4">
      {/* Decorative blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-56 h-56 bg-oatly-blue rounded-full opacity-30 blur-2xl" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-oatly-pink rounded-full opacity-25 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back link */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm font-semibold text-oatly-text/60 hover:text-oatly-text mb-6 transition-colors font-body"
        >
          <ArrowLeft className="w-4 h-4" /> Back to login
        </Link>

        <div className="brutal-card bg-white p-8 md:p-10">
          {/* Step indicator */}
          <div className="flex items-center gap-0 mb-8">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className={`w-8 h-8 rounded-full border-2 border-oatly-text flex items-center justify-center text-sm font-bold font-body transition-all ${
                      step > s.id
                        ? "bg-oatly-yellow text-oatly-text"
                        : step === s.id
                        ? "bg-oatly-text text-white"
                        : "bg-white text-oatly-text/40"
                    }`}
                  >
                    {step > s.id ? <CheckCircle className="w-4 h-4" /> : s.id}
                  </div>
                  <span className={`text-[10px] font-semibold mt-1 font-body whitespace-nowrap ${step === s.id ? "text-oatly-text" : "text-oatly-text/40"}`}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 mb-4 ${step > s.id ? "bg-oatly-yellow border border-oatly-text" : "bg-oatly-text/15"}`} />
                )}
              </div>
            ))}
          </div>

          {/* ── STEP 1: Email ──────────────────────────────────── */}
          {step === 1 && (
            <>
              <div className="w-14 h-14 bg-oatly-blue border-2 border-oatly-text flex items-center justify-center shadow-brutal mb-5">
                <Mail className="w-7 h-7 text-oatly-text" />
              </div>
              <h1 className="font-heading text-3xl text-oatly-text mb-1">Forgot password?</h1>
              <p className="text-oatly-text/55 text-sm font-body mb-7">
                Enter your registered email and we'll send you a 6-digit OTP to reset your password.
              </p>
              <form onSubmit={handleSendOTP} noValidate className="space-y-4">
                <div>
                  <label className="block font-body font-semibold text-oatly-text text-sm mb-1" htmlFor="fp-email">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-oatly-text/40" />
                    <input
                      id="fp-email"
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setErrors({}); }}
                      placeholder="you@example.com"
                      className={`input-brutal pl-10 ${errors.email ? "border-red-500 shadow-[2px_2px_0px_#ef4444]" : ""}`}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.email}</p>}
                </div>
                <button
                  id="send-otp-btn"
                  type="submit"
                  disabled={loading}
                  className="btn-brutal w-full py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-oatly-text/30 border-t-oatly-text rounded-full animate-spin" />
                  ) : "Send OTP →"}
                </button>
              </form>
            </>
          )}

          {/* ── STEP 2: OTP ───────────────────────────────────── */}
          {step === 2 && (
            <>
              <div className="w-14 h-14 bg-oatly-yellow border-2 border-oatly-text flex items-center justify-center shadow-brutal mb-5">
                <ShieldCheck className="w-7 h-7 text-oatly-text" />
              </div>
              <h1 className="font-heading text-3xl text-oatly-text mb-1">Check your email</h1>
              <p className="text-oatly-text/55 text-sm font-body mb-1">
                We sent a 6-digit OTP to:
              </p>
              <p className="font-semibold text-oatly-text font-body mb-7 text-sm">{email}</p>

              <form onSubmit={handleVerifyOTP} noValidate className="space-y-5">
                {/* OTP boxes */}
                <div>
                  <label className="block font-body font-semibold text-oatly-text text-sm mb-3">
                    Enter OTP
                  </label>
                  <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (otpRefs.current[idx] = el)}
                        id={`otp-${idx}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className={`w-12 h-14 text-center text-xl font-bold font-body border-2 border-oatly-text outline-none
                          transition-all focus:bg-oatly-yellow focus:shadow-brutal
                          ${errors.otp ? "border-red-500 bg-red-50" : digit ? "bg-oatly-yellow/30" : "bg-white"}`}
                      />
                    ))}
                  </div>
                  {errors.otp && <p className="text-red-500 text-xs mt-2 text-center font-semibold">{errors.otp}</p>}
                </div>

                <button
                  id="verify-otp-btn"
                  type="submit"
                  disabled={loading || otp.some(d => !d)}
                  className="btn-brutal w-full py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-oatly-text/30 border-t-oatly-text rounded-full animate-spin" />
                  ) : "Verify OTP →"}
                </button>
              </form>

              {/* Resend */}
              <div className="mt-5 text-center">
                <p className="text-sm text-oatly-text/50 font-body mb-1">Didn't receive the email?</p>
                <button
                  onClick={handleResend}
                  disabled={resendTimer > 0 || loading}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-oatly-text underline underline-offset-2 hover:text-oatly-brown disabled:text-oatly-text/30 disabled:no-underline transition-colors font-body"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                </button>
              </div>

              {/* Change email */}
              <button
                onClick={() => { setStep(1); setOtp(["","","","","",""]); setErrors({}); }}
                className="mt-2 w-full text-center text-xs text-oatly-text/40 hover:text-oatly-text font-body transition-colors"
              >
                ← Change email address
              </button>
            </>
          )}

          {/* ── STEP 3: New Password ──────────────────────────── */}
          {step === 3 && (
            <>
              <div className="w-14 h-14 bg-oatly-pink border-2 border-oatly-text flex items-center justify-center shadow-brutal mb-5">
                <Lock className="w-7 h-7 text-oatly-text" />
              </div>
              <h1 className="font-heading text-3xl text-oatly-text mb-1">Set new password</h1>
              <p className="text-oatly-text/55 text-sm font-body mb-7">
                Almost there! Choose a strong new password for your account.
              </p>
              <form onSubmit={handleResetPassword} noValidate className="space-y-4">
                {/* New password */}
                <div>
                  <label className="block font-body font-semibold text-oatly-text text-sm mb-1" htmlFor="new-password">
                    New password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-oatly-text/40" />
                    <input
                      id="new-password"
                      type={showPw ? "text" : "password"}
                      value={newPw}
                      onChange={(e) => { setNewPw(e.target.value); setErrors(v => ({...v, newPw: ""})); }}
                      placeholder="Min. 6 characters"
                      className={`input-brutal pl-10 pr-10 ${errors.newPw ? "border-red-500 shadow-[2px_2px_0px_#ef4444]" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-oatly-text/40 hover:text-oatly-text"
                    >
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.newPw && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.newPw}</p>}
                </div>

                {/* Confirm password */}
                <div>
                  <label className="block font-body font-semibold text-oatly-text text-sm mb-1" htmlFor="confirm-new-password">
                    Confirm password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-oatly-text/40" />
                    <input
                      id="confirm-new-password"
                      type={showConfirm ? "text" : "password"}
                      value={confirmPw}
                      onChange={(e) => { setConfirmPw(e.target.value); setErrors(v => ({...v, confirmPw: ""})); }}
                      placeholder="Re-enter new password"
                      className={`input-brutal pl-10 pr-10 ${
                        errors.confirmPw ? "border-red-500 shadow-[2px_2px_0px_#ef4444]"
                        : confirmPw && confirmPw === newPw ? "border-green-500" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-oatly-text/40 hover:text-oatly-text"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPw && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.confirmPw}</p>}
                  {!errors.confirmPw && confirmPw && confirmPw === newPw && (
                    <p className="text-green-600 text-xs mt-1 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Passwords match
                    </p>
                  )}
                </div>

                <button
                  id="reset-password-btn"
                  type="submit"
                  disabled={loading}
                  className="btn-brutal w-full py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-oatly-text/30 border-t-oatly-text rounded-full animate-spin" />
                  ) : "Reset Password ✓"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
