import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full bg-violet-600/10 blur-3xl animate-pulse" />
      </div>
      <div className="relative z-10 text-center">
        <div className="font-heading text-[8rem] md:text-[12rem] font-bold leading-none text-gradient opacity-20 select-none">
          404
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-white -mt-8 mb-4">Page not found</h1>
        <p className="text-slate-400 max-w-md mx-auto mb-10">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/" className="btn-vapor-solid flex items-center gap-2 px-6 py-3">
            <Home className="w-4 h-4" /> Go Home
          </Link>
          <button onClick={() => history.back()} className="btn-vapor flex items-center gap-2 px-6 py-3">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
