import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl animate-pulse" />
      </div>
      <div className="relative z-10 w-full max-w-md">
        <div className="glass-card p-8 md:p-10">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-vapor-lavender mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center mb-6">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-white mb-2">Forgot password?</h1>
          <p className="text-slate-400 text-sm mb-8">
            No worries! With Google Sign-In, you don't need a password. Just sign in with your Google account and you'll be back in no time.
          </p>
          <Link
            to="/login"
            className="btn-vapor-solid w-full flex items-center justify-center gap-2 py-3"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
