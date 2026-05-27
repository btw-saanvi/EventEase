import { useLocation } from "react-router-dom";

export default function Packages() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type") || "all";
  const query = queryParams.get("q") || "";

  return (
    <div className="min-h-screen bg-oatly-bg pt-20 pb-12">
      <div className="section-container">
        <h1 className="font-heading text-6xl text-black uppercase mb-8 drop-shadow-[4px_4px_0px_#A7D7E8]">
          Packages (The Good Stuff)
        </h1>
        
        <div className="bg-white border-[4px] border-black shadow-[8px_8px_0px_#000] p-8 -rotate-1 mb-12 inline-block">
          <p className="font-body font-bold text-2xl">
            {query ? `Searching for: "${query}"` : `Showing: ${type.toUpperCase()} packages`}
          </p>
          <p className="mt-4 text-xl">
            This is a placeholder for the actual packages list. 
            Because building a real one takes time and you just wanted to see the design!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="brutal-card p-6 flex flex-col gap-4">
              <div className="w-full h-48 bg-gray-200 border-[3px] border-black flex items-center justify-center bg-oatly-pink">
                <span className="font-heading text-2xl uppercase">Image Here</span>
              </div>
              <h3 className="font-heading text-2xl uppercase">Super Awesome Package {i}</h3>
              <p className="font-body font-bold text-gray-700">A really cool description about how awesome this package is.</p>
              <button className="btn-brutal btn-brutal-blue mt-auto">Book Now</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
