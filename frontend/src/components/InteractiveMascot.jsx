import { useState, useEffect, useRef } from "react";
import { X, Sparkles, RefreshCw, MessageSquare, Bot } from "lucide-react";

const QUIPS = [
  "Hoot! I'm Easey, your smart event pet! Need me to math your house party budget?",
  "Smart Hoot: Finger foods save 35% on catering costs compared to full buffets!",
  "Pro tip: Always keep a 5-10% emergency buffer for extra ice, drinks, and last-minute setup!",
  "Planning an intimate birthday? Splurge on sound setup & ambient lighting first!",
  "Hoot! Check out our marketplace for Google-rated DJs and caterers near you!",
  "Don't guess event budgets—fill out our AI Quotation form and I'll crunch the math!"
];

export default function InteractiveMascot() {
  const [position, setPosition] = useState({ x: 24, y: 24 }); // pixels from bottom-right
  const [isRoaming, setIsRoaming] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [quipIndex, setQuipIndex] = useState(0);
  const [eyeAngle, setEyeAngle] = useState(0);
  const [wingFlap, setWingFlap] = useState(false);

  // Track mouse cursor so 3D owl's eyes track the user around screen
  useEffect(() => {
    const handleMouseMove = (e) => {
      const owlX = window.innerWidth - position.x - 40;
      const owlY = window.innerHeight - position.y - 40;
      const angle = Math.atan2(e.clientY - owlY, e.clientX - owlX);
      setEyeAngle(angle);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [position]);

  // Periodic roaming movement & flying across the bottom of screen
  useEffect(() => {
    const roamInterval = setInterval(() => {
      // Roam position slightly along right bottom corner
      const newX = 20 + Math.floor(Math.random() * 120);
      const newY = 20 + Math.floor(Math.random() * 60);
      setPosition({ x: newX, y: newY });

      // Trigger wing flap animation
      setWingFlap(true);
      setTimeout(() => setWingFlap(false), 1200);

      // Rotate advice quip
      setQuipIndex((prev) => (prev + 1) % QUIPS.length);
    }, 10000);

    return () => clearInterval(roamInterval);
  }, []);

  const triggerNextQuip = (e) => {
    e.stopPropagation();
    setQuipIndex((prev) => (prev + 1) % QUIPS.length);
    setWingFlap(true);
    setTimeout(() => setWingFlap(false), 800);
  };

  // Eye pupil offset based on mouse tracking angle
  const pupilX = Math.cos(eyeAngle) * 3;
  const pupilY = Math.sin(eyeAngle) * 3;

  return (
    <div
      style={{ right: `${position.x}px`, bottom: `${position.y}px` }}
      className="fixed z-50 flex flex-col items-end pointer-events-none transition-all duration-700 ease-out"
    >
      {/* Speech Bubble Dialog */}
      <div
        className={`pointer-events-auto mb-3 w-72 bg-white border-[4px] border-black p-4 shadow-[6px_6px_0px_#000] transition-all duration-300 transform origin-bottom-right ${
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-2">
          <span className="font-heading text-xs uppercase bg-oatly-yellow border border-black px-2 py-0.5 shadow-[1.5px_1.5px_0px_#000] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Easey 3D Pet
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-red-400 border border-black shadow-[1.5px_1.5px_0px_#000] transition-colors"
          >
            <X className="w-3.5 h-3.5 text-black" />
          </button>
        </div>

        <p className="font-body font-bold text-xs text-black leading-relaxed mb-3">
          "{QUIPS[quipIndex]}"
        </p>

        <div className="flex items-center justify-between pt-2 border-t-2 border-black/10">
          <span className="text-[10px] font-heading uppercase text-black/60">Witty Event Assistant</span>
          <button
            onClick={triggerNextQuip}
            className="text-[10px] font-heading uppercase text-black bg-oatly-blue px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-oatly-pink transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3 h-3" /> Next Tip
          </button>
        </div>
      </div>

      {/* CSS 3D Interactive Mascot Pet Character */}
      <div
        onClick={() => {
          setIsOpen(!isOpen);
          setWingFlap(true);
          setTimeout(() => setWingFlap(false), 1000);
        }}
        className="pointer-events-auto relative cursor-pointer group select-none"
      >
        {/* Main 3D Mascot Body Sphere */}
        <div
          className={`w-20 h-24 bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 border-[4px] border-black rounded-[3rem] shadow-[6px_6px_0px_#000] relative flex flex-col items-center justify-between p-2 transition-transform duration-300 group-hover:scale-110 ${
            wingFlap ? "animate-bounce" : ""
          }`}
        >
          {/* Party Hat */}
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[20px] border-b-rose-500 filter drop-shadow-[2px_2px_0px_#000]">
            <div className="absolute -top-6 -left-1.5 w-3 h-3 bg-yellow-300 rounded-full border border-black" />
          </div>

          {/* Glasses Frame & Eyes */}
          <div className="w-full flex items-center justify-center gap-1 mt-3 z-10">
            {/* Left Eye & Glasses */}
            <div className="w-7 h-7 bg-white border-[2.5px] border-black rounded-full relative flex items-center justify-center shadow-[1px_1px_0px_#000]">
              <div
                style={{ transform: `translate(${pupilX}px, ${pupilY}px)` }}
                className="w-3.5 h-3.5 bg-black rounded-full flex items-center justify-center transition-transform duration-75"
              >
                <div className="w-1 h-1 bg-white rounded-full translate-x-[-1px] translate-y-[-1px]" />
              </div>
            </div>
            {/* Glasses Bridge */}
            <div className="w-2 h-1 bg-black -mx-1" />
            {/* Right Eye & Glasses */}
            <div className="w-7 h-7 bg-white border-[2.5px] border-black rounded-full relative flex items-center justify-center shadow-[1px_1px_0px_#000]">
              <div
                style={{ transform: `translate(${pupilX}px, ${pupilY}px)` }}
                className="w-3.5 h-3.5 bg-black rounded-full flex items-center justify-center transition-transform duration-75"
              >
                <div className="w-1 h-1 bg-white rounded-full translate-x-[-1px] translate-y-[-1px]" />
              </div>
            </div>
          </div>

          {/* Cute Beak */}
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-amber-600 border-black -mt-1 z-10" />

          {/* Flapping Wings (Left & Right) */}
          <div
            className={`absolute -left-3 top-7 w-4 h-9 bg-amber-500 border-[2.5px] border-black rounded-l-full origin-right transition-transform duration-200 ${
              wingFlap ? "-rotate-45" : "rotate-12 group-hover:-rotate-12"
            }`}
          />
          <div
            className={`absolute -right-3 top-7 w-4 h-9 bg-amber-500 border-[2.5px] border-black rounded-r-full origin-left transition-transform duration-200 ${
              wingFlap ? "rotate-45" : "-rotate-12 group-hover:rotate-12"
            }`}
          />

          {/* Belly Feathers */}
          <div className="w-11 h-8 bg-amber-100 border-[2px] border-black rounded-b-2xl mb-1 flex items-center justify-center gap-1">
            <div className="w-1.5 h-1.5 border-b-2 border-r-2 border-black rotate-45" />
            <div className="w-1.5 h-1.5 border-b-2 border-r-2 border-black rotate-45" />
          </div>

          {/* Cute Feet */}
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 flex gap-3">
            <div className="w-3 h-2.5 bg-amber-600 border border-black rounded-full" />
            <div className="w-3 h-2.5 bg-amber-600 border border-black rounded-full" />
          </div>
        </div>

        {/* Floating "Hoot!" Badge when closed */}
        {!isOpen && (
          <div className="absolute -top-3 -left-3 bg-oatly-pink text-black border-2 border-black text-[10px] font-heading uppercase px-2 py-0.5 shadow-[2px_2px_0px_#000] animate-bounce">
            Hoot! 🦉
          </div>
        )}
      </div>
    </div>
  );
}
