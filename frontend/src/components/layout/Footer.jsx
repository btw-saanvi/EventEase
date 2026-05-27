import { Link } from "react-router-dom";
import { Sparkles, Twitter, Instagram, Linkedin, Github, Mail } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Features", to: "/home" },
    { label: "Vendor Marketplace", to: "/vendor-marketplace" },
    { label: "Pricing", to: "/" },
  ],
  Platform: [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Budget Tracker", to: "/budget" },
    { label: "Guest Management", to: "/guests" },
  ],
  Company: [
    { label: "About", to: "/" },
    { label: "Blog", to: "/" },
    { label: "Contact", to: "/" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Mail, href: "#", label: "Email" },
];

export default function Footer() {
  return (
    <footer className="relative mt-auto border-t border-vapor-border bg-vapor-darker/50">
      {/* Aurora gradient line at top */}
      <div className="h-px w-full bg-aurora opacity-60" />

      <div className="section-container py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-heading font-bold text-xl text-gradient-static">EventEase</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              The all-in-one platform for planning unforgettable events. Connect with vendors, manage budgets, and coordinate guests effortlessly.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 border border-vapor-border text-slate-400 hover:text-vapor-lavender hover:border-vapor-lavender/30 transition-all duration-200"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">{section}</h4>
              <ul className="space-y-2">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-slate-400 hover:text-vapor-lavender transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="divider-vapor my-8" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <p>© {new Date().getFullYear()} EventEase. All rights reserved.</p>
          <p className="text-slate-600">
            Vapor Chrome Design System · React 18 · MongoDB · Google Auth
          </p>
        </div>
      </div>
    </footer>
  );
}
