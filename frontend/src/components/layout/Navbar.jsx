import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import {
  CalendarDays, LayoutDashboard, Users, DollarSign,
  Store, Star, User, LogOut, Menu, X, Sparkles
} from "lucide-react";
import { cn } from "../../lib/utils";

// Authenticated links remain largely the same structurally, but styled brutally later.
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
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#F9F5F0] border-b-[4px] border-black">
        <div className="section-container">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-oatly-yellow border-[3px] border-black flex items-center justify-center shadow-[3px_3px_0px_#000] group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-[1px_1px_0px_#000] transition-all">
                <Sparkles className="w-5 h-5 text-black" />
              </div>
              <span className="font-heading font-normal text-2xl text-black uppercase tracking-wide">EventEase</span>
            </Link>

            {/* Desktop nav - authenticated */}
            {isAuthenticated && (
              <div className="hidden md:flex items-center gap-2">
                {navLinks.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2 px-3 py-2 border-[2px] border-transparent font-heading text-sm uppercase transition-all duration-150",
                        isActive
                          ? "bg-oatly-pink border-black shadow-[2px_2px_0px_#000]"
                          : "text-black hover:bg-white hover:border-black hover:shadow-[2px_2px_0px_#000]"
                      )
                    }
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </NavLink>
                ))}
              </div>
            )}

            {/* Desktop nav - public */}
            {!isAuthenticated && (
              <div className="hidden md:flex items-center gap-8 font-heading text-lg uppercase">
                <Link to="/packages?type=house_party" className="text-black hover:-translate-y-1 hover:text-oatly-pink transition-transform">House Parties & Family</Link>
                <Link to="/quotations" className="text-black hover:-translate-y-1 hover:text-oatly-green transition-transform">Find Out Quotation (AI Math)</Link>
                <Link to="/login?redirect=/vendor-marketplace" className="text-black hover:-translate-y-1 hover:text-oatly-blue transition-transform">I Want To Book</Link>
                <Link to="/login" className="btn-brutal btn-brutal-pink">Sign In</Link>
              </div>
            )}

            {/* User menu */}
            {isAuthenticated && (
              <div className="hidden md:flex items-center gap-3">
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 p-1 border-[3px] border-black bg-white shadow-[3px_3px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_#000] transition-all"
                  >
                    <Avatar className="w-8 h-8 rounded-none border-[2px] border-black">
                      <AvatarImage src={user?.avatar} alt={user?.name} className="rounded-none" />
                      <AvatarFallback name={user?.name} className="rounded-none bg-oatly-blue font-heading" />
                    </Avatar>
                    <span className="text-sm text-black font-heading uppercase max-w-[120px] truncate pr-1">{user?.name}</span>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-3 w-48 bg-white border-[3px] border-black shadow-[6px_6px_0px_#000] overflow-hidden z-50">
                      <div className="px-3 py-3 border-b-[3px] border-black bg-oatly-yellow">
                        <p className="text-xs text-black font-body font-bold truncate">{user?.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-3 py-3 text-sm font-heading uppercase text-black hover:bg-oatly-blue transition-colors border-b-[3px] border-black"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <User className="w-4 h-4" /> Profile
                      </Link>
                      <button
                         onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-3 text-sm font-heading uppercase text-black hover:bg-oatly-pink transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Bail Out (Log Out)
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 border-[3px] border-black bg-oatly-yellow shadow-[3px_3px_0px_#000]"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6 text-black" /> : <Menu className="w-6 h-6 text-black" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 pt-20 bg-oatly-yellow md:hidden overflow-y-auto border-b-[4px] border-black">
          <div className="p-6 space-y-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 p-4 mb-4 bg-white border-[3px] border-black shadow-[4px_4px_0px_#000]">
                  <Avatar className="w-12 h-12 rounded-none border-[3px] border-black">
                    <AvatarImage src={user?.avatar} alt={user?.name} className="rounded-none" />
                    <AvatarFallback name={user?.name} className="rounded-none bg-oatly-blue font-heading text-lg" />
                  </Avatar>
                  <div>
                    <p className="text-lg font-heading uppercase text-black">{user?.name}</p>
                    <p className="text-sm font-body font-bold text-black">{user?.email}</p>
                  </div>
                </div>
                {navLinks.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-4 py-4 border-[3px] border-black font-heading text-lg uppercase transition-all shadow-[4px_4px_0px_#000]",
                        isActive ? "bg-oatly-pink text-black" : "bg-white text-black"
                      )
                    }
                  >
                    <Icon className="w-6 h-6" />
                    {label}
                  </NavLink>
                ))}
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-4 border-[3px] border-black bg-[#ff6b6b] text-black font-heading text-lg uppercase shadow-[4px_4px_0px_#000] mt-4"
                >
                  <LogOut className="w-6 h-6" /> Bail Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-4 font-heading text-xl uppercase">
                <Link to="/packages" onClick={() => setMobileOpen(false)} className="block p-4 border-[3px] border-black bg-white shadow-[4px_4px_0px_#000]">Packages (The Good Stuff)</Link>
                <Link to="/vendors" onClick={() => setMobileOpen(false)} className="block p-4 border-[3px] border-black bg-white shadow-[4px_4px_0px_#000]">Vendors (The People)</Link>
                <Link to="/quotations" onClick={() => setMobileOpen(false)} className="block p-4 border-[3px] border-black bg-white shadow-[4px_4px_0px_#000]">Quotations (The Math)</Link>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-brutal btn-brutal-pink w-full py-4 text-center mt-4 text-xl">Prove You're Human</Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-20" />
    </>
  );
}
