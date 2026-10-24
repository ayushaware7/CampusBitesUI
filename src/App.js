import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import LandingPage from './pages/landing/Landingpage';
import TrackOrdersPage from './pages/TrackOrdersPage';
import Navbar from './components/common/Navbar';
import MenuPage from './pages/menu/MenuPage';
import About from './components/common/About';
import TodaySpecial from './components/categories/TodaySpecial';
import CheckoutPage from './pages/CheckoutPage';
import CartPage from './pages/CartPage';
import { CartProvider } from './contexts/CartContext';
import Snacks from './components/categories/Snacks';
import Breakfast from './components/categories/Breakfast';
import Lunch from './components/categories/Lunch';
import Beverages from './components/categories/Beverages';
import AdminDashboard from './features/admin/AdminDashboard';
import ProtectedAdminRoute from './features/admin/ProtectedAdminRoute';
import AdminLogin from './features/admin/AdminLogin';
import CanteenEntry from './pages/CanteenEntry';

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/admin");

  return (
    <CartProvider>
      {/* navbar hidden on any /admin route */}
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/c/:slug" element={<CanteenEntry />} />
        <Route path="/menu" element={<MenuPage/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/specials" element={<TodaySpecial/>} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/snacks" element={<Snacks />} />
        <Route path="/breakfast" element={<Breakfast />} />
        <Route path="/lunch" element={<Lunch />} />
        <Route path="/beverages" element={<Beverages />} />
        <Route path="/track-orders" element={<TrackOrdersPage />} />

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </CartProvider>
  );
}

export default App;
