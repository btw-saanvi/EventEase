import { UserPlus, CalendarPlus, Users, Store, Sparkles } from "lucide-react";

const steps = [
  { icon: UserPlus, step: "01", title: "Create Your Account", description: "Sign in with Google in one click. Your profile is set up instantly.", color: "#A7D7E8" }, // Blue
  { icon: CalendarPlus, step: "02", title: "Create an Event", description: "Add your event details — date, venue, type, and expected guest count.", color: "#FFD933" }, // Yellow
  { icon: Users, step: "03", title: "Invite Your Guests", description: "Add guests, send invitations, and track RSVPs in real time.", color: "#FFB0C2" }, // Pink
  { icon: Store, step: "04", title: "Book Vendors", description: "Browse the marketplace, save vendors to your event, and manage bookings.", color: "#A4CBA3" }, // Green
  { icon: Sparkles, step: "05", title: "Celebrate!", description: "Everything is organized. Show up and enjoy your perfectly planned event.", color: "#FFB0C2" }, // Pink
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-oatly-bg border-t-[4px] border-black">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl text-black uppercase mb-4">
            How <span className="text-oatly-pink">EventEase</span> Works
          </h2>
          <p className="text-black/80 font-body font-bold text-lg max-w-xl mx-auto">
            From idea to celebration in five simple steps
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[4px] bg-black hidden lg:block" />

          <div className="space-y-12 lg:space-y-16">
            {steps.map((step, i) => (
              <div
                key={step.step}
                className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16 ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
              >
                {/* Content */}
                <div className={`flex-1 ${i % 2 === 1 ? "lg:text-right" : ""}`}>
                  <div
                    className="inline-flex items-center gap-2 text-xs font-heading uppercase mb-3 px-3 py-1 border-[2px] border-black bg-white shadow-[2px_2px_0px_#000] text-black"
                  >
                    STEP {step.step}
                  </div>
                  <h3 className="font-heading text-2xl text-black uppercase mb-3">{step.title}</h3>
                  <p className={`text-black/75 font-body font-semibold leading-relaxed max-w-sm ${i % 2 === 1 ? "lg:ml-auto" : "lg:mr-auto"}`}>{step.description}</p>
                </div>

                {/* Icon node */}
                <div className="relative flex-shrink-0 z-10">
                  <div
                    className="w-20 h-20 border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0px_#1E1E1E]"
                    style={{ backgroundColor: step.color }}
                  >
                    <step.icon className="w-9 h-9 text-black" />
                  </div>
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
