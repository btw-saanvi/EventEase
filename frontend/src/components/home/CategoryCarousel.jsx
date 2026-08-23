import { Link } from "react-router-dom";
import { ArrowRight, Home as HomeIcon, Heart, Sparkles, Users, PartyPopper } from "lucide-react";

const partyIdeas = [
  {
    id: 1,
    title: "House Party Bash",
    subtitle: "Cozy vibes, epic playlist & custom cocktail setup",
    icon: HomeIcon,
    color: "bg-oatly-pink",
    rotation: "-rotate-2",
    tag: "10-30 Guests",
    ideas: ["Acoustic Corner & Karaoke setup", "DIY Cocktail/Mocktail station", "Finger foods & bite-sized catering"]
  },
  {
    id: 2,
    title: "Casual Friends & Family",
    subtitle: "Backyard barbecue, dinner parties & anniversaries",
    icon: Users,
    color: "bg-oatly-blue",
    rotation: "rotate-2",
    tag: "25-75 Guests",
    ideas: ["Fairy light ambient decoration", "Buffet or live food counters", "Polaroid photo booth nook"]
  },
  {
    id: 3,
    title: "Intimate Birthday",
    subtitle: "Cake, fun themes, and memorable photo corners",
    icon: PartyPopper,
    color: "bg-oatly-yellow",
    rotation: "-rotate-1",
    tag: "15-50 Guests",
    ideas: ["Custom balloon arches & banners", "Interactive games coordinator", "Dessert & custom cake bar"]
  },
  {
    id: 4,
    title: "Micro-Wedding / Engagement",
    subtitle: "Meaningful small-scale celebrations with loved ones",
    icon: Heart,
    color: "bg-oatly-green",
    rotation: "rotate-3",
    tag: "30-100 Guests",
    ideas: ["Minimalist floral backdrops", "Candid photographer for 4 hrs", "Acoustic solo musician"]
  },
];

export default function CategoryCarousel() {
  return (
    <section className="py-20 bg-white border-b-[4px] border-black">
      <div className="section-container">
        <h2 className="font-heading text-5xl md:text-7xl text-black uppercase mb-4 drop-shadow-[4px_4px_0px_#FFD933] text-center">
          Pick Your Poison
        </h2>
        <p className="text-xl md:text-2xl font-body font-bold text-center mb-16 text-black">
          Fresh, budget-smart ideas for small to medium scale events.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
          {partyIdeas.map((idea) => (
            <div
              key={idea.id}
              className={`block ${idea.color} border-[4px] border-black shadow-[8px_8px_0px_#000] p-6 ${idea.rotation} hover:rotate-0 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_#000] transition-all flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white border-[3px] border-black flex items-center justify-center shadow-[2px_2px_0px_#000]">
                    <idea.icon className="w-6 h-6 text-black" />
                  </div>
                  <span className="bg-white border-[2px] border-black px-2 py-1 font-heading text-xs uppercase shadow-[2px_2px_0px_#000]">
                    {idea.tag}
                  </span>
                </div>
                <h3 className="font-heading text-2xl uppercase mb-2 text-black">{idea.title}</h3>
                <p className="font-body font-bold text-sm mb-4 text-black">{idea.subtitle}</p>
                
                <div className="bg-white/80 border-[2px] border-black p-3 mb-6 space-y-1.5">
                  <p className="font-heading text-xs uppercase text-black border-b border-black pb-1">Popular Ideas:</p>
                  {idea.ideas.map((item, idx) => (
                    <p key={idx} className="font-body font-semibold text-xs text-black flex items-center gap-1">
                      <Sparkles className="w-3 h-3 flex-shrink-0 text-black" /> {item}
                    </p>
                  ))}
                </div>
              </div>

              <Link
                to={`/quotations?type=${encodeURIComponent(idea.title)}`}
                className="btn-brutal bg-white hover:bg-black hover:text-white text-sm py-2.5 font-heading uppercase flex items-center justify-center gap-2"
              >
                Plan Ideas <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Link to="/quotations" className="btn-brutal btn-brutal-pink px-8 py-5 text-xl rotate-1 inline-flex items-center gap-3">
            <Sparkles className="w-6 h-6" /> Calculate Quotation With AI Math
          </Link>
        </div>
      </div>
    </section>
  );
}
