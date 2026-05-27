import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-mesh flex flex-col">
      <Navbar />
      <main className="flex-1 section-container">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
