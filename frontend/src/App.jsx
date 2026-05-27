import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// Layouts
import PublicLayout from "./components/layout/PublicLayout";
import AppLayout from "./components/layout/AppLayout";

// Public pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import SetNewPassword from "./pages/SetNewPassword";
import NotFound from "./pages/NotFound";
import Packages from "./pages/Packages";
import Quotations from "./pages/Quotations";

// Auth pages
import Welcome from "./pages/Welcome";

// App pages
import Dashboard from "./pages/Dashboard";
import Budget from "./pages/Budget";
import Guests from "./pages/Guests";
import VendorMarketplace from "./pages/VendorMarketplace";
import Vendors from "./pages/Vendors";
import Profile from "./pages/Profile";
import Reviews from "./pages/Reviews";

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/quotations" element={<Quotations />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/set-new-password" element={<SetNewPassword />} />
      </Route>

      {/* Protected app routes */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/guests" element={<Guests />} />
        <Route path="/vendor-marketplace" element={<VendorMarketplace />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/reviews" element={<Reviews />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}