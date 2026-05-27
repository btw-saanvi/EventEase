import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const categories = [
  { id: 1, title: "Wedding", color: "bg-oatly-pink", rotation: "-rotate-2" },
  { id: 2, title: "Destination", color: "bg-oatly-blue", rotation: "rotate-3" },
  { id: 3, title: "Birthday", color: "bg-oatly-yellow", rotation: "-rotate-1" },
  { id: 4, title: "Corporate", color: "bg-oatly-green", rotation: "rotate-2" },
];

export default function CategoryCarousel() {
  return (
    <section className="py-20 bg-white border-b-[4px] border-black">
      <div className="section-container">
        <h2 className="font-heading text-5xl md:text-7xl text-black uppercase mb-16 drop-shadow-[4px_4px_0px_#FFD933] text-center">
          Pick Your Poison
          <br />
          <span className="text-2xl font-body font-bold normal-case drop-shadow-none tracking-normal">(We mean event type, obviously)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
          {categories.map((cat) => (
            <Link
              to={`/packages?type=${cat.title.toLowerCase()}`}
              key={cat.id}
              className={`block ${cat.color} border-[4px] border-black shadow-[8px_8px_0px_#000] p-8 ${cat.rotation} hover:rotate-0 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_#000] transition-all group`}
            >
              <div className="w-16 h-16 bg-white border-[3px] border-black rounded-full mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl font-heading">#</span>
              </div>
              <h3 className="font-heading text-3xl uppercase mb-4">{cat.title}</h3>
              <p className="font-body font-bold text-lg mb-8">
                Yeah, we do {cat.title.toLowerCase()}s. And we do them well.
              </p>
              
              <div className="flex items-center gap-2 font-heading uppercase text-xl">
                See More <ArrowRight className="w-6 h-6" />
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-20 text-center">
          <Link to="/quotations" className="btn-brutal btn-brutal-pink px-12 py-6 text-2xl rotate-2 inline-block">
            I don't know what I want. Help me math!
          </Link>
        </div>
      </div>
    </section>
  );
}
