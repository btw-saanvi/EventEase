import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import {
  CalendarDays, LayoutDashboard, Users, DollarSign,
  Store, Star, User, LogOut, Menu, X, Sparkles
} from "lucide-react";
import { cn } from "../../lib/utils";

const navLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/budget", label: "Budget", icon: DollarSign },
  { to: "/guests", label: "Guests", icon: Users },
  { to: "/vendor-marketplace", label: "Marketplace", icon: Store },
  { to: "/vendors", label: "My Vendors", icon: CalendarDays },
  { to: "/reviews", label: "Reviews", icon: Star },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setDropdownOpen(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          scrolled
            ? "glass border-b border-vapor-border shadow-lg shadow-black/20"
            : "bg-transparent"
        )}
      >
        <div className="section-container">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-heading font-bold text-xl text-gradient-static">EventEase</span>
            </Link>

            {/* Desktop nav - authenticated */}
            {isAuthenticated && (
              <div className="hidden md:flex items-center gap-1">
                {navLinks.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                        isActive
                          ? "text-vapor-lavender bg-vapor-lavender/10"
                          : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                      )
                    }
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </NavLink>
                ))}
              </div>
            )}

            {/* Desktop nav - public */}
            {!isAuthenticated && (
              <div className="hidden md:flex items-center gap-6">
                <Link to="/home" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">Features</Link>
                <Link to="/login" className="btn-vapor text-sm py-2 px-4">Sign In</Link>
                <Link to="/signup" className="btn-vapor-solid text-sm py-2 px-4">Get Started</Link>
              </div>
            )}

            {/* User menu */}
            {isAuthenticated && (
              <div className="hidden md:flex items-center gap-3">
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-white/5 transition-colors"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback name={user?.name} />
                    </Avatar>
                    <span className="text-sm text-slate-300 font-medium max-w-[120px] truncate">{user?.name}</span>
                    <svg className={cn("w-4 h-4 text-slate-500 transition-transform", dropdownOpen && "rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 glass rounded-xl border border-vapor-border shadow-xl animate-fade-in overflow-hidden">
                      <div className="px-3 py-2 border-b border-vapor-border">
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-3 py-2.5 text-sm text-slate-300 hover:text-vapor-lavender hover:bg-white/5 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <User className="w-4 h-4" /> Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 text-slate-400 hover:text-slate-200 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 pt-16 glass md:hidden animate-fade-in">
          <div className="p-4 space-y-1">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 p-3 mb-2 glass-card">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback name={user?.name} />
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-slate-200">{user?.name}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                </div>
                {navLinks.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                        isActive ? "text-vapor-lavender bg-vapor-lavender/10" : "text-slate-400"
                      )
                    }
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </NavLink>
                ))}
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-400"
                >
                  <User className="w-5 h-5" /> Profile
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400"
                >
                  <LogOut className="w-5 h-5" /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-slate-300">Sign In</Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="block btn-vapor-solid text-center mt-2">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
}
