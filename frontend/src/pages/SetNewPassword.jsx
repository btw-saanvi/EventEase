import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function SetNewPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4">
      <div className="relative z-10 w-full max-w-md">
        <div className="glass-card p-8 md:p-10">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-vapor-lavender mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
          <h1 className="font-heading text-2xl font-bold text-white mb-2">Set new password</h1>
          <p className="text-slate-400 text-sm mb-8">
            With Google Sign-In, password management is handled by Google. You can update your Google account password through Google's account settings.
          </p>
          <a
            href="https://myaccount.google.com/security"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-vapor-solid w-full flex items-center justify-center gap-2 py-3"
          >
            Manage Google Account
          </a>
        </div>
      </div>
    </div>
  );
}
