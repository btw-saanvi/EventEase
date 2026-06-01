import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-oatly-bg bg-mesh flex items-center justify-center px-4 py-16">
      <div className="relative z-10 text-center max-w-md brutal-card bg-white p-8 md:p-12 shadow-[8px_8px_0px_#000]">
        <div className="font-heading text-7xl md:text-8xl text-oatly-pink border-3 border-black bg-white inline-block px-6 py-2 shadow-[4px_4px_0px_#000] rotate-3 mb-8 select-none">
          404
        </div>
        <h1 className="font-heading text-3xl text-black uppercase mb-3">Page not found</h1>
        <p className="font-body font-bold text-black/60 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/" className="btn-brutal btn-brutal-pink flex items-center gap-2 py-2.5 px-5 w-full sm:w-auto">
            <Home className="w-4 h-4 text-black" /> Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-brutal bg-white flex items-center gap-2 py-2.5 px-5 w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4 text-black" /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
