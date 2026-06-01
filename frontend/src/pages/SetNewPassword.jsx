import { Link } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";

// This page is a fallback redirect — the full reset flow lives in ForgotPassword.jsx
export default function SetNewPassword() {
  return (
    <div className="min-h-screen bg-oatly-bg bg-mesh flex items-center justify-center py-16 px-4">
      <div className="relative z-10 w-full max-w-md">
        <Link
          to="/forgot-password"
          className="inline-flex items-center gap-2 text-sm font-semibold text-oatly-text/60 hover:text-oatly-text mb-6 transition-colors font-body"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <div className="brutal-card bg-white p-8 md:p-10 text-center">
          <div className="w-14 h-14 bg-oatly-pink border-2 border-oatly-text flex items-center justify-center shadow-brutal mx-auto mb-5">
            <Lock className="w-7 h-7 text-oatly-text" />
          </div>
          <h1 className="font-heading text-3xl text-oatly-text mb-3">Reset Password</h1>
          <p className="text-oatly-text/60 font-body text-sm mb-7">
            Use the forgot password flow to reset your password securely via OTP.
          </p>
          <Link
            to="/forgot-password"
            className="btn-brutal w-full flex items-center justify-center gap-2 py-3"
          >
            Go to Forgot Password →
          </Link>
        </div>
      </div>
    </div>
  );
}
