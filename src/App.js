import React from "react";
import { Navigate, Routes, Route, useLocation, useParams } from "react-router-dom";
import LandingPage from './pages/landing/Landingpage';
import TrackOrdersPage from './pages/TrackOrdersPage';
import Navbar from './components/common/Navbar';
import MenuPage from './pages/menu/MenuPage';
import About from './components/common/About';
import TodaySpecial from './components/categories/TodaySpecial';
import CheckoutPage from './pages/CheckoutPage';
import CartPage from './pages/CartPage';
import { CartProvider } from './contexts/CartContext';
import AdminDashboard from './features/admin/AdminDashboard';
import ProtectedAdminRoute from './features/admin/ProtectedAdminRoute';
import AdminLogin from './features/admin/AdminLogin';
import CanteenEntry from './pages/CanteenEntry';

// Old category URLs (/lunch, /category/snacks) now open the menu filtered to that category.
const CategoryRedirect = ({ name }) => {
  const params = useParams();
  const category = name || params.name;
  return <Navigate to={`/menu?category=${encodeURIComponent(category)}`} replace />;
};

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
        <Route path="/category/:name" element={<CategoryRedirect />} />
        <Route path="/snacks" element={<CategoryRedirect name="Snacks" />} />
        <Route path="/breakfast" element={<CategoryRedirect name="Breakfast" />} />
        <Route path="/lunch" element={<CategoryRedirect name="Lunch" />} />
        <Route path="/beverages" element={<CategoryRedirect name="Beverages" />} />
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
