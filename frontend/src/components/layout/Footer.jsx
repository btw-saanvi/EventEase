import { Link } from "react-router-dom";
import { Sparkles, Twitter, Instagram, Linkedin, Github, Mail } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Features", to: "https://event-ease-ashen.vercel.app/" },
    { label: "Vendor Marketplace", to: "/vendor-marketplace" },
    { label: "Pricing", to: "/quotations" },
  ],
  Platform: [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Budget Tracker", to: "/budget" },
    { label: "Guest Management", to: "/guests" },
  ],
  Company: [
    { label: "About", to: "https://saanvigargportfolio.netlify.app/" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "https://x.com/GargSaanvi92426", label: "Twitter" },
  { icon: Instagram, href: "https://www.instagram.com/btw_saanvi/", label: "Instagram" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/saanvi-garg-320993378/", label: "LinkedIn" },
  { icon: Github, href: "https://github.com/btw-saanvi", label: "GitHub" },
  {
    icon: Mail,
    href: "mailto:saanvigarg2020@gmail.com?subject=Your%20Next%20Challenge&body=Saanvi,%0D%0A%0D%0AYour%20work%20got%20our%20attention.%0D%0A%0D%0AWe're%20not%20reaching%20out%20to%20everyone.%20We're%20reaching%20out%20to%20you.%0D%0A%0D%0AIf%20you're%20interested%20in%20building,%20shipping,%20and%20owning%20real%20products,%20reply%20to%20this%20email.%0D%0A%0D%0ALet's%20make%20something%20worth%20remembering.",
    label: "Email"
  }
];

export default function Footer() {
  return (
    <footer className="relative mt-auto border-t-[4px] border-black bg-oatly-bg">
      <div className="section-container py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 bg-oatly-yellow border-[2px] border-black flex items-center justify-center shadow-[2px_2px_0px_#000] group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-[1px_1px_0px_#000] transition-all">
                <Sparkles className="w-4 h-4 text-black" />
              </div>
              <span className="font-heading font-normal text-xl text-black uppercase tracking-wide">EventEase</span>
            </Link>
            <p className="text-sm font-body font-semibold text-black/70 leading-relaxed max-w-xs">
              The all-in-one platform for planning unforgettable events. Connect with vendors, manage budgets, and coordinate guests effortlessly.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-none flex items-center justify-center bg-white border-[2px] border-black text-black hover:bg-oatly-yellow shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000] transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-heading uppercase tracking-wider text-black mb-4">{section}</h4>
              <ul className="space-y-2">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm font-body font-bold text-black/60 hover:text-oatly-pink transition-colors"
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
        <div className="h-[3px] w-full bg-black my-8" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-body font-bold text-black/60">
          <p>© {new Date().getFullYear()} EventEase. All rights reserved........to me ofcourse</p>
          <p>
            My socials are used because it's my web app and none of your business.
              <br />
            I hope both sides of your pillow are sweetly cool.
          </p>
        </div>
      </div>
    </footer>
  );
}
