import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import InteractiveMascot from "../InteractiveMascot";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-mesh flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <InteractiveMascot />
    </div>
  );
}
