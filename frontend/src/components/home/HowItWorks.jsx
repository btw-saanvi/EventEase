import { UserPlus, CalendarPlus, Users, Store, Sparkles } from "lucide-react";

const steps = [
  { icon: UserPlus, step: "01", title: "Create Your Account", description: "Sign in with Google in one click. Your profile is set up instantly.", color: "#c4b5fd" },
  { icon: CalendarPlus, step: "02", title: "Create an Event", description: "Add your event details — date, venue, type, and expected guest count.", color: "#818cf8" },
  { icon: Users, step: "03", title: "Invite Your Guests", description: "Add guests, send invitations, and track RSVPs in real time.", color: "#67e8f9" },
  { icon: Store, step: "04", title: "Book Vendors", description: "Browse the marketplace, save vendors to your event, and manage bookings.", color: "#f0abfc" },
  { icon: Sparkles, step: "05", title: "Celebrate!", description: "Everything is organized. Show up and enjoy your perfectly planned event.", color: "#a5f3fc" },
];

export default function HowItWorks() {
  return (
    <section className="py-24">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-slate-100 mb-4">
            How <span className="text-gradient">EventEase</span> Works
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            From idea to celebration in five simple steps
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-vapor-border to-transparent hidden lg:block" />

          <div className="space-y-8 lg:space-y-0">
            {steps.map((step, i) => (
              <div
                key={step.step}
                className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16 ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
              >
                {/* Content */}
                <div className={`flex-1 ${i % 2 === 1 ? "lg:text-right" : ""}`}>
                  <div
                    className="inline-flex items-center gap-2 text-xs font-mono font-bold mb-3 px-3 py-1 rounded-full"
                    style={{ background: `${step.color}20`, color: step.color, border: `1px solid ${step.color}40` }}
                  >
                    STEP {step.step}
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-slate-100 mb-3">{step.title}</h3>
                  <p className="text-slate-400 leading-relaxed max-w-sm">{step.description}</p>
                </div>

                {/* Icon node */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse-glow"
                    style={{
                      background: `linear-gradient(135deg, ${step.color}30, ${step.color}15)`,
                      border: `2px solid ${step.color}40`,
                    }}
                  >
                    <step.icon className="w-9 h-9" style={{ color: step.color }} />
                  </div>
                  {/* Pulse ring */}
                  <div
                    className="absolute inset-0 rounded-2xl animate-ping opacity-20"
                    style={{ background: step.color, animationDuration: "3s" }}
                  />
                </div>

                {/* Empty for layout */}
                <div className="flex-1 hidden lg:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
